import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { handleNewRequestNotification, handleApprovedRequestLogic } from './request.service'; 

// חיבור ל-Redis המקומי דרך Memurai
const redisConnection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null
});

// הקמת ה-Worker שמקשיב לצינור 'requests-queue'
const requestWorker = new Worker('requests-queue', async (job: Job) => {
  
  // הגנה היקפית פנימית לכל משימה
  try {
    switch (job.name) {
      
      // 🔵 סוג 1: בקשה חדשה נוצרה
      case 'send-new-request-email': {
        const { requestId } = job.data;
        
        if (!requestId) {
          throw new Error("Missing requestId in job data");
        }

        console.log(`[Worker] מטפל במשימה מסוג: סוג א' - בקשה חדשה (${requestId})`);
        
        // הפעלת הפונקציה שמבצעת populate ושולחת מייל
        await handleNewRequestNotification(requestId);
        break;
      }

      // 🟢 סוג 2: המפרסם אישר את הבקשה
      case 'process-approved-request': {
        const { requestId, isApproved } = job.data;
        
        if (!requestId) {
          throw new Error("Missing requestId in job data");
        }

        console.log(`[Worker] מטפל במשימה מסוג: סוג ב' - בקשה אושרה/נדחתה (${requestId})`);
        
        await handleApprovedRequestLogic(requestId, isApproved);
        break;
      }

      default:
        console.warn(`[Worker] התקבלה משימה לא מוכרת בתור: ${job.name}`);
    }
  } catch (error: any) {
    // תפיסת שגיאות ממוקדת כדי לדעת אם ה-populate נכשל בגלל null.name
    console.error(`[Worker Error] שגיאה פנימית בזמן עיבוד הלוגיקה של המשימה ${job.name}:`, error.message);
    throw error; // זורקים חזרה ל-BullMQ כדי שיסמן את המשימה כחלשה (failed)
  }

}, { 
  connection: redisConnection as any
});

// מעקב ולוגים בטרמינל
requestWorker.on('completed', (job) => {
  console.log(`[Worker] 🎉 משימה מהסוג ${job.name} (מזהה: ${job.id}) הושלמה בהצלחה!`);
});

requestWorker.on('failed', (job, err) => {
  console.error(`[Worker] ❌ משימה מהסוג ${job?.name} נכשלה סופית. סיבה: ${err.message}`);
});

export default requestWorker;