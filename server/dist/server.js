"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cloudinaryConfiguration_1 = __importDefault(require("./config/cloudinaryConfiguration"));
dotenv_1.default.config();
// Initialize Cloudinary first
(0, cloudinaryConfiguration_1.default)();
const DBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGO_URI) {
        throw new Error("Missing MongoDB connection string");
    }
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("Connection to MongoDB established");
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield DBConnection();
    const app = (0, express_1.default)();
    // Middlewares
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    // Routes
    app.use("/api/ducks", require("./routes/ducks"));
    app.use("/api/user", require("./routes/user"));
    app.use("/api/comments", require("./routes/comments"));
    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error("Server error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    });
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}))();
