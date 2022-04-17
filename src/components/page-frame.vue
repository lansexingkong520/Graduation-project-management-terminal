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

    <!-- 修改管理员信息对话框 -->
    <el-dialog
      title="管理员信息修改"
      :visible.sync="dialogAlterInfo"
      :width="wrapWidth * 0.4 + 'px'"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div style="width: 100px;margin: auto" class="pb-4">
        <el-upload
          action="#"
          :show-file-list="false"
          :on-change="handleAddChange"
          :auto-upload="false">
          <img width="100" height="100" :src="(imageUrl !== null && imageUrl !== '') ? imageUrl : adminInfo.picUrl" class="avatar" style="border-radius: 50%">
        </el-upload>
      </div>
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
          <el-button @click="cancelFormInfo">取 消</el-button>
          <el-button type="primary" @click="commitChange">修 改</el-button>
        </span>
    </el-dialog>
    <!-- 修改管理员密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogAlterSecretCode"
      :width="wrapWidth * 0.4 + 'px'"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        label-position="right"
        label-width="120px"
        ref="adminInfoForm"
      >
        <el-form-item label="密  码">
          <el-input
            placeholder="请输入密码"
            v-model="password">
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            placeholder="请输入确认密码"
            v-model="configPW">
          </el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <div class="d-flex justify-space-between">
            <el-input
              placeholder="请输入验证码"
              v-model="verificationCode">
            </el-input>
            <el-button class="ml-4" type="primary" @click="getVerificationCode">获取验证码</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFormSecretCode">取 消</el-button>
          <el-button type="primary" @click="passwordChange">修 改</el-button>
        </span>
    </el-dialog>
  </v-app>
</template>

<script>
import API from '../js/api'
import axios from 'axios'

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
      // 修改管理员信息的对话框打开标识
      dialogAlterInfo: false,
      // 修改管理员密码的对话框打开标识
      dialogAlterSecretCode: false,
      // 修改密码
      password: '',
      // 确认密码
      configPW: '',
      // 修改密码验证码
      verificationCode: '',
      // 图片地址
      imageUrl: '',
      // 图片文件
      picFile: null,
      // 头像修改了返回的图片id
      modifyPicId: null
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
      this.dialogAlterSecretCode = true
    },
    // 管理员修改信息
    modifyInfo () {
      this.dialogAlterInfo = true
    },
    // 发送修改密码验证码
    async getVerificationCode () {
      let params = {mail: this.adminInfo.mail}
      let [err, res] = await API.admin.getVerificationCode(params)
      if (err || res.code !== '200') {
        this.$message.error('修改密码验证码发送失败')
      }
    },
    // 密码修改
    async passwordChange () {
      if (this.password === null || this.password === '') {
        this.$message.warning('密码不能为空！')
        return
      }
      if (this.password !== this.configPW) {
        this.$message.warning('密码和确认密码不一致！')
        return
      }
      if (this.verificationCode === null || this.verificationCode === '') {
        this.$message.warning('验证码不能为空！')
        return
      }
      let params = {
        adid: this.adminInfo.adid,
        password: this.password,
        captcha: this.verificationCode
      }
      let [err, res] = await API.admin.modifyPW(params)
      if (err || res.code !== '200') {
        this.$message.error('管理员修改密码失败')
        return
      }
      this.$message.success(res.msg)
      this.cancelFormSecretCode()
    },
    // 获取管理员上传的头像
    handleAddChange (file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.picFile = file
    },
    // 提交修改
    async commitChange () {
      if (this.picFile !== null) {
        let formData = new FormData()
        // 将文件放进去
        formData.append('file', this.picFile.raw)
        axios({
          method: 'post',
          url: 'http://localhost:8888/upHeadFile',
          data: formData
        }).then(res => {
          console.log(res)
          if (res.data.code !== '200') {
            this.$message.error(res.data.msg)
          }
          this.modifyPicId = res.data.data.picid
          this.adminInfo.picUrl = res.data.data.url
          this.modify()
        }).catch(err => {
          this.$message.error(err)
        })
      } else {
        await this.modify()
      }
    },
    // 管理员普通信息的修改
    async modify () {
      let params = {
        adid: this.adminInfo.adid,
        username: this.adminInfo.username,
        mail: this.adminInfo.mail,
        tel: this.adminInfo.tel
      }
      if (this.modifyPicId !== null) {
        Object.assign(params, {
          picaid: this.modifyPicId
        })
      }
      let [err, res] = await API.admin.modifyAdminInfo(params)
      if (err || res.code !== '200') {
        this.$message.error('管理员信息修改失败')
        return
      }
      this.$message.success(res.msg)
      localStorage.setItem('adminInfo', JSON.stringify(res.data))
      this.cancelFormInfo()
    },
    // 取消修改管理员信息
    cancelFormInfo () {
      this.dialogAlterInfo = false
      this.imageUrl = null
      this.picFile = null
      this.modifyPicId = null
    },
    // 取消修改管理员密码
    cancelFormSecretCode () {
      this.dialogAlterSecretCode = false
      this.password = ''
      this.configPW = ''
      this.verificationCode = ''
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
