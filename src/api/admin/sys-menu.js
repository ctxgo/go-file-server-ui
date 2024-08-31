import request from '@/utils/request'

// 查询菜单下拉树结构
// export function treeselect() {
//   return request({
//     url: '/api/v1/menuTreeselect',
//     method: 'get'
//   })
// }

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/api/v1/menu/role-tree/' + roleId,
    method: 'get'
  })
}

