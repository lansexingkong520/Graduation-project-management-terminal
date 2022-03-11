<template>
  <v-app>
    <el-container>
      <el-header>Header</el-header>
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
  </v-app>
</template>

<script>
export default {
  name: 'page-frame',
  watch: {},
  data () {
    return {
      wrapWidth: 0,
      wrapHeight: 0,
      menuItem: [
        {index: '/postList', icon: 'el-icon-document', title: '帖子管理', route: 'postList'},
        {index: '/commentList', icon: 'el-icon-s-comment', title: '评论管理', route: 'commentList'},
        {index: '/usersList', icon: 'el-icon-s-custom', title: '用户管理', route: 'usersList'},
        {index: '/statisticalInformation', icon: 'el-icon-s-data', title: '统计信息', route: 'statisticalInformation'}
      ],
      menuItemGroup: [
        {index: '5', icon: 'el-icon-picture', title: '图片管理', submenu: [{index: '/imageList', title: '帖子图片列表', route: 'imageList'}, {index: '/uploadPicture', title: '添加图片', route: 'uploadPicture'}]},
        {index: '6', icon: 'el-icon-s-order', title: '系统信息管理', submenu: [{index: '/systemInformationList', title: '系统信息列表', route: 'systemInformationList'}, {index: '/releaseSystemMessage', title: '发布系统消息', route: 'releaseSystemMessage'}]}
      ]
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
    }
  },
  mounted () {
    this.initPage()
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
