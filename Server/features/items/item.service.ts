import { Types } from 'mongoose';
import { ItemModel, IItem, ItemCategory } from './item.model';

export class ItemService {
  // 1. יצירת פריט חדש
  async createItem(itemData: Partial<IItem>): Promise<IItem> {
    const newItem = new ItemModel(itemData);
    return await newItem.save();
  }

  // 2. שליפת כל הפריטים הזמינים במערכת (עם מידע על הבעלים)
  async getAllAvailableItems(): Promise<IItem[]> {
    return await ItemModel.find({ status: 'available' }).populate('ownerId', 'name email');
  }

  // 3. שליפת פריטים לפי קטגוריה ספציפית
  async getItemsByCategory(categoryName: ItemCategory): Promise<IItem[]> {
    return await ItemModel.find({ category: categoryName, status: 'available' }).populate('ownerId', 'name email');
  }

  // 4. שליפת כל הפריטים ששייכים למשתמש ספציפי (הפריטים שלי)
  async getItemsByOwner(ownerId: string): Promise<IItem[]> {
    const objectId = new Types.ObjectId(ownerId);
    return await ItemModel.find({ ownerId: objectId as any });
  }

  // 5. עדכון פרטי פריט
  async updateItem(itemId: string, updateData: Partial<IItem>): Promise<IItem | null> {
    return await ItemModel.findByIdAndUpdate(itemId, updateData, { new: true });
  }

  // 6. מחיקת פריט
  async deleteItem(itemId: string): Promise<IItem | null> {
    return await ItemModel.findByIdAndDelete(itemId);
  }
}