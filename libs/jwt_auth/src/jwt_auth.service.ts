import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(input: { userId: string; officialEmail: string; emp_role: string }) {
    return this.jwtService.signAsync(
      {
        sub: input.userId,
        email: input.officialEmail,
        emp_role: input.emp_role,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '24h',
      },
    );
  }

  generateRefreshToken(input: { userId: string; officialEmail: string; emp_role: string }) {
    return this.jwtService.signAsync(
      {
        sub: input.userId,
        email: input.officialEmail,
        emp_role: input.emp_role,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  generateResetPasswordToken(input: { userId: string; officialEmail: string }) {
    return this.jwtService.signAsync(
      {
        sub: input.userId,
        officialEmail: input.officialEmail,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );
  }

  async verifyResetPasswordToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      return payload.sub;
    } catch (err) {
      return null;
    }
  }
}
