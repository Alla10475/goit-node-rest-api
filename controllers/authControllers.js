import crypto from "node:crypto";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import * as fs from "node:fs/promises";
import path from "node:path";

import gravatar from "gravatar";
import Jimp from "jimp";

import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import mail from "../mail.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    mail.sendMail({
      to: email,
      from: "sopinskaya10475@gmail.com",
      subject: "Welcome to Phone book",
      html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
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

    if (user.verify === false) {
      return res.status(401).send({ message: "Please verify your email" });
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
    if (!req.file) throw HttpError(400, "File not downloaded");
    const avatarSize = await Jimp.read(req.file.path);
    await avatarSize.resize(250, 250).writeAsync(req.file.path);

    const newPath = path.resolve("public", "avatars", req.file.filename);

    await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: path.join("avatars", req.file.filename),
      },

      { new: true }
    );

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken })
    
    if (!user) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null
    });

    res.status(200).send({ message: "Verification successful" });

  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    mail.sendMail({
      to: email,
      from: "sopinskaya10475@gmail.com",
      subject: "Welcome to Phone book",
      html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${user.verificationToken}`,
    });

    res.status(200).json({ message: "Verification email sent" });

  
} catch (error) {
  next(error);
}

}
