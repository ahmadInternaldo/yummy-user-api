import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHelperService {
  constructor(private jwtService: JwtService) {}

  async signAsync(payload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: +process.env.EXP_TOKEN,
    });
  }
}
