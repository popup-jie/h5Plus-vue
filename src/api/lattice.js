import { axios } from './axios.js'
import {
    commonParams,
    serverUrlApp
} from './config'
    /**
     * 获取格子柜相关信息
     * @param {用户token} token 
     * @param {机器ID} machineId 
     * @param {轨道编号} orbitalNo 
     */
export function showGoodInfo(token, machineId, orbitalNo) {
    const url = serverUrlApp + '/app/shopping/showGoodInfo'

    const data = Object.assign({}, commonParams, {
        token,
        machineId,
        orbitalNo
    })

    return axios(url, data)
}

/**
 * 获取格子柜物品相关推荐
 * @param {云八ID} cloud8InfoId 
 * @param {物品ID} gid 
 * @param {机器ID} vendMachineId 
 */
export function recommendGoods(cloud8InfoId, gid, vendMachineId) {
    const url = serverUrlApp + '/app/shopping/recommendGoods'

    const data = Object.assign({}, commonParams, {
        cloud8InfoId,
        gid,
        vendMachineId
    })

    return axios(url, data)
}

/**
 * 终端扫码相关信息
 * @param {用户token} token 
 * @param {机器ID} machineId 
 * @param {轨道编号} orbitalNo 
 * @param {订单编号} orderNo 
 */
export function addOrderBySaoMa(token, machineId, orbitalNo, orderNo) {
    const url = serverUrlApp + '/app/accountApp/addOrderBySaoMa'

    const data = Object.assign({}, commonParams, {
        token,
        machineId,
        orbitalNo,
        orderNo
    })

    return axios(url, data)
}

/**
 * 格子柜生成订单
 * @param {用户token} token 
 * @param {云八ID} cloud8InfoId 
 * @param {字符串物品数量} goodList 
 */
export function addOrderWithGoods(token, cloud8InfoId, goodList) {
    const url = serverUrlApp + '/app/accountApp/addOrderWithGoods'

    const data = Object.assign({}, commonParams, {
        token,
        cloud8InfoId,
        goodList
    })

    return axios(url, data)
}

/**
 * 选好了/再次购买获取订单数据
 * @param {我的用户ID} userId 
 * @param {云八id} themeId 
 * @param {商品id拼接(可空)} goodsIds 
 * @param {订单编号(可空)} orderNo 
 */
export function toConfirmOrder(userId, themeId, goodsIds, orderNo) {
    const url = serverUrlApp + '/app/order/toConfirmOrder'

    const data = Object.assign({}, commonParams, {
        userId,
        themeId,
        goodsIds,
        orderNo
    })

    return axios(url, data)
}

/**
 * 支付时生成订单
 * @param {我的用户ID} userId 
 * @param {商品id#数量} goodsInfo 
 * @param {云八id} themeId 
 * @param {支付方式} payWay 
 */
export function addOrder(userId, goodsInfo, themeId, payWay) {
    const url = serverUrlApp + '/app/order/addOrder'

    const data = Object.assign({}, commonParams, {
        userId,
        goodsInfo,
        themeId,
        payWay
    })

    return axios(url, data)
}