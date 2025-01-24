import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    console.log()
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateUser(username: string, password: string): any {
    const mockUser = { username: 'edvtest01', password: 'password123' };
    if (username === mockUser.username && password === mockUser.password) {
      return { userId: 1, username: mockUser.username };
    }
    return null;
  }

}
