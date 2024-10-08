<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    @select="handleSelect"
  >
    <template v-for="(item, index) in topMenus">
      <el-menu-item
        v-if="index < visibleNumber"
        :key="index"
        :index="item.path"
      ><svg-icon :icon-class="item.meta.icon" />
        {{ item.meta.title }}</el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-submenu v-if="topMenus.length > visibleNumber" index="more">
      <template slot="title">更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          v-if="index >= visibleNumber"
          :key="index"
          :index="item.path"
        ><svg-icon :icon-class="item.meta.icon" />
          {{ item.meta.title }}</el-menu-item>
      </template>
    </el-submenu>
  </el-menu>
</template>

<script>
import { constantRoutes } from '@/router'

export default {
  data() {
    return {
      // 顶部栏初始数
      visibleNumber: 5,
      // 是否为首次加载
      isFrist: false
    }
  },
  computed: {
    // 顶部显示菜单
    topMenus() {
      return this.routers.map((menu) => ({
        ...menu,
        children: undefined
      }))
    },
    // 所有的路由信息
    routers() {
      return this.$store.state.permission.topbarRouters
    },
    // 设置子路由
    childrenMenus() {
      var childrenMenus = []
      this.routers.map((router) => {
        for (var item in router.children) {
          if (router.children[item].parentPath === undefined) {
            router.children[item].parentPath = router.path
          }
          childrenMenus.push(router.children[item])
        }
      })
      return constantRoutes.concat(childrenMenus)
    },
    // 默认激活的菜单
    activeMenu() {
      if (this.routers.length === 0) {
        return
      }
      const path = this.$route.path
      let activePath = this.routers[0].path
      if (path.lastIndexOf('/') > 0) {
        const tmpPath = path.substring(1, path.length)
        activePath = '/' + tmpPath.substring(0, tmpPath.indexOf('/'))
      } else if (path === '/index' || path === '') {
        if (!this.isFrist) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.isFrist = true
        } else {
          activePath = 'index'
        }
      }
      this.activeRoutes(activePath)
      return activePath
    }
  },
  mounted() {
    this.setVisibleNumber()
  },
  methods: {
    // 根据宽度计算设置显示栏数
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width - 200
      const elWidth = this.$el.getBoundingClientRect().width
      const menuItemNodes = this.$el.children
      const menuWidth = Array.from(menuItemNodes).map(
        (i) => i.getBoundingClientRect().width
      )
      this.visibleNumber = (
        parseInt(width - elWidth) / parseInt(menuWidth)
      ).toFixed(0)
    },
    // 菜单选择事件
    handleSelect(key, keyPath) {
      if (key.indexOf('http://') !== -1 || key.indexOf('https://') !== -1) {
        // http(s):// 路径新窗口打开
        window.open(key, '_blank')
      } else {
        this.activeRoutes(key)
      }
    },
    // 当前激活的路由
    activeRoutes(key) {
      var routes = []
      if (this.childrenMenus && this.childrenMenus.length > 0) {
        this.childrenMenus.map((item) => {
          if (key === item.parentPath || (key === 'index' && item.path === '')) {
            routes.push(item)
          }
        })
      }
      this.$store.commit('permission/SET_SIDEBAR_ROUTERS', routes)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 50px;
  line-height: 50px;
  margin: 0;
  border-bottom: 3px solid transparent;
  color: #999093;
  padding: 0 5px;
  margin: 0 10px;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 3px solid #409eff;
  color: #303133;
}
</style>
