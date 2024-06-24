import express from "express";
import { createAccount, deleteAccount, getAccount, updateAccount } from "../controllers/accountController.js";

const accountRouter = express.Router();

accountRouter.post("/Create", createAccount);
accountRouter.post("/Get", getAccount);
accountRouter.post("/Update", updateAccount);
accountRouter.post("/Delete", deleteAccount);

export default accountRouter;