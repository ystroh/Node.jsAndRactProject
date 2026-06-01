import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // 1. האם זו שגיאת ולדציה של Zod?
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'נתונים לא תקינים',
      details: err.issues.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    });
  }

  // 2. שגיאה כללית (500)
  console.error(err); // נדפיס לטרמינל כדי שתוכלי לראות מה הבעיה באמת
  res.status(500).json({ 
    status: 'error',
    message: 'שגיאה פנימית בשרת, אנא נסה שנית מאוחר יותר.' 
  });
};