import { connectDB } from './config/db';
import { UserService } from './features/users/user.service';

(async () => {
  try {
    await connectDB();
    const svc = new UserService();
    const data = { name: 'debug', email: 'debug-create@example.com', password: 'Debug123', roles: ['receiver'] };
    const user = await svc.createUser(data);
    console.log('Created user:', user.email, user._id);
    process.exit(0);
  } catch (err: any) {
    console.error('ERROR:' + (err.stack || err.message || err));
    if (err.errors) console.error('errors:', err.errors);
    process.exit(1);
  }
})();
