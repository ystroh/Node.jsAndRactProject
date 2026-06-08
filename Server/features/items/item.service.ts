import { Types } from 'mongoose';
import { ItemModel, IItem, ItemCategory } from './item.model';
import { createItemSchema, updateItemSchema, idSchema } from './item.validation';
import { AppError } from '../../utils/AppError';
import { logger } from '../../logger/logger';

export class ItemService {

  // פונקציה תומכת Pagination
  async getAllItems(page?: number, limit?: number): Promise<IItem[]> {
    const query = ItemModel.find({ status: 'available' }).populate('ownerId', 'name email');
    
    if (page && limit) {
      const skip = (page - 1) * limit;
      return await query.skip(skip).limit(limit);
    }
    
    return await query;
  }

  async createItem(itemData: any): Promise<IItem> {
    const validatedData = createItemSchema.parse(itemData);

    const newItem = new ItemModel({
      ...validatedData,
      ownerId: new Types.ObjectId(validatedData.ownerId)
    });
    const item = await newItem.save();
    logger.info({ itemId: newItem._id, ownerId: newItem.ownerId }, 'פריט חדש נוסף למערכת');
    return item;
  }

  async getAllAvailableItems(): Promise<IItem[]> {
    return await ItemModel.find({ status: 'available' }).populate('ownerId', 'name email');
  }

  async getItemsByCategory(categoryName: ItemCategory): Promise<IItem[]> {
    return await ItemModel.find({ category: categoryName, status: 'available' }).populate('ownerId', 'name email');
  }

  async getItemsByOwner(ownerId: string): Promise<IItem[]> {
    const validatedId = idSchema.parse(ownerId);

    return await ItemModel.find({
      ownerId: new Types.ObjectId(validatedId) as any // הוספת as any פותרת את התנגשות הטיפוסים
    }).populate('ownerId', 'name email');
  }
  async updateItem(itemId: string, updateData: any): Promise<IItem> {
      idSchema.parse(itemId); 
   const validatedData = updateItemSchema.parse(updateData);

    const updatedItem = await ItemModel.findByIdAndUpdate(itemId, validatedData, { new: true });
    if (!updatedItem) throw new AppError('הפריט לא נמצא במערכת', 404);

    return updatedItem;
  }

  async deleteItem(itemId: string): Promise<IItem> {
    idSchema.parse(itemId); // וולידציה ל-ID
    const deletedItem = await ItemModel.findByIdAndDelete(itemId);
    if (!deletedItem) throw new AppError('הפריט לא נמצא במערכת', 404);

    return deletedItem;
  }
}