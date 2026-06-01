import pino from 'pino';
import fs from 'fs';
import path from 'path';

// וודאי שהתיקייה קיימת
const logFilePath = path.join(__dirname, '../app.log');

// יצירת stream לכתיבה לקובץ
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

export const logger = pino(
  {
    level: 'info',
  },
  logStream // כאן אנחנו מעבירים את ה-stream במקום את המחרוזת של הנתיב
);
