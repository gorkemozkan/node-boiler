import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  getAllUsers, 
  getUserById 
} from '../controllers/authController';
import { authenticateToken, requireRole } from '../middlewares/auth';
import { validatePagination } from '../utils/validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

router.get('/users', authenticateToken, requireRole([UserRole.ADMIN]), validatePagination, getAllUsers);
router.get('/users/:id', authenticateToken, requireRole([UserRole.ADMIN]), getUserById);

export default router;
