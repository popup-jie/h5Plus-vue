import { commonParams, serverUrlApp } from './config'
import { axios } from './axios.js'

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
 * 用户注册
 * @param {*} openid 
 * @param {*} avatar 
 * @param {*} sex 
 * @param {*} nickName 
 * @param {*} phone 
 * @param {*} code 
 * @param {*} wxUnionid 
 */
export function userRegister(
    openid,
    avatar,
    sex,
    nickName,
    phone,
    code,
    wxUnionid
) {
    const url = serverUrlApp + '/app/userInfo/userRegister'

    const data = Object.assign({}, commonParams, {
        openid,
        avatar,
        sex,
        nickName,
        phone,
        code,
        wxUnionid
    })

    return axios(url, data)
}

/**
 * 微信登录
 * @param {*} openid 
 * @param {*} avatar 
 * @param {*} sex 
 * @param {*} nickName 
 * @param {*} phone 
 * @param {*} code 
 * @param {*} wxUnionid 
 * @param {*开户渠道 1：微网站2：设备终端 3:熟悉APP 4:熟嘻小程序 如果为空默认是熟嘻app开户} openWay 
 */
export function wxLogin(
    openid,
    avatar,
    sex,
    nickName,
    phone,
    code,
    wxUnionid,
    openWay
) {
    const url = serverUrlApp + '/app/userInfo/wxLogin'

    const data = Object.assign({}, commonParams, {
        openid,
        avatar,
        sex,
        nickName,
        phone,
        code,
        wxUnionid,
        openWay
    })

    return axios(url, data)
}
/**
 * 用户登录注册
 * @param {*手机号} phone 
 * @param {*验证码} code 
 * @param {*推荐码} referralCode 
 */
export function loginOrRegist(phone, code, referralCode) {
    const url = serverUrlApp + '/app/userInfo/LoginOrRegist'

    const data = Object.assign({}, commonParams, {
        phone,
        code,
        referralCode
    })

    return axios(url, data)
}