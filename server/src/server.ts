// server.ts
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';
import { MenuController } from './controllers/MenuController';
import { EventController } from './controllers/EventController';
import { ReservationController } from './controllers/ReservationController';
import { TheForkController } from './controllers/TheForkController';
import { AuthController } from './controllers/AuthController';
import { WhitelabelController } from './controllers/WhitelabelController';
import { authMiddleware } from './middlewares/authMiddleware';
import { SeedService } from './services/SeedService';
import { ClientController } from './controllers/ClientController';

// Connect to MongoDB and seed initial data.
connectDB().then(async () => {
    const seedService = new SeedService();
    await seedService.seedInitialData();
});

// Create the API Express app using routing-controllers.
// All API endpoints will be available under the '/api' prefix.
const apiApp = createExpressServer({
    controllers: [
        MenuController,
        EventController,
        ReservationController,
        TheForkController,
        AuthController,
        WhitelabelController,
    ],
    routePrefix: '/api',
    cors: true,
    middlewares: [authMiddleware, ],
} as any);

// Create the main Express app.
const app = express();

// Enable cookie parsing and CORS (for both API and client routes).
app.use(cookieParser());
app.use(cors());

// Mount the API endpoints.
app.use(apiApp);

// Serve static public from the "client" folder.
app.use(express.static(path.join(__dirname, '../../client')));

// Catch-all route for client-side rendering using the separated client controller.
app.get('*', ClientController as any);

// Start the server.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
