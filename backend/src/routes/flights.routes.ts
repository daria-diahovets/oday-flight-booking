import { Router } from 'express';
import {
  listFlights,
  getFlightById,
} from '../controllers/flights.controller.js';

const router = Router();

router.get('/', listFlights);
router.get('/:id', getFlightById);

export default router;
