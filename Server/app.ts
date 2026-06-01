import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import userRouter from './features/users/user.routes';
import requestRouter from './features/requests/request.routes';
import itemRouter from './features/items/item.routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// הפעלת החיבור למסד הנתונים מתוך תיקיית ה-config
connectDB();

// מידלוורס בסיסיים
app.use(cors()); 
app.use(express.json()); 

// חיבור לראוטרים של הישויות
app.use('/api/users', userRouter);

// חיבור לראוטרים של בקשות
app.use('/api/requests', requestRouter);

// חיבור לראוטרים של פריטים
app.use('/api/items', itemRouter);

// נתיב בדיקה כללי
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('השרת פעיל ויציב!');
});
app.use(errorHandler);
// מידלוור מרכזי לתפיסת שגיאות גלובלית (Global Error Handler)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('שגיאה שנלכדה בשרת:', err);
  res.status(500).json({ error: 'שגיאה פנימית בשרת, אנא נסה שנית מאוחר יותר.' });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`השרת רץ ומאזין בפורט ${PORT}`);
});