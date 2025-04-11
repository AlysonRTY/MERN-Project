import express from "express";
import { getAllDucks } from "../controller/duckController";
const duckRouter = express.Router();

duckRouter.get("/all", getAllDucks);
// duckRouter.get("/", getDuck)

// duckRouter.post("/", createDuck);

export default duckRouter;
