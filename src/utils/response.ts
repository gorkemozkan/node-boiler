import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export function successResponse<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function errorResponse(
  res: Response,
  error: string,
  statusCode = 400
): Response<ApiResponse> {
  return res.status(statusCode).json({
    success: false,
    error,
  });
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
