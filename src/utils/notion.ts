import { Client } from '@notionhq/client';

import env from './env-validation';

export const NOTION_DATE_PROPERTY = 'Date';
export const NOTION_DAYS_PROPERTY = 'Day';

export const notionClient = new Client({
  auth: env.NOTION_SECRET,
});
