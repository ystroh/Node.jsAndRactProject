import { User, IUser } from './user.model';
import { createUserSchema, loginUserSchema } from './user.validation';
import { AppError } from '../../utils/AppError'; // וודאי שהנתיב נכון
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../../logger/logger';



export class UserService {

  // 1. יצירת משתמש חדש
async createUser(userData: any): Promise<IUser> {
  // א. וולידציה
  const validatedData = createUserSchema.parse(userData);

  // ב. בדיקת קיום
  const existingUser = await User.findOne({ email: validatedData.email });
  if (existingUser) {
    throw new AppError("משתמש עם כתובת אימייל זו כבר קיים במערכת", 409);
  }

  // ג. הצפנת סיסמה
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(validatedData.password, salt);

  // ד. יצירת המשתמש (בצורה מפורשת ובטוחה)
  const user = new User({
    name: validatedData.name,
    email: validatedData.email,
    passwordHash: hashedPassword,
    roles: validatedData.roles
  });

  const savedUser = await user.save();
  
  // ה. לוג
  logger.info({ userId: savedUser._id }, 'משתמש חדש נוצר בהצלחה');
  
  return savedUser;
}

  

  // 2. מציאת משתמש לפי אימייל (עבור Login)
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+passwordHash');
  }

  // 3. שליפת כל המשתמשים
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().select('-passwordHash');
  }

  // 4. מחיקת משתמש
  async deleteUser(userId: string): Promise<IUser> {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new AppError('המשתמש לא נמצא במערכת', 404);
    }
    return user;
  }

  async login(email: string, password: string): Promise<{ user: IUser, token: string }> {
    // 1. מציאת משתמש
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) throw new AppError('אימייל או סיסמה שגויים', 401);

    // 2. בדיקת סיסמה
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new AppError('אימייל או סיסמה שגויים', 401);

    // 3. יצירת טוקן
    const secret = process.env.JWT_SECRET || 'default-secret';
    const token = jwt.sign({ id: user._id }, secret);
    return { user, token };
  }
}