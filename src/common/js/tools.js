import {
  Base64
} from 'js-base64'

// 计算时长
export function videoTimeLong(datetime) {
  if (datetime) {
    let _hour = datetime / 60 | 0
    let _seconds = datetime % 60

    let mns = ([_hour, _seconds]).map(function (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }).join(':')
    return mns
  }
  return ''
}

// 头像地址前缀拼凑
export function avatar(logo) {
  if (logo == '' || logo == undefined || logo == null) {
    return;
  }
  if (logo.indexOf("www.ppbar.com.cn") != -1 || logo.indexOf("wx.qlogo.cn") != -1) {
    return logo
  } else {
    return 'http://www.ppbar.com.cn/file/file/preview/' + logo
    // return 'http://120.76.155.216/file/file/preview/' + logo   //目前域名报错，临时使用IP地址
    // return 'http://test.szcloud8.com/file/file/preview/' + logo //目前域名报错，临时使用IP地址
  }
}

// 图片地址前缀拼凑
export function bgImg(logo) {
  if (!logo) {
    return
  }
  if (logo.indexOf('.png') != -1 || logo.indexOf('.jpg') != -1 || logo.indexOf('.jpeg') != -1 || logo.indexOf('.bmp') != -1) {
    return logo
  } else {
    return 'http://www.ppbar.com.cn/file/file/preview/' + logo
  }
}

// 多张头像图片地址格式化处理
export function formatAvatars(avatars) {
  let s = avatars.split(',').map(item => {
    return avatar(item)
  })
  return s
}

/*
 * 字符串截取指定长度并返回
 *  content:需要截取的文本内容
 *  limitLength:限定的长度
 */
export function textEllipse(content, limitLength) {
  var result = ''
  if (content.length > limitLength) {
    result = content.substring(0, limitLength) + '...'
  } else {
    result = content
  }
  return result
}

// 节流函数
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 截取url字符串相对应的参数的值
export function getUrlAttribute(url, parameName) {
  // location.search是从当前URL的?号开始的字符串，即查询字符串
  var query = url
  var query = query.split('?')[1]
  if (null != query) {
    var args = {}
    var pairs = query.split('&')
    for (var i = 0; i < pairs.length; i++) {
      var pos = pairs[i].indexOf('=')
      if (pos == -1) continue
      var argname = pairs[i].substring(0, pos)
      var value = pairs[i].substring(pos + 1)
      value = decodeURIComponent(value)
      args[argname] = value
    }
    // return value
    // 根据键名获取值
    return args[parameName]
  }
  return null
}

// 截取url字符串相对应的参数的值(针对Base64加密)
export function getBase64UrlAttribute(url, parameName) {
  // location.search是从当前URL的?号开始的字符串，即查询字符串
  var query = url
  var query = query.split('?')[1]
  if (null != query) {
    var args = {}
    var pairs = query.split('&')
    for (var i = 0; i < pairs.length; i++) {
      var pos = pairs[i].indexOf('=')
      if (pos == -1) continue
      var argname = pairs[i].substring(0, pos)
      var value = pairs[i].substring(pos + 1)
      value = Base64.decode(value)
      args[argname] = value
    }
    // return value
    // 根据键名获取值
    return args[parameName]
  }
  return null
}

/**
 * 生成一个指定范围内的数组
 * @param n 【最小值】
 * @param m 【最大值】
 * @param unit 【单位】
 * @return {Array}
 */
export function range(n, m, unit = '') {
  let arr = []
  for (let i = n; i <= m; i++) {
    let value = i + unit
    arr.push({
      text: value,
      value: i
    })
  }
  return arr
}


/**
 * 返回计算格式
 * @param {数据库请求出来的数据} arr 
 * @param {时间字段名字} mtype 
 * 
 * 返回格式：
 * 数据源：{
 *  ...原本字段
 *  extratime:{
 *    extratime: _time, //计算后的时间
      isShow: true //是否展示在页面
 *  }
 * }
 */
export function formatTime(arr, mtype) {
  // this.fortmatTimer = setInterval(() => {
  let _arr = arr.slice()
  _arr.forEach((element, index) => {
    let $el = element[mtype].split(':')
    let _hour = Math.abs($el[0])
    let _minutes = Math.abs($el[1])
    let _seconds = Math.abs($el[2])

    if (_seconds > 0) {
      _seconds--
    } else if (_minutes > 0) {
      _seconds = 59
      _minutes--
    } else if (_hour > 0) {
      _seconds = 59
      _minutes = 59
      _hour--
    } else {
      //如果以上不成立
      element.extratime = {
        extratime: '00:00:00',
        isShow: false
      }
      element[mtype] = '00:00:00'
      return false
    }
    let _time = ([_hour, _minutes, _seconds]).map((n) => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }).join(':')
    element[mtype] = _time
    element.extratime = {
      extratime: _time,
      isShow: true
    }
  });
  return _arr
}

/**
 * 格式化时间
 * @param {数据源} arr 
 * @param {字段名字} mtype 
 */
export function initformatTime(arr, mtype) {
  let _arr = arr.slice()
  _arr.forEach((element, index) => {

    let $el = element[mtype]
    $el = $el.toString()
    if ($el.indexOf(':') != -1) {
      return false
    }
    let _hour = parseInt($el / 3600)
    let _minutes = parseInt($el % 3600 / 60)
    let _seconds = parseInt($el % 60)
    let _time = ([_hour, _minutes, _seconds]).map((n) => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }).join(':')
    element[mtype] = _time
  });
  return _arr
}




//实现深拷贝
export function deepCopy(target) {
  if (typeof target !== 'object') return
  //判断目标类型，来创建返回值
  var newObj = target instanceof Array ? [] : {}

  for (var item in target) {
    //只复制元素自身的属性，不复制原型链上的
    if (target.hasOwnProperty(item)) {
      newObj[item] =
        typeof target[item] == 'object' ? deepCopy(target[item]) : target[item] //判断属性值类型
    }
  }

  return newObj
}

export function whichTransitionEvent() {
  var t
  var el = document.createElement('fakeelement')
  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }
  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t]
    }
  }
}
