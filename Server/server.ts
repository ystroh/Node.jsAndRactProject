import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { connectDB } from './config/db';
import { logger } from './logger/logger';
import { RequestService } from './features/requests/request.service';

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log('--- מנסה להתחבר ל-DB ---');
  try {
    await connectDB();
    console.log('✅ החיבור ל-MongoDB הצליח בהצלחה!');

    // הפעלת ה-Worker רק אם המשתנה ב-env מוגדר כ-true
    if (process.env.ENABLE_QUEUE === 'true') {
      console.log('🚀 Starting Redis queue worker...');
      await import('./features/requests/request.worker');
    } else {
      console.log('⚠️ Redis queue worker disabled (ENABLE_QUEUE != true)');
    }
    app.listen(PORT, async () => {
      logger.info(`Server is running on port ${PORT}`);
      console.log(`השרת רץ ומאזין בפורט ${PORT}`);
    });

  } catch (err) {
    console.error('!!! שגיאה קריטית באתחול הרכיבים !!!', err);
  }
}



// הרצת השרת
startServer().catch(err => {
  console.error('!!! קריסה טוטאלית של תהליך השרת !!!', err);
});