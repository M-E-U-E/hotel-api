// File: src/app.ts
import express from 'express';
import hotelRoutes from './routes/hotelRoutes';

const app = express();

app.use(express.json());
app.use('/api', hotelRoutes);
app.use('/images', express.static('uploads/images'));

export default app;
