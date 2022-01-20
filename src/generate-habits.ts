import { Client } from '@notionhq/client';
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import moment from 'moment';

import env from './utils/env-validation';

const NOTION_DATE_PROPERTY = 'Date';
const NOTION_DAYS_PROPERTY = 'Day';

const notionClient = new Client({
  auth: env.NOTION_SECRET,
});

const habitPageAlreadyExists = async (date: string) => {
  const queryResult = await notionClient.databases.query({
    database_id: env.NOTION_HABIT_DATABASE_ID,
    filter: {
      property: NOTION_DATE_PROPERTY,
      date: {
        equals: date,
      },
    },
  });

  return queryResult.results.length > 0;
};

const createHabitPage = async (date: moment.Moment) => {
  try {
    console.log(`Creating page ${moment(date).format('YYYY-MM-DD')}`);

    await notionClient.pages.create({
      parent: {
        database_id: env.NOTION_HABIT_DATABASE_ID,
      },
      properties: {
        [NOTION_DAYS_PROPERTY]: {
          title: [
            {
              text: {
                content: moment(date).format('dddd'),
              },
            },
          ],
        },
        [NOTION_DATE_PROPERTY]: {
          date: {
            start: moment(date).format('YYYY-MM-DD'),
            end: null,
            time_zone: null,
          },
        },
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const createHabitPagesForNextWeek = async () => {
  const nextWeekStartDate = moment().add(1, 'weeks').startOf('isoWeek');
  const nextWeekEndDate = moment().add(1, 'weeks').endOf('isoWeek');

  console.log('---> ', nextWeekEndDate);
  for (
    let date = moment(nextWeekStartDate);
    date.diff(nextWeekEndDate, 'days', true) <= 0;
    date.add(1, 'days')
  ) {
    console.log(
      moment(date).format('YYYY-MM-DD'),
      date.diff(nextWeekEndDate, 'days'),
    );
    const pageAlreadyExists = await habitPageAlreadyExists(
      moment(date).format('YYYY-MM-DD'),
    );

    if (!pageAlreadyExists) {
      createHabitPage(date);
    } else {
      console.log(`Page ${moment(date).format('YYYY-MM-DD')} already exists`);
    }
  }
};

createHabitPagesForNextWeek();
