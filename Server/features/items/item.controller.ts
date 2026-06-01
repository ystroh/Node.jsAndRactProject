import { Request, Response, NextFunction } from 'express';
import { ItemService } from './item.service';
import { ItemCategory } from './item.model';

const itemService = new ItemService();

export class ItemController {
  
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newItem = await itemService.createItem(req.body);
      res.status(201).json({ message: 'הפריט פורסם בהצלחה!', item: newItem });
    } catch (error) {
      next(error); 
    }
  }

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

  async getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const items = await itemService.getItemsByOwner(userId as string);
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedItem = await itemService.updateItem(id as string, req.body);
      res.status(200).json({ message: 'הפריט עודכן בהצלחה', item: updatedItem });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await itemService.deleteItem(id as string);
      res.status(200).json({ message: 'הפריט נמחק בהצלחה' });
    } catch (error) {
      next(error);
    }
  }
}