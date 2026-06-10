import { Router } from 'express';
import { RequestController } from './request.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();
const requestController = new RequestController();

// ADMIN: get all requests
router.get('/all', protect, restrictTo('admin'), requestController.getAllRequests.bind(requestController));

// Owner: get requests for items owned by the authenticated user
router.get('/owner', protect, requestController.getRequestsForOwner.bind(requestController));

router.put('/:requestId/approve', requestController.approveRequest);

// 3. עדכון סטטוס בקשה (אישור/דחייה): PATCH /api/requests/:id/status
router.patch('/:id/status', requestController.updateStatus.bind(requestController));

// 4. ביטול ומחיקת בקשה: DELETE /api/requests/:id
router.delete('/:id', requestController.delete.bind(requestController));

// 2. קבלת הבקשות של משתמש ספציפי: GET /api/requests
router.get('/', requestController.getMyRequests.bind(requestController));

// 1. יצירת בקשה: POST /api/requests
router.post('/', requestController.create.bind(requestController));



export default router;