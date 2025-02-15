import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '@services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async POST(@Body() payload: { email: string; password: string }) {
    if (!payload)
      throw new HttpException('Payload not sended', HttpStatus.FORBIDDEN);
    if (!payload.email)
      throw new HttpException('Email not sended', HttpStatus.FORBIDDEN);
    if (!payload.password)
      throw new HttpException('password not sended', HttpStatus.FORBIDDEN);
    return await this.authService.post(payload);
  }
}
