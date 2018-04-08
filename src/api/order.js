import {
  commonParams,
  serverUrlShop
} from './config'
import {
  axios
} from './axios.js'

//***************线上商城--订单相关API******************
/**
 * 确认订单
 * @param {用户token} token
 * @param {商品信息son字符串(类似：
   * [{
        id:商品id
        specificationsId:规格id
        num:数量
      }]
  )} goodsJson
 * @param {用户发起拼团id} startGroupBuyId
 * @return {*}
 */
export function confirmOrder(token,goodsJson,startGroupBuyId) {
  const url = serverUrlShop + '/mallOrder/confirmOrder'

  const data = Object.assign({}, commonParams, {
    token,
    goodsJson,
    startGroupBuyId
  })
  return axios(url, data)
}

/**
 * 添加订单
 * @param {参数对象} params
 * @return {*}
 */
export function addOrder(params) {
  const url = serverUrlShop + '/mallOrder/addOrder'

  const data = Object.assign({}, commonParams, {
    goodsJson: params.goodsJson,
    token: params.token,
    userMessage: params.userMessage,
    freight: params.freight,
    totalMoney: params.totalMoney,
    shippingUserName: params.shippingUserName,
    shippingUserMobile: params.shippingUserMobile,
    invoiceType: params.invoiceType,
    invoiceTitle: params.invoiceTitle,
    invoiceNo: params.invoiceNo,
    provinceId: params.provinceId,
    provinceName: params.provinceName,
    cityId: params.cityId,
    cityName: params.cityName,
    areaId: params.areaId,
    areaName: params.areaName,
    shippingDetailAddress: params.shippingDetailAddress,
    mallStartGroupBuyId: params.mallStartGroupBuyId
  })
  return axios(url, data)
}

/**
 * 获取用户订单列表信息
 * @param {用户token} token
 * @param {模糊查询条件} select
 * @param {订单状态} status
 * @param {当前页数} page
 * @param {每页条数} limit
 * @return {*}
 */
export function userOrderList(token,select,status,page,limit) {
  const url = serverUrlShop + '/mallOrder/userOrderList'

  const data = Object.assign({}, commonParams, {
    token,
    select,
    status,
    page,
    limit
  })
  return axios(url, data)
}

/**
 * 获取订单详情信息
 * @param {订单编号} orderNo
 * @return {*}
 */
export function orderDetail(orderNo,token) {
  const url = serverUrlShop + '/mallOrder/orderDetail'

  const data = Object.assign({}, commonParams, {
    orderNo,
    token
  })
  return axios(url, data)
}

/**
 * 取消订单
 * @param {订单编号} orderNo
 * @param {用户token} token
 * @return {*}
 */
export function cancelOrder(orderNo,token) {
  const url = serverUrlShop + '/mallOrder/cancelOrder'

  const data = Object.assign({}, commonParams, {
    orderNo,
    token
  })
  return axios(url, data)
}

/**
 * 确认收货
 * @param {订单编号} orderNo
 * @param {用户token} token
 * @return {*}
 */
export function receiveGoods(orderNo,token) {
  const url = serverUrlShop + '/mallOrder/receiveGoods'

  const data = Object.assign({}, commonParams, {
    orderNo,
    token
  })
  return axios(url, data)
}

/**
 * 查询物流信息(实时)
 * @param {订单编号} orderNo
 * @return {*}
 */
export function getLogisticInformation(orderNo) {
  const url = serverUrlShop + '/mallOrder/getLogisticInformation'

  const data = Object.assign({}, commonParams, {
    orderNo
  })
  return axios(url, data)
}




