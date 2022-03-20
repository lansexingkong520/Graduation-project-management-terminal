<template>
  <div>
    <v-subheader>
      <v-spacer />
      <div style="width: 300px">
        <el-input
          placeholder="请输入搜索的用户名"
          v-model="searchInput"
          @keydown.enter.native="search"
        >
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
        :data="userList"
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
            <!-- 用户个人简介超出长度处理-->
            <div v-if="item.value === 'introduction'">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <div
                    style="max-width: 350px"
                    class="ellipsisText_1"
                    v-on="scope.row[item.value] ? on : null"
                    v-bind="scope.row[item.value] ? attrs : null"
                  >
                    {{ scope.row[item.value] ? scope.row[item.value] : '暂无'}}
                  </div>
                </template>
                <span style="max-width: 300px">{{ scope.row[item.value] }}</span>
              </v-tooltip>
            </div>
            <div v-if="item.value === 'sculpture'">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <img
                    style="height: 30px; max-width: 100px;"
                    v-on="on"
                    v-bind="attrs"
                    :src="scope.row[item.value]">
                </template>
                <v-img style="height: 100px;width: 100px" :src="scope.row[item.value]"></v-img>
              </v-tooltip>
            </div>
            <!-- 除了头像、个人介绍和操作列的显示 -->
            <span
              v-if="item.value !== 'operate' && item.value !== 'introduction' && item.value !== 'sculpture'"
            >{{scope.row[item.value] ? scope.row[item.value] : '无'}}</span>
            <!-- 操作列处理 -->
            <div v-if="item.value === 'operate'">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn
                    icon x-small v-on="on" v-bind="attrs"
                    style="border: 0.1px solid #FE9A5E; color: #FE9A5E; margin: 0 36px; padding: 12px"
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
  name: 'usersList',
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
      this.getUserList()
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
        {label: '用户名', value: 'username', width: 140, fixed: null},
        {label: '头像', value: 'sculpture', width: 100, fixed: null},
        {label: '手机号', value: 'phone', width: 100, fixed: null},
        {label: '性别', value: 'sex', width: 40, fixed: null},
        {label: '个人简介', value: 'introduction', width: 360, fixed: null},
        {label: '操作', value: 'operate', width: 120, fixed: 'right'}
      ],
      userList: [],
      // 每一页最多有多少条信息
      max: 10,
      // 总用户数
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
    async getUserList () {
      this.$nextTick(() => {
        // 解决表格错位
        this.$refs.table.doLayout()
      })
      let params = {
        start: this.pagination[this.favorite].page - 1,
        size: this.max
      }
      let [err, res] = await API.userList.getUserList(params)
      if (err || res.code !== '200') {
        this.$message.error('未获取用户信息')
        return
      }
      if (!res.data) {
        return
      }
      this.userList = []
      // 正则匹配，给显示的手机号打码
      let reg = /(\d{3})\d{4}(\d{4})/
      res.data.forEach((item, index) => {
        Object.assign(item, {
          id: item.uid,
          serialNumber: this.serialNo + (index + 1),
          sculpture: item.picURL,
          phone: item.tel.replace(reg, '$1****$2'),
          introduction: item.selfintroduction,
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
      this.userList = res.data
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
      let [err, res] = await API.userList.searchUserList(params)
      if (err || res.code !== '200') {
        this.$message.error('未获取用户信息')
        return
      }
      if (!res.data) {
        return
      }
      this.userList = []
      // 正则匹配，给显示的手机号打码
      let reg = /(\d{3})\d{4}(\d{4})/
      res.data.forEach((item, index) => {
        Object.assign(item, {
          id: item.uid,
          serialNumber: this.serialNo + (index + 1),
          sculpture: item.picURL,
          phone: item.tel.replace(reg, '$1****$2'),
          introduction: item.selfintroduction,
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
      this.userList = res.data
      Object.assign(this.pagination[this.favorite], {
        size: res.count
      })
    },
    // 用户单删
    singleDelete (item) {
      console.log(item)
      this.$message.warning('此功能暂时不开放')
    },
    // 分页，页数改变，重新搜索
    handleCurrentChange (item) {
      this.pagination[this.favorite].page = item
      if (this.favorite === 0) {
        this.getUserList()
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
    this.getUserList()
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
