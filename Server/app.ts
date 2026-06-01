import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRouter from './features/users/user.routes';
import requestRouter from './features/requests/request.routes';
import itemRouter from './features/items/item.routes';
import { errorHandler } from './middlewares/error.middleware';
import 'dotenv/config'; // זה טוען את המשתנים מקובץ ה-.env לתוך process.env
import { limiter } from './middlewares/rate-limited';


export const app: Application = express();
const PORT = process.env.PORT;


const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-production-site.com'], 
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // אילו פעולות את מאפשרת
  credentials: true // אם את צריכה לשלוח Cookies או Headers מיוחדים
};


// מידלוורס בסיסיים
app.use(cors(corsOptions)); 
app.use(express.json()); 


// החלת המגבלה על כל השרת (גלובלי)
app.use(limiter);
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

