import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import configRoutes from './routes/configRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';

dotenv.config();
const app = express();

const allowed = (process.env.FRONTEND_ORIGIN || '*') 
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowed.includes('*') || allowed.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  })
);



app.use(express.json());
app.use(morgan('dev'));

app.use('/config', configRoutes);
app.use('/webhook', webhookRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use(errorHandler);

export default app;