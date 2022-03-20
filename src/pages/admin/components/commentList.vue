<template>
  <div>
    <v-subheader>
      <v-spacer />
      <div style="width: 300px">
        <el-input
          @keydown.enter.native="search"
          placeholder="请输入搜索的评论内容"
          v-model="searchInput">
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
        :data="commentList"
        :height="wrapHeight - 191 + 'px'"
        row-key="id"
        :row-style="insertRowStyle"
        :cell-class-name="insertCellClassName"
        ref="table"
      >
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
            <!-- 评论内容超出长度处理-->
            <div v-if="item.value === 'commentMessage'">
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
            <!-- 除了帖子标题、内容和操作列的显示 -->
            <span
              v-if="item.value !== 'operate' && item.value !== 'commentMessage'"
            >{{scope.row[item.value]}}</span>
            <!-- 操作列处理 -->
            <div v-if="item.value === 'operate'">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn
                    icon x-small v-on="on" v-bind="attrs"
                    style="border: 0.1px solid #FE9A5E; color: #FE9A5E; margin: 0 36px; padding: 12px"
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
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="max"
        :current-page="pagination[favorite].page"
        layout="prev, pager, next"
        :total="pagination[favorite].size">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import API from '../../../js/api'
export default {
  name: 'commentList',
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
      this.getCommentList()
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
        {label: '内容', value: 'commentMessage', width: 520, fixed: null},
        {label: '发布时间', value: 'commentReleaseTime', width: 160, fixed: null},
        {label: '作者', value: 'commentAuthor', width: 140, fixed: null},
        {label: '操作', value: 'operate', width: 120, fixed: 'right'}
      ],
      commentList: [],
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
      // 搜索内容
      searchInput: ''
    }
  },
  methods: {
    async getCommentList () {
      this.$nextTick(() => {
        // 解决表格错位
        this.$refs.table.doLayout()
      })
      let params = {
        start: this.pagination[this.favorite].page - 1,
        size: this.max
      }
      let [err, res] = await API.commentList.getCommentList(params)
      if (err || res.code !== '200') {
        this.$message.error('未获取评论信息')
        return
      }
      if (!res.data) {
        return
      }
      this.commentList = []
      res.data.forEach((item, index) => {
        Object.assign(item, {
          id: index,
          serialNumber: this.serialNo + (index + 1),
          commentMessage: item.message,
          commentReleaseTime: item.time,
          commentAuthor: item.tbUser.username,
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
      this.commentList = res.data
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
      let [err, res] = await API.commentList.searchCommentList(params)
      if (err || res.code !== '200') {
        this.$message.error('未获取评论信息')
        return
      }
      if (!res.data) {
        return
      }
      this.commentList = []
      res.data.forEach((item, index) => {
        Object.assign(item, {
          id: index,
          serialNumber: this.serialNo + (index + 1),
          commentMessage: item.message,
          commentReleaseTime: item.time,
          commentAuthor: item.tbUser.username,
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
      this.commentList = res.data
      Object.assign(this.pagination[this.favorite], {
        size: res.count
      })
    },
    // 评论删除确认
    singleDeleteConfirm (item) {
      this.$confirm('确认删除此评论?该评论删除，其下的回复也会删除哦~', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定的操作(调用接口)
        this.singleDelete(item)
      }).catch(() => {
        // 取消
      })
    },
    // 评论单删
    async singleDelete (item) {
      let err
      let res
      if (item.distinguish === 0) {
        [err, res] = await API.commentList.deleteComment(item.cid)
      } else if (item.distinguish === 1) {
        [err, res] = await API.commentList.deleteReply(item.cid)
      }
      if (err || res.code !== '200') {
        this.$message.error('评论删除失败')
        return
      }
      this.$message.success(res.msg)
      await this.getCommentList()
    },
    // 分页，页数改变，重新搜索
    handleCurrentChange (item) {
      this.pagination[this.favorite].page = item
      if (this.favorite === 0) {
        this.getCommentList()
      }
      if (this.favorite === 1) {
        this.search()
      }
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
    this.getCommentList()
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
