import * as express from 'express';
import { getAll, getById, createMatch } from '../controller/matchController';

const route = express.Router();

route.get('/', getAll);
route.get('/:id', getById);
route.post('/', createMatch);

export default route;
