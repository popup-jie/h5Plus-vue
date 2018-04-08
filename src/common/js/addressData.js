import { getAreaList } from 'api/getAreaList'

let datas = []
let provinceList = []
let cityList = {}
let areaList = {}

export function initFunc() {
    datas = []
    provinceList = []
    cityList = {}
    areaList = {}
    return new Promise((resolve, reject) => {
        getAreaList().then((res) => {
            return resolve(calcList(res.data.data))
        })
    })
}

function calcList(dataList) {
    // 处理地区

    let _arr = dataList.slice()
    _arr.forEach((item, index) => {
        // 遍历省
        if (item.level === 1) {
            // console.log(item.name)
            item.text = item.name
            item.value = item.id
            provinceList.push(item)
        }
    })
    provinceList.splice(31, 3)
        // console.log(provinceList.splice(31, 3))
        // console.log(provinceList)
    datas.push(provinceList)
    _arr.forEach((item, index) => {
        if (item.level === 2) {
            provinceList.forEach(obj => {
                if (obj.value === item.pid) {
                    item.province = obj.text
                    item.text = item.name
                    item.value = item.id
                    if (cityList[obj.value]) {
                        cityList[obj.value].push(item)
                    } else {
                        cityList[obj.value] = [item]
                    }
                }
            })
        }
    })
    datas.push(cityList)
    _arr.forEach((item, index) => {
        // 遍历区
        if (item.level === 3) {
            for (var i in cityList) {
                for (var j in cityList[i]) {
                    if (cityList[i][j].value === item.pid) {
                        item.city = cityList[i][j].text
                        item.text = item.name
                        item.value = item.id
                        if (areaList[cityList[i][j].value]) {
                            areaList[cityList[i][j].value].push(item)
                        } else {
                            areaList[cityList[i][j].value] = [item]
                        }
                    }
                }
            }
        }
    })

    datas.push(areaList)
        // console.log('datas:' + datas)
    return datas
}