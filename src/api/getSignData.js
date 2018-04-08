import Axios from 'axios'
import {
  serverUrlWechat
} from 'api/config'
export function getSignData(openId, url) {
  return new Promise((resolve, reject) => {
    Axios.get(
      serverUrlWechat + '/wxConfig/getSignData', {
        params: {
          openId,
          url
        }
      }
    ).then(
      (res) => {
        resolve(res)
      }).catch((res) => {
      reject(res)
    })
  })
}
