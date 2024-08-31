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
    fsInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        title: {
          text: '文件统计',
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
            name: '文件统计',
            type: 'pie',
            radius: ['25%', '50%'], // 设置内外半径，形成环形图
            label: {
              formatter: function(params) {
                return `${params.name}: ${Math.round(params.percent)}%\n(${params.value})`
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
    fsInfo: {
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
    updateChartData(fsInfo) {
      // 获取磁盘信息
      // 更新磁盘数据变量
      const count = fsInfo.count
      const fileCount = fsInfo.file_count
      const dirCount = fsInfo.dir_count

      // 更新图表数据
      this.chartOptions.series[0].data = [
        { value: fileCount, name: '文件数' },
        { value: dirCount, name: '目录数' }
      ]

      // 确保图例数据与系列数据一致
      this.chartOptions.legend.data = ['文件数', '目录数']

      // 更新图形文本
      this.chartOptions.graphic[0].children[0].style.text = `总数量\n${count}`
    }

  }
}
</script>

