import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './users.service';
import { db } from 'src/main';
import { usersTable } from '@models/users';
import { sql } from 'drizzle-orm';
import { decryptPasswordAndValidate } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(public jwtService: JwtService) {}

  async post(payload: Omit<User, 'id'>) {
    const user = (
      await db
        .select()
        .from(usersTable)
        .where(sql`${usersTable['email']} = ${payload.email}`)
    )[0];
    if (!user)
      throw new HttpException(
        'Error on login check your email or password',
        HttpStatus.BAD_REQUEST,
      );
    if (decryptPasswordAndValidate(payload.password, user.password)) {
      return this.jwtService.sign(payload, {
        secret: process.env.SECRET,
        expiresIn: '1d',
      });
    }
    throw new HttpException(
      'Error on login check your email or password',
      HttpStatus.FORBIDDEN,
    );
  }
}
