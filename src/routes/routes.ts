import { Router } from "express";
import { authorization, registration, user } from "../controllers/controllers";
import { checkAuth } from '../utils/checkAuth'


export const router = Router();

router.post('/authorization', authorization)
router.post('/registration', registration)
router.get('/user', checkAuth, user)