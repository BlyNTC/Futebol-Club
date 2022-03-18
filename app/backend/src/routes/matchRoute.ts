import * as express from 'express';
import { getAll, getById, createMatch, finishMatch } from '../controller/matchController';

const route = express.Router();

route.get('/', getAll);
route.get('/:id', getById);
route.post('/', createMatch);
route.patch('/:id/finish', finishMatch);

export default route;
