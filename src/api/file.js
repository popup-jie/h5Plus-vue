import {
  commonParams,
  uploadServerUrl,
  fileServerUrl
} from './config'
import {
  axios
} from './axios'

import Axios from 'axios'

/**
 * 上传文件
 * @param file 【待上传文件】
 * @return {*}
 */
export function uploadFile(fileName, fileString) {
  const url = fileServerUrl + '/uploadString'

  const data = Object.assign({}, commonParams, {
    folder : 'rlFolder',
    fileName,
    fileString
  })
  return Axios({
    method: 'post',
    url: url,
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  }).catch((e) => {
    console.log(e)
  })
}

/**
 * 线上商城评价页面--微信SDK对应文件上传方法
 * @param {
       jsonString:{[
          key:定义的唯一key
          pictureIds:图片地址拼接，以"，"隔开
        ]}
  } jsonString
 * @param {微信的token} token
 * @return {Promise.<T>|*}
 */
export function uploadFileByWxSdk(jsonString,token) {
  const url = uploadServerUrl + '/uploadFile/uploadFileByWxSdk'

  const data = Object.assign({}, commonParams, {
    jsonString,
    token
  })
  return axios(url, data)
}


