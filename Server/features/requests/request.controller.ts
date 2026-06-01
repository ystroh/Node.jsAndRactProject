import { Request, Response, NextFunction } from 'express';
import { RequestService } from './request.service';
import { idSchema } from './request.validation';

const requestService = new RequestService();

export class RequestController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // כל הבדיקות נעשות ב-Service דרך Zod
      const newRequest = await requestService.createRequest(req.body);
      res.status(201).json({ message: 'הבקשה נוצרה בהצלחה', request: newRequest });
    } catch (error) {
      next(error);
    }
  }

  async getMyRequests(req: Request<{ userId: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const requests = await requestService.getMyRequests(req.params.userId);
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      // מעבירים את ה-body ל-service כדי שיבדוק אם הסטטוס חוקי
      const updatedRequest = await requestService.updateRequestStatus(req.params.id, req.body);
      if (!updatedRequest) {
        res.status(404).json({ error: 'הבקשה לא נמצאה' });
        return;
      }
      res.status(200).json({ message: 'סטטוס הבקשה עודכן', request: updatedRequest });
    } catch (error) {
      next(error);
    }
  }

  // בתוך ה-Controller שלך
async delete(req: Request, res: Response, next: NextFunction) {
  try {
    // בדיקת ה-ID ב-URL בעזרת Zod
    const  id = idSchema.parse(req.params.id); 
    
    await requestService.deleteRequest(id);
    res.status(200).json({ message: "נמחק בהצלחה" });
  } catch (error) {
    next(error); // ה-Middleware שלנו יתפוס את זה ויחזיר 400
  }
}
  
}