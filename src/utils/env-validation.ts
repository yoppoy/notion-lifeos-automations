import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
  NOTION_SECRET: str({
    desc: 'Notion secret',
    example: 'secret_A67zXCp0Wo9JkCky52DpsxPvUGla4f9f6oFu5gy67G',
  }),
  NOTION_HABIT_DATABASE_ID: str({
    desc: 'Notion habits database id',
    example: 'dc9be0311e5f45fc9fdf94ae958e65e0',
  }),
  NOTION_TASK_DATABASE_ID: str({
    desc: 'Notion tasks database id',
    example: 'dc9be0311e5f45fc9fdf94ae958e65e0',
  }),
});

export default env;
