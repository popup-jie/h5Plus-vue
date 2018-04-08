import Axios from 'axios'
import { serverUrlShop } from './config'

export function getAreaList() {
    return new Promise((resolve, reject) => {
        Axios.get(serverUrlShop + '/userAddress/getAreaList').then(
            // Axios.get('/api/userAddress/getAreaList').then(
            (res) => {
                resolve(res)
            }).catch((res) => {
            reject(res)
        })
    })
}