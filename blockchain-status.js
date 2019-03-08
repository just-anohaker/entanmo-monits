"use strict";

const socketioClient = require("socket.io-client");

const client = socketioClient("http://59.110.136.11:4096");

client.on("connect", () => {
    console.log("connect");
});

client.on("blocks/change", args => {
    console.log(`[NewBlock] (${args.height}) - ${(new Date()).toLocaleString()}`);
});