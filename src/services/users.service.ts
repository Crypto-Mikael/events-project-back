import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from '../main';
import { usersTable } from '@models/index';
import { catchError, encryptPassword } from '../utils';

export type User = {
  id: number;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor() {}
  async get() {
    const [err, users] = await catchError(db.select().from(usersTable));
    if (err) throw Error(err.message);
    if (users) return users as User[];
    return [];
  }

  async post(payload: Omit<User, 'id'>) {
    const password = encryptPassword(payload.password);

    const [err, user] = await catchError(
      db.insert(usersTable).values({
        email: payload.email,
        password,
      }),
    );
    if (err?.code === 'SQLITE_CONSTRAINT')
      throw new HttpException('USER ALREADY EXISTS', HttpStatus.FORBIDDEN);
    if (err) throw new HttpException(err, HttpStatus.FORBIDDEN);
    if (user) return;
  }
}
