import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.log(err);
    });

// Routes
app.use("/api/user", userRouter);

app.use('/api/tasks', taskRouter);

app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
