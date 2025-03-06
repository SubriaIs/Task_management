const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Enable CORS for specific origins or all
server.use(cors({
  origin: '*',  // Allow all origins (you can restrict this to specific domains if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Use default middlewares (for logging, static, etc.)
server.use(middlewares);

// Set up the router to handle the db.json
server.use(router);

// Start the server on all available network interfaces
server.listen(3010, '0.0.0.0', () => {
    console.log('JSON Server is running on http://5.231.25.145:3010');
  });
