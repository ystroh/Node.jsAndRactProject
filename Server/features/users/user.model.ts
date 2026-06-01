import { Schema, model, Document } from 'mongoose';

// הגדרת הטיפוסים (TypeScript Interface)
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  roles: ('admin' | 'giver' | 'receiver')[]; // מערך של סוגי משתמשים
  createdAt: Date;
}

// הגדרת הסכמה של Mongoose
const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    passwordHash: { 
      type: String, 
      required: true,
      select: false
    },
    roles: {
      type: [String],
      enum: ['admin', 'giver', 'receiver'],
      default: ['receiver'], // ברירת מחדל: משתמש פשוט שמבקש מוצרים
      required: true
    }
  },
  { 
    timestamps: true // מייצר אוטומטית שדות createdAt ו-updatedAt
  }
);

export const User = model<IUser>('User', userSchema);