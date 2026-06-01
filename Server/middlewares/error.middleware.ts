import { ZodError } from "zod";
import { Request, Response, NextFunction } from 'express';
import { logger } from "../logger/logger";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  
logger.error({ err, path: req.path }, 'שגיאה התרחשה בשרת');

  // 1. שגיאת ולדציה של Zod
  if (err instanceof ZodError) {
    return res.status(400).json({ status: 'error', message: 'נתונים לא תקינים', details: err.issues });
  }

  // 2. שגיאות "יזומות" שלנו (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // 3. שגיאות MongoDB
  // שגיאת כפילות (Duplicate Key)
  if (err.code === 11000) {
    return res.status(409).json({ status: 'error', message: 'המידע כבר קיים במערכת (כפילות)' });
  }
  // שגיאת ID לא תקין (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({ status: 'error', message: 'מזהה לא תקין' });
  }

  // 4. שגיאות של JWT (טוקן לא תקין)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'error', message: 'טוקן לא תקין או פג תוקף' });
  }

  // 5. שגיאה כללית (500)
  console.error('SERVER ERROR:', err); // כאן כדאי להשתמש בלוגר מרכזי (Winston/Pino)
  res.status(500).json({ 
    status: 'error',
    message: 'שגיאה פנימית בשרת, אנא נסה שנית מאוחר יותר.' 
  });
};