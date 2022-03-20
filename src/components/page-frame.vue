<template>
  <v-app>
    <!-- 页面框架 -->
    <el-container>
      <el-header>
        <v-subheader class="my-2 mr-12">
          <v-spacer />
          <el-avatar size="large" :src="adminInfo.picUrl"></el-avatar>
          <div class="mx-4">
            <el-dropdown>
              <span style="color: #ffffff;font-size: 18px">
                {{adminInfo.username}}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="modifyInfo" icon="el-icon-edit-outline">修改信息</el-dropdown-item>
                <el-dropdown-item @click.native="modifyPW" icon="el-icon-edit">修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="logOut" icon="el-icon-switch-button">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </v-subheader>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            @select="handleSelect"
            unique-opened
            :default-active="$route.path"
            router
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item v-for="item in menuItem" :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
            <el-submenu v-for="item in menuItemGroup" :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group v-for="items in item.submenu" :key="items.index">
                <el-menu-item :index="items.index">{{items.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view
            ref="route"
            @change="onRouterChange($event)"
            :wrapWidth="wrapWidth"
            :wrapHeight="wrapHeight"
          ></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 修改管理员消息对话框 -->
    <el-dialog
      title="管理员信息修改"
      :visible.sync="dialogAlter"
      :width="wrapWidth * 0.4 + 'px'"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        label-position="right"
        label-width="120px"
        :model="adminInfo"
        ref="adminInfoForm"
      >
        <el-form-item label="管理员名">
          <el-input
            placeholder="请输入名称"
            v-model="adminInfo.username">
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            placeholder="请输入邮箱"
            v-model="adminInfo.mail">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            placeholder="请输入手机号"
            v-model="adminInfo.tel">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="commitChange">修 改</el-button>
        </span>
    </el-dialog>
  </v-app>
</template>

<script>
import API from '../js/api'

export default {
  name: 'page-frame',
  watch: {},
  data () {
    return {
      wrapWidth: 0,
      wrapHeight: 0,
      adminInfo: null,
      menuItem: [
        {index: '/postList', icon: 'el-icon-document', title: '帖子管理', route: 'postList'},
        {index: '/commentList', icon: 'el-icon-s-comment', title: '评论管理', route: 'commentList'},
        {index: '/usersList', icon: 'el-icon-s-custom', title: '用户管理', route: 'usersList'},
        {index: '/statisticalInformation', icon: 'el-icon-s-data', title: '统计信息', route: 'statisticalInformation'}
      ],
      menuItemGroup: [
        {index: '5', icon: 'el-icon-picture', title: '图片管理', submenu: [{index: '/imageList', title: '帖子图片列表', route: 'imageList'}, {index: '/uploadPicture', title: '添加图片', route: 'uploadPicture'}]},
        {index: '6', icon: 'el-icon-s-order', title: '系统信息管理', submenu: [{index: '/systemInformationList', title: '系统信息列表', route: 'systemInformationList'}, {index: '/releaseSystemMessage', title: '发布系统消息', route: 'releaseSystemMessage'}]}
      ],
      // 修改管理员消息的对话框打开标识
      dialogAlter: false
    }
  },
  methods: {
    initPage () {
      setTimeout(() => {
        this.wrapWidth = window.innerWidth - 200
        this.wrapHeight = window.innerHeight - 60
        this.initPage()
      })
    },
    onRouterChange (path) {
      console.log(path)
    },
    // 导航栏菜单选择，进行局部路由跳转
    handleSelect (key) {
      this.$router.push(key).catch(err => err)
    },
    // 管理员修改登录密码
    modifyPW () {

    },
    // 管理员修改信息
    modifyInfo () {
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
    // 取消修改
    cancelForm () {
      this.dialogAlter = false
    },
    // 注销
    logOut () {
      localStorage.clear()
      location.href = 'login.html'
    }
  },
  mounted () {
    this.initPage()
  },
  created () {
    this.adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
  }
}
</script>

<style scoped>
.el-header {
  /*background-color: #FE9A5E;*/
  background-color: #545C64;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545C64;
  color: #fff;
  text-align: center;
  line-height: 200px;
}
.v-application ol, .v-application ul {
   padding-left: 0px;
}
.el-submenu .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 45px;
  min-width: 0;
}
.el-main {
  color: #333;
  text-align: center;
}
</style>
