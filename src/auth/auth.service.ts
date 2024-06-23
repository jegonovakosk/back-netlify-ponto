/* eslint-disable @typescript-eslint/no-unused-vars */
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    // Retornar um objeto simplificado do usuário, sem a senha
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    console.log(user);
    const payload = { email: user._doc.email, sub: user._doc._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
