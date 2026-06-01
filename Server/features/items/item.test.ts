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

describe('Item API Integration Tests', () => {
  const mockOwnerId = new Types.ObjectId().toString();
  let createdItemId: string;

  it('should create a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({
        title: 'מקדחה חשמלית',
        description: 'מקדחה במצב מצוין לשימוש ביתי',
        category: 'כלי עבודה וגינה',
        ownerId: mockOwnerId,
        status: 'available'
      });

    expect(res.status).toBe(201);
    expect(res.body.item).toHaveProperty('_id');
    createdItemId = res.body.item._id;
  });

  it('should get all available items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get items by owner', async () => {
    const res = await request(app).get(`/api/items/user/${mockOwnerId}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    
    // בודקים לפי ה-title ששלחנו, במקום להסתמך על populate של ownerId
    const foundItem = res.body.find((item: any) => item._id === createdItemId);
    expect(foundItem).toBeDefined();
    expect(foundItem.title).toBe('מקדחה חשמלית');
  });

  it('should update item details', async () => {
    const res = await request(app)
      .patch(`/api/items/${createdItemId}`)
      .send({ status: 'borrowed' });

    expect(res.status).toBe(200);
    expect(res.body.item.status).toBe('borrowed');
  });

  it('should delete an item', async () => {
    const res = await request(app).delete(`/api/items/${createdItemId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('הפריט נמחק בהצלחה');
  });
});