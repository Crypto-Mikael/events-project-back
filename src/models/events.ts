import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const events = sqliteTable('events', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text().notNull(),
  imageUrl: text('image_url').notNull(),
  startIn: text('start_in').notNull(),
  endsIn: text('ends_in').notNull(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
});
