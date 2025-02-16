import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { catchError } from '../utils';
import { db } from '../main';
import { events } from '@models/index';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';

@Injectable()
export class EventsService {
  constructor(public jwtService: JwtService) {}
  async get() {
    const [err, events_] = await catchError(db.query.events.findMany());
    if (err) throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    if (events_) return events_;
    return [];
  }

  async post(payload: Omit<typeof events.$inferSelect, 'id'>) {
    const [err, event] = await catchError(
      db.insert(events).values(payload).returning({ insertedId: events.id }),
    );
    if (err) throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    if (event) return event[0].insertedId;
  }

  async put(payload: typeof events.$inferSelect) {
    const [err, event] = await catchError(
      db
        .update(events)
        .set({
          description: payload.description,
          title: payload.title,
          imageUrl: payload.imageUrl,
          endsIn: payload.endsIn,
          startIn: payload.startIn,
        })
        .where(eq(events.id, Number(payload.id))),
    );
    if (err) throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    if (event) return;
  }

  async delete(id: string) {
    const [err, event] = await catchError(
      db.delete(events).where(eq(events.id, Number(id))),
    );
    if (err) throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    if (event) return;
  }
}
