import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { loginUserSchema, idSchema } from './user.validation';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/AppError';
import z from 'zod';

const userService = new UserService();

export class UserController {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json({
        message: 'המשתמש נוצר בהצלחה',
        user: { id: newUser._id, name: newUser.name, email: newUser.email, roles: newUser.roles }
      });
    } catch (error: any) {
      next(error)
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = idSchema.parse(req.params.id); // אימות ID דרך Zod
      const deletedUser = await userService.deleteUser(userId);
      res.status(200).json({
        message: 'המשתמש נמחק בהצלחה',
        deletedUser: { id: deletedUser._id, name: deletedUser.name, email: deletedUser.email }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = idSchema.parse(req.params.id);
      const updated = await userService.updateUser(userId, req.body);
      res.status(200).json({ message: 'המשתמש עודכן בהצלחה', user: { id: updated._id, name: updated.name, email: updated.email, roles: updated.roles } });
    } catch (error) {
      next(error);
    }
  }

 async login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginUserSchema.parse(req.body);
    const { user, token } = await userService.login(email, password); // קריאה לסרוויס
    
    res.status(200).json({ message: 'התחברת בהצלחה', token, user });
  } catch (error) {
    next(error);
  }
}
}