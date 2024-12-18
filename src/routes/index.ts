import express from 'express';

import {
  loginController,
  productController,
  refreshTokenController,
  registerController,
  userController,
} from '../controllers';

import { admin, auth } from '../middlewares';

const router = express.Router();


router.post('/register', registerController.registerUser);

router.post('/login', loginController.loginUser);

router.post('/refresh', refreshTokenController.refresh);


router.get('/me', [auth], userController.me);

router.post('/logout', [auth], userController.logout);


router.post('/products', [auth, admin], productController.create);

router.put('/products/:id', [auth, admin], productController.update);

router.delete('/products/:id', [auth, admin], productController.remove);

router.get('/products', productController.getAll);

router.get('/products/:id', productController.getOne);

export default router;
