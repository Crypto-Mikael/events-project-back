import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from '../main';
import { users } from '@models/index';
import { catchError, encryptPassword } from '../utils';

@Injectable()
export class UsersService {
  constructor() {}
  async get() {
    const [err, users_] = await catchError(db.query.users.findMany());
    if (err) throw Error(err.message);
    if (users) return users_;
    return [];
  }

  async post(payload: Omit<typeof users.$inferSelect, 'id'>) {
    const password = encryptPassword(payload.password);

    const [err, user] = await catchError(
      db.insert(users).values({
        email: payload.email,
        password,
      }),
    );
    if (err?.code === 'SQLITE_CONSTRAINT') {
      throw new HttpException('USER ALREADY EXISTS', HttpStatus.FORBIDDEN);
    }
    if (err) throw new HttpException(err, HttpStatus.FORBIDDEN);
    if (user) return;
  }
}
