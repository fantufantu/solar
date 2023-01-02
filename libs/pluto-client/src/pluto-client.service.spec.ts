import { Test, TestingModule } from '@nestjs/testing';
import { PlutoClientService } from './pluto-client.service';

describe('PlutoClientService', () => {
  let service: PlutoClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlutoClientService],
    }).compile();

    service = module.get<PlutoClientService>(PlutoClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
