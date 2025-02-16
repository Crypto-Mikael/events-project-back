import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '@services/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async POST(@Body() payload: { email: string; password: string }) {
    if (!payload)
      throw new HttpException('Payload not sended', HttpStatus.BAD_REQUEST);
    return await this.authService.post(payload);
  }
}
