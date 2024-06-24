import express from "express";
import { createDestination, deleteDestination, getDestination, updateDestination } from "../controllers/destinationController.js";

const destinationRouter = express.Router();

destinationRouter.post("/Create", createDestination);
destinationRouter.post("/Get", getDestination);
destinationRouter.post("/Update", updateDestination);
destinationRouter.post("/Delete", deleteDestination);

export default destinationRouter;