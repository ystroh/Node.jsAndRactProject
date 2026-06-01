import { Types } from 'mongoose';
import { ItemModel, IItem, ItemCategory } from './item.model';
import { createItemSchema, updateItemSchema } from './item.validation';

export class ItemService {
  
  // 1. יצירת פריט חדש - מאובטח עם Zod
  async createItem(itemData: any): Promise<IItem> {
    // הרצת הוולדציה של Zod
    const validatedData = createItemSchema.parse(itemData);
    
    // בניית האובייקט עם המרה ל-ObjectId עבור הבעלים
    const newItem = new ItemModel({
      ...validatedData,
      ownerId: new Types.ObjectId(validatedData.ownerId)
    });
    
    return await newItem.save();
  }

  // 2. שליפת כל הפריטים הזמינים
  async getAllAvailableItems(): Promise<IItem[]> {
    return await ItemModel.find({ status: 'available' }).populate('ownerId', 'name email');
  }

  // 3. שליפת פריטים לפי קטגוריה
  async getItemsByCategory(categoryName: ItemCategory): Promise<IItem[]> {
    return await ItemModel.find({ category: categoryName, status: 'available' }).populate('ownerId', 'name email');
  }

async getItemsByOwner(ownerId: string): Promise<IItem[]> {
  return await ItemModel.find({ 
    ownerId: new Types.ObjectId(ownerId) as any 
  }).populate('ownerId', 'name email');
}

  // 5. עדכון פריט - מאובטח עם Zod
  async updateItem(itemId: string, updateData: any): Promise<IItem | null> {
    // וולדציית עדכון (Partial)
    const validatedData = updateItemSchema.parse(updateData);
    
    return await ItemModel.findByIdAndUpdate(itemId, validatedData, { new: true });
  }

  // 6. מחיקת פריט
  async deleteItem(itemId: string): Promise<IItem | null> {
    return await ItemModel.findByIdAndDelete(itemId);
  }
}