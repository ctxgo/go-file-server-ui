<template>
  <div style="width: 100%; height: 100%;">
    <v-chart :option="chartOptions" style="width: 100%; height: 100%;" autoresize />
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import VChart from '@/components/Charts/VChart'
import { formatBytes } from '@/utils/format'

export default {
  components: {
    VChart
  },
  props: {
    diskInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        title: {
          text: '磁盘使用情况',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return `${params.name}: ${params.data.formattedValue} (${params.percent}%)`
          }
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: [] // 初始化为空，将在 updateChartData 中更新
        },
        series: [
          {
            name: '磁盘使用情况',
            type: 'pie',
            radius: ['25%', '50%'], // 设置内外半径，形成环形图
            label: {
              formatter: function(params) {
                return `${params.name}: ${Math.round(params.percent)}%\n(${params.data.formattedValue})`
              },
              position: 'outside'
            },
            labelLine: {
              length: 10,
              length2: 10
            },
            data: [] // 数据将通过 updateChartData 更新
          }
        ],
        graphic: [
          {
            type: 'group',
            left: 'center',
            top: 'center',
            children: [
              {
                type: 'text',
                left: 'center',
                top: 'center',
                style: {
                  text: 'asda', // 文本将在 updateChartData 中更新
                  textAlign: 'center',
                  fill: '#000',
                  fontSize: 14,
                  fontWeight: 'bold'
                }
              }
            ]
          }
        ]
      }
    }
  },
  watch: {
    diskInfo: {
      deep: true,
      handler(newVal, oldVal) {
        if (isEqual(newVal, oldVal)) {
          return
        }
        this.updateChartData(newVal)
      }
    }
  },
  methods: {
    updateChartData(diskInfo) {
      // 获取磁盘信息
      const usedFormatted = formatBytes(diskInfo.used_size)
      const freeFormatted = formatBytes(diskInfo.free_size)
      const totalFormatted = formatBytes(diskInfo.total_size)

      // 更新图表数据

      this.chartOptions.series[0].data = [
        { value: diskInfo.used_size, name: '已使用', formattedValue: usedFormatted },
        { value: diskInfo.free_size, name: '剩余', formattedValue: freeFormatted }
      ]

      // 确保图例数据与系列数据一致
      this.chartOptions.legend.data = ['已使用', '剩余']

      // 更新图形文本
      this.chartOptions.graphic[0].children[0].style.text = `总容量\n${totalFormatted}`
    }
  }
}
</script>

