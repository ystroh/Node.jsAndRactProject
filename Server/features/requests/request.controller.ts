import { Request, Response, NextFunction } from 'express';
import { RequestService } from './request.service';

const requestService = new RequestService();

export class RequestController {
  
  // יצירת בקשה חדשה
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { itemId, requesterId, message } = req.body;

      if (!itemId || !requesterId) {
        res.status(400).json({ error: 'itemId ו-requesterId הם שדות חובה' });
        return;
      }

      const newRequest = await requestService.createRequest({
        itemId,
        requesterId,
        message
      });

      res.status(201).json({ message: 'הבקשה נוצרה בהצלחה', request: newRequest });
    } catch (error) {
      next(error);
    }
  }

  // קבלת הבקשות שהמשתמש הנוכחי שלח
async getMyRequests(req: Request<{ userId: string }>, res: Response, next: NextFunction): Promise<void> {
        try {
      const { userId } = req.params; // זמני: מקבלים את ה-ID של המשתמש ב-URL כדי לסנן
      const requests = await requestService.getMyRequests(userId);
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  }

  // עדכון סטטוס (אישור או דחיית בקשה)
  async updateStatus(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body; // הסטטוס החדש שנבחר: 'approved' או 'rejected'

      if (!['approved', 'rejected', 'completed'].includes(status)) {
        res.status(400).json({ error: 'סטטוס לא חוקי' });
        return;
      }

      const updatedRequest = await requestService.updateRequestStatus(id, status);

      if (!updatedRequest) {
        res.status(404).json({ error: 'הבקשה לא נמצאה' });
        return;
      }

      res.status(200).json({ message: 'סטטוס הבקשה עודכן', request: updatedRequest });
    } catch (error) {
      next(error);
    }
  }

  // ביטול בקשה
  async cancel(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const canceledRequest = await requestService.deleteRequest(id);

      if (!canceledRequest) {
        res.status(404).json({ error: 'הבקשה לא נמצאה' });
        return;
      }

      res.status(200).json({ message: 'הבקשה בוטלה ונמחקה בהצלחה' });
    } catch (error) {
      next(error);
    }
  }
}