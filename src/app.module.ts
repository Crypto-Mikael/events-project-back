import { Module } from '@nestjs/common';
import { UsersController } from '@controllers/index';
import { UsersService } from '@services/index';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@controllers/auth.controller';
import { AuthService } from '@services/auth.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.SECRET })],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
})
export class AppModule {}
