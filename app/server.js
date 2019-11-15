/*
 * @Author: Antoine YANG 
 * @Date: 2019-11-15 21:47:38 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-15 23:33:23
 */

const express = require('express');
const app = express();
const fs = require("fs");
const process = require('child_process');


const path = {
    static: "./public/"
};


app.get("/", (req, res) => {
    console.dir(req.params);
    res.send({
        success: true
    });
});

app.get("/open/:url", (req, res) => {
    console.dir(req.params);
    fs.readFile(path.static + req.params["url"], { encoding: 'UTF-8' }, (err, data) => {
        res.json({
            data: data
        });
    });
});


const server = app.listen(2369, () => {
    const addr = server.address().address;
    const host = addr === "::" ? "127.0.0.1" : addr;
    const port = server.address().port;
    console.log("Back-end server opened at http://" + host + ":" + port);
    console.log("Starting front-end server...");
    process.exec("npm start", (error, stdout, stderr) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(stdout);
        }
    });
});
