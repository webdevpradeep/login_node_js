import { readFile, writeFile } from 'node:fs/promises';
import jwt from 'jsonwebtoken';
import prisma from '../db.mjs';
import bcrypt from 'bcrypt';
import * as z from 'zod';
import { sendEmail } from '../email.mjs';
import Randomstring from 'randomstring';
import dayjs from 'dayjs';
import { ServerError } from '../error.mjs';

// input model for user registration
const UserModel = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s]*$/, 'Name cannot contain special characters'),
  email: z.email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

const registerController = async (req, res, next) => {
  // input check
  try {
    await UserModel.parseAsync(req.body);
  } catch (e) {
    const msg = z.prettifyError(e);
    throw new ServerError(400, msg);
  }

  // add user in DB
  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: newHashedPassword,
    },
  });

  // send response
  res.json({ message: 'register successful' });
};

// input model for user login
const UserLoginModel = z.object({
  email: z.email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 8 characters long' }),
});

const loginController = async (req, res, next) => {
  const result = await UserLoginModel.safeParseAsync(req.body);
  if (!result.success) {
    const msg = z.prettifyError(result.error);
    throw new ServerError(400, msg);
  }

  // find user in DB
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    throw new ServerError(404, 'user DNE');
  }

  // match password
  const isOk = await bcrypt.compare(req.body.password, user.password);
  if (!isOk) {
    throw new ServerError(400, 'password is wrong');
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    process.env.TOKEN_SECRET
  );

  res.json({ token, name: user.name, email: user.email, role: user.role });
};

const forgotPasswordController = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    throw new ServerError(404, 'user DNE');
  }

  const token = Randomstring.generate();
  await prisma.user.update({
    where: { email: req.body.email },
    data: {
      resetToken: token,
      resetTokenExpiry: new Date(Date.now()),
    },
  });

  const msg = `<html><body>Click this link <a href="http://localhost:3000/reset_password/${token}">Click Here</a></body></html>`;

  await sendEmail(req.body.email, 'Forgot Password', msg);

  res.json({ message: 'email sent check your email' });
};

const resetPasswordController = async (req, res, next) => {
  const users = await prisma.user.findMany({
    where: {
      resetToken: req.params.token,
    },
  });

  if (!users.length) {
    throw new ServerError(400, 'invalid reset link');
  }

  const user = users[0];

  const subTime = dayjs().subtract(
    process.env.RESET_LINK_EXPIRY_TIME_IN_MINUTES,
    'minute'
  );
  if (dayjs(subTime).isAfter(dayjs(user.resetTokenExpiry))) {
    throw new ServerError(400, 'link is expired!!! try forgot password again');
  }

  const hasedPassword = await bcrypt.hash(req.body.password, 10);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetToken: null,
      password: hasedPassword,
    },
  });
  res.json({ message: 'password reset successful' });
};

const getAllUsers = async (req, res, next) => {
  res.json({ message: 'get all user not implemented' });
};

export {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  getAllUsers,
};
