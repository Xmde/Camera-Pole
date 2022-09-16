import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello from the TypeScript world!</h1>");
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

// Quick start, create an active ftp server.
// const FtpSrv = require("ftp-srv");

// const port = 21;
// const ftpServer = new FtpSrv({
//   url: "ftps://0.0.0.0:" + port,
//   anonymous: true,
// });

// ftpServer.on("login", ({ connection, username, password }, resolve, reject) => {
//   if (username === "anonymous" && password === "@anonymous") {
//     return resolve({ root: "/" });
//   }
//   return reject(new Error("Invalid username or password"));
// });

// ftpServer.listen().then(() => {
//   console.log("Ftp server is starting...");
// });
