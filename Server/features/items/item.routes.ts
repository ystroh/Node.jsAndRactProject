import { Router } from 'express';
import { ItemController } from './item.controller';

const router = Router();
const itemController = new ItemController();

// 1. יצירת פריט וקבלת פריטים (תומך בסינון קטגוריה ב-GET)
router.post('/', itemController.create.bind(itemController));
router.get('/', itemController.getAll.bind(itemController));

// 2. קבלת כל הפריטים ששייכים למשתמש ספציפי
router.get('/user/:userId', itemController.getByUser.bind(itemController));

// 3. עדכון ומחיקת פריט לפי ה-ID שלו
router.patch('/:id', itemController.update.bind(itemController));
router.delete('/:id', itemController.delete.bind(itemController));

export default router;