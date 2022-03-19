import * as express from 'express';
import { getHome, getAway, getAll } from '../controller/leaderBoardController';

const route = express.Router();

route.get('/home', getHome);

route.get('/away', getAway);

route.get('/', getAll);

export default route;
