import { Schema, model, Document } from 'mongoose';

// הגדרת רשימת הקטגוריות הרשמית של המערכת
export const ITEM_CATEGORIES = [
  'מטבח וכלי בית',
  'מוצרי חשמל',
  'משחקים וצעצועים',
  'כלי עבודה וגינה',
  'אביזרי חצר וקמפינג',
  'ספרים ומדיה',
  'ביגוד ואופנה',
  'תינוקות וילדים',
  'ספורט וכושר',
  'אחר'
] as const;

export type ItemCategory = typeof ITEM_CATEGORIES[number];

export interface IItem extends Document {
  title: string;
  description: string;
  category: ItemCategory;
  ownerId: Schema.Types.ObjectId; // קשר למשתמש ששייך לו הפריט
  status: 'available' | 'borrowed' | 'archived'; // מצב הפריט
  imageUrl?: string; // שדה אופציונלי לתמונת המוצר בעתיד
  createdAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: [true, 'חובה להזין כותרת לפריט'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'חובה להזין תיאור לפריט'],
      trim: true
    },
    category: {
      type: String,
      enum: ITEM_CATEGORIES,
      required: [true, 'חובה לבחור קטגוריה חוקית'],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'borrowed', 'archived'],
      default: 'available',
      required: true
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  { 
    timestamps: true 
  }
);

export const ItemModel = model<IItem>('Item', itemSchema);