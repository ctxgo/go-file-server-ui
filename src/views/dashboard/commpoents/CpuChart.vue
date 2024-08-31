<template>
  <div style="width: 100%; height: 100%;">
    <v-chart :option="chartOptions" style="width: 100%; height: 100%;" autoresize />
  </div>
</template>

<script>

import { isEqual } from 'lodash'

import VChart from '@/components/Charts/VChart'

export default {
  components: {
    VChart
  },
  props: {
    cpuInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        title: {
          text: 'CPU使用情况',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: [] // 初始化为空，将在 updateChartData 中更新
        },
        series: [
          {
            name: 'CPU',
            type: 'pie',
            radius: ['0%', '50%'], // 设置内外半径，形成环形图
            label: {
              formatter: function(params) {
                return `${params.name}: ${params.value}%\n`
              },
              position: 'outside'
            },
            labelLine: {
              length: 10,
              length2: 10
            },
            data: [] // 数据将通过 updateChartData 更新
          }
        ]
      }
    }
  },
  watch: {
    cpuInfo: {
      deep: true,
      handler(newVal, oldVal) {
        if (isEqual(newVal, oldVal)) {
          return
        }
        // 当basePath变化时，调用parsePath方法
        this.updateChartData(newVal)
      }
    }
  },

  methods: {
    updateChartData(cpuInfo) {
      // 获取磁盘信息
      // 更新磁盘数据变量
      const usagePercent = (cpuInfo.usage_percent).toFixed(2)
      const idlePercent = (100 - usagePercent).toFixed(2)

      // 更新图表数据
      this.chartOptions.series[0].data = [
        { value: usagePercent, name: '使用率' },
        { value: idlePercent, name: '空闲' }
      ]

      // 确保图例数据与系列数据一致
      this.chartOptions.legend.data = ['使用率', '空闲']

      // 更新图形文本
      // this.chartOptions.graphic[0].children[0].style.text = `总数量\n${100}`
    }

  }
}
</script>

