import express from "express";
import { dataHandler } from "../controllers/dataHandlerController.js";

const dataHandlerRoute = express.Router();

dataHandlerRoute.post("/incoming_data", dataHandler)

export default dataHandlerRoute;