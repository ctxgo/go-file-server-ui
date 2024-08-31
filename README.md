# go-file-server-ui


[go-file-server](https://github.com/ctxgo/go-file-server.git) 的前端

Vue2 + Element UI 

基于 [go-admin-team](https://github.com/go-admin-team/go-admin-ui.git) 项目修改

## 🎁 内置
1. 文件管理：文件的增删改查
1. 用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2. 部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3. 角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
4. 操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
5. 登录日志：系统登录日志记录查询包含登录异常。
6. 服务监控：查看一些服务器的基本信息。

## 📦 本地开发

### 环境要求

node版本: v16.20.0

npm版本: 8.19.4

### 本地启动

```bash
# 获取代码
git clone https://github.com/ctxgo/go-file-server-ui.git

# 进入到项目目录
cd go-file-server-ui

# 安装cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com

#沿用npm的安装方式，解决cnpm symlink带来的问题
cnpm install --by=npm

# 修改 .env.development 中 VUE_APP_BASE_API = '' 为实际的后端api地址
# 启动服务
npm run dev
```

### 编译

```bash
# 编译为 dist
npm run build:prod

# 编译为docker 镜像
docker build -t go-file-server-ui .
```









