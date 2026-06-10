import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// מרחיבים את הטיפוס של Express Request כדי שיכיר את שדה req.user המותאם שלנו
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;

    // 1. בדיקה אם הטוקן הגיע ב-Headers של הבקשה כמקובל (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. אם אין טוקן בכלל - חוסמים את הגישה
    if (!token) {
      res.status(401).json({ error: 'אינך מחובר, אנא התחבר כדי לקבל גישה' });
      return;
    }

    // 3. אימות ופענוח הטוקן
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { id: string; roles?: string[] };

    // 4. הזרקת נתוני המשתמש לתוך אובייקט הבקשה (req) — דואגים ש־roles תמיד יהיה מערך
    req.user = {
      id: decoded.id,
      roles: Array.isArray(decoded.roles) ? decoded.roles : []
    };

    // 5. הכל תקין! עוברים לקונטרולר
    next();
  } catch (error) {
    res.status(401).json({ error: 'טוקן לא תקין או פג תוקף, אנא התחבר שוב' });
  }
};

// המידלוור לקביעת הרשאות לפי תפקיד
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    
    // 1. הגנה מפני טעויות תכנות: ודאות ששמנו את protect לפני restrictTo
    if (!req.user) {
       res.status(500).json({ error: 'שגיאת שרת פנימית: לא נמצא מידע על המשתמש המחובר' });
       return;
    }

    // 2. בדיקה האם לפחות אחד מהתפקידים של המשתמש נמצא ברשימת התפקידים המותרים
    // (משתמשים במתודת .some בגלל ששדה roles אצלך הוא מערך של סטרינגים)
    const roles = Array.isArray(req.user.roles) ? req.user.roles : []
    const hasPermission = roles.some(role => allowedRoles.includes(role));

    // 3. אם אין לו אף תפקיד מתאים - חוסמים אותו עם שגיאה 403 (Forbidden)
    if (!hasPermission) {
       res.status(403).json({ error: 'אין לך הרשאה לבצע פעולה זו' });
       return;
    }

    // 4. יש אישור! עוברים לתחנה הבאה (לקונטרולר)
    next();
  };
};