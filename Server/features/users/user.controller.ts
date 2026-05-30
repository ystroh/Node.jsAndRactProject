import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

export class UserController {
  
  // רישום משתמש חדש
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, roles } = req.body;

      // בדיקה בסיסית שהשדות הגיעו (בהמשך נחליף את זה ב-Zod Middleware)
      if (!name || !email || !password) {
        res.status(400).json({ error: 'נא למלא את כל שדות החובה' });
        return;
      }

      // בדיקה שהמשתמש לא קיים כבר
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: 'משתמש עם אימייל זה כבר קיים במערכת' });
        return;
      }

      // יצירת המשתמש (הערה: בשלב הבא נוסיף כאן הצפנת סיסמה עם bcrypt)
      const newUser = await userService.createUser({
        name,
        email,
        passwordHash: password, // זמני ללא הצפנה לצורך הבסיס
        roles: roles || ['receiver']
      });

      res.status(201).json({
        message: 'המשתמש נוצר בהצלחה',
        user: { id: newUser._id, name: newUser.name, email: newUser.email, roles: newUser.roles }
      });
    } catch (error) {
      next(error); // מעביר לשכבת הטיפול בשגיאות הכללית
    }
  }

  // שליפת כל המשתמשים
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // הוסיפי את זה בתוך המחלקה UserController
async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
   // מקבלים את ה-id מתוך כתובת ה-URL
    const { id } = req.params as { id: string };
    const deletedUser = await userService.deleteUser(id);

    // אם הסרביס החזיר null, זה אומר שאין משתמש כזה במסד
    if (!deletedUser) {
      res.status(404).json({ error: 'המשתמש לא נמצא במערכת' });
      return;
    }

    res.status(200).json({
      message: 'המשתמש נמחק בהצלחה',
      deletedUser: { id: deletedUser._id, name: deletedUser.name, email: deletedUser.email }
    });
  } catch (error) {
    next(error); // מעביר לטיפול השגיאות הגלובלי אם מונגו זרק שגיאה (למשל ID לא תקין)
  }
}
}