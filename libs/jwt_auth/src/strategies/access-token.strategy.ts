import { EmployeeRepository } from '@database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  username: string;
  emp_role: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly employeeRepository: EmployeeRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreNotBefore: true,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: userId, username, emp_role: emp_role } = payload;

    const user = await this.employeeRepository.findByEmail(username);

    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
} 