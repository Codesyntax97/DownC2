const axios = require('axios');
const fs = require('fs');

const QuantixProxies = [];
const QuantixOutputFile = 'proxy.txt';

if (fs.existsSync(QuantixOutputFile)) {
  fs.unlinkSync(QuantixOutputFile);
  console.log('\x1b[33m%s\x1b[0m', `'${QuantixOutputFile}' telah dihapus.`); // Warna kuning
}

const QuantixProxySites = [
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt',
  'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
  'https://raw.githubusercontent.com/theSpeedX/PROXY-List/master/http.txt',
  'https://raw.githubusercontent.com/theSpeedX/PROXY-List/master/socks4.txt',
  'https://raw.githubusercontent.com/theSpeedX/PROXY-List/master/socks5.txt',
  'https://raw.githubusercontent.com/proxylist-to/proxy-list/main/http.txt',
  'https://raw.githubusercontent.com/proxylist-to/proxy-list/main/https.txt',
  'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt',
  'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt',
  'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/socks5.txt',
  'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt',
  'https://raw.githubusercontent.com/prxchk/proxy-list/main/socks5.txt',
  'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt',
  'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/socks5.txt',
  'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
  'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks4.txt',
  'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt',
  'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt',
  'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/socks5.txt',
  'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
  'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
  'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
  'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/proxy.txt',
  'https://www.proxy-list.download/api/v1/get?type=http',
  'https://www.proxy-list.download/api/v1/get?type=https',
  'https://www.proxy-list.download/api/v1/get?type=socks4',
  'https://www.proxy-list.download/api/v1/get?type=socks5',
  'https://www.proxyscan.io/download?type=http',
  'https://www.proxyscan.io/download?type=https',
  'https://www.proxyscan.io/download?type=socks4',
  'https://www.proxyscan.io/download?type=socks5',
  'https://api.openproxylist.xyz/http.txt',
  'https://api.openproxylist.xyz/https.txt',
  'https://api.openproxylist.xyz/socks4.txt',
  'https://api.openproxylist.xyz/socks5.txt',
  // Sumber tambahan
  'https://www.proxy-list.download/api/v1/get?type=socks4',
  'https://www.proxy-list.download/api/v1/get?type=socks5',
  'https://www.proxyscan.io/download?type=socks4',
  'https://www.proxyscan.io/download?type=socks5',
  'https://api.openproxylist.xyz/socks4.txt',
  'https://api.openproxylist.xyz/socks5.txt',
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
    'https://cdn.jsdelivr.net/gh/TheSpeedX/PROXY-List/socks5.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks4.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/connect.txt',
    'https://raw.githubusercontent.com/zevtyardt/proxy-list/main/all.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/socks5.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/socks4.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/proxy.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt',
    'https://raw.githubusercontent.com/yuceltoluyag/GoodProxy/main/raw.txt',
    'https://raw.githubusercontent.com/yogendratamang48/ProxyList/master/proxies.txt',
    'https://raw.githubusercontent.com/yemixzy/proxy-list/master/proxies.txt',
    'https://raw.githubusercontent.com/yemixzy/proxy-list/main/proxies/unchecked.txt',
    'https://raw.githubusercontent.com/Vann-Dev/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/Vann-Dev/proxy-list/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/Vann-Dev/proxy-list/main/proxies/https.txt',
    'https://raw.githubusercontent.com/Vann-Dev/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/socks5.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/socks4.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/proxylist.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/https.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt',
    'https://raw.githubusercontent.com/UptimerBot/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/UptimerBot/proxy-list/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/UptimerBot/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/tuanminpay/live-proxy/master/socks5.txt',
    'https://raw.githubusercontent.com/TuanMinPay/live-proxy/master/socks5.txt',
    'https://raw.githubusercontent.com/tuanminpay/live-proxy/master/socks4.txt',
    'https://raw.githubusercontent.com/TuanMinPay/live-proxy/master/socks4.txt',
    'https://raw.githubusercontent.com/tuanminpay/live-proxy/master/http.txt',
    'https://raw.githubusercontent.com/TuanMinPay/live-proxy/master/http.txt',
    'https://raw.githubusercontent.com/tuanminpay/live-proxy/master/all.txt',
    'https://raw.githubusercontent.com/TuanMinPay/live-proxy/master/all.txt',
    'https://raw.githubusercontent.com/Tsprnay/Proxy-lists/master/proxies/https.txt',
    'https://raw.githubusercontent.com/Tsprnay/Proxy-lists/master/proxies/http.txt',
    'https://raw.githubusercontent.com/Tsprnay/Proxy-lists/master/proxies/all.txt',
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt',
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/blob/master/socks4.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/generated/socks5_proxies.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/generated/socks4_proxies.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/generated/http_proxies.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/main/proxies.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/main/generated/socks5_proxies.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/main/generated/socks4_proxies.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/main/generated/http_proxies.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks4.txt',
    'https://raw.githubusercontent.com/shiftytr/proxy-list/master/proxy.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/proxy.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/working.txt',
    'https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/ultrafast.txt',
    'https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/socks5.txt',
    'https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/socks4.txt',
    'https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/premium.txt',
    'https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/new.txt',
    'https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/http.txt',
    'https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/fast.txt',
    'https://raw.githubusercontent.com/saisuiu/Lionkings-Http-Proxys-Proxies/main/free.txt',
    'https://raw.githubusercontent.com/saisuiu/Lionkings-Http-Proxys-Proxies/main/cnfree.txt',
    'https://raw.githubusercontent.com/RX4096/proxy-list/main/online/socks5.txt',
    'https://raw.githubusercontent.com/RX4096/proxy-list/main/online/socks4.txt',
    'https://raw.githubusercontent.com/RX4096/proxy-list/main/online/https.txt',
    'https://raw.githubusercontent.com/RX4096/proxy-list/main/online/http.txt',
    'https://raw.githubusercontent.com/rx443/proxy-list/main/online/https.txt',
    'https://raw.githubusercontent.com/rx443/proxy-list/main/online/http.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/SOCKS5_RAW.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/SOCKS4_RAW.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',,
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTP_RAW.txt',
    'https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies_anonymous/socks5.txt',
    'https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies_anonymous/socks4.txt',
    'https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies_anonymous/http.txt',
    'https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/socks5.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/socks4.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/https.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/all.txt',
    'https://raw.githubusercontent.com/ProxyScraper/ProxyScraper/main/socks5.txt',
    'https://raw.githubusercontent.com/ProxyScraper/ProxyScraper/main/socks4.txt',
    'https://raw.githubusercontent.com/ProxyScraper/ProxyScraper/main/http.txt',
    'https://raw.githubusercontent.com/proxylist-to/proxy-list/main/socks5.txt',
    'https://raw.githubusercontent.com/proxylist-to/proxy-list/main/socks4.txt',
    'https://raw.githubusercontent.com/proxylist-to/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/https.txt',
    'https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt',
    'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/all/data.txt',
    'https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/xResults/RAW.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/xResults/old-data/Proxies.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/socks5/socks5.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/socks4/socks4.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/https/https.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/socks5.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/socks4.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/https.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/http.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/file/socks5.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/file/socks4.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/file/https.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/file/http.txt',
    'https://raw.githubusercontent.com/mython-dev/free-proxy-4000/main/proxy-4000.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/socks5.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/socks4.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/https.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt',
    'https://raw.githubusercontent.com/MrMarble/proxy-list/main/all.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks5.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks4.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/https.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/mmpx12/proxy-list/master/socks5.txt',
    'https://raw.githubusercontent.com/mmpx12/proxy-list/master/socks4.txt',
    'https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt',
    'https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt',
    'https://raw.githubusercontent.com/miyukii-chan/proxy-list/master/proxies/http.txt',
    'https://raw.githubusercontent.com/mishakorzik/Free-Proxy/main/proxy.txt',
    'https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt',
    'https://raw.githubusercontent.com/manuGMG/proxy-365/main/SOCKS5.txt',
    'https://raw.githubusercontent.com/mallisc5/master/proxy-list-raw.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks4.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-https.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
    'https://raw.githubusercontent.com/j0rd1s3rr4n0/api/main/proxy/http.txt',
    'https://raw.githubusercontent.com/ItzRazvyy/ProxyList/main/socks5.txt',
    'https://raw.githubusercontent.com/ItzRazvyy/ProxyList/main/socks4.txt',
    'https://raw.githubusercontent.com/ItzRazvyy/ProxyList/main/https.txt',
    'https://raw.githubusercontent.com/ItzRazvyy/ProxyList/main/http.txt',
    'https://raw.githubusercontent.com/im-razvan/proxy_list/main/socks5',
    'https://raw.githubusercontent.com/im-razvan/proxy_list/main/http.txt',
    'https://raw.githubusercontent.com/HyperBeats/proxy-list/main/socks5.txt',
    'https://raw.githubusercontent.com/HyperBeats/proxy-list/main/socks4.txt',
    'https://raw.githubusercontent.com/HyperBeats/proxy-list/main/https.txt',
    'https://raw.githubusercontent.com/HyperBeats/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
    'https://raw.githubusercontent.com/hendrikbgr/Free-Proxy-Repo/master/proxy_list.txt',
    'https://raw.githubusercontent.com/fate0/proxylist/master/proxy.list',
    'https://raw.githubusercontent.com/fahimscirex/proxybd/master/proxylist/socks4.txt',
    'https://raw.githubusercontent.com/fahimscirex/proxybd/master/proxylist/http.txt',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/https.txt',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt',
    'https://raw.githubusercontent.com/enseitankado/proxine/main/proxy/socks5.txt',
    'https://raw.githubusercontent.com/enseitankado/proxine/main/proxy/socks4.txt',
    'https://raw.githubusercontent.com/enseitankado/proxine/main/proxy/https.txt',
    'https://raw.githubusercontent.com/enseitankado/proxine/main/proxy/http.txt',
    'https://raw.githubusercontent.com/elliottophellia/yakumo/master/results/socks5/global/socks5_checked.txt',
    'https://raw.githubusercontent.com/elliottophellia/yakumo/master/results/socks4/global/socks4_checked.txt',
    'https://raw.githubusercontent.com/elliottophellia/yakumo/master/results/mix_checked.txt',
    'https://raw.githubusercontent.com/elliottophellia/yakumo/master/results/http/global/http_checked.txt',
    'https://raw.githubusercontent.com/dunno10-a/proxy/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/dunno10-a/proxy/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/dunno10-a/proxy/main/proxies/https.txt',
    'https://raw.githubusercontent.com/dunno10-a/proxy/main/proxies/http.txt',
    'https://raw.githubusercontent.com/dunno10-a/proxy/main/proxies/all.txt',
    'https://raw.githubusercontent.com/Daesrock/XenProxy/main/socks5.txt',
    'https://raw.githubusercontent.com/Daesrock/XenProxy/main/socks4.txt',
    'https://raw.githubusercontent.com/Daesrock/XenProxy/main/proxylist.txt',
    'https://raw.githubusercontent.com/Daesrock/XenProxy/main/https.txt',
    'https://raw.githubusercontent.com/crackmag/proxylist/proxy/proxy.list',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list.txt',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/socks5',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/socks4',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/https',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/http',
    'https://raw.githubusercontent.com/caliphdev/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/caliphdev/Proxy-List/main/socks5.txt',
    'https://raw.githubusercontent.com/caliphdev/Proxy-List/main/http.txt',
    'https://raw.githubusercontent.com/BreakingTechFr/Proxy_Free/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/BreakingTechFr/Proxy_Free/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/BreakingTechFr/Proxy_Free/main/proxies/https.txt',
    'https://raw.githubusercontent.com/BreakingTechFr/Proxy_Free/main/proxies/http.txt',
    'https://raw.githubusercontent.com/BreakingTechFr/Proxy_Free/main/proxies/all.txt',
    'https://raw.githubusercontent.com/BlackCage/Proxy-Scraper-and-Verifier/main/Proxies/Not_Processed/proxies.txt',
    'https://raw.githubusercontent.com/berkay-digital/Proxy-Scraper/main/proxies.txt',
    'https://raw.githubusercontent.com/B4RC0DE-TM/proxy-list/main/HTTP.txt',
    'https://raw.githubusercontent.com/aslisk/proxyhttps/main/https.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/socks5_proxies.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/socks4_proxies.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/https_proxies.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/http_proxies.txt',
    'https://raw.githubusercontent.com/andigwandi/free-proxy/main/proxy_list.txt',
    'https://raw.githubusercontent.com/almroot/proxylist/master/list.txt',
    'https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/socks5.txt',
    'https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/http.txt',
    'https://raw.githubusercontent.com/a2u/free-proxy-list/master/free-proxy-list.txt',
    'https://proxyspace.pro/socks5.txt',
    'https://proxyspace.pro/socks4.txt',
    'https://proxyspace.pro/https.txt',
    'https://proxyspace.pro/http.txt',
    'https://proxy-spider.com/api/proxies.example.txt',
    'https://openproxylist.xyz/socks5.txt',
    'https://openproxylist.xyz/socks4.txt',
    'https://openproxylist.xyz/https.txt',
    'https://openproxylist.xyz/http.txt',
    'https://naawy.com/api/public/proxylist/getList/?proxyType=socks5&format=txt',
    'https://naawy.com/api/public/proxylist/getList/?proxyType=socks4&format=txt',
    'https://naawy.com/api/public/proxylist/getList/?proxyType=https&format=txt',
    'https://naawy.com/api/public/proxylist/getList/?proxyType=http&format=txt',
    'https://multiproxy.org/txt_all/proxy.txt',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    'https://api.proxyscrape.com/v2/?request=displayproxies',
    'https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all&ssl=all&anonymity=all',
    'https://api.proxyscrape.com/?request=displayproxies&proxytype=http',
    'https://api.openproxylist.xyz/socks5.txt',
    'https://api.openproxylist.xyz/socks4.txt',
    'https://api.openproxylist.xyz/http.txt',
    'https://api.good-proxies.ru/getfree.php?count=1000&key=freeproxy'
];

