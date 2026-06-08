import { Types } from 'mongoose';
import { RequestModel, IRequest } from './request.model';
import { createRequestSchema, updateStatusSchema, idSchema } from './request.validation';
import { AppError } from '../../utils/AppError';
import { logger } from '../../logger/logger';
import { sendEmail } from '../../utils/email.service';
import { requestQueue } from './request.queue';
import { log } from 'console';

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
    logger.info({ requestId: request._id, itemId: request.itemId }, 'Request created successfully in database');

    try {
      await requestQueue.add('send-new-request-email', { requestId: request._id.toString() });
      logger.info({ requestId: request._id }, 'Request task added to queue: send-new-request-email');
    } catch (queueError: any) {
      logger.error({ requestId: request._id, error: queueError.message }, 'Failed to add request to queue');
    }

    return request;
  }

  async getMyRequests(userId: string): Promise<IRequest[]> {
    idSchema.parse(userId);
    return await RequestModel.find({
      requesterId: new Types.ObjectId(userId) as any
    }).populate('itemId');
  }

  async updateRequestStatus(requestId: string, statusData: any): Promise<IRequest> {
    idSchema.parse(requestId);
    const { status } = updateStatusSchema.parse(statusData);

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) throw new AppError('Request not found', 404);
    logger.info({ requestId, newStatus: status }, 'Request status updated manually');
    return updatedRequest;
  }

  async deleteRequest(requestId: string): Promise<IRequest> {
    idSchema.parse(requestId);
    const deletedRequest = await RequestModel.findByIdAndDelete(requestId);

    if (!deletedRequest) throw new AppError('Request not found', 404);
    logger.info({ requestId }, 'Request deleted');
    return deletedRequest;
  }

  async approveRequest(requestId: string, isApproved: boolean): Promise<void> {
    logger.info({ requestId, isApproved }, 'Attempting to approve/reject request');

    const request = await RequestModel.findById(requestId);
    if (!request) {
      throw new Error(`Request ${requestId} not found in database`);
    }

    request.status = isApproved ? 'approved' : 'rejected';
    await request.save();

    logger.info({ requestId, status: request.status }, 'Request status updated in DB');

    await requestQueue.add('process-approved-request', {
      requestId: requestId,
      isApproved: isApproved
    });

    logger.info({ requestId }, 'Process-approved-request task added to Redis queue');
  }
}

export const handleNewRequestNotification = async (requestId: string) => {
  logger.info({ requestId }, 'Worker: Starting handleNewRequestNotification');

  const requestData = await RequestModel.findById(requestId)
    .populate({
      path: 'itemId',
      populate: { path: 'ownerId', select: 'name email' }
    })
    .populate('requesterId', 'name');

  if (!requestData) {
    logger.error({ requestId }, 'Worker: Request not found during notification processing');
    throw new Error('Request not found');
  }

  const item = requestData.itemId as any;
  const owner = item?.ownerId as any;
  const requester = requestData.requesterId as any;
  const message = (requestData as any).message;

  if (!owner?.email) {
    logger.error({ requestId, owner }, 'Worker: Owner email missing');
    throw new Error('Owner email missing');
  }

  console.log('DEBUG: Sending email with:', {
    ownerName: owner.name,
    requesterName: requester.name,
    message: (requestData as any).message
  });
  await sendEmail({
    to: owner.email,
    subject: `בקשה חדשה עבור: ${item?.title}`,
    text: `המשתמש ${requester?.name} ביקש את הפריט שלך: ${item?.title}. הודעה: ${message}`,
    html: `
      <h2>שלום ${owner.name},</h2>
      <p>יש לנו בקשה חדשה עבור הפריט שלך: <strong>${item?.title}</strong>.</p>
      <p><strong>המבקש:</strong> ${requester?.name}</p>
      <p><strong>ההודעה של המבקש:</strong> <em>"${message || 'לא צורפה הודעה'}"</em></p>
      <hr />
      <p>באפשרותך להיכנס למערכת כדי לאשר או לדחות את הבקשה.</p>
    `
  });

  logger.info({ requestId, to: owner.email }, 'Worker: Notification email sent successfully');
};

export const handleApprovedRequestLogic = async (requestId: string, isApproved: boolean): Promise<void> => {
  logger.info({ requestId, isApproved }, 'Worker: Starting handleApprovedRequestLogic');

  const currentRequest = await RequestModel.findById(requestId)
    .populate({ path: 'itemId', populate: { path: 'ownerId', select: 'name email' } })
    .populate('requesterId', 'name email');

  if (!currentRequest) {
    logger.error({ requestId }, 'Worker: Request not found');
    throw new Error('Request not found');
  }

  const item = currentRequest.itemId as any;
  const owner = item?.ownerId as any;
  const requester = currentRequest.requesterId as any;

  logger.info({ requesterEmail: requester?.email, ownerEmail: owner?.email }, 'Worker: Debugging participant emails');

  if (isApproved) {
    if (item) {
      item.status = item.transactionType === 'borrow' ? 'borrowed' : 'archived';
      await item.save();
    }

    await RequestModel.updateMany(
      { itemId: item._id, _id: { $ne: currentRequest._id }, status: 'pending' },
      { status: 'rejected' }
    );
    logger.info({ itemId: item._id }, 'Worker: Rejected all other pending requests');

    // Notify Winner
    if (requester?.email) {
      await sendEmail({
        to: requester.email,
        subject: 'הבקשה שלך אושרה!',
        text: `מזל טוב! הבקשה עבור ${item?.title} אושרה.`,
        html: `
          <h2>שלום ${requester.name},</h2>
          <p>יש לנו חדשות טובות!</p>
          <p>הבעלים אישר את הבקשה שלך עבור הפריט: <strong>${item?.title}</strong>.</p>
          <br>
          <p>ניתן לתאם את האיסוף מול בעל הפריט.</p>
        `
      });
      logger.info({ requestId, to: requester.email }, 'Worker: Approved email sent to winner');
    }

    // Notify Rejected
    const rejectedRequests = await RequestModel.find({ itemId: item._id, status: 'rejected' }).populate('requesterId', 'email name');
    for (const req of rejectedRequests) {
      const user = req.requesterId as any;
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: 'עדכון בנוגע לבקשתך',
          text: 'הבקשה עבור הפריט נדחתה.',
          html: `<p>שלום ${user.name},</p>
         <p>הצטערנו להודיע שהבקשה עבור הפריט <strong>${item?.title}</strong> לא אושרה הפעם.</p>`
        });
        logger.info({ rejectedRequestId: req._id, to: user.email }, 'Worker: Rejection email sent');
      }
    }
  } else {
    // Notify Requester - דחייה!
    if (requester?.email) {
      await sendEmail({
        to: requester.email,
        subject: 'עדכון בנוגע לבקשתך',
        text: `לצערנו, הבקשה עבור ${item?.title} נדחתה.`,
        html: `
          <h2>שלום ${requester.name},</h2>
          <p>לצערנו, הבקשה שלך עבור הפריט <strong>${item?.title}</strong> לא אושרה הפעם.</p>
          <p>נשמח אם תנסה להשאיל פריט אחר בהמשך.</p>
        `
      });
      logger.info({ requestId, to: requester.email }, 'Worker: Decline email sent');
    }
  }
  logger.info({ requestId }, 'Worker: Finished processing approved/rejected request successfully');
};