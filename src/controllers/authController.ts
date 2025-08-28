import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserModel, CreateUserData } from '../models/user';
import { env } from '../config/env';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { validateRequest } from '../utils/validation';
import { AuthenticatedRequest } from '../types';

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    role: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

export class AuthController {
  static register = [
    validateRequest(registerSchema),
    async (req: Request, res: Response) => {
      try {
        const { email, password, name, role } = req.body as CreateUserData;

        const existingUser = await UserModel.findByEmail(email);

        if (existingUser) {
          return errorResponse(res, 'User with this email already exists', 409);
        }

        const user = await UserModel.create({ email, password, name, role });

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          env.JWT_SECRET,
          { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
        );

        const userResponse = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        };

        return successResponse(res, { user: userResponse, token }, 'User registered successfully', 201);
      } catch (error) {
        console.error('Register error:', error);
        return errorResponse(res, 'Failed to register user', 500);
      }
    },
  ];

  static login = [
    validateRequest(loginSchema),
    async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;

        const user = await UserModel.findByEmail(email);

        if (!user) {
          return errorResponse(res, 'Invalid email or password', 401);
        }

        const isValidPassword = await UserModel.verifyPassword(password, user.password);

        if (!isValidPassword) {
          return errorResponse(res, 'Invalid email or password', 401);
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          env.JWT_SECRET,
          { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
        );

        const userResponse = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        };

        return successResponse(res, { user: userResponse, token }, 'Login successful');
      } catch (error) {
        return errorResponse(res, 'Failed to login', 500);
      }
    },
  ];

  static getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      const user = await UserModel.findById(userId);

      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return successResponse(res, userResponse);
    } catch (error) {
      return errorResponse(res, 'Failed to get profile', 500);
    }
  };

  static updateProfile = [
    validateRequest(updateUserSchema),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const userId = req.user!.id;

        const updateData = req.body;

        const existingUser = await UserModel.findById(userId);

        if (!existingUser) {
          return errorResponse(res, 'User not found', 404);
        }

        const updatedUser = await UserModel.update(userId, updateData);

        const userResponse = {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        };

        return successResponse(res, userResponse, 'Profile updated successfully');
      } catch (error) {
        return errorResponse(res, 'Failed to update profile', 500);
      }
    },
  ];

  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;

      const limit = parseInt(req.query.limit as string) || 10;

      const search = req.query.search as string;

      const { users, total } = await UserModel.findAll({ page, limit, search });

      return paginatedResponse(res, users, page, limit, total);
    } catch (error) {
      return errorResponse(res, 'Failed to get users', 500);
    }
  };



  static getUserById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;

      const user = await UserModel.findById(userId as string);
      
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      return successResponse(res, user);
    } catch (error) {
      return errorResponse(res, 'Failed to get user', 500);
    }
  }
}
