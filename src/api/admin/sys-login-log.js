import request from '@/utils/request'

// 查询SysLoginlog列表
export function listSysLoginlog(query) {
  return request({
    url: '/api/v1/log/login',
    method: 'get',
    params: query
  })
}

// 删除SysLoginlog
export function delSysLoginlog(data) {
  return request({
    url: '/api/v1/log/login',
    method: 'delete',
    data: data
  })
}

