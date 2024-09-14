// src/routes/index.ts (or any file where you want to list routes)
import express from 'express';

const app = express();

// Define your routes
app.get('/api/users', (req, res) => res.send('Get users'));
app.post('/api/users', (req, res) => res.send('Create user'));
// ... other routes

// Function to list all routes
const listRoutes = (app: express.Application) => {
  const routes: { [method: string]: string[] } = {};

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) { // route
      const path = middleware.route.path;
      const method = Object.keys(middleware.route.methods)[0].toUpperCase();
      if (!routes[method]) {
        routes[method] = [];
      }
      routes[method].push(path);
    } else if (middleware.name === 'router') { // mounted routers
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const path = handler.route.path;
          const method = Object.keys(handler.route.methods)[0].toUpperCase();
          if (!routes[method]) {
            routes[method] = [];
          }
          routes[method].push(path);
        }
      });
    }
  });

  return routes;
};

console.log('API Routes:', listRoutes(app));

export default app;
