import mongoose from 'mongoose';

const dbURI = 'mongodb://localhost:27017/sharing_platform';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbURI);
    console.log('מחובר ל-MongoDB בהצלחה!');
  } catch (err) {
    console.error('כישלון בחיבור למסד הנתונים:', err);
    process.exit(1); // סגירת האפליקציה במידה ואין חיבור לדטבייס
  }
};