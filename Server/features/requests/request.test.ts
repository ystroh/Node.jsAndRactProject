/// <reference types="jest" />
import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types } from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}, 20000);

afterAll(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

describe('Request API Integration Tests', () => {
  const mockUserId = new Types.ObjectId().toString();
  const mockItemId = new Types.ObjectId().toString();
  let createdRequestId: string;

  it('should create a new request', async () => {
    const res = await request(app)
      .post('/api/requests') // תואם ל-router.post('/')
      .send({
        itemId: mockItemId,
        requesterId: mockUserId,
        message: 'בקשה לבדיקה',
        status: 'pending'
      });

    expect(res.status).toBe(201);
    createdRequestId = res.body.request._id;
  });

  it('should get requests for a user', async () => {
    // מעודכן ל-GET /api/requests/user/:userId
    const res = await request(app).get(`/api/requests/user/${mockUserId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update request status', async () => {
    // מעודכן ל-PATCH /api/requests/:id/status
    const res = await request(app)
      .patch(`/api/requests/${createdRequestId}/status`)
      .send({ status: 'approved' });

    expect(res.status).toBe(200);
    expect(res.body.request.status).toBe('approved');
  });

  it('should delete a request', async () => {
    // תואם ל-DELETE /api/requests/:id
    const res = await request(app).delete(`/api/requests/${createdRequestId}`);
    expect(res.status).toBe(200);
  });
});