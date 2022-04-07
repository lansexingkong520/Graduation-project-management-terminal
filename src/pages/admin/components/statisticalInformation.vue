<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="others">
        <!-- 帖子收藏柱状图 查看收藏量最多的9个帖或8个-->
          <div class="px-3" style="width: 100%; height: 300px" id="histogram1"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="others">
          <!-- 用户关注柱状图 查看被关注最多的9个用户或8个-->
          <div class="px-3" style="width: 100%; height: 300px" id="histogram2"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="others">
          <!-- 用户注册折线图-->
          <div>
            <el-date-picker
              v-model="value1"
              @change="timePicker1"
              type="daterange"
              size="mini"
              style="margin: 5px 0"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="px-3" style="width: 100%; height: 250px" id="line1"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="others">
          <!-- 发帖折线图 -->
          <div>
            <el-date-picker
              v-model="value2"
              @change="timePicker2"
              type="daterange"
              size="mini"
              style="margin: 5px 0"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="px-3" style="width: 100%; height: 250px" id="line2"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '../../../js/api'
const echarts = require('echarts')

export default {
  name: 'statisticalInformation',
  data () {
    return {
      // 柱状图数据
      postCollectionData: [],
      dimensions1: ['postName', 'count', 'postId'],
      barData1: [],
      userAttentionData: [],
      dimensions2: ['username', 'count', 'uId'],
      barData2: [],
      startTime: '',
      endTime: '',
      // 第一个时间选择器
      value1: '',
      // 第二个时间选择器
      value2: '',
      // 折线图数据
      userRegData: [],
      lineData1: [],
      lineDataXAxis1: [],
      postAddData: [],
      lineData2: [],
      lineDataXAxis2: []
    }
  },
  methods: {
    // 帖子收藏最多的9个统计
    async getPostConllectionCount () {
      let [err, res] = await API.dataStatistics.getPostConllection()
      if (err || res.code !== '200') {
        this.$message.error('未获取帖子收藏统计数据')
        return
      }
      if (!res.data) {
        return
      }
      this.postCollectionData = res.data
      if (res.data.length !== 0) {
        res.data.forEach(item => {
          let i = []
          i.push(item.title)
          i.push(item.collectionCount)
          i.push(item.favoritesid)
          this.barData1.push(i)
        })
      }
      this.paintHistogram1()
    },
    paintHistogram1 () {
      this.myChartBar = echarts.init(document.getElementById('histogram1'))
      this.myChartBar.resize()
      // 指定图表的配置项和数据
      let option = {
        dataset: [
          {
            dimensions: this.dimensions1,
            source: this.barData1
          },
          {
            transform: {
              type: 'sort',
              config: { dimension: 'count', order: 'desc' }
            }
          }
        ],
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {},
        grid: {
          left: 40,
          right: 5,
          bottom: 50
        },
        color: ['#188df0A8'],
        title: [
          {
            left: 'center',
            text: '帖子收藏统计柱状图',
            textStyle: {
              color: '#333333',
              fontSize: 14
            }
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        series: {
          type: 'bar',
          encode: { x: 'name', y: 'score' },
          datasetIndex: 1,
          barWidth: 20 // 柱子宽度
        }
      }
      this.myChartBar.setOption(option)
    },
    async getUserAttentionCount () {
      let [err, res] = await API.dataStatistics.getUserAttention()
      if (err || res.code !== '200') {
        this.$message.error('未获取用户关注统计数据')
        return
      }
      if (!res.data) {
        return
      }
      this.userAttentionData = res.data
      if (res.data.length !== 0) {
        res.data.forEach(item => {
          let i = []
          i.push(item.username)
          i.push(item.attentionCount)
          i.push(item.attentionid)
          this.barData2.push(i)
        })
      }
      this.paintHistogram2()
    },
    // 用户关注最高的9个统计
    paintHistogram2 () {
      this.myChartBar = echarts.init(document.getElementById('histogram2'))
      this.myChartBar.resize()
      // 指定图表的配置项和数据
      let option = {
        dataset: [
          {
            dimensions: this.dimensions2,
            source: this.barData2
          },
          {
            transform: {
              type: 'sort',
              config: { dimension: 'count', order: 'desc' }
            }
          }
        ],
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {},
        grid: {
          left: 40,
          right: 5,
          bottom: 50
        },
        color: ['#91cc75'],
        title: [
          {
            left: 'center',
            text: '用户关注统计柱状图',
            textStyle: {
              color: '#333333',
              fontSize: 14
            }
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        series: {
          type: 'bar',
          encode: { x: 'name', y: 'score' },
          datasetIndex: 1,
          barWidth: 20 // 柱子宽度
        }
      }
      this.myChartBar.setOption(option)
    },
    // 第一个日期选择器改变
    timePicker1 () {
      if (this.value1 === null) {
        let date = new Date()
        this.startTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        this.endTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        this.userRegStatistics()
        return
      }
      let date1 = this.value1[0]
      let date2 = this.value1[1]
      this.startTime = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + ' 00:00:00'
      this.endTime = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' 23:59:59'
      this.userRegStatistics()
    },
    // 用户注册统计
    async userRegStatistics () {
      let params = {
        startTime: this.startTime,
        endTime: this.endTime
      }
      let [err, res] = await API.dataStatistics.getUserReg(params)
      if (err || res.code !== '200') {
        this.$message.error('未获取用户注册统计数据')
        return
      }
      if (!res.data) {
        return
      }
      this.userRegData = res.data
      if (res.data.length !== 0) {
        let i = []
        let iAxis = []
        res.data.forEach(item => {
          i.push(item.dayCount)
          iAxis.push(item.dayTime)
        })
        this.lineData1 = i
        this.lineDataXAxis1 = iAxis
      }
      this.paintLine1()
    },
    paintLine1 () {
      this.myChartLine = echarts.init(document.getElementById('line1'))
      this.myChartLine.resize()
      // 指定图表的配置项和数据
      let option = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.lineDataXAxis1,
          axisLabel: {
            color: '#333333'
          }
        },
        yAxis: {},
        visualMap: {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0
        },
        grid: {
          left: 25,
          top: 25,
          right: 25,
          bottom: 25
        },
        title: [
          {
            left: 'center',
            text: '用户注册统计折线图',
            textStyle: {
              color: '#333333',
              fontSize: 14
            }
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        series: [
          {
            data: this.lineData1,
            type: 'line',
            showSymbol: false
          }
        ]
      }
      this.myChartLine.setOption(option)
    },
    // 第一个日期选择器改变
    timePicker2 () {
      if (this.value2 === null) {
        let date = new Date()
        this.startTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        this.endTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        this.postStatistics()
        return
      }
      let date1 = this.value2[0]
      let date2 = this.value2[1]
      this.startTime = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + ' 00:00:00'
      this.endTime = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' 23:59:59'
      this.postStatistics()
    },
    // 发帖数量统计
    async postStatistics () {
      let params = {
        startTime: this.startTime,
        endTime: this.endTime
      }
      let [err, res] = await API.dataStatistics.getAddPost(params)
      if (err || res.code !== '200') {
        this.$message.error('未获取发帖数量统计数据')
        return
      }
      if (!res.data) {
        return
      }
      this.postAddData = res.data
      if (res.data.length !== 0) {
        let i = []
        let iAxis = []
        res.data.forEach(item => {
          i.push(item.dayCount)
          iAxis.push(item.dayTime)
        })
        this.lineData2 = i
        this.lineDataXAxis2 = iAxis
      }
      this.paintLine2()
    },
    paintLine2 () {
      this.myChartLine = echarts.init(document.getElementById('line2'))
      this.myChartLine.resize()
      // 指定图表的配置项和数据
      let option = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.lineDataXAxis2,
          axisLabel: {
            color: '#333333'
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          show: false
        },
        visualMap: {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0
        },
        grid: {
          left: 25,
          top: 25,
          right: 25,
          bottom: 25
        },
        title: [
          {
            left: 'center',
            text: '帖子新增统计折线图',
            textStyle: {
              color: '#333333',
              fontSize: 14
            }
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        series: [
          {
            data: this.lineData2,
            type: 'line',
            areaStyle: {
              // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(254,154,94,1)'
              }, {
                offset: 0.5,
                color: 'rgba(254,154,94,0.50)'
              }, {
                offset: 1,
                // color: 'rgba(38,197,254,0.00)'
                color: 'rgba(254,154,94,0.00)'
              }])
            },
            label: {
              show: true, // 开启显示
              position: 'top', // 在上方显示
              color: '#FE9A5E',
              fontSize: 11
            },
            lineStyle: {
              color: '#FE9A5E'
            }
          }
        ]
      }
      this.myChartLine.setOption(option)
    },
    init () {
      let date = new Date()
      this.startTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.endTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.getPostConllectionCount()
      this.getUserAttentionCount()
      this.userRegStatistics()
      this.postStatistics()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
.others {
  height: 300px;
  border: 1px solid #eeeeee;
  border-radius: 4px;
}
</style>
<style scoped>
.el-row {
  margin-bottom: 10px;
}
.el-row :last-child{
  margin-bottom: 0;
}
</style>
