import fs from 'fs';

const COMPLETED_TASK_LIST_FILE_URL = './completed-tasks.json';

export const readCompletedTasksFile = (): Array<unknown> | null => {
  if (fs.existsSync(COMPLETED_TASK_LIST_FILE_URL)) {
    const rawData = fs.readFileSync(COMPLETED_TASK_LIST_FILE_URL);
    const completedTasks = JSON.parse(rawData.toString());

    return completedTasks.tasks;
  }
  return null;
};

export const storeCompletedTasksInFile = (completedTasks: Array<unknown>) => {
  fs.writeFileSync(
    COMPLETED_TASK_LIST_FILE_URL,
    JSON.stringify({ tasks: completedTasks }),
  );
};
