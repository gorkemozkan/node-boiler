import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: UserRole | undefined;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  role?: UserRole;
}

export class UserModel {
  static async create(data: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.USER,
      },
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async update(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  static async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ users: Omit<User, 'password'>[]; total: number }> {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
