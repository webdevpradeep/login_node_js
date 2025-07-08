import express from 'express';
import { registerController, loginController } from './controllers/user.mjs'
import { prizeController } from './controllers/prize.mjs'
import { globalMiddleware, authMiddleware } from './middleware.mjs';
import { errorController, undefinedRouteHandler } from './error.mjs';
const server = express();
const port = 5000

server.use(express.json())

server.use(globalMiddleware)

server.post("/register", registerController);
server.post("/login", loginController);
server.get("/prize", authMiddleware, prizeController)

// Catch-all route
server.all(/^.*$/, undefinedRouteHandler);

// error controller
server.use(errorController)

server.listen(port, () => {
  console.log(`server started on ${port}`);
});
