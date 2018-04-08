import {
  commonParams,
  serverUrlApp,
  serverUrlShop
} from './config'
import {
  axios
} from './axios'
/**
 * 获取用户个人信息
 * @return {*}
 */
export function getUserInfo(token) {
  const url = serverUrlApp + '/personalCenter/indexInfo'

  const data = Object.assign({}, commonParams, {
    token
  })
  return axios(url, data)
}


// 查询我的信息
export function queryInfoByToken(token) {
  const url = serverUrlApp + '/app/userInfo/queryInfoByToken'

  const data = Object.assign({}, commonParams, {
    token
  })
  return axios(url, data)
}

/**
 * 保存个人信息
 * @param userInfo 【用户信息对象】
 * @return {*}
 */
export function saveUserInfo(token, userInfo) {
  const url = serverUrlApp + '/app/userInfo/updateDetailUserInfo'

  const data = Object.assign({}, commonParams, {
    token,
    avatars: userInfo.avatars,
    tagIds: userInfo.tagIds,
    nickName: userInfo.nickName,
    sex: userInfo.sex,
    birthDateStr: userInfo.birthDateStr,
    height: userInfo.height,
    weight: userInfo.weight,
    maritalStatus: userInfo.maritalStatus,
    userTag: userInfo.userTag,
    businessType: userInfo.businessType,
    positionName: userInfo.positionName,
    companyName: userInfo.companyName,
    workBuilding: userInfo.workBuilding,
    buildLongitude: userInfo.buildLongitude,
    buildLatitude: userInfo.buildLatitude
  })
  return axios(url, data)
}



/** 我的账户(账户资金) begin */
/**
 * 查询交易明细（包括余额和当月的收入和支出）
 * @param token
 * @param yearAndMonth 【时间】
 * @param genre 【资金账户枚举:-1:线上钱包和会员卡所有的，0：线上钱包  1:会员卡(不传默认是线上钱包)】
 * @return {*}
 */
export function queryTradeDetail(token, yearAndMonth, genre) {
  const url = serverUrlApp + '/app/accountApp/queryTradeDetail'

  const data = Object.assign({}, commonParams, {
    token,
    yearAndMonth,
    genre
  })
  return axios(url, data)
}

/**
 * 查询用户是否归还共享物品
 * @param token
 * @return {*}
 */
export function shareIsRetrun(token) {
  const url = serverUrlApp + '/sharedReturn/shareIsRetrun'

  const data = Object.assign({}, commonParams, {
    token
  })
  return axios(url, data)
}

/**
 * 共享押金退款或者取消退款
 * @param token
 * @param type 【1/2(申请退款/取消退款)】
 * @return {*}
 */
export function refund(token, type) {
  const url = serverUrlApp + '/sharedReturn/applyOrCancelDeposit'

  const data = Object.assign({}, commonParams, {
    token,
    type
  })
  return axios(url, data)
}

/**
 * 查询交易明细分页(我的账户交易详情页)
 * @param token
 * @param yearAndMonth 【时间】
 * @param currPage 【当前页】
 * @param pageSize 【每页显示条数】
 * @param genre 【资金账户枚举:-1:线上钱包和会员卡所有的，0：线上钱包  1:会员卡(不传默认是线上钱包)】

 * @return {*}
 */
export function queryTradeDetailByPage(token, yearAndMonth, currPage, pageSize, genre) {
  const url = serverUrlApp + '/app/accountApp/queryTradeDetailByPage'

  const data = Object.assign({}, commonParams, {
    token,
    yearAndMonth,
    currPage,
    pageSize,
    genre
  })
  return axios(url, data)
}

/**
 * 查询充值金额配置
 * @return {*}
 */
export function queryAllRechargeInfos() {
  const url = serverUrlApp + '/app/accountApp/queryAllRechargeInfos'
  const data = Object.assign({}, commonParams, {})
  return axios(url, data)
}
/** 我的账户(账户资金) end */





/**
 * 通过用户token确认该用户是否设置了支付密码
 * @param token 
 * @return {*}
 */
export function hasPaymentPassword(token) {
  const url = serverUrlApp + '/app/userInfo/hasPaymentPassword'
  const data = Object.assign({}, commonParams, {
    token
  })
  return axios(url, data)
}

/**
 * 设置/修改支付密码
 * @param token 
 * @param password 【新支付密码】
 * @param oldPwd 【旧支付密码】
 * @return {*}
 */
export function paymentPassword(token, password, oldPwd) {
  const url = serverUrlApp + '/personalCenter/paymentPassword'
  const data = Object.assign({}, commonParams, {
    token,
    password,
    oldPwd
  })
  return axios(url, data)
}

/**
 * 找回支付密码
 * @param token 
 * @param password 【设置的支付密码】
 * @param phone 【手机号】
 * @param code 【验证码】
 * @return {*}
 */
