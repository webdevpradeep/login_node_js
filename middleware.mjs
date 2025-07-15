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
  next();
};

export { globalMiddleware, authMiddleware };
