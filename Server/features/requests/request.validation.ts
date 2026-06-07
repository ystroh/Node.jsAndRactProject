import { z } from 'zod';

// 1. סכמה בסיסית (בסיס ליצירה)
const baseRequestSchema = z.object({
  itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "מזהה פריט לא תקין"),
  requesterId: z.string().regex(/^[0-9a-fA-F]{24}$/, "מזהה משתמש לא תקין"),
  message: z.string().max(500, "ההודעה לא יכולה לעלות על 500 תווים").default(''),
  status: z.enum(['pending', 'approved', 'rejected', 'completed']).default('pending')
});

// 2. סכמות ספציפיות ל-CRUD
export const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "מזהה לא תקין");

// CREATE (POST): דורש את הסכימה המלאה
export const createRequestSchema = baseRequestSchema;

// UPDATE STATUS (PATCH): סכימה ייעודית לעדכון סטטוס בלבד
export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'completed'])
});


export const approveRequestSchema = z.object({
  body: z.object({
    isApproved: z.boolean({ required_error: "חובה להזין האם הבקשה מאושרת"  } as any)
  }),
  params: z.object({
    requestId: z.string().length(24, "מזהה בקשה לא תקין") // בדיקה שזה ObjectId של מונגו
  })
});

// READ & DELETE: משתמשים ב-idSchema בלבד (דרך ה-URL)