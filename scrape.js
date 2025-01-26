const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputFile = 'proxy.txt';

if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
    console.log('SCRAPPING FUCK PROXY');
}

const proxyUrls = [
    // Daftar sebelumnya
    'https://api.ngocphong.space/get-proxy?key=Lintar21&type=http',
    'https://api.ngocphong.space/get-proxy?key=Lintar21&type=https',
    'https://api.ngocphong.space/get-proxy?key=Lintar21&type=socks4',
    'https://api.ngocphong.space/get-proxy?key=Lintar21&type=socks5',
    // Tambahan baru
    'https://spys.me/proxy.txt',
    'https://www.sslproxies.org/',
    'https://free-proxy-list.net/',
    'https://us-proxy.org/',
    'https://www.socks-proxy.net/',
    'https://openproxy.space/list',
    'https://proxypremier.com/proxies.php',
    'https://github.com/clarketm/proxy-list/blob/master/proxy-list-raw.txt',
    'https://proxy-daily.com/',
    'https://list.proxylistplus.com/Fresh-HTTP-Proxy-List-1',
    'https://aliveproxy.com/fastest-proxies/',
    'https://www.proxy-list.download/HTTPS',
    'https://www.proxy-list.download/HTTP',
    'https://proxylist.fatezero.org/proxy.list',
    'https://proxyscrape.com/proxies/HTTP.txt',
    'https://proxyscrape.com/proxies/HTTPS.txt',
    'https://proxyscrape.com/proxies/SOCKS4.txt',
    'https://proxyscrape.com/proxies/SOCKS5.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/proxylist-to/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/yuceltoluyag/GoodProxy/main/raw.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
    'https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/http_proxies.txt',
    'https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/https_proxies.txt',
    'https://api.openproxylist.xyz/http.txt',
    'https://api.proxyscrape.com/v2/?request=displayproxies',
    'https://api.proxyscrape.com/?request=displayproxies&proxytype=http',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    'https://www.proxydocker.com/en/proxylist/download?email=noshare&country=all&city=all&port=all&type=all&anonymity=all&state=all&need=all',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous',
    'http://worm.rip/http.txt',
    'https://proxyspace.pro/http.txt',
    'https://multiproxy.org/txt_all/proxy.txt',
    'https://proxy-spider.com/api/proxies.example.txt',
    'https://sunny9577.github.io/proxy-scraper/proxies.txt',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=1000&country=all&ssl=all&anonymity=anonymous',
    'https://sunny9577.github.io/proxy-scraper/generated/http_proxies.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/http.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt',
    'https://www.proxy-list.download/api/v1/get?type=http',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt',
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=5000&country=all&ssl=all&anonymity=all',
    'https://sunny9577.github.io/proxy-scraper/generated/socks4_proxies.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks4.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks4.txt',
    'https://www.proxy-list.download/api/v1/get?type=socks4',
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=5000&country=all&ssl=all&anonymity=all',
    'https://sunny9577.github.io/proxy-scraper/generated/socks5_proxies.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks5.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt',
    'https://www.proxy-list.download/api/v1/get?type=socks',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt',
    'https://raw.githubusercontent.com/mallisc5/master/proxy-list-raw.txt',
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt',
    'https://raw.githubusercontent.com/saisuiu/Lionkings-Http-Proxys-Proxies/main/free.txt',
    'https://raw.githubusercontent.com/HyperBeats/proxy-list/main/https.txt',
    'https://raw.githubusercontent.com/UptimerBot/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/caliphdev/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/https.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt',
    'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt',
    'https://raw.githubusercontent.com/tuanminpay/live-proxy/master/http.txt',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/https',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/http',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt',
    'https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt',
    'http://atomintersoft.com/proxy_list_port_80',
    'http://atomintersoft.com/proxy_list_domain_org',
    'http://atomintersoft.com/proxy_list_port_3128',
    'http://www.cybersyndrome.net/pla5.html',
    'http://alexa.lr2b.com/proxylist.txt',
    'http://browse.feedreader.com/c/Proxy_Server_List-1/449196258',
    'http://free-ssh.blogspot.com/feeds/posts/default',
    'http://browse.feedreader.com/c/Proxy_Server_List-1/449196259',
    'http://johnstudio0.tripod.com/index1.htm',
    'http://atomintersoft.com/transparent_proxy_list',
    'http://atomintersoft.com/anonymous_proxy_list',
    'http://atomintersoft.com/high_anonymity_elite_proxy_list',
    'http://worm.rip/https.txt',
    'http://rootjazz.com/proxies/proxies.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies.txt',
    'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=1000000&country=all&ssl=all&anonymity=all',
    'https://www.proxydocker.com/en/proxylist/download?email=noshare&country=all&city=all&port=all&type=all&anonymity=all&state=all&need=all',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=1000000&country=all&ssl=all&anonymity=anonymous',
    'http://proxysearcher.sourceforge.net/Proxy%20List.php?type=http',
    'https://openproxy.space/list/http',
    'https://proxyspace.pro/http.txt',
    'https://rootjazz.com/proxies/proxies.txt',
    'https://spys.me/proxy.txt',
    'https://proxyhub.me/en/all-http-proxy-list.html',
    'https://proxy-tools.com/proxy/http',
    'https://www.proxy-list.download/api/v1/get?type=http',
    'https://www.proxyscan.io/download?type=http',
    'https://cdn.jsdelivr.net/gh/Bardiafa/Proxy-Leecher/proxies.txt',
    'https://cdn.jsdelivr.net/gh/aslisk/proxyhttps/https.txt',
    'https://cdn.jsdelivr.net/gh/clarketm/proxy-list/proxy-list-raw.txt',
    'https://cdn.jsdelivr.net/gh/Bardiafa/Proxy-Leecher/good.txt',
    'https://cdn.jsdelivr.net/gh/hendrikbgr/Free-Proxy-Repo/proxy_list.txt',
    'https://cdn.jsdelivr.net/gh/prxchk/proxy-list/http.txt',
    'https://cdn.jsdelivr.net/gh/jetkai/proxy-list/online-proxies/txt/proxies-http.txt',
    'https://cdn.jsdelivr.net/gh/mertguvencli/http-proxy-list/proxy-list/data.txt',
    'https://cdn.jsdelivr.net/gh/mmpx12/proxy-list/https.txt',
    'https://cdn.jsdelivr.net/gh/roosterkid/openproxylist/HTTPS_RAW.txt',
    'https://cdn.jsdelivr.net/gh/saschazesiger/Free-Proxies/proxies/http.txt',
    'https://cdn.jsdelivr.net/gh/ShiftyTR/Proxy-List/https.txt',
    'https://cdn.jsdelivr.net/gh/sunny9577/proxy-scraper/proxies.txt',
    'http://proxysearcher.sourceforge.net/Proxy%20List.php?type=socks',
    'https://openproxy.space/list/socks4',
    'https://proxyspace.pro/socks4.txt',
    'https://www.proxy-list.download/api/v1/get?type=socks4',
    'https://proxyhub.me/en/all-socks4-proxy-list.html',
    'https://proxylist.geonode.com/api/proxy-list?limit…rt_by=lastChecked&sort_type=desc&protocols=socks4',
    'https://www.my-proxy.com/free-socks-4-proxy.html',
    'https://cdn.jsdelivr.net/gh/B4RC0DE-TM/proxy-list/SOCKS4.txt',
    'https://cdn.jsdelivr.net/gh/jetkai/proxy-list/online-proxies/txt/proxies-socks4.txt',
    'https://cdn.jsdelivr.net/gh/roosterkid/openproxylist/SOCKS4_RAW.txt',
    'https://cdn.jsdelivr.net/gh/prxchk/proxy-list/socks4.txt',
    'https://cdn.jsdelivr.net/gh/saschazesiger/Free-Proxies/proxies/socks4.txt',
    'https://cdn.jsdelivr.net/gh/TheSpeedX/PROXY-List/socks4.txt',
    'http://proxysearcher.sourceforge.net/Proxy%20List.php?type=socks',
    'https://openproxy.space/list/socks5',
    'https://proxyspace.pro/socks5.txt',
    'https://www.proxy-list.download/api/v1/get?type=socks5',
    'https://proxy-tools.com/proxy/socks5',
    'https://proxyhub.me/en/all-sock5-proxy-list.html',
    'https://cdn.jsdelivr.net/gh/prxchk/proxy-list/socks5.txt',
    'https://proxylist.geonode.com/api/proxy-list?limit…rt_by=lastChecked&sort_type=desc&protocols=socks5',
    'https://cdn.jsdelivr.net/gh/HyperBeats/proxy-list/socks5.txt',
    'https://cdn.jsdelivr.net/gh/jetkai/proxy-list/online-proxies/txt/proxies-socks5.txt',
    'https://cdn.jsdelivr.net/gh/mmpx12/proxy-list/socks5.txt',
    'https://cdn.jsdelivr.net/gh/roosterkid/openproxylist/SOCKS5_RAW.txt',
    'https://cdn.jsdelivr.net/gh/saschazesiger/Free-Proxies/proxies/socks5.txt',
    'https://cdn.jsdelivr.net/gh/TheSpeedX/PROXY-List/socks5.txt'
];

const downloadAndSaveProxies = async (url, outputFile) => {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            fs.appendFileSync(outputFile, response.data);
            console.log(`Success Gets In ${url}`);
        } else {
            console.log(`Failed In ${url}`);
        }
    } catch (error) {
        console.error(`Something Broken in ${url}`);
    }
};

(async () => {
    for (let url of proxyUrls) {
        await downloadAndSaveProxies(url, outputFile);
    }

    const fileContent = fs.readFileSync(outputFile, 'utf8');
    const lines = fileContent.split('\n');
    const uniqueProxies = [...new Set(lines)].join('\n');
    
    fs.writeFileSync(outputFile, uniqueProxies);
    console.log('Successfully cleaned and saved proxies.');
})();
