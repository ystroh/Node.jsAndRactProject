/// <reference types="jest" />
import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// 1. הגדלנו את הזמן ל-20 שניות (20000ms) עבור ההרצה הראשונה
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 20000); 

afterAll(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

describe('User API', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'טסט משתמש',
        email: 'test@test.com',
        password: 'password123',
        roles: ['receiver']
      });

    expect(res.status).toBe(201);
  }, 10000); // גם לטסט עצמו נתנו קצת יותר זמן
});