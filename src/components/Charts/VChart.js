// chart.js
import VChart from 'vue-echarts' // 导入VChart组件
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts' // 导入饼图模块
import { TooltipComponent, LegendComponent, TitleComponent, GraphicComponent } from 'echarts/components' // 导入所需组件
import { CanvasRenderer } from 'echarts/renderers' // 导入渲染器

// 注册所需的图表和组件
echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GraphicComponent,
  CanvasRenderer
])

export default VChart
