import request from '@/utils/request'

export function makePath(path) {
  path = path.replace(/^\/admin\/file/, '') || '/'
  return path
}

// 查询目录下拉树结构
export function getFs(path, query) {
  path = makePath(path)
  const newQuery = { ...query, action: 'list' }
  return request({
    url: '/api/v1/fs' + path,
    method: 'get',
    params: newQuery
  })
}

// 查询目录下拉树结构
export function createFs(path, newName) {
  path = makePath(path)
  return request({
    url: '/api/v1/fs' + path,
    method: 'post',
    data: { newName: newName }
  })
}

// 查询目录下拉树结构
export function renameFs(path, newName) {
  path = makePath(path)
  return request({
    url: '/api/v1/fs' + path,
    method: 'put',
    data: { action: 'rename', newName: newName }
  })
}

// 查询目录下拉树结构
export function moveFs(path, data) {
  data.action = 'move'
  path = makePath(path)
  return request({
    url: '/api/v1/fs' + path,
    method: 'put',
    data: data,
    skipIntercept: true
  })
}

// 查询目录下拉树结构
export function deleteFs(path) {
  path = makePath(path)
  return request({
    url: '/api/v1/fs' + path,
    method: 'delete',
    skipIntercept: true
  })
}

// 查询目录下拉树结构
export function resetFs() {
  return request({
    url: '/api/v1/fsindex',
    method: 'post'
  })
}

export function getDownloadUrl(path) {
  path = makePath(path)
  return request({
    url: '/api/v1/fsu' + path,
    method: 'get'
  })
}
