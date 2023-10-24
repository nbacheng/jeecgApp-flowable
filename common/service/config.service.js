let BASE_URL = ''
 //let BASE_URLS = 'http://192.168.3.2:9888'
 //let BASE_URLS = 'http://172.18.2.30:9888'
 let BASE_URLS = 'http://122.227.135.243:9888'
if (process.env.NODE_ENV == 'development') {
	BASE_URL = 'http://122.227.135.243:9080/nbcio-boot'
	//BASE_URL = 'http://192.168.3.2:8080/nbcio-boot'
	//BASE_URL = 'http://172.18.2.30:8080/nbcio-boot' // 开发环境
} else {
         BASE_URL = 'http://122.227.135.243:9080/nbcio-boot'
	 //BASE_URL = 'https://更换为正式环境地址' // 生产环境
}
let staticDomainURL = BASE_URL+ '/sys/common/static';

const configService = {
	apiUrl: BASE_URL,
	staticDomainURL: staticDomainURL,
	BASE_URLS:BASE_URLS,
};

export default configService
