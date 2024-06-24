import express from "express";
import cors from "cors";
import accountRouter from "./routes/accountRoute.js";
import destinationRouter from "./routes/destinationRoute.js";
import dataHandlerRoute from "./routes/dataHandlerRoute.js";

const app = express();
const port = process.env.port || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/Account", accountRouter);
app.use("/Destination", destinationRouter);
app.use("/server", dataHandlerRoute);

app.get("/", (req, res) => {
    res.send("Api Working");
});

app.listen(port, () => {
    console.log(`Server started on http://127.0.0.1:${port}`);
});
