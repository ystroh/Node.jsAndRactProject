import { Request, Response, NextFunction } from 'express';
import { RequestService } from './request.service';

const requestService = new RequestService();

export class RequestController {

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // If the client didn't include requesterId in the body, try to read it from header
      const headerUserId = (req.headers['x-user-id'] as string) || undefined;
      if (!req.body.requesterId && headerUserId) {
        req.body.requesterId = headerUserId;
      }

      const newRequest = await requestService.createRequest(req.body);
      res.status(201).json({ message: 'הבקשה נוצרה בהצלחה', request: newRequest });
    } catch (error) {
      next(error);
    }
  }

  async getMyRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers['x-user-id'] as string;

     if (!userId) {
      res.status(401).json({ message: "User ID is missing" });
      return;
    } 
      const requests = await requestService.getMyRequests(userId as string);
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedRequest = await requestService.updateRequestStatus(id as string, req.body);
      res.status(200).json({ message: 'סטטוס הבקשה עודכן', request: updatedRequest });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await requestService.deleteRequest(id as string);
      res.status(200).json({ message: "הבקשה נמחקה בהצלחה" });
    } catch (error) {
      next(error);
    }
  }


  /**
   * מטפל בבקשת אישור/דחיית פנייה של מפרסם
   */
  approveRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      // הולידציה כבר עברה במידלוור בראוטר, 
      // אז אנחנו סומכים על כך שה-requestId וה-isApproved תקינים
      const { requestId } = req.params;
      const { isApproved } = req.body;

      // קריאה לשירות שיעדכן ב-DB וידחוף לתור
      await requestService.approveRequest(requestId as any, isApproved);

      res.status(200).json({
        success: true,
        message: `הבקשה עודכנה בהצלחה לסטטוס: ${isApproved ? 'מאושר' : 'דחוי'}. תהליך שליחת המיילים החל ברקע.`
      });

    } catch (error: any) {
      console.error('❌ שגיאה בקונטרולר בזמן אישור בקשה:', error.message);
      res.status(500).json({
        success: false,
        message: "שגיאה בביצוע הפעולה",
        error: error.message
      });
    }
  };
}