<template>
  <div>
    <v-subheader>
      <v-spacer />
      <!-- 搜索框 -->
      <div style="width: 400px">
        <el-input
          placeholder="请输入搜索内容"
          v-model="searchInput"
          @keydown.enter.native="search"
        >
          <el-select style="width: 100px" v-model="searchSelect" slot="prepend" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </v-subheader>

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
        @selection-change="handleSelectionChange"
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
            <div v-if="item.value === 'operate'" style="margin: 0 56px">
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
              v-if="item.value !== 'operate' && item.value !== 'systemContent' && item.value !== 'systemTitle'"
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
                    <v-icon size="18" @click.stop="alter(scope.row)">mdi-clipboard-edit-outline</v-icon>
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
                    <v-icon size="16" @click.stop="singleDeleteConfirm(scope.row)">mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>删除</span>
              </v-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 批量删除按钮 -->
      <el-button
        :disabled="multipleSelection.length === 0"
        class="delete"
        type="primary"
        round
        @click="bulkDelete">批量删除</el-button>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="max"
        layout="prev, pager, next"
        :total="pagination[favorite].size">
      </el-pagination>
      <!-- 查看系统消息对话框 -->
      <el-dialog
        :title="'消息序号：' + systemItem.serialNumber"
        :visible.sync="dialogViewDetail"
        :width="wrapWidth * 0.4 + 'px'"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="padding: 0 10px;">
          <el-row>
            <el-col :span="6">
              <div style="font-weight: bold;font-size:18px;padding-bottom: 10px">消息标题：</div>
            </el-col>
            <el-col :span="18">
              <div style="font-weight: bold;font-size:18px;padding-bottom: 10px">{{systemItem.systemTitle}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div style="padding: 10px 0;">消息内容：</div>
            </el-col>
            <el-col :span="18">
              <div style="padding: 10px 0">{{systemItem.systemContent}}</div>
            </el-col>
          </el-row>
          <div style="font-size: 12px;color: #8a8a8a;padding-top: 10px;">发布时间：{{systemItem.systemReleaseTime}}</div>
        </div>
      </el-dialog>
      <!-- 修改系统消息对话框 -->
      <el-dialog
        :title="'修改消息，序号：' + systemMsgForm.serialNumber"
        :visible.sync="dialogAlter"
        :width="wrapWidth * 0.4 + 'px'"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          label-position="right"
          label-width="120px"
          :model="systemMsgForm"
          ref="systemMsgForm"
        >
          <el-form-item label="系统消息标题">
            <el-input
              placeholder="请输入消息标题"
              :maxlength="50"
              :show-word-limit="true"
              v-model="systemMsgForm.title"></el-input>
          </el-form-item>
          <el-form-item label="系统消息内容">
            <el-input
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 12}"
              :maxlength="255"
              :show-word-limit="true"
              placeholder="请输入消息内容"
              v-model="systemMsgForm.content"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="commitChange">修 改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import API from '../../../js/api'
import axios from 'axios'
import qs from 'qs'

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
  watch: {
    searchInput (val) {
      if (val.trim()) {
        this.favorite = 1
        this.pagination[this.favorite].page = 1
        this.search()
        return
      }
      this.favorite = 0
      this.pagination[this.favorite].page = 1
      this.getSystemInfoList()
    }
  },
  data () {
    return {
      headers: [
        {label: '序号', value: 'serialNumber', width: 50, fixed: 'left'},
        {label: '标题', value: 'systemTitle', width: 140, fixed: null},
        {label: '内容', value: 'systemContent', width: 520, fixed: null},
        {label: '发布时间', value: 'systemReleaseTime', width: 160, fixed: null},
        {label: '操作', value: 'operate', width: 180, fixed: 'right'}
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
      ],
      // 查看系统消息的对话框打开标识
      dialogViewDetail: false,
      // 修改系统消息的对话框打开标识
      dialogAlter: false,
      systemItem: {},
      systemMsgForm: {},
      // 多选数组
      multipleSelection: [],
      searchInput: '',
      // 搜索选择默认为1（标题）
      searchSelect: '标题',
      options: [{label: '标题', value: 1, name: 'title'},
        {label: '内容', value: 2, name: 'content'}
      ]
    }
  },
  methods: {
    async getSystemInfoList () {
      this.$nextTick(() => {
        // 解决表格错位
        this.$refs.table.doLayout()
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
    async search () {
      this.$nextTick(() => {
        // 解决表格错位
        this.$refs.table.doLayout()
      })
      let params = {
        start: this.pagination[this.favorite].page - 1,
        size: this.max,
        search: this.searchInput.trim()
      }
      if (this.searchSelect === '标题') {
        Object.assign(params, {
          range: 'title'
        })
      } else {
        this.options.forEach(item => {
          if (item.value === this.searchSelect) {
            Object.assign(params, {
              range: item.name
            })
          }
        })
      }
      let [err, res] = await API.systemInfoList.searchSystemInfoList(params)
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
      this.systemItem = item
      this.dialogViewDetail = true
    },
    // 系统消息修改弹窗弹出
    alter (item) {
      this.systemMsgForm = item
      this.dialogAlter = true
    },
    // 提交修改
    async commitChange () {
      let params = {
        sysid: this.systemMsgForm.id,
        title: this.systemMsgForm.title,
        content: this.systemMsgForm.content
      }
      let [err, res] = await API.systemInfoList.modifySystemInfo(params)
      if (err || res.code !== '200') {
        this.$message.error('系统消息修改失败')
        return
      }
      this.$message.success(res.msg)
      this.cancelForm()
      await this.getSystemInfoList()
    },
    // 取消修改，清空
    cancelForm () {
      this.dialogAlter = false
      setTimeout(() => {
        this.systemMsgForm = {}
      }, 500)
    },
    // 系统消息单删确认
    singleDeleteConfirm (item) {
      this.$confirm('确认删除此系统消息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定的操作(调用接口)
        let ids = []
        ids.push(item.id)
        this.deleteSystemMessage(ids)
      }).catch(() => {
        // 取消
      })
    },
    // 批量删除
    bulkDelete () {
      let ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      this.$confirm('确认删除此系统消息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定的操作(调用接口)
        this.deleteSystemMessage(ids)
      }).catch(() => {
        // 取消
      })
    },
    // 系统消息删除
    async deleteSystemMessage (ids) {
      axios.delete('http://localhost:8888/tbSystemmessages/deleteSystemInfo', {
        params: {
          ids: ids
        },
        paramsSerializer: params => {
          return qs.stringify(params, {indices: false})
        }
      }).then(res => {
        if (res.data.code !== '200') {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.msg)
          this.getSystemInfoList()
          this.$refs.table.clearSelection()
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 分页，页数改变，重新搜索
    handleCurrentChange (item) {
      this.pagination[this.favorite].page = item
      this.getSystemInfoList()
    },
    // 表格多选改变
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    insertRowStyle ({row, rowIndex}) {
      let params = {
        height: '42px',
        border: 'none !important'
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
.delete {
  padding: 6px 20px;
  position: absolute;
  left: 15%;
  margin-top: 3px;
}
</style>
