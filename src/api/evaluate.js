import {
  commonParams,
  serverUrlShop
} from './config'
import {
  axios
} from './axios.js'

//***************线上商城--评论相关API******************
/**
 * 添加评论
 * @param {评论信息json} appraiseJson (示例：
     [{
       goodsId:商品id,
       barCod:条码,
       starLevel:星级,
       message:留言,
       files:图片地址(以逗号隔开),
       parentId:回复的评论id，如果没有，存0
    }]
  )
 * @param {订单编号} orderNo
 * @param {用户token} token
 * @return {*}
 */
export function addOrderAppraise(appraiseJson,orderNo,token) {
  const url = serverUrlShop + '/mallAppraise/addOrderAppraise'

  const data = Object.assign({}, commonParams, {
    appraiseJson,
    orderNo,
    token
  })
  return axios(url, data)
}
