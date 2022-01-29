import moment from 'moment';

import env from '../utils/env-validation';
import {
  notionClient,
  NOTION_DATE_PROPERTY,
  NOTION_DAYS_PROPERTY,
} from '../utils/notion';

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

export const createHabitPagesForNextWeek = async () => {
  const nextWeekStartDate = moment().add(1, 'weeks').startOf('isoWeek');
  const nextWeekEndDate = moment().add(1, 'weeks').endOf('isoWeek');

  for (
    let date = moment(nextWeekStartDate);
    date.diff(nextWeekEndDate, 'days', true) <= 0;
    date.add(1, 'days')
  ) {
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