export function backPassword(token, password, phone, code) {
  const url = serverUrlApp + '/personalCenter/backPassword'
  const data = Object.assign({}, commonParams, {
    token,
    password,
    phone,
    code
  })
  return axios(url, data)
}

/**
 * 获取验证码
 * @param phone 【手机号】
 * @param businessType 【业务类型：400(固定值)】
 * @return {*}
 */
export function getRegisterCode(phone, businessType) {
  const url = serverUrlApp + '/app/userInfo/getRegisterCode'
  const data = Object.assign({}, commonParams, {
    phone,
    businessType
  })
  return axios(url, data)
}



/**
 * 保存意见反馈信息
 * @param token 
 * @param fids 【图片IDs】
 * @param content 【意见反馈内容】
 * @param email 【邮箱】
 * @return {*}
 */
export function saveOpinionFeedBack(token, fids, content, email) {
  const url = serverUrlApp + '/personalCenter/saveOpinionFeedBack'
  const data = Object.assign({}, commonParams, {
    token,
    fids,
    content,
    email
  })
  return axios(url, data)
}

/** 我的订单 begin */
/**
 * 我的订单
 * @param userId   【用户ID】
 * @param currPage 【页数】
 * @param keyWord  【关键字搜索】
 * @return {*}
 */
export function queryOrderById(userId, currPage, keyWord) {
  const url = serverUrlApp + '/app/order/queryOrderById'
  const data = Object.assign({}, commonParams, {
    userId,
    currPage,
    keyWord
  })
  return axios(url, data)
}
/**
 * 订单详情
 * @param orderId 【订单ID】
 * @param userId   【用户ID】
 * @return {*}
 */
export function queryOrderDetail(orderId, userId) {
  const url = serverUrlApp + '/app/order/queryOrderDetail'
  const data = Object.assign({}, commonParams, {
    orderId,
    userId
  })
  return axios(url, data)
}


/** 我的订单 end */

/**我的红包   begin */
/**
 * 查询我的红包
 * @param token
 * @param status   【1/2(可用/历史)】
 * @param pageSize 【显示条数】
 * @param currPage 【当前页】
 * @param cloud8InfoId 【云八id】
 * @param conditionMoney 【使用条件金额(元)】
 * @param redPkgId 【需要查询排除的红包数据】
 * @return {*}
 */
export function queryWallet(token, status, pageSize, currPage, cloud8InfoId, conditionMoney, redPkgId) {
  const url = serverUrlApp + '/app/userInfo/queryWallet'

  const data = Object.assign({}, commonParams, {
    token,
    status,
    pageSize,
    currPage,
    cloud8InfoId,
    conditionMoney,
    redPkgId
  })
  return axios(url, data)
}
/**
 * 查询单个红包信息
 * @param wid 【红包id】
 * @return {*}
 */
export function queryWalletById(wid) {
  const url = serverUrlApp + '/app/userInfo/queryWalletById'

  const data = Object.assign({}, commonParams, {
    wid
  })
  return axios(url, data)
}


/**我的红包   end */

/**
 * 获取验证码 激活业务
 * @param phone 【手机号】
 * @return {*}
 */
export function getRegisterCodejihuo(phone) {
  const url = serverUrlShop + '/register/getRegisterCode'
  const data = Object.assign({}, commonParams, {
    phone
  })
  return axios(url, data)
}

/**
 * 根据openid查询用户信息
 * @param openid 【手机号】
 */
export function queryUserInfoByOpenId(openid) {
  const url = serverUrlShop + '/register/queryUserInfoByOpenId'
  const data = Object.assign({}, commonParams, {
    openid
  })
  return axios(url, data)
}

/**
 * 根据wxUnionid查询用户信息
 * @param wxUnionid 【手机号】
 */
export function queryUserInfoByWxUnionid(wxUnionid) {
  const url = serverUrlShop + '/register/queryUserInfoByWxUnionid'
  const data = Object.assign({}, commonParams, {
    wxUnionid
  })
  return axios(url, data)
}


/**
 * 用户注册
 * @param phoneNo 【手机号】
 * @param code    【验证码】
 * @param referralCode 【邀请码】
 * @param openid 【微信openid】
 * @param wxunionid 【微信wxunionid】
 * @param registWay 【注册类型】
 */
export function registerInfo(phoneNo, code, referralCode, openid, wxunionid, registWay) {
  const url = serverUrlShop + '/register/registerInfo'
  const data = Object.assign({}, commonParams, {
    phoneNo,
    code,
    referralCode,
    openid,
    wxunionid,
    registWay
  })
  return axios(url, data)
}

/**
 * 获取用户金额
 * @param {用户token} token 
 */
export function queryUserFundInfo(token) {
  const url = serverUrlApp + '/app/accountApp/queryUserFundInfo'
  const data = Object.assign({}, commonParams, {
    token
  })
  return axios(url, data)
}
