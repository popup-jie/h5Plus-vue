export const commonParams = {}

// 接口（测试环境）test
// export const serverUrlApp = "http://192.168.1.251:9091";
// export const serverUrlShop = "http://192.168.3.123:8090";



// 外网测试环境
export const serverUrlApp = "https://www.ppbar.com.cn/shuxiApp";
export const serverUrlShop = "https://www.ppbar.com.cn/jingtingMallTest"
export const serverUrlWechat = "https://www.ppbar.com.cn/cloud8Wechat"

// 微信微网站小程序分享前缀,后缀
export const serverUrlPrefix = 'https://www.ppbar.com.cn/cloud8Wechat/wxConfig/pageTurnShare/'
export const serverUrlSuffix = '/jingtingShare'

// 微信，微网站右上角 首页及其他页面分享链接
export const homeShareUrl = 'http://www.ppbar.com.cn/cloud8Wechat/wxConfig/pageTurnShare/programType=microweb/jingtingShare'
export const mirWebUrl = 'https://www.ppbar.com.cn/cloud8Wechat/jingting_test/index.html'


//微网站 上传图片新接口地址前缀
export const uploadServerUrl = serverUrlWechat;
export const shareServerUrl = serverUrlWechat;
//文件服务器
export const fileServerUrl = "https://www.ppbar.com.cn/file/file";

//线上商城支付接口URL地址
export const payforUrl = serverUrlShop + '/mallPay/thirdPay';

//旧支付接口
export const offlinepayforUrl = serverUrlApp + '/app/accountApp/unifiedPay'