import * as express from 'express';
import {
  getAll,
  getById,
  createMatch,
  finishMatch,
  updateMatch,
} from '../controller/matchController';

const route = express.Router();

route.patch('/:id/finish', finishMatch);
route.patch('/:id', updateMatch);
route.get('/:id', getById);
route.get('/', getAll);
route.post('/', createMatch);

export default route;
