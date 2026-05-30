import { RequestModel, IRequest } from './request.model';
import { Types } from 'mongoose';
export class RequestService {
  // 1. יצירת בקשה חדשה במערכת (C)
  async createRequest(requestData: Partial<IRequest>): Promise<IRequest> {
    const newRequest = new RequestModel(requestData);
    return await newRequest.save();
  }

  // 2. שליפת בקשות שהמשתמש שלח (Read - יוצאות)
async getMyRequests(userId: string): Promise<IRequest[]> {
  return await RequestModel.find({ requesterId: userId as any }).populate('itemId');
}

  // 3. עדכון סטטוס בקשה - אישור/דחייה (U)
  async updateRequestStatus(requestId: string, newStatus: 'approved' | 'rejected' | 'completed'): Promise<IRequest | null> {
    return await RequestModel.findByIdAndUpdate(
      requestId,
      { status: newStatus },
      { new: true } // מחזיר את האובייקט המעודכן לאחר השינוי
    );
  }

  // 4. מחיקת/ביטול בקשה (D)
  async deleteRequest(requestId: string): Promise<IRequest | null> {
    return await RequestModel.findByIdAndDelete(requestId);
  }
}