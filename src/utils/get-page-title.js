
export default function getPageTitle(pageTitle) {
  // const app_info = storage.get('app_info')
  // const title = app_info ? app_info.sys_app_name : 'go-admin 后台管理系统'
  const title = '文件服务器'
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
