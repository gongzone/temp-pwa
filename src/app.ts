import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("++++++++++++++Error!!!!!+++++++++++++", err.message);
  console.log(err.stack);
  res.status(err.status || 500);
  res.json({ code: err.code, msg: err.message, status: err.status });
});

app.listen(8080, () => {
  console.log(`app listening on port 8080`);
});

module.exports = app;
