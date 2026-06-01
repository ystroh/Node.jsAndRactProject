import { User, IUser } from './user.model';
import { createUserSchema } from './user.validation'; // ייבוא סכמת ה-Zod
import bcrypt from 'bcryptjs'; // ייבוא ספריית ההצפנה

export class UserService {
  
  // 1. יצירת משתמש חדש - הגרסה המאובטחת והמלאה!
  async createUser(userData: any): Promise<IUser> {
    // א. ולדציה עם Zod על הנתונים הנכנסים מפוסטמן
    const validatedData = createUserSchema.parse(userData);

    // ב. בדיקה אם המייל כבר קיים במערכת
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      throw new Error("משתמש עם כתובת אימייל זו כבר קיים במערכת");
    }

    // ג. הצפנת הסיסמה הגלויה (password) שהגיעה מפוסטמן
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // ד. יצירת המשתמש במונגו עם ה-passwordHash והתפקידים
    const user = new User({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash: hashedPassword, // התאמה ל-Interface
      roles: validatedData.roles     // יקבל דיפולט ["receiver"] אם לא נשלח
    });

    // ה. שמירה והחזרה של המשתמש שנוצר
    return await user.save();
  }

  // 2. מציאת משתמש לפי אימייל (עבור ה-Login)
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+passwordHash');
  }

  // 3. שליפת כל המשתמשים (עבור המנהל)
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().select('-passwordHash'); // ללא הסיסמה
  }

  // 4. מחיקת משתמש לפי ID
  async deleteUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }
}