"use strict";

const { modules: { Blocks, Delegates } } = require("entanmo-clientjs");
const delay = require("./lib/delay");

const minters = [
    { name: "seabook", publicKey: "7688d73c5627c4adb2928f1f12ad100cdbf143d4f28b1f2f31818d0cdc46cc8e" },
    { name: "linkvc8", publicKey: "65e831ec96ae8369417f83e9d2541ab163f0da82a44a65a0a92d79807bd6580f" },
    { name: "tkcn", publicKey: "9025963f75a208da8b2c2478d3ed609ce2b22c2c49af0f4c2301c5f0e1332cf4" },
    { name: "tkcn1", publicKey: "9fc11565d468e9e28952f080fd9f4fbdc10c80a8d6acf875f683e2cb196e5138" },
    { name: "tkcn2", publicKey: "eef6415b9dc468949a1f816c9388b939e972ea77d4b3faffe48982c5da984c74" },
    { name: "tkcn4", publicKey: "d998438009d3f4959effd87a5f458f8de864887b7e059ea00b713c5482d2ed63" },
    { name: "xc01", publicKey: "97767c366c87bffd850e6ae04226fb6b318d35e423df2241312a6aa5d55c463f" },
    { name: "xc02", publicKey: "bb91d4e38638fbb02de974b606f10f5f5c46678f1817faa2689fbe16e234cbaf" },
    { name: "xc03", publicKey: "45ea678c97460a900b048729a4c4c4cf922b0e3dc9dec38bff7af78a580264ee" },
    { name: "xc04", publicKey: "a969a7cf4f9b11df9922c98f941c8cf925f6bdb1699e4177e2c9e543d5af59cc" },
    { name: "ken_01", publicKey: "6e3bfa53116ac247fe3f8a8eead4395b3603937763828f5cbc9a9e61e29a6cdd" },
    { name: "ken_02", publicKey: "0e9275328a1c1ecc94a6f867a02c5c09ef8e0d628e8147fb61a484cfe4d88b70" },
    { name: "brocktest", publicKey: "69cf25fc6744dee458382694f5d8561c74d72b774dbfa5d3374209a0fb9cc76e" }
];
const kNodeServer = "http://59.110.136.11:4096";
const kStartTime = new Date(Date.UTC(2018, 9, 12, 12, 0, 0, 0));
const blocksInst = new Blocks();
const delegatesInst = new Delegates();

const checkMint = async publicKey => {
    while (true) {
        try {
            const respDelegate = await delegatesInst.getDelegate(kNodeServer, { publicKey });
            if (!respDelegate.done) {
                throw new Error("next tick ...");
            }
            const respBlock = await blocksInst.getBlocks(kNodeServer, { generatorPublicKey: publicKey, limit: 1, orderBy: "height:desc" });
            if (!respBlock.done) {
                throw new Error("next tick ...");
            }
            return {
                vote: respDelegate.data.delegate.vote,
                rate: respDelegate.data.delegate.rate,
                produced: respDelegate.data.delegate.producedblocks,
                missed: respDelegate.data.delegate.missedblocks,
                timestamp: respBlock.data.blocks.length > 0 ? respBlock.data.blocks[0].timestamp : null
            };
        } catch (error) {
            void error;
            await delay(100);
        }
    }
};

function main() {

    (async () => {
        while (true) {
            console.log(`<${(new Date(Date.now())).toLocaleString()}>`);
            for (let v of minters) {
                const mintInfo = await checkMint(v.publicKey);
                const latestBlockTime = mintInfo.timestamp != null
                    ? (new Date(mintInfo.timestamp * 1000 + kStartTime.getTime())).toLocaleString()
                    : "--";
                const minterName = `[${v.name}]`;
                const minterLatestBlock = `  LatestBlock: ${latestBlockTime}`;
                const minterVote = `  Vote: ${mintInfo.vote}`;
                const minterRate = `  Rate: ${mintInfo.rate}`;
                const minterProduced = `  Produced: ${mintInfo.produced}`;
                const minterMissed = `  Missed: ${mintInfo.missed}`;
                console.log(minterName + minterLatestBlock + minterVote
                    + minterRate + minterProduced + minterMissed);
                // console.log(`[${v.name}] LatestBlock:${latestBlockTime}, Rate: ${minterRate}, Vote: ${minterVote}, Produced: ${minterProduced}, Missed: ${minterMissed}`);
            }
            console.log("\nWaitting for next check ...");
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