import { commonParams, serverUrlShop } from './config'
import { axios } from './axios.js'

/**
 * 用户添加或更新地址
 * @param {*token} token
 * @param {*该条地址的地址id} id
 * @param {*收货人} receiver 
 * @param {*手机号} phoneNo 
 * @param {*省的id} provinceId 
 * @param {*省的名称} provinceName 
 * @param {*城市id} cityId 
 * @param {*城市名称} cityName 
 * @param {*地区id} areaId 
 * @param {*地区名称} areaName 
 * @param {*详细地址} detailAddress 
 * @param {*是否默认} isDefault 
 */
export function addOrUpdateUserAddress(
    token,
    id,
    receiver,
    phoneNo,
    provinceId,
    provinceName,
    cityId,
    cityName,
    areaId,
    areaName,
    detailAddress,
    isDefault
) {
    const url = serverUrlShop + '/userAddress/addOrUpdateUserAddress'

    const data = Object.assign({}, commonParams, {
        token,
        id,
        receiver,
        phoneNo,
        provinceId,
        provinceName,
        cityId,
        cityName,
        areaId,
        areaName,
        detailAddress,
        isDefault
    })

    return axios(url, data)
}

/**
 * 删除用户地址
 * @param {*该条地址的地址id} userAddressInfoId 
 */
export function deleteUserAddressById(
    userAddressInfoId
) {
    const url = serverUrlShop + '/userAddress/deleteUserAddressById'

    const data = Object.assign({}, commonParams, {
        userAddressInfoId
    })

    return axios(url, data)
}

/**
 * 修改地址的默认状态
 * @param {*该条地址的地址id} userAddressInfoId 
 * @param {*是否是默认地址} isDefault 
 */
export function updateAddressDefault(
    userAddressInfoId,
    isDefault
) {
    const url = serverUrlShop + '/userAddress/updateAddressDefault'

    const data = Object.assign({}, commonParams, {
        userAddressInfoId,
        isDefault
    })

    return axios(url, data)
}

/**
 * 获取管理地址列表
 * @param {*用户token} token 
 */
export function getUserAddressList(token) {
    const url = serverUrlShop + '/userAddress/getUserAddressList'

    const data = Object.assign({}, commonParams, {
        token
    })

    return axios(url, data)
}

/**
 * 获取用户的默认地址
 * @param {*用户token} token 
 */
export function getUserAddressDefault(token) {
    const url = serverUrlShop + '/userAddress/getUserAddressDefault'

    const data = Object.assign({}, commonParams, {
        token
    })

    return axios(url, data)
}