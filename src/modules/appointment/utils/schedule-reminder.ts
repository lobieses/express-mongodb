import { scheduleJob } from 'node-schedule';
import * as path from 'path';
import * as fs from 'fs';
import { formatDateToString } from './format-date-to-string';

const DB_FOLDER = path.join(
  path.join(__dirname, '..', '..', '..', '..', 'reminders'),
);
const DB_FILE_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'reminders',
  'reminders.txt',
);

//Node-schedule library will create new thread for this job
export const scheduleReminder = (
  triggerDate: Date,
  userName: string,
  speciality: string,
  appointmentTimestamp: Date,
) => {
  scheduleJob(
    triggerDate,
    function (userName, speciality, appointmentTimestamp) {
      if (!fs.existsSync(DB_FOLDER)) {
        fs.mkdirSync(DB_FOLDER, { recursive: true });
      }
      if (!fs.existsSync(DB_FILE_PATH)) {
        fs.writeFileSync(DB_FILE_PATH, '');
      }

      const existingData = fs.readFileSync(DB_FILE_PATH, {
        encoding: 'utf8',
        flag: 'r',
      });
      const remind = `Hi ${userName}! Remember that you have an appointment to ${speciality} at ${formatDateToString(
        appointmentTimestamp,
      )}, in ${appointmentTimestamp.getHours()}:${appointmentTimestamp.getMinutes()}!  //create-timestamp===> ${new Date()} \n\n`;

      fs.writeFileSync(DB_FILE_PATH, existingData + remind);
    }.bind(null, userName, speciality, appointmentTimestamp),
  );
};
