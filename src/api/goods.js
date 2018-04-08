import {
  commonParams,
  serverUrlShop
} from './config'
import {
  axios
} from './axios.js'


/**
 *  获取首页banner
 */
export function getIndexBanners() {
  const url = serverUrlShop + '/mallBanner/getIndexBanners'

  const data = Object.assign({}, commonParams, {})
  return axios(url, data)
}

/**
 * 首页导航栏分类查询（一级分类）
 */
export function getIndexSimpleCategorys() {
  const url = serverUrlShop + '/mallCategory/getIndexSimpleCategorys'

  const data = Object.assign({}, commonParams, {})
  return axios(url, data)
}


/**
 * 查询一级分类和部分相关商品信息列表
 * @param {当前页数} page 可空
 * @param {每页总数} limit 可空
 * @param {每个模块展示条数} num 可空
 */
export function getIndexCategorysAndGoods(page, limit, num) {
  const url = serverUrlShop + '/mallCategory/getIndexCategorysAndGoods'

  const data = Object.assign({}, commonParams, {
    page,
    limit,
    num
  })
  return axios(url, data)
}

/**
 * 查询分类的banners和子分类列表
 * @param {当前一级分类ID} categoryId
 */
export function getCategoryBannersAndChildren(categoryId) {
  const url = serverUrlShop + '/mallCategory/getCategoryBannersAndChildren'

  const data = Object.assign({}, commonParams, {
    categoryId
  })
  return axios(url, data)
}


/**
 * 查询某一分类信息并分页查询分类下的商品信息列表
 * @param {分类详情下的分类ID} categoryId 
 * @param {当前页数} goodsPage 可空
 * @param {当前总页数} goodsLimit 可空
 */
export function getCategoryWithGoods(categoryId, goodsPage, goodsLimit) {
  const url = serverUrlShop + '/mallCategory/getCategoryWithGoods'

  const data = Object.assign({}, commonParams, {
    categoryId,
    goodsPage,
    goodsLimit
  })
  return axios(url, data)
}

/**
 * 查询商品详细信息
 * @param {商品ID} goodId 
 * @param {用户token} token 
 */
export function selectGoodDetail(goodsId, token) {
  const url = serverUrlShop + '/mallGoods/selectGoodDetail'

  const data = Object.assign({}, commonParams, {
    goodsId,
    token
  })
  return axios(url, data)
}

/**
 * 查询商品所属规格列表
 * @param {商品ID} goodsId 
 * @param {用户token} token 
 */
export function selectGoodsspecifications(goodsId, token) {
  const url = serverUrlShop + '/mallGoods/selectGoodsspecifications'

  const data = Object.assign({}, commonParams, {
    goodsId,
    token
  })
  return axios(url, data)
}

/**
 * 查询推荐商品列表信息
 * @param {查询条数} limit
 * @return {*}
 */
export function selectRecommendsGoods(limit) {
  const url = serverUrlShop + '/mallGoods/selectRecommendsGoods'

  const data = Object.assign({}, commonParams, {
    limit
  })
  return axios(url, data)
}

/**
 * 添加购物车
 * @param {用户token} token 
 * @param {物品ID} goodsId 
 * @param {规格ID} specificationsId 
 * @param {数量} num 
 */
export function addCart(token, goodsId, specificationsId, num) {
  const url = serverUrlShop + '/mallCart/addCart'

  const data = Object.assign({}, commonParams, {
    token,
    goodsId,
    specificationsId,
    num
  })
  return axios(url, data)
}

/**
 * 购物车减少商品
 * @param {购物车记录信息id} cartInfoId
 * @return {*}
 */
export function reduceCart(cartInfoId) {
  const url = serverUrlShop + '/mallCart/reduceCart'

  const data = Object.assign({}, commonParams, {
    cartInfoId
  })
  return axios(url, data)
}

/**
 * 购物车删除商品
 * @param {购物车记录信息id字符串} cartInfoIds
 * @return {*}
 */
export function deleteCart(cartInfoIds) {
  const url = serverUrlShop + '/mallCart/deleteCart'

  const data = Object.assign({}, commonParams, {
    cartInfoIds
  })
  return axios(url, data)
}

/**
 * 修改购物车商品列表信息
 * @param {购物车记录json字符串(类似：
   * [{
        cartInfoIds: 购物车记录id
        specificationsId: 规格id
        num: 商品数量
      }]
  )} cartInfoJson
 * @return {*}
 */
export function updateCartList(cartInfoJson) {
  const url = serverUrlShop + '/ mallCart/updateCartList'

  const data = Object.assign({}, commonParams, {
    cartInfoJson
  })
  return axios(url, data)
}

/**
 * 查询购物车商品列表信息
 * @param {用户token} token
 * @param {当前页数} page 可空
 * @param {每页总数} limit 可空
 * @return {*}
 */
export function getUserCartList(token, page, limit) {
  const url = serverUrlShop + '/mallCart/getUserCartList'

  const data = Object.assign({}, commonParams, {
    token,
    page,
    limit
  })
  return axios(url, data)
}

/**
 * 根据多个商品的规格和数量获取返现
 * @param {商品数据json字符串(类似：
   * [{
        goodsId: 商品id
        barCod: 规格id
        num: 商品数量
      }]
  )} goodsJson
 * @return {*}
 */
export function getAllPromotionDiscount(goodsJson, token) {
  const url = serverUrlShop + '/mallGoods/getAllPromotionDiscount'

  const data = Object.assign({}, commonParams, {
    goodsJson,
    token
  })
  return axios(url, data)
}

/**
 * 查询当前物品返现
 * @param {物品ID} goodsId 
 * @param {规格ID} barCod 
 * @param {当前购买数量} num 
 */
export function getPromotionDiscount(goodsId, barCod, num) {
  const url = serverUrlShop + '/mallGoods/getPromotionDiscount'

  const data = Object.assign({}, commonParams, {
    goodsId,
    barCod,
    num
  })
  return axios(url, data)
}

/**
 * 商品分销最高佣金
 * @param {商品id} goodsInfoId 
 */
export function getGoodsCommission(goodsInfoId) {
  const url = serverUrlShop + '/mallUserShareSaleInfo/getGoodsCommission'

  const data = Object.assign({}, commonParams, {
    goodsInfoId
  })
  return axios(url, data)
}
