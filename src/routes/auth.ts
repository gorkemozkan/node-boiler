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

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

router.get('/users', authenticateToken, requireRole(['admin']), validatePagination, getAllUsers);
router.get('/users/:id', authenticateToken, requireRole(['admin']), getUserById);

export default router;
