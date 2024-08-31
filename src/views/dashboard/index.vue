<template>
  <el-container style="height: 86vh;">
    <!--el-aside width="15%" style="border-right: 2px solid #e0e0e0;">
    <div class="info-section">
      <h2>系统信息</h2>
      <p>操作系统: Linux</p>
      <p>运行时长: 4day</p>
      <p>分区类型: etx4</p>
      <p>cpu规格: i5-xxxxx</p>
      <p>cpu核心: 3</p>
    </div>
    </el-aside-->
    <el-main>
      <div class="chart-container">
        <fs-chart
          :fs-info="fsInfo"
        />
      </div>
      <div class="chart-container">
        <disk-chart
          :disk-info="diskInfo"
        />
      </div>
      <div class="chart-container">
        <memory-chart
          :memory-info="memoryInfo"
        />
      </div>
      <div class="chart-container">
        <cpu-chart
          :cpu-info="cpuInfo"
        />
      </div>
    </el-main>
  </el-container>
</template>
<script>

import DiskChart from './commpoents/DiskChart.vue'
import FsChart from './commpoents/FsChart.vue'
import MemoryChart from './commpoents/MemoryChart.vue'
import CpuChart from './commpoents/CpuChart.vue'

import sseService from '@/utils/sse'

export default {
  components: { DiskChart, FsChart, MemoryChart, CpuChart },
  data() {
    return {
      sse: null,
      systemDetails: {
        os: '',
        uptime: ''
      },
      fsInfo: {
        count: undefined,
        file_count: undefined,
        dir_count: undefined
      },
      diskInfo: {
        file_system: '',
        total_size: 0,
        used_size: 0,
        free_size: 0,
        usage_percent: 0
      },
      memoryInfo: {
        used: 0,
        free: 0,
        total: 0
      },
      cpuInfo: {
        usage_percent: 0
      }
    }
  },
  mounted() {
    this.sse = sseService.createSse()
    this.sse.fetch('/api/v1/sse/fs/info', event => {
      if (event.event === 'message' && event.data) {
        this.fsInfo = JSON.parse(event.data)
      }
    })
    this.sse.fetch('/api/v1/sse/system', event => {
      if (event.event === 'message' && event.data) {
        const jsonData = JSON.parse(event.data)
        this.diskInfo = jsonData.disk_info
        this.memoryInfo = jsonData.memory_info
        this.cpuInfo = jsonData.cpu_info
      }
    })
  },
  beforeDestroy() {
    if (this.sse) {
      this.sse.disconnect()
      console.log(`SSE connection to ${this.endpoint} has been closed`)
    }
  }
}
</script>
  <style scoped>

.el-main {
  display: flex;
  flex-wrap: wrap;
  height: 100%; /* 确保不超过父容器高度 */
  padding: 10px;
  overflow: hidden; /* 防止内容溢出导致滚动条出现 */
}

  .el-aside {
    background-color: #ffffff; /* 白色背景 */
    color: #4f3be4; /* 深色文字 */
    padding: 10px; /* 边距 */
  }
  .info-section h2 {
    margin-top: 23px; /* 上边距，确保标题间隔清晰 */
    color: #692895; /* 标题颜色，使用 Element UI 的主题蓝色 */
    font-size: 15px; /* 字体大小 */
  }
  .info-section p {
    margin-left: 0px; /* 移除缩进，文字对齐左边 */
    color: #666; /* 文字颜色 */
    font-size: 13px; /* 文字大小 */
    line-height: 1; /* 行间距 */
  }
  .chart-container {
  width: 50%; /* 占父容器的一半宽 */
  height: 50%; /* 占父容器的一半高 */
  padding: 0px; /* 提供一些内边距 */
  background-color: #fff; /* 设置背景色为白色 */
  border: 2px solid #ebebeb; /* 边框颜色 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* 添加阴影效果 */
  border-radius: 12px; /* 圆角边框 */
}

  </style>
