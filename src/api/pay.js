import {
  commonParams,
  serverUrlApp,
  serverUrlShop
} from './config'
import {
  axios
} from './axios.js'

// const serverUrl = "http://192.168.1.251:9090";
// const serverUrl1 = "https://www.ppbar.com.cn/shuxiApp"

/**
 * @param {请求地址} url
 * @param {token} token 
 * @param {定单编号} orderNo 
 * @param {支付类型:1:支付宝 2:微信 3：微信小程序} payType 
 * @param {支付业务:1:充值支付 2:共享支付 3:订单支付4:小程序共享支付5:会员卡充值支付6:购买会员卡7:会员卡和商品一起支付} payView 
 * @param {充值金额(元)或者会员卡金额:充值和购买会员卡时必传,其它支付业务不用传} rechMoney 
 * @param {红包id} userWalletId
 * @param {*} openid 
 */
export function unifiedPay(url, token, orderNo, payType, payView, rechMoney, userWalletId, openid) {
  // url = serverUrl + url

  const data = Object.assign({}, commonParams, {
    token,
    orderNo,
    payType,
    payView,
    rechMoney,
    userWalletId,
    openid
  })

  return axios(url, data)
}

/**
 * 是否设置支付密码
 * @param {当前用户token} token 
 */
export function hasPaymentPassword(token) {
  const url = serverUrlApp + '/app/userInfo/hasPaymentPassword'

  const data = Object.assign({}, commonParams, {
    token
  })

  return axios(url, data)
}

/**
 * 充值（生成充值记录返回充值编号）
 * @param {用户token} token 
 * @param {充值金额} money 
 */
export function addRecharge(token, money) {
  const url = serverUrlApp + '/app/accountApp/addRecharge'

  const data = Object.assign({}, commonParams, {
    token,
    money
  })

  return axios(url, data)
}

/**
 * 调用云八钱包支付(之前熟嘻APP的)
 * @param {} token 
 * @param {订单id} orderNo 
 * @param {支付密码} password 
 * @param {拜帖临时表ID(可空)} visitBookRetempId 
 * @param {红包ID(可空)} userWalletId 
 */
export function cloud8Pay(token, orderNo, password, visitBookRetempId, userWalletId) {
  const url = serverUrlApp + '/app/accountApp/cloud8Pay'

  const data = Object.assign({}, commonParams, {
    token,
    orderNo,
    password,
    visitBookRetempId,
    userWalletId
  })

  return axios(url, data)
}

/**
 *线上钱包支付（熟嘻商城）
 * @param {订单编号} orderNo
 * @param {支付密码} password
 * @param {用户token} token
 * @return {*}
 * @constructor
 */
export function Newcloud8Pay(orderNo, password, token) {
  const url = serverUrlShop + '/mallPay/cloud8Pay'

  const data = Object.assign({}, commonParams, {
    orderNo,
    password,
    token
  })

  return axios(url, data)
}
