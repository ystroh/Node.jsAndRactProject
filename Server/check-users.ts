import { connectDB } from './config/db';
import { User } from './features/users/user.model';

(async () => {
  await connectDB();
  const users = await User.find().select('+passwordHash');
  console.log('All users:');
  users.forEach(u => {
    console.log(`- ${u.email}: passwordHash=${u.passwordHash ? 'exists' : 'MISSING'}`);
  });
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
