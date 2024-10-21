"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({ error: "Some fields are missing. Please fill in all fields" });
            return;
        }
        const userExist = await user_1.default.findOne({ email }).exec();
        if (userExist) {
            res.status(201).json({ message: "User already exists" });
            return;
        }
        else {
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const newUser = new user_1.default({ username, email, password: hashedPassword });
            await newUser.save();
            res.status(201).json({ message: "User saved successfully" });
            return;
        }
    }
    catch (error) {
        if (!error.statusCode)
            error.statusCode = 500;
        next(error);
    }
    return;
};
exports.signUp = signUp;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Some fields are missing. Please fill in all fields" });
            return;
        }
        else {
            const userExist = await user_1.default.findOne({ email }).exec();
            if (userExist) {
                const passwordMatched = await bcryptjs_1.default.compare(password, userExist.password);
                if (passwordMatched) {
                    res.status(200).json({ email: userExist.email, username: userExist.username });
                    return;
                }
            }
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
    }
    catch (error) {
        if (!error.statusCode)
            error.statusCode = 500;
        next(error);
    }
    return;
};
exports.login = login;
