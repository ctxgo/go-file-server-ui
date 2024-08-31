import request from '@/utils/request'
import service from '@/utils/request'
import { Message } from 'element-ui'
// login 登陆
export function login(data) {
  return request({
    url: '/api/v1/login',
    method: 'post',
    data
  })
}

// logout 退出
export function logout() {
  return request({
    url: '/api/v1/logout',
    method: 'post'
  })
}

// refreshtoken 刷新token
export function refreshtoken(data) {
  return request({
    url: '/refreshtoken',
    method: 'post',
    data
  })
}

// getInfo 获取用户权限信息
export function getAccess() {
  return request({
    url: '/api/v1/user/access',
    method: 'get'
  })
}

// getAvatar 获取用户头像
export function getAvatar() {
  return service({
    url: '/api/v1/avatar', // 根据实际API路径调整
    method: 'get',
    responseType: 'blob' // 确保返回类型为 Blob，以处理图像流
  })
    .then(response => {
      // 成功获取数据后，创建 Blob URL
      if (response.status === 200) {
        const contentType = response.headers['content-type']

        if (contentType.includes('application/json')) {
          return response.data.text().then(text => {
            const data = JSON.parse(text) // 解析文本为 JSON
            if (data.code === 1009) {
              return require('@/assets/avatar.png')
            }
            throw new Error(data.message || 'Unknown error occurred')
          })
        }

        return window.URL.createObjectURL(new Blob([response.data]))
      }
      throw new Error(response.msg || 'Unknown error occurred')
    }).catch(error => {
      Message({
        message: error.message || '获取头像失败',
        type: 'error'
      })

      throw error
    })
}
