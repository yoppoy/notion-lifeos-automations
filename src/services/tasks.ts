import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

import env from '../utils/env-validation';
import {
  notionClient,
  NOTION_PROPERTIES,
  Task,
  TaskStatus,
} from '../utils/notion';
import {
  readCompletedTasksFile,
  storeCompletedTasksInFile,
} from '../utils/tmp-storage';

const getCompletedTasksList = async (): Promise<
  QueryDatabaseResponse['results']
> => {
  const notionTaskQuery = await notionClient.databases.query({
    database_id: env.NOTION_TASK_DATABASE_ID,
    filter: {
      property: NOTION_PROPERTIES.tasks.status,
      select: {
        equals: TaskStatus.COMPLETED,
      },
    },
  });

  return notionTaskQuery.results;
};

const updateDoneDateForCompletedTask = async (task: Task) => {
  const currentDate = new Date().toISOString();

  const notionUpdateQuery = await notionClient.pages.update({
    page_id: task.id,
    properties: {
      [NOTION_PROPERTIES.tasks.dateDone]: {
        date: {
          start: currentDate,
          end: null,
          time_zone: null,
        },
      },
    },
  });
  console.log(
    `Completed today : "${task.properties.Name.title[0].plain_text}"`,
  );
};

export const updateDoneDateForCompletedTasks = async () => {
  const alreadyCompletedTasks = readCompletedTasksFile();
  const currentCompletedTasks = await getCompletedTasksList();

  if (alreadyCompletedTasks) {
    const newCompletedTasks = currentCompletedTasks.filter(
      (task) =>
        !alreadyCompletedTasks
          .map((completedTask) => (completedTask as Task).id)
          .includes(task.id),
    );

    newCompletedTasks.map((task) =>
      updateDoneDateForCompletedTask(task as Task),
    );
  }
  storeCompletedTasksInFile(currentCompletedTasks);
};
