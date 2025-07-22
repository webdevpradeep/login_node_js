import jwt from 'jsonwebtoken';

const globalMiddleware = (req, res, next) => {
  req.name = 'apple';
  console.log('global middleware apple');
  next();
};

const authMiddleware = (req, res, next) => {
  // check for token is available or not
  if (!req.headers.authorization) {
    res.statusCode = 400;
    return res.json({ error: 'token is not sent' });
  }

  // check for Barer is present or not
  const barerToken = req.headers.authorization.split(' ');
  const token = barerToken[1];
  if (!token) {
    res.statusCode = 400;
    return res.json({ error: 'token not valid' });
  }

  // validate token
  try {
    jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (e) {
    res.statusCode = 400;
    return res.json({ error: e.message });
  }

  req.user = jwt.decode(token);

  next();
};

const permissionMiddleware = (...roles) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.statusCode = 500;
      return res.json({ message: 'authentication not added correctly' });
    }
    const role = roles.filter((e) => e === req.user.role);
    if (role.length == 0) {
      res.statusCode = 401;
      return res.json({ message: 'you are not authorized!!!' });
    }
    next();
  };
};

export { globalMiddleware, authMiddleware, permissionMiddleware };
