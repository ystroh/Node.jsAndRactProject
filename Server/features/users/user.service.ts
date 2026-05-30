import { User, IUser } from './user.model';

export class UserService {
  // יצירת משתמש חדש
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  // מציאת משתמש לפי אימייל (יעזור לנו בהמשך ל-Login)
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  // שליפת כל המשתמשים (עבור המנהל)
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().select('-passwordHash'); // שליפה ללא הסיסמה המוצפנת
  }

  // הוסיפי את זה בתוך המחלקה UserService
async deleteUser(userId: string): Promise<IUser | null> {
  // הפונקציה מחפשת לפי ה-ID של מונגו ומוחקת אותו
  return await User.findByIdAndDelete(userId);
}
}