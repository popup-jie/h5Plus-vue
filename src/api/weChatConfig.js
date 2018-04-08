import Axios from 'axios'
import {
  serverUrlWechat
} from 'api/config'

export function getWxAccessToken() {
  return new Promise((resolve, reject) => {
    Axios.get(
      serverUrlWechat + '/wxConfig/getWxAccessToken').then(
      (res) => {
        resolve(res.data)
      }).catch((res) => {
      reject(res)
    })
  })
}
