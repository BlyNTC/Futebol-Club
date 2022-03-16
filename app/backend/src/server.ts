import { App } from './app';
import 'dotenv/config';

const PORT = process.env.PORT || process.env.MINHA_PORT || 3001;

const app = new App();

app.start(PORT);

export default app;
