import { Request, Response, NextFunction } from 'express';
import { RequestService } from './request.service';

const requestService = new RequestService();

export class RequestController {
  
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newRequest = await requestService.createRequest(req.body);
      res.status(201).json({ message: 'הבקשה נוצרה בהצלחה', request: newRequest });
    } catch (error) {
      next(error);
    }
  }

  async getMyRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const requests = await requestService.getMyRequests(userId as string);
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id } = req.params;
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
}