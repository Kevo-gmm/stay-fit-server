import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import User, { UserData } from "../models/user";

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const { username, email, password } = req.body as UserData;
    if (!username || !password || !email) {
      res.status(400).json({ error: "Some fields are missing. Please fill in all fields" });
      return;
    }
    const userExist: UserData | null = await User.findOne({ email }).exec();
    if (userExist) {
      res.status(201).json({ message: "User already exists" });
      return;
    } else {
      const hashedPassword: string = await bcrypt.hash(password, 10);

      const newUser: UserData = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: "User saved successfully" });
      return;
    }
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }

  return;
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ error: "Some fields are missing. Please fill in all fields" });
      return;
    } else {
      const userExist: UserData | null = await User.findOne({ email }).exec();

      if (userExist) {
        const passwordMatched: boolean = await bcrypt.compare(password, userExist.password);
        if (passwordMatched) {
          res.status(200).json({ email: userExist.email, username: userExist.username });
          return;
        }
      }
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
  return;
};
