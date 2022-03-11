<template>
  <div>

    <!-- Table -->
    <div
      class="mt-3 white px-4 pt-4 brat-elevation"
      :style="{height: wrapHeight - 140 + 'px'}"
    >
      <el-table
        id="postTable"
        style="width: 100%"
        :data="systemInfoList"
        :height="wrapHeight - 191 + 'px'"
        row-key="id"
        :row-style="insertRowStyle"
        :cell-class-name="insertCellClassName"
        ref="table"
      >
        <el-table-column
          type="selection"
          width="50"
          :reserve-selection="true"
        >
        </el-table-column>
        <el-table-column
          id="table1"
          v-for="item in headers"
          :key="item.label"
          :prop="item.value"
          :label="item.label"
          :min-width="item.width"
          :fixed="item.fixed"
        >
          <template slot="header" slot-scope="scope">
            <div v-if="item.value !== 'operate'">
              {{item.label}}
            </div>
            <div v-if="item.value === 'operate'" style="margin: 0 36px">
              {{item.label}}
            </div>
          </template>
          <template slot-scope="scope">
            <!-- 系统消息标题超出长度处理-->
            <div v-if="item.value === 'systemTitle'">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <div
                    style="max-width: 480px"
                    class="ellipsisText_1"
                    v-on="on"
                    v-bind="attrs"
                  >
                    {{ scope.row[item.value] }}
                  </div>
                </template>
                <span style="max-width: 450px">{{ scope.row[item.value] }}</span>
              </v-tooltip>
            </div>
            <!-- 系统消息内容超出长度处理-->
            <div v-if="item.value === 'systemContent'">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <div
                    style="max-width: 480px"
                    class="ellipsisText_1"
                    v-on="on"
                    v-bind="attrs"
                  >
                    {{ scope.row[item.value] }}
                  </div>
                </template>
                <span style="max-width: 450px">{{ scope.row[item.value] }}</span>
              </v-tooltip>
            </div>
            <!-- 除了系统消息标题、内容和操作列的显示 -->
            <span
              v-if="item.value !== 'operate' && item.value !== 'systemContent'"
            >{{scope.row[item.value]}}</span>
            <!-- 操作列处理 -->
            <div v-if="item.value === 'operate'">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn
                    icon x-small v-on="on" v-bind="attrs"
                    style="border: 0.1px solid #FE9A5E; color: #FE9A5E;margin: 0 10px; padding: 12px"
                  >
                    <v-icon size="18" @click.stop="viewDetail(scope.row)">mdi-file-search-outline</v-icon>
                  </v-btn>
                </template>
                <span>查看</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn
                    icon x-small v-on="on" v-bind="attrs"
                    style="border: 0.1px solid #FE9A5E; color: #FE9A5E;margin: 0 10px; padding: 12px"
                  >
                    <v-icon size="18" @click.stop="viewDetail(scope.row)">mdi-file-search-outline</v-icon>
                  </v-btn>
                </template>
                <span>修改</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn
                    icon x-small v-on="on" v-bind="attrs"
                    style="border: 0.1px solid #FE9A5E; color: #FE9A5E; margin: 0 10px; padding: 12px"
                  >
                    <v-icon size="16" @click.stop="singleDelete(scope.row)">mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>删除</span>
              </v-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="max"
        layout="prev, pager, next"
        :total="pagination[favorite].size">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import API from '../../../js/api'

export default {
  name: 'systemInformationList',
  props: {
    wrapHeight: {
      type: Number,
      default: 0
    },
    wrapWidth: {
      type: Number,
      default: 0
    }
  },
  computed: {
    serialNo () {
      return (this.pagination[this.favorite].page - 1) * 10
    }
  },
  data () {
    return {
      headers: [
        {label: '序号', value: 'serialNumber', width: 50, fixed: 'left'},
        {label: '标题', value: 'systemTitle', width: 140, fixed: null},
        {label: '内容', value: 'systemContent', width: 520, fixed: null},
        {label: '发布时间', value: 'systemReleaseTime', width: 160, fixed: null},
        {label: '操作', value: 'operate', width: 120, fixed: 'right'}
      ],
      systemInfoList: [],
      // 每一页最多有多少条信息
      max: 10,
      // 总评论数
      total: 0,
      // 判断是否跳转到其他地方，0为全部查看，1为搜索
      favorite: 0,
      // 分页
      pagination: [{page: 1, pages: 0, size: 0},
        {page: 1, pages: 0, size: 0}
      ]
    }
  },
  methods: {
    async getSystemInfoList () {
      this.$nextTick(() => {
        // 解决表格错位
        if (this.$refs.table) this.$refs.table.doLayout()
      })
      let params = {
        start: this.pagination[this.favorite].page - 1,
        size: this.max
      }
      let [err, res] = await API.systemInfoList.getSystemInfoList(params)
      if (err || res.code !== '200') {
        this.$message.error('未获取系统信息')
        return
      }
      if (!res.data) {
        return
      }
      this.systemInfoList = []
      res.data.forEach((item, index) => {
        Object.assign(item, {
          id: item.sysid,
          serialNumber: this.serialNo + (index + 1),
          systemTitle: item.title,
          systemContent: item.content,
          systemReleaseTime: item.time,
          isBgc: false,
          operate: {
            isDelete: 1
          }
        })
        // 判断是否是偶数行添加斑马色
        if (index % 2 !== 0) {
          item.isBgc = !item.isBgc
        }
      })

      this.systemInfoList = res.data
      Object.assign(this.pagination[this.favorite], {
        size: res.count
      })
    },
    // 查看系统消息详情
    viewDetail (item) {
      console.log(item)
    },
    // 系统消息单删
    singleDelete (item) {
      console.log(item)
    },
    // 分页，页数改变，重新搜索
    handleCurrentChange (item) {
      this.pagination[this.favorite].page = item
      this.getSystemInfoList()
    },
    insertRowStyle ({row, rowIndex}) {
      let params = {
        height: '42px',
        border: 'none !important'
      }
      if (row.operate.toTop) {
        params['background-color'] = '#E8F4FE'
      } else if (row.isBgc) {
        params['background-color'] = '#f8fbfd'
      }
      return params
    },
    insertCellClassName () {
      return 'py-0'
    }
  },
  mounted () {
    this.getSystemInfoList()
  }
}
</script>

<style>
.v-application ol, .v-application ul {
  padding-left: 0px;
}
</style>
<style scoped>

</style>
