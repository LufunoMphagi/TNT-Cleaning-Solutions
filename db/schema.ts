import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const requests=sqliteTable('requests',{id:text('id').primaryKey(),type:text('type').notNull(),token:text('token').notNull(),status:text('status').notNull(),data:text('data').notNull(),created:text('created').notNull(),updated:text('updated').notNull()});
export const settings=sqliteTable('settings',{key:text('key').primaryKey(),value:text('value').notNull()});
export const files=sqliteTable('files',{id:text('id').primaryKey(),requestId:text('request_id').notNull(),name:text('name').notNull(),mime:text('mime').notNull(),size:integer('size').notNull()});
export const audit=sqliteTable('audit',{id:text('id').primaryKey(),actor:text('actor').notNull(),action:text('action').notNull(),created:text('created').notNull()});
export const notices=sqliteTable('notices',{id:text('id').primaryKey(),recipient:text('recipient').notNull(),subject:text('subject').notNull(),message:text('message').notNull(),status:text('status').notNull(),created:text('created').notNull()});
