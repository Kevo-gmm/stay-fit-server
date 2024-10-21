"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json()); // application/json
app.use((0, cors_1.default)());
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({ message: message });
    next();
});
app.use("/user", auth_1.default);
mongoose_1.default.set("strictQuery", true);
mongoose_1.default
    .connect(process.env.CONNECTION_URL)
    .then(() => {
    app.listen(3001);
    console.log("listening at port 3001.....");
})
    .catch((err) => {
    console.log(err);
});
