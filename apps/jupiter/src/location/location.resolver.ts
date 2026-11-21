import { Args, Query, Resolver } from '@nestjs/graphql';
import { ReverseGeocodeInput } from './dto/reverse-geocode.input.js';
import { ReverseGeocodeResult } from './dto/reverse-geocode.object.js';
import { LocationService } from './location.service.js';

@Resolver()
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Query(() => ReverseGeocodeResult, {
    description: '根据当前位置坐标解析城市',
  })
  reverseGeocode(@Args('input') input: ReverseGeocodeInput) {
    return this.locationService.reverseGeocode(input);
  }
}
