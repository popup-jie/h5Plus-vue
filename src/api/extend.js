import {
    commonParams,
    serverUrlApp,
    serverUrlShop
} from './config'
import {
    axios
} from './axios.js'

//***************************推广相关接口******************************************

/**
 * 查询并注册用户
 * @param {微信openid} openid
 * @param {微信unionid} wxUnionid
 * @param {用户头像}  avatar
 * @param {用户昵称}  nickName
 * @param {微信openid}  sex
 * @param  {用户性别} openWay
 * @return {*}
 */
export function queryAndRegistUser(openid, wxUnionid, avatar, nickName, sex, openWay) {
    const url = serverUrlApp + '/app/userInfo/queryAndRegistUser'

    const data = Object.assign({}, commonParams, {
        openid,
        wxUnionid,
        avatar,
        nickName,
        sex,
        openWay
    })
    return axios(url, data)
}

/**
 * 绑定分销用户
 * @param {绑定分销用户} token
 * @param {被邀请客户token} custToken
 * @return {*}
 */
export function bindShareSaleUser(token, custToken) {
    const url = serverUrlShop + '/mallUserShareSaleInfo/bindShareSaleUser'

    const data = Object.assign({}, commonParams, {
        token,
        custToken
    })
    return axios(url, data)
}

/**
 * 查询用户推广信息
 * @param {*} token 
 */
export function findUserShareSaleInfo(token) {
    const url = serverUrlShop + '/mallUserShareSaleInfo/findUserShareSaleInfo'

    const data = Object.assign({}, commonParams, {
        token
    })
    return axios(url, data)
}