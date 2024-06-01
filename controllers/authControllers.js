import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as fs from "node:fs/promises";
import path from "node:path";
import gravatar from "gravatar";
import Jimp from "jimp";

import User from "../models/user.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      email,
      password: passwordHash,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "23h",
    });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogout = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { token: null },
      { new: true }
    );

    if (!user) {
      res.status(401).send({ message: "Not authorized" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const userCurrent = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

export const updateSubscr = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription })
      .end();
  } catch (error) {
    next(error);
  }
};

export const changeAvatar = async (req, res, next) => {
  try {
    const avatarSize = await Jimp.read(req.file.path);
    await avatarSize.resize(250, 250).writeAsync(req.file.path);

    const newPath = path.resolve("public", "avatars", req.file.filename);

    await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
