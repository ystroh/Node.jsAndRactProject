import { z } from 'zod';

// 1. סכימה בסיסית - מגדירה מה זה משתמש במערכת
const baseUserSchema = z.object({
  name: z.string().min(2, "השם חייב להכיל לפחות 2 תווים").trim(),
  email: z.string().email("כתובת אימייל לא תקינה").toLowerCase(),
  password: z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
  roles: z.array(z.enum(["admin", "giver", "receiver"])).default(["receiver"])
});

// 2. סכימה לאימות ID (חובה לכל פעולה מול ה-URL)
export const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "מזהה משתמש לא תקין");

// 3. סכימות ספציפיות ל-CRUD:

// CREATE (POST): דורש את הסכימה המלאה
export const createUserSchema = baseUserSchema;

// UPDATE (PATCH): עדכון חלקי - כל השדות הופכים לאופציונליים
export const updateUserSchema = baseUserSchema.partial();

// LOGIN (לא חלק מה-CRUD אבל שימושי): סכימה קטנה רק לאימייל וסיסמה
export const loginUserSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(6, "סיסמה לא תקינה")
});

// יצוא הטיפוסים לשימוש ב-TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;