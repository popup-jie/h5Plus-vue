export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function removeClass (el, className) {
  if (!hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  var index = newClass.findIndex(function (value, index, arr) {
    return value === className
  })
  newClass.splice(index, 1)
  el.className = newClass.join(' ')
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function toggleClass (el, className) {
  if (hasClass(el, className)) {
    removeClass(el, className)
  } else {
    addClass(el, className)
  }
}

export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

export function nativeUI (title, fn, canfn) {
  if ('iOS' == plus.os.name) {
    plus.nativeUI.confirm(
      title,
      function (e) {
        if (e.index > 0) {
          fn && fn()
        } else {
          canfn && canfn()
        }
      },
      '系统消息', ['取消', '确定']
    )
  } else {
    var r = confirm(title)
    if (r) {
      fn && fn()
    } else {
      canfn && canfn()
    }
  }
}

export function handler () {
}

