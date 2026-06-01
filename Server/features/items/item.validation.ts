import { z } from 'zod';
import { ITEM_CATEGORIES } from './item.model';

// 1. סכימה בסיסית של הפריט (לשימוש ב-POST)
const baseItemSchema = z.object({
  title: z.string().min(2, "כותרת קצרה מדי").trim(),
  description: z.string().min(5, "תיאור קצר מדי").trim(),
  category: z.string().refine((val) => ITEM_CATEGORIES.includes(val as any)),
  ownerId: z.string().length(24, "מזהה בעלים לא תקין"),
  status: z.enum(['available', 'borrowed', 'archived']).default('available'),
  imageUrl: z.string().optional().default('')
});

// 2. וולידציה ל-ID (משמש ב-GET, PATCH, DELETE)
export const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "מזהה לא תקין");

// 3. יצוא לכל הפעולות:
// - CREATE: משתמשים ב-baseItemSchema המלא
export const createItemSchema = baseItemSchema;

// - UPDATE: משתמשים ב-partial שמאפשר לעדכן רק חלק מהשדות
export const updateItemSchema = baseItemSchema.partial();