import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisConnection = new IORedis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null } as any);

let queue: any;
try {
  queue = new Queue('requests-queue', {
    connection: redisConnection as any
  });
  queue.on('error', (err: Error) => {
    console.error('[Queue] Redis queue error:', err.message);
  });
} catch (err: any) {
  console.error('[Queue] Failed to create Redis queue, falling back to no-op queue:', err.message);
  queue = {
    add: async () => {
      console.log('[Queue] Redis unavailable - skipping job add');
      return null;
    }
  };
}

export const requestQueue = queue;