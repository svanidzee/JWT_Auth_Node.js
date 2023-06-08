import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

import authRouter from './authRouter.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);

const start = async () => {
  const uri = process.env.MONGODB_URI;
  const PORT = process.env.PORT || 5000;

  try {
    await mongoose.connect(uri);
    app.listen(PORT, () => console.log(`REST API on http://localhost:${PORT}`));
  } catch (e) {
    console.error(e);
  }
};

start();
