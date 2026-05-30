import { Schema, model, Document } from 'mongoose';

export interface IRequest extends Document {
  itemId: Schema.Types.ObjectId;      // קשר למוצר המבוקש
  requesterId: Schema.Types.ObjectId; // קשר למשתמש שביקש (המקבל)
  message: string;                     // הודעה אישית מהמבקש
  status: 'pending' | 'approved' | 'rejected' | 'completed'; // מצב הבקשה
  createdAt: Date;
}

const requestSchema = new Schema<IRequest>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item', // שם מודל המוצרים (כשניצור אותו בהמשך)
      required: true
    },
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // מקושר למודל המשתמשים הקיים שלך
      required: true
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
      required: true
    }
  },
  { 
    timestamps: true 
  }
);

export const RequestModel = model<IRequest>('Request', requestSchema);