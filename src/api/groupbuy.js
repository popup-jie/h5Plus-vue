import {
  commonParams,
  serverUrlShop
} from './config'
import {
  axios
} from './axios.js'

/**
 * 用户发起的拼团列表
 * @param {*商品id} goodsInfoId 
 * @param {*当前页数} page 
 * @param {*每页条数} limit 
 */
export function starGroupBuyList(
  goodsInfoId,
  page,
  limit
) {
  const url = serverUrlShop + '/mallGroupBuy/starGroupBuyList'

  const data = Object.assign({}, commonParams, {
    goodsInfoId,
    page,
    limit
  })
  return axios(url, data)
}

/**
 * 拼团类型列表
 * @param {*商品id} goodsInfoId 
 */
export function groupBuyTypeList(
  goodsInfoId
) {
  const url = serverUrlShop + '/mallGroupBuy/groupBuyTypeList'

  const data = Object.assign({}, commonParams, {
    goodsInfoId
  })
  return axios(url, data)
}

/**
 * 拼团类型规格列表
 * @param {*拼团类型id} groupBuyTypeId 
 */
export function groupBuySpecificationsList(
  groupBuyTypeId
) {
  const url = serverUrlShop + '/mallGroupBuy/groupBuySpecificationsList'

  const data = Object.assign({}, commonParams, {
    groupBuyTypeId
  })
  return axios(url, data)
}

/**
 * 用户发起拼团
 * @param {*拼团类型id} groupBuyTypeId 
 * @param {*} token 
 */
export function startGroupBuy(
  groupBuyTypeId,
  token,
  orderNo
) {
  const url = serverUrlShop + '/mallGroupBuy/startGroupBuy'

  const data = Object.assign({}, commonParams, {
    groupBuyTypeId,
    token,
    orderNo
  })
  return axios(url, data)
}


/**
 * 根据用户发起的拼团id查询该拼团信息
 * @param {*用户发起拼团id} startGroupBuyId 
 */
export function selectStartGroupBuyById(
  startGroupBuyId
) {
  const url = serverUrlShop + '/mallGroupBuy/selectStartGroupBuyById'

  const data = Object.assign({}, commonParams, {
    startGroupBuyId
  })
  return axios(url, data)
}
