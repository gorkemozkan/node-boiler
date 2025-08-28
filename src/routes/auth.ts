import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, requireRole } from '../middlewares/auth';
import { validatePagination } from '../utils/validation';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);

router.get('/users', authenticateToken, requireRole(['admin']), validatePagination, AuthController.getAllUsers);
router.get('/users/:id', authenticateToken, requireRole(['admin']), AuthController.getUserById);

export default router;
