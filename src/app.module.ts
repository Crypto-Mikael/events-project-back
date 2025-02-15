import { Module } from '@nestjs/common';
import { EventsService, UsersService, AuthService } from '@services/index';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategys/jwt.strategy';
import {
  EventsController,
  AuthController,
  UsersController,
} from '@controllers/index';

@Module({
  imports: [JwtModule.register({ secret: process.env.SECRET })],
  controllers: [UsersController, AuthController, EventsController],
  providers: [UsersService, AuthService, JwtStrategy, EventsService],
})
export class AppModule {}
