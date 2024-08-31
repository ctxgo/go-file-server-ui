<template>
  <el-dialog slot="footer" :title="'test'" :visible.sync="open">
    <div ref="logContainer" class="log-container">
      <pre v-for="(event, index) in logs" :key="index" :class="{'text-error': event.event === 'error'}">
      {{ event.data }}</pre>
    </div>
    <div slot="footer" class="dialog-footer">
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="!done" type="primary" @click="submitForm">完 成</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div></el-dialog></template>

<script>
import sseService from '@/utils/sse'

export default {
  props: {
    showLogObj: {
      type: Object,
      required: true
    }},
  data() {
    return {
      logs: [],
      open: false,
      done: false,
      doneEnabled: false,
      eventSource: null
    }
  },
  watch: {
    showLogObj(val) {
      if (val.open) {
        this.logs = []
        this.open = true
        this.startLogging(val)
      } else {
        this.logs = []
        this.stopLogging()
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit('update:showLogObj', { open: false, path: '' }) // 通知父组件更新 prop
    },
    startLogging(val) {
      this.sse = sseService.createSse(true)
      this.sse.fetch('/api/v1/sse/fs/unarchive' + val.path, event => {
        this.logs.push(event)
        if (event.event === 'done') {
          this.stopLogging()
          this.done = true
          return
        }
      })
      if (this.logs.length > 1000) {
        this.logs.shift() // 保持日志数量不超过100条
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.logContainer
        container.scrollTop = container.scrollHeight
      })
    },
    stopLogging() {
      if (this.sse) {
        this.sse.disconnect()
      }
    },
    submitForm() {
      console.log('submitForm')
      this.$emit('log-callback')
      this.open = false
      this.$emit('update:showLogObj', { open: false, path: '' }) // 通知父组件更新 prop
    },
    cancel() {
      this.stopLogging()
      this.open = false
      this.$emit('update:showLogObj', { open: false, path: '' }) // 通知父组件更新 prop
    }
  }
}
</script>

<style scoped>
.log-container {
  background-color: black;
  border: 2px solid purple;
  color: white;
  height: 400px;
  overflow-y: scroll;
  padding: 10px;
  font-family: monospace;
}

/* 滚动条的轨道 */
.log-container::-webkit-scrollbar {
  width: 13px;  /* 调整滚动条宽度 */
}

.text-error {
  color: red; /* 将文本颜色设置为红色 */
}

/* 滚动条的滑块 */
.log-container::-webkit-scrollbar-thumb {
  background-color: rgb(187, 40, 187);  /* 调整滑块颜色以匹配边框 */
  border-radius: 20px; /* 设置按钮的边框圆角 */
}
/* 滚动条的轨道背景 */
.log-container::-webkit-scrollbar-track {
  background: rgba(20, 38, 203, 0.849);
}
</style>
