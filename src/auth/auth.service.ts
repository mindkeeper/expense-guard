import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto';

@Injectable()
export class AuthService {
  async signUp(signUpDto: SignUpDto) {
    return signUpDto;
  }
}
