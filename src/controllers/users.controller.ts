import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '@services/index';
import { users } from '@models/users';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async POST(@Body() payload: Omit<typeof users.$inferSelect, 'id'>) {
    if (!payload)
      throw new HttpException('Payload not sended', HttpStatus.BAD_REQUEST);
    if (!payload.email)
      throw new HttpException('Email not sended', HttpStatus.BAD_REQUEST);
    if (!payload.password)
      throw new HttpException('password not sended', HttpStatus.BAD_REQUEST);
    return await this.usersService.post(payload);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.FOUND)
  async GET() {
    return await this.usersService.get();
  }
}
