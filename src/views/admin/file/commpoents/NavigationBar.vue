<template>
  <div class="path-display">

    <span class="path-label">当前路径: </span>

    <div v-for="(part, index) in pathParts" :key="index" class="path-part-container" @click="handlePartClick(index)">
      <i class="el-icon-folder" />
      <span>{{ part }}</span>
      <i v-if="index !== pathParts.length - 1" class="el-icon-arrow-right" />
    </div>
  </div>
</template>

<script>
import { makePath } from '@/api/admin/sys-fs'

export default {
  props: {
    basePath: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pathParts: [] // 存储路径部分
    }
  },
  watch: {
    basePath(newVal) {
      // 当basePath变化时，调用parsePath方法
      this.parsePath(newVal)
    }
  },
  created() {
    this.parsePath(this.basePath)
  },
  methods: {
    parsePath(basePath) {
      const { path, rid } = basePath
      const roleDir = rid ? atob(rid) : ''
      const realPath = makePath(path)
      let parts = []

      if (roleDir && roleDir !== '/' && realPath.startsWith(roleDir)) {
        parts.push(roleDir.replace(/^\/+/, ''))
        const relativePath = realPath.slice(roleDir.length)
        parts.push(...relativePath.split('/').filter(part => part))
      } else {
        parts = realPath.split('/').filter(part => part)
      }
      this.pathParts = ['/', ...parts]
    },
    handlePartClick(index) {
      // 处理路径部分的点击事件
      const clickedPath = '/' + this.pathParts.slice(0, index + 1).join('/')
      this.$emit('node-clicked', clickedPath)
    }
  }
}
</script>

<style scoped>
.path-display {
  display: flex;
  align-items: center;
}

.path-part-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s;
}

.path-part-container i {
  color: #409EFF;
  margin-right: 5px;
}

.path-part-container:hover {
  color: #66b1ff;
}

.el-icon-arrow-right {
  margin: 0 5px;
}
.path-label {
  margin-right: 15px; /* 添加右侧间距以分隔文字和路径 */
}
</style>
