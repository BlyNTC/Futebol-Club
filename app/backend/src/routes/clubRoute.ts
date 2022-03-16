import * as express from 'express';
import { getAll, getById } from '../controller/clubController';

const route = express.Router();

route.get('/', getAll);
route.get('/:id', getById);

export default route;
