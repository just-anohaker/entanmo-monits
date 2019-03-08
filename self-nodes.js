"use strict";

const { modules: { Blocks } } = require("entanmo-clientjs");
const delay = require("./lib/delay");

const svrList = [
    { name: "G爱尔兰", hostname: "http://34.244.36.103:4096" },
    { name: "G北京1", hostname: "http://39.105.77.252:4096" },
    { name: "G北京2", hostname: "http://47.95.3.22:4096" },
    { name: "G北京3", hostname: "http://59.110.136.11:4096" },
    { name: "G东京", hostname: "http://3.112.19.136:4096" },
    { name: "G法兰克福", hostname: "http://52.59.42.182:4096" },
    { name: "G加利福利亚", hostname: "http://13.56.210.205:4096" },
    { name: "G上海1", hostname: "http://106.14.155.8:4096" },
    { name: "G上海2", hostname: "http://106.14.187.88:4096" },
    { name: "G深圳1", hostname: "http://120.77.168.107:4096" },
    { name: "G深圳2", hostname: "http://120.79.8.18:4096" },
    { name: "S北京", hostname: "http://47.102.135.35:6096" },
    { name: "S弗吉利亚", hostname: "http://40.114.70.112:6096" },
    { name: "S杭州", hostname: "http://47.110.42.170:6096" },
    { name: "S上海", hostname: "http://47.102.135.35:6096" },
    { name: "S张家口", hostname: "http://39.98.65.187:6096" },
    { name: "W悉尼1", hostname: "http://52.187.232.98:4096" },
    { name: "W悉尼2", hostname: "http://20.188.242.113:4096" },
    { name: "汪雷", hostname: "http://etm.red:8096" }
];
const blocksInst = new Blocks();

const checkSvr = async (svr, retry = 5) => {
    let currentHeight = "--";
    let currentRetry = 0;
    while (true) {
        if (currentRetry >= retry) {
            break;
        }

        try {
            const respHeight = await blocksInst.getHeight(svr, 1000);
            if (!respHeight.done) {
                throw new Error("http request failure.");
            }
            currentHeight = respHeight.data.height;
            break;
        } catch (error) {
            void error;
            currentRetry++;
            delay(100);
        }
    }
    return currentHeight;
};

const checkSvrList = async (svrList, logged = true, retry = 5) => {
    const result = [];
    for (let s of svrList) {
        const checkResult = await checkSvr(s.hostname, retry);
        if (logged) {
            console.log(`  [Check] (${checkResult}) - ${s.name}`);
        }
        result.push({ name: s.name, result: checkResult });
    }
    return result;
};

function main() {
    (async () => {
        let count = 0;
        while (true) {
            count++;
            const d = (new Date(Date.now())).toLocaleString();
            console.log(`<${d}> Tick(${count}):`);
            const result = await checkSvrList(svrList);
            void result;
            //console.log(`Tick(${count})` + "\n" + JSON.stringify(result, null, 2));

            console.log("\nWaitting for next tick ...\n");
            await delay(60 * 1000);
        }
    })()
        .then(result => {
            void result;
            console.log("Finished.");
        })
        .catch(error => {
            console.log("Exception:", error);
        });
}

main();