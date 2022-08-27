// nest
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PassportService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * jwt加签
   */
  sign(id: number) {
    return this.jwtService.sign({
      id,
    });
  }
}
