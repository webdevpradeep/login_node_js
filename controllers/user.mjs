import { readFile, writeFile } from 'node:fs/promises';
import jwt from 'jsonwebtoken';

const registerController = async (req, res, next) => {
  // input check
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.statusCode = 400;
    return res.json({ error: 'input is not valid' });
    // throw new Error(JSON.stringify({ error: "input is not valid" }))
  }

  // db file read
  const fileDataStr = await readFile('./db.json', {
    encoding: 'utf-8',
  });
  // parser string to json object
  const fileData = JSON.parse(fileDataStr);

  // user data object
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  // check if user already registered
  if (
    fileData.users.filter((e) => {
      return e.email === userData.email;
    }).length > 0
  ) {
    res.statusCode = 400;
    return res.json({ error: 'user already registered' });
  }

  // user data added to json data
  fileData.users.push(userData);

  // db json update
  await writeFile('./db.json', JSON.stringify(fileData));

  // send response
  res.json({ message: 'register successful' });
};

const loginController = async (req, res, next) => {
  // validate input
  if (!req.body.email || !req.body.password) {
    res.statusCode = 400;
    return res.json({ error: 'input is not valid' });
  }

  // read db in string
  const fileDataStr = await readFile('./db.json', { encoding: 'utf-8' });
  // convert db data in json
  const dbData = JSON.parse(fileDataStr);

  // find user in db
  const user = dbData.users.filter((e) => {
    return e.email === req.body.email;
  })[0];

  // match password
  if (user.password !== req.body.password) {
    res.statusCode = 400;
    return res.json({ error: 'password is wrong' });
  }

  const token = jwt.sign(
    { name: user.name, email: user.email },
    'kuguogyfyfvhgyvhuofkygvkiulju',
    { expiresIn: '1h' }
  );

  res.json({ token, name: user.name, email: user.email });
};

export { registerController, loginController };
