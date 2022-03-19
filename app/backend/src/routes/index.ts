import * as express from 'express';

import loginRoute from './loginRoute';
import clubRoute from './clubRoute';
import matchRoute from './matchRoute';
import leaderBoardRoute from './leaderBoardRoute';

const route = express.Router();

route.use('/login', loginRoute);

route.use('/clubs', clubRoute);

route.use('/matchs', matchRoute);

route.use('/leaderboard/', leaderBoardRoute);

export default route;
