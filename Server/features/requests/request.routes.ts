import { Router } from 'express';
import { RequestController } from './request.controller';

const router = Router();
const requestController = new RequestController();

// 1. יצירת בקשה: POST /api/requests
router.post('/', requestController.create.bind(requestController));

router.put('/:requestId/approve', requestController.approveRequest);
// 2. קבלת הבקשות של משתמש ספציפי: GET /api/requests/user/:userId
router.get('/user/:userId', requestController.getMyRequests.bind(requestController));

// 3. עדכון סטטוס בקשה (אישור/דחייה): PATCH /api/requests/:id/status
router.patch('/:id/status', requestController.updateStatus.bind(requestController));

// 4. ביטול ומחיקת בקשה: DELETE /api/requests/:id
router.delete('/:id', requestController.delete.bind(requestController));



export default router;