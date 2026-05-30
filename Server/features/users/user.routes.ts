import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const userController = new UserController();

// נתיב לרישום משתמש חדש: POST /api/users/register
router.post('/register', userController.register.bind(userController));

// נתיב לקבלת כל המשתמשים: GET /api/users
router.get('/', userController.getUsers.bind(userController));

// הוסיפי את השורה הזו בסוף רשימת הנתיבים, לפני ה-export:
// נתיב למחיקת משתמש לפי ה-ID שלו: DELETE /api/users/:id
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;