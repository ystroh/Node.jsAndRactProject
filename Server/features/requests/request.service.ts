import { Types } from 'mongoose';
import { RequestModel, IRequest } from './request.model';
import { createRequestSchema, updateStatusSchema, idSchema } from './request.validation';
import { AppError } from '../../utils/AppError';
import { logger } from '../../logger/logger';


export class RequestService {
  
  async createRequest(requestData: any): Promise<IRequest> {
    const validatedData = createRequestSchema.parse(requestData);

    const newRequest = new RequestModel({
      itemId: new Types.ObjectId(validatedData.itemId),
      requesterId: new Types.ObjectId(validatedData.requesterId),
      message: validatedData.message,
      status: validatedData.status
    });
    const request = await newRequest.save();
    logger.info({ requestId: newRequest._id, itemId: newRequest.itemId }, 'בקשה חדשה נוצרה');
    return request;
  }

  async getMyRequests(userId: string): Promise<IRequest[]> {
    idSchema.parse(userId); // וולידציית ID
    return await RequestModel.find({ 
      requesterId: new Types.ObjectId(userId) as any
    }).populate('itemId');
  }

  async updateRequestStatus(requestId: string, statusData: any): Promise<IRequest> {
    idSchema.parse(requestId); // וולידציית ID
    const { status } = updateStatusSchema.parse(statusData);
    
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
    
    if (!updatedRequest) throw new AppError('הבקשה לא נמצאה במערכת', 404);
    return updatedRequest;
  }

  async deleteRequest(requestId: string): Promise<IRequest> {
    idSchema.parse(requestId); // וולידציית ID
    const deletedRequest = await RequestModel.findByIdAndDelete(requestId);
    
    if (!deletedRequest) throw new AppError('הבקשה לא נמצאה במערכת', 404);
    return deletedRequest;
  }
}