import { app } from './app';
import { connectDB } from './config/db';
import { logger } from './logger/logger';

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log("--- מנסה להתחבר ל-DB ---");
  await connectDB(); 
  
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    console.log(`השרת רץ ומאזין בפורט ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("!!! שגיאה בהפעלת השרת !!!", err);
});