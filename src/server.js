import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './router/userRoutes.js';
import notificationRoutes from './router/notificationRoutes.js';
import { connectRabbitMQ } from './rabbitmq.js';
import { setupWebSocket, getBroadcastFunction } from './websocket.js';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Notification and Auth API',
      version: '1.0.0',
      description: 'API for Notification and Authentication services',
      contact: {
        name: 'Animesh',
        email: 'ajangir52@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/router/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Setup WebSocket server
setupWebSocket(server);

// Connect to RabbitMQ with broadcast function
connectRabbitMQ(getBroadcastFunction);
