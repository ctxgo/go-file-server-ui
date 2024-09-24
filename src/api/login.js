import request from '@/utils/request'

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/api/v1/captcha',
    method: 'get'
  })
}

export function getConfig() {
  return request({
    url: '/api/v1/config',
    method: 'get'
  })
}

export function getDexAuthUrl() {
  return request({
    url: '/api/v1/login/dex',
    method: 'get'
  })
}

export function loginCallback(query) {
  return request({
    url: '/api/v1/login/callback',
    params: query,
    method: 'get'
  })
}
