import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db } from 'src/main';
import { decryptPasswordAndValidate } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(public jwtService: JwtService) {}

  async post(payload: { email: string; password: string }) {
    if (!payload.email)
      throw new HttpException('Email not sended', HttpStatus.FORBIDDEN);
    if (!payload.password)
      throw new HttpException('password not sended', HttpStatus.FORBIDDEN);
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, payload.email),
    });
    if (!user)
      throw new HttpException(
        'Error on login check your email or password',
        HttpStatus.BAD_REQUEST,
      );
    if (decryptPasswordAndValidate(payload.password, user.password)) {
      return this.jwtService.sign(
        { id: user.id, email: user.email },
        {
          secret: process.env.SECRET,
          expiresIn: '1d',
        },
      );
    }
    throw new HttpException(
      'Error on login check your email or password',
      HttpStatus.FORBIDDEN,
    );
  }
}
