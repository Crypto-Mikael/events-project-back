import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from '@services/index';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async POST(@Body() payload: { email: string; password: string }) {
    if (!payload)
      throw new HttpException('Payload not sended', HttpStatus.FORBIDDEN);
    if (!payload.email)
      throw new HttpException('Email not sended', HttpStatus.FORBIDDEN);
    if (!payload.password)
      throw new HttpException('password not sended', HttpStatus.FORBIDDEN);
    return await this.usersService.post(payload);
  }

  @Get()
  @HttpCode(HttpStatus.FOUND)
  async GET() {
    return await this.usersService.get();
  }
}
