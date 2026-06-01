import { Request, Response, NextFunction } from 'express';
import { ItemService } from './item.service';
import { ItemCategory } from './item.model';

const itemService = new ItemService();

export class ItemController {
  
  // יצירת פריט חדש
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // מעבירים את req.body ישירות ל-Service והוא כבר יפעיל את Zod
      const newItem = await itemService.createItem(req.body);
      res.status(201).json({ message: 'הפריט פורסם בהצלחה!', item: newItem });
    } catch (error) {
      // אם Zod יזרוק שגיאה, ה-next(error) יעביר אותה ל-Middleware של השגיאות שלך
      next(error);
    }
  }

  // שליפת פריטים (תומך גם בסינון לפי קטגוריה דרך ה-URL)
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.query;

      let items;
      if (category) {
        items = await itemService.getItemsByCategory(category as ItemCategory);
      } else {
        items = await itemService.getAllAvailableItems();
      }

      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  }

  // שליפת פריטים של משתמש ספציפי
  async getByUser(req: Request<{ userId: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const items = await itemService.getItemsByOwner(userId);
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  }

  // עדכון פריט
  async update(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedItem = await itemService.updateItem(id, req.body);

      if (!updatedItem) {
        res.status(404).json({ error: 'הפריט לא נמצא' });
        return;
      }

      res.status(200).json({ message: 'הפריט עודכן בהצלחה', item: updatedItem });
    } catch (error) {
      next(error);
    }
  }

  // מחיקת פריט
  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deletedItem = await itemService.deleteItem(id);

      if (!deletedItem) {
        res.status(404).json({ error: 'הפריט לא נמצא' });
        return;
      }

      res.status(200).json({ message: 'הפריט נמחק בהצלחה' });
    } catch (error) {
      next(error);
    }
  }
}