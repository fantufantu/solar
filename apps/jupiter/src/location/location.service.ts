import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DISTRICT_LEVEL,
  District,
} from '@/libs/database/entities/jupiter/district.entity';
import { PlutoClientService } from '@/libs/pluto-client';
import {
  AMAP_PROPERTY_TOKEN,
  REGISTERED_CONFIGURATION_TOKENS,
} from 'constants/configuration.constant';
import { ReverseGeocodeInput } from './dto/reverse-geocode.input';

const AMAP_COORDINATE_CONVERT_URL =
  'https://restapi.amap.com/v3/assistant/coordinate/convert';
const AMAP_REVERSE_GEOCODE_URL =
  'https://restapi.amap.com/v3/geocode/regeo';

interface AmapCoordinateResponse {
  status: string;
  locations?: string;
}

interface AmapReverseGeocodeResponse {
  status: string;
  regeocode?: {
    addressComponent?: {
      city?: string | string[];
      province?: string;
    };
  };
}

@Injectable()
export class LocationService {
  constructor(
    private readonly plutoClient: PlutoClientService,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async reverseGeocode({ latitude, longitude }: ReverseGeocodeInput) {
    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new BadRequestException('Invalid latitude or longitude');
    }

    const apiKey = await this.plutoClient.getConfiguration<string>({
      token: REGISTERED_CONFIGURATION_TOKENS.AMAP,
      property: AMAP_PROPERTY_TOKEN.API_KEY,
    });
    if (!apiKey) {
      throw new ServiceUnavailableException('Amap API key is not configured');
    }

    const amapCoordinates = await this.convertGpsCoordinates(
      longitude,
      latitude,
      apiKey,
    );
    const cityName = await this.findCityName(amapCoordinates, apiKey);
    const district = await this.districtRepository.findOneBy({
      name: cityName,
      level: DISTRICT_LEVEL.CITY,
    });

    if (!district) {
      throw new NotFoundException('Current city is not supported');
    }

    return {
      districtCode: district.code,
      districtName: district.name,
    };
  }

  private async convertGpsCoordinates(
    longitude: number,
    latitude: number,
    apiKey: string,
  ): Promise<string> {
    const url = new URL(AMAP_COORDINATE_CONVERT_URL);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('locations', `${longitude.toFixed(6)},${latitude.toFixed(6)}`);
    url.searchParams.set('coordsys', 'gps');
    url.searchParams.set('output', 'JSON');

    const response = await fetch(url, { signal: AbortSignal.timeout(10000) }).catch(
      () => {
        throw new BadGatewayException('Amap coordinate conversion is unavailable');
      },
    );
    if (!response.ok) {
      throw new BadGatewayException('Amap coordinate conversion failed');
    }

    const result = (await response.json()) as AmapCoordinateResponse;
    if (result.status !== '1' || !result.locations) {
      throw new BadGatewayException('Amap coordinate conversion failed');
    }

    return result.locations;
  }

  private async findCityName(
    coordinates: string,
    apiKey: string,
  ): Promise<string> {
    const url = new URL(AMAP_REVERSE_GEOCODE_URL);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('location', coordinates);
    url.searchParams.set('extensions', 'base');
    url.searchParams.set('output', 'JSON');

    const response = await fetch(url, { signal: AbortSignal.timeout(10000) }).catch(
      () => {
        throw new BadGatewayException('Amap reverse geocoding is unavailable');
      },
    );
    if (!response.ok) {
      throw new BadGatewayException('Amap reverse geocoding failed');
    }

    const result = (await response.json()) as AmapReverseGeocodeResponse;
    const address = result.regeocode?.addressComponent;
    if (result.status !== '1' || !address) {
      throw new BadGatewayException('Amap reverse geocoding failed');
    }

    const cityName = Array.isArray(address.city) ? address.city[0] : address.city;
    const resolvedCityName = cityName || address.province;
    if (!resolvedCityName) {
      throw new NotFoundException('Current city could not be resolved');
    }

    return resolvedCityName;
  }
}
