import request from '@/utils/request'

// 自定义内容
export function loginByUsername(data) {
  let formdata = new FormData();

  formdata.append('username', data.username)
  formdata.append('password', data.password)

  //return request.post('/login',formdata)
  return request({
    url: '/login',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: formdata
  })
}

export function getUserInfo(token){
  return request({
    url: '/getUserInfo',
    method: 'post',
  })
}

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
