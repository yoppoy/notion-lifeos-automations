import { Client } from '@notionhq/client';

import env from './env-validation';

export const NOTION_PROPERTIES = {
  habits: {
    day: 'Day',
    date: 'Date',
  },
  tasks: {
    status: 'status',
    dateDone: 'Done date',
  },
};

export enum TaskStatus {
  COMPLETED = 'completed',
  NEXT_ACTIONS = 'next actions',
  BACKLOG = 'backlog',
  ONGOING = 'ongoing',
  BLOCKED = 'blocked',
  ARCHIVED = 'archived',
}

export type Task = {
  object: string;
  id: string;
  properties: {
    status: TaskStatus;
    Name: {
      title: [
        {
          plain_text: string;
        },
      ];
    };
  };
};

export const notionClient = new Client({
  auth: env.NOTION_SECRET,
});
