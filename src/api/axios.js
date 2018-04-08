import Axios from 'axios'
import qs from 'qs'
// Axios.defaults.headers.post['content-Type'] = 'application/json;charset=utf-8'

export function axios(url, data) {
    data = qs.stringify(data)
    return Axios.post(url, data, {}).then((res) => {
        // if (res.data.success !== true) {
        //     if (window.plus) {
        //         plus.nativeUI.toast(res.data.msg ? res.data.msg : res.msg)
        //     } else {
        //         alert(res.data.msg ? res.data.msg : res.msg)
        //     }
        // }
        if (res.data) {
            return Promise.resolve(res.data)
        } else {
            return Promise.resolve(res)
        }
    }).catch((res) => {
        return Promise.reject(res)
    })
}

/*
export function axios(url, data, cb) {

  ajax({
    url: url, //请求地址
    type: "POST", //请求方式
    data: data, //请求参数
    success: function (res, xml) {
      res = eval('(' + res + ')')
      cb && cb(res)
    },
    fail: function (status) {
      console.log('...' + status)
    }
  })
  // return new Promise((resolve, reject) => {
  //   Axios({
  //     method: 'post',
  //     url: url,
  //     params: data
  //   }).then(res => {
  //     if (res.data.success !== true) {
  //       alert(res.data.msg)
  //       return
  //     }
  //     cb && cb(res.data)
  //   })
  // })
  // return Axios({
  //     method: 'post',
  //     url: url,
  //     params: data
  //   }).then((res) => {
  //     resolve(res)
  //   }).catch((err) => {
  //     reject(err)
  //   })
  // })
  // Axios({
  //   method: 'post',
  //   url: url,
  //   params: data
  // }).then((res) => {
  //   if (res.data.success !== true) {
  //     alert(res.data.msg)
  //     return
  //   }
  //   return Promise.resolve(res.data)
  // }).catch((res) => {
  //   console.log(res)
  // })
}

function ajax(options) {
  options = options || {}
  options.type = (options.type || "GET").toUpperCase()
  options.dataType = options.dataType || "json"
  var params = formatParams(options.data)

  //创建 - 非IE6 - 第一步
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest()
  } else { //IE6及其以下版本浏览器
    var xhr = new ActiveXObject('Microsoft.XMLHTTP')
  }

  //接收 - 第三步
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var status = xhr.status
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText, xhr.responseXML)
      } else {
        options.fail && options.fail(status)
      }
    }
  }

  //连接 和 发送 - 第二步
  if (options.type == "GET") {
    xhr.open("GET", options.url + "?" + params, true)
    xhr.send(null)
  } else if (options.type == "POST") {
    xhr.open("POST", options.url, true)
    //设置表单提交时的内容类型
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(params)
  }
}
//格式化参数
function formatParams(data) {
  var arr = []
  for (var name in data) {
    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]))
  }
  arr.push(("v=" + Math.random()).replace(".", ""))
  return arr.join("&")
}
 */