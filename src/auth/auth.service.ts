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

  // Function to generate the sign
  generateSign = (payload: Record<string, any>, pgKey: string): string => {
    // Step 1: Sort the keys of the payload alphabetically
    const sortedKeys = Object.keys(payload).sort();

    // Step 2: Concatenate the key-value pairs into a single string
    let concatenatedString = '';
    for (const key of sortedKeys) {
      if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
        concatenatedString += `${key}=${payload[key]}&`;
      }
    }

    // Step 3: Append the secret key (pgKey)
    concatenatedString = concatenatedString.slice(0, -1); // Remove trailing "&"
    concatenatedString += pgKey;

    // Step 4: Generate the HMAC-SHA256 hash
    const hash = this.jwtService.sign(concatenatedString, {secret: pgKey});

    return hash;
  };
}
