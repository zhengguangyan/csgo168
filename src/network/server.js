import { Axios } from './axios'

// Get 获取排行榜列表
export function SGetRank(date) {
    return Axios({
        url: `leaderboards?date=${date}`,
        method: 'get',
    })
}

// Get 获取开箱奖品列表
export function SGetAwards(params) {
    return Axios({
        url: `box/detail?id=${params}`,
        method: 'get',
    })
}

// Post 获取开箱奖品列表
export function SOpenBox(id, num) {
    return Axios({
        url: `open`,
        method: 'post',
        data: {
            id,
            num
        }
    })
}
// Get 获取幸运开箱奖品列表
export function SGetLucky(params) {
    return Axios({
        url: `award/get?id=${params}`,
        method: 'get',
    })
}

// Post 获取幸运开箱奖品列表
export function SLuckyOpen(id, percent) {
    return Axios({
        url: `lucky/open`,
        method: 'post',
        data: {
            id,
            percent
        }
    })
}

// Post 兑换m豆
export function SToBean(params) {
    return Axios({
        url: `cash`,
        method: 'post',
        data: {
            data: JSON.stringify(params)
        }
    })
}

// Post 兑换m豆
export function SToSteam(params) {
    return Axios({
        url: `extract`,
        method: 'post',
        data: {
            data: JSON.stringify(params)
        }
    })
}

//获取个人信息
export function GetMy() {
    return Axios({
        url: `me`,
        method: 'get'
    })
}

//获取 Roll 房列表
export function SGetRoll(page) {
    return Axios({
        url: `rooms?page=${page}`,
        method: 'get'
    })
}

//获取我的 Roll 房列表
export function SMyRoll(page) {
    return Axios({
        url: `user/rooms?page=${page}`,
        method: 'get'
    })
}

//获取我的 Roll 房详情
export function SRollInfo(id) {
    return Axios({
        url: `room/detail?id=${id}`,
        method: 'get'
    })
}

//加入房间
export function SJoinHome(...params) {
    return Axios({
        url: `room/join`,
        method: 'post',
        data: {
            id: params[0],
            password: params[1],
        }
    })
}

//获取分页
export function SStorage(...params) {
    return Axios({
        url: `storage?page=${params[0] || 0}`,
        method: 'get',
        data: {
            page: params[0] || 0,
            status: params[1] || 0,
        }
    })
}

