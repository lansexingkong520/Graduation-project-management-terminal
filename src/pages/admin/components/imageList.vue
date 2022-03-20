<template>
  <div>
    <v-subheader>
      <v-spacer />
      <div style="width: 400px">
        <el-input
          placeholder="请输入搜索内容"
          v-model="searchInput"
          size="small"
          @keydown.enter.native="search"
        >
          <el-select style="width: 150px" v-model="searchSelect" slot="prepend" placeholder="请选择">
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

    <el-row v-for="(items, indexs) in imgList" :key="indexs">
      <el-col :span="6" v-for="(item, index) in items" :key="index">
        <v-hover v-slot="{ hover }">
          <div @click="viewDetail(item)" style="margin:0 5px;" :style="{height: wrapHeight * 0.265 + 'px', width: wrapWidth * 0.23 + 'px'}">
            <v-card
              style="transition: all 0.8s"
              :style="{
                transform: `scale(${hover ? '1.05' : '1.0'})`,
                 'box-shadow': `0 2px 12px 0 rgba(0, 0, 0, ${hover ? 0.08 : 0}) !important`
                }"
            >
              <img :style="{height: wrapHeight * 0.265 + 'px', width: wrapWidth * 0.23 + 'px'}" :src="item.imgURL">
            </v-card>
          </div>
        </v-hover>
      </el-col>
    </el-row>
    <el-pagination
      id="page"
      @current-change="handleCurrentChange"
      :current-page="pagination[favorite].page"
      :page-size="max"
      layout="prev, pager, next"
      :total="pagination[favorite].size">
    </el-pagination>
    <el-dialog
      :title="'图片序号：' + imgItem.serialNumber"
      :visible.sync="dialogVisible"
      :width="wrapWidth * 0.3 + 'px'"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-card :body-style="{ padding: '0px' }"  shadow="never">
        <img width="100%" height="100%" :src="imgItem.imgURL">
        <div style="padding: 10px;">
          <div>图片ID：{{imgItem.id}}</div>
          <div>图片的帖子ID：{{imgItem.postid}}</div>
          <div>上传图片的用户：{{imgItem.username}}</div>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="singleDelete">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '../../../js/api'

export default {
  name: 'imageList',
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
      return (this.pagination[this.favorite].page - 1) * 12
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
      this.getPostImgList()
    }
  },
  data () {
    return {
      imgList: [],
      // 每一页最多有多少条信息
      max: 12,
      // 总评论数
      total: 0,
      // 判断是否跳转到其他地方，0为全部查看，1为搜索
      favorite: 0,
      // 分页
      pagination: [{page: 1, pages: 0, size: 0},
        {page: 1, pages: 0, size: 0}
      ],
      // 对话框的弹出
      dialogVisible: false,
      // 单个帖子图片的查看
      imgItem: {},
      searchInput: '',
      // 搜索选择默认为1（标题）
      searchSelect: '图片ID',
      options: [{label: '图片ID', value: 1, name: 'postPicId'},
        {label: '图片的帖子ID', value: 2, name: 'postId'},
        {label: '上传图片的用户', value: 3, name: 'username'}
      ]
    }
  },
  methods: {
    async getPostImgList () {
      let params = {
        start: this.pagination[this.favorite].page - 1,
        size: this.max
      }
      let [err, res] = await API.imgList.getPostImgList(params)
      if (err || res.code !== '200') {
        this.$message.error('未获取帖子图片')
        return
      }
      if (!res.data) {
        return
      }
      this.imgList = []
      res.data.forEach((item, index) => {
        Object.assign(item, {
          id: item.picid,
          serialNumber: this.serialNo + (index + 1),
          imgTitle: item.title,
          imgType: item.type,
          imgURL: item.url
        })
      })
      let count = 1
      let list = []
      for (let i = 0; i < res.data.length; i++) {
        list.push(res.data[i])
        if (count % 4 === 0) {
          this.imgList.push(list)
          list = []
        }
        count++
      }
      Object.assign(this.pagination[this.favorite], {
        size: res.count
      })
    },
    async search () {
      let params = {
        start: this.pagination[this.favorite].page - 1,
        size: this.max,
        search: this.searchInput.trim()
      }
      if (this.searchSelect === '图片ID') {
        Object.assign(params, {
          range: 'postPicId'
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
      let [err, res] = await API.imgList.searchPostImgList(params)
      if (err || res.code !== '200') {
        this.$message.error('未获取帖子图片')
        return
      }
      if (!res.data) {
        return
      }
      this.imgList = []
      res.data.forEach((item, index) => {
        Object.assign(item, {
          id: item.picid,
          serialNumber: this.serialNo + (index + 1),
          imgTitle: item.title,
          imgType: item.type,
          imgURL: item.url
        })
      })
      let count = 1
      let list = []
      for (let i = 0; i < res.data.length; i++) {
        list.push(res.data[i])
        if (count % 4 === 0) {
          this.imgList.push(list)
          list = []
        }
        count++
      }
      // 经过测试发现在最后的图片没有满四张，没有加入img数组
      if (list.length !== 0) {
        this.imgList.push(list)
        list = []
      }
      Object.assign(this.pagination[this.favorite], {
        size: res.count
      })
    },
    // 查看帖子图片详情
    viewDetail (item) {
      this.imgItem = item
      this.dialogVisible = true
    },
    // 帖子图片单删
    singleDelete () {
      this.$confirm('确认删除此照片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定的操作(调用接口)
        this.dialogVisible = false

        // 未做完
      }).catch(() => {
        // 取消
      })
    },
    // 分页，页数改变，重新搜索
    handleCurrentChange (item) {
      this.pagination[this.favorite].page = item
      if (this.favorite === 0) {
        this.getPostImgList()
      }
      if (this.favorite === 1) {
        this.search()
      }
    }
  },
  mounted () {
    this.getPostImgList()
  }
}
</script>

<style>
#page .v-application ol, .v-application ul {
  padding-left: 0px;
}
</style>
<style scoped>

.el-row {
  margin-top: 10px;
}
.el-col {
  border-radius: 4px;
}

</style>
