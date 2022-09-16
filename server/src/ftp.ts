import { globalEvent } from "./index";

const FtpSrv = require("ftp-srv");

const port = process.env.PORT || 3000;
const ip = process.env.SERVIP || '10.1.80.102';
const pass = process.env.FTPPASS || 'defaultPassword';

export default () => {
    const ftpServer = new FtpSrv({
        url: "ftp://0.0.0.0:" + port,
        pasv_url: ip,
        pasv_min: 50000,
        pasv_max: 60000
      });


    ftpServer.on("login", ({ connection, username, password }: any, resolve: any, reject: any) => {

        connection.on('STOR', (err: any, filePath: string) => {
            if (err) return console.error(err);
            console.log(`New File! ${filePath}`);
            globalEvent.emit('file-upload', filePath);
        })
      
        if (username === "cameraPole" && password === pass) {
          return resolve({ root: "/mnt/lpr" });
        }
        return reject(new Error("Invalid username or password"));
      });
      

      ftpServer.listen().then(() => {
        console.log(`Ftp server is starting Port: ${port}, IP: ${ip}`);
      });
}