async function QuantixFetchProxiesFromSite(site) {
  try {
    const response = await axios.get(site);
    const lines = response.data.split('\n');
    lines.forEach(line => {
      if (line.includes(':')) {
        const [ip, port] = line.split(':', 2);
        QuantixProxies.push(`${ip}:${port}`);
      }
    });
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', `Gagal mengambil proxy dari ${site}: ${error.message}`); // Warna merah
  }
}

function drawProgressBar(progress) {
  const barLength = 50;
  const filledLength = Math.round(barLength * progress);
  const filledBar = '█'.repeat(filledLength);
  const emptyBar = '░'.repeat(barLength - filledLength);
  return `[${filledBar}${emptyBar}] ${(progress * 100).toFixed(2)}%`;
}

async function QuantixFetchAllProxies() {
  console.log('\x1b[36m%s\x1b[0m', 'Memulai proses pengambilan proxy...'); // Warna cyan

  const QuantixStartTime = Date.now();

  for (let i = 0; i < QuantixProxySites.length; i++) {
    await QuantixFetchProxiesFromSite(QuantixProxySites[i]);
    const progress = (i + 1) / QuantixProxySites.length;
    process.stdout.write(`\r${drawProgressBar(progress)}`);
  }

  console.log('\n\x1b[32m%s\x1b[0m', 'Proses pengambilan proxy selesai.'); // Warna hijau

  fs.writeFileSync(QuantixOutputFile, QuantixProxies.join('\n'));
  console.log('\x1b[32m%s\x1b[0m', `Proxies berhasil diambil dan disimpan dalam ${QuantixOutputFile}`); // Warna hijau
  console.log('\x1b[34m%s\x1b[0m', `Total proxy valid: ${QuantixProxies.length}`); // Warna biru

  const QuantixEndTime = Date.now();
  const QuantixExecutionTime = (QuantixEndTime - QuantixStartTime) / 1000;
  console.log('\x1b[33m%s\x1b[0m', `Waktu eksekusi: ${QuantixExecutionTime.toFixed(2)} detik`); // Warna kuning

  console.log('\x1b[35m%s\x1b[0m', 'Kredit oleh: t.me/Raptor_code'); // Warna magenta
}

QuantixFetchAllProxies();
