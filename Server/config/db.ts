import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// כאן אנחנו מחלצים את המשתנה מה-process.env
const dbURI = process.env.MONGO_URI;

export const connectDB = async (): Promise<void> => {
  // 1. בדיקה האם המשתנה בכלל קיים
  if (!dbURI) {
    console.error('שגיאה: משתנה הסביבה MONGO_URI לא מוגדר בקובץ ה-.env');
    process.exit(1);
  }

  try {
    // עכשיו TypeScript יודע ש-dbURI הוא בוודאות string (כי עברנו את ה-if)
    await mongoose.connect(dbURI);
    console.log('מחובר ל-MongoDB בהצלחה!');
  } catch (err) {
    console.error('כישלון בחיבור למסד הנתונים:', err);
    process.exit(1);
  }
};