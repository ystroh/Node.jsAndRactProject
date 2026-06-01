import { RequestModel, IRequest } from './request.model';
import { createRequestSchema, updateStatusSchema } from './request.validation';
import { Types } from 'mongoose'; 

export class RequestService {
  
  // 1. יצירת בקשה חדשה
  async createRequest(requestData: any): Promise<IRequest> {
    const validatedData = createRequestSchema.parse(requestData);

    const requestObject = {
      itemId: new Types.ObjectId(validatedData.itemId),
      requesterId: new Types.ObjectId(validatedData.requesterId),
      message: validatedData.message,
      status: validatedData.status as 'pending' | 'approved' | 'rejected' | 'completed'
    };

    const newRequest = new RequestModel(requestObject);
    return await newRequest.save();
  }

  async getMyRequests(userId: string): Promise<IRequest[]> {
  return await RequestModel.find({ 
    requesterId: new Types.ObjectId(userId) as any 
  }).populate('itemId');
}

  // 3. עדכון סטטוס בקשה
  async updateRequestStatus(requestId: string, statusData: any): Promise<IRequest | null> {
    const { status } = updateStatusSchema.parse(statusData);
    return await RequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
  }

  // 4. מחיקת בקשה
  async deleteRequest(requestId: string): Promise<IRequest | null> {
  // בדיקה אם ה-ID הוא פורמט תקין של מונגו (זה ימנע שגיאות 500 על פורמט לא תקין)
  if (!Types.ObjectId.isValid(requestId)) {
    console.log("ID לא תקין:", requestId); // זה יופיע בטרמינל שלך!
    throw new Error("Invalid ID format"); // זה יגרום ל-Controller לשלוח 400 ולא 500
  }
  
  return await RequestModel.findByIdAndDelete(requestId);
}
}