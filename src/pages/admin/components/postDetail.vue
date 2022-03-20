<template>
  <div>
    <div style="position: relative">
      <div style="position: absolute;left: 0">
        <v-icon>mdi-less-than</v-icon>
        <router-link to="/postList">返回</router-link>
      </div>
    </div>

    <div style="width: 1000px;margin: 0 auto;">
      <div class="py-6" style="font-size: 18px;font-weight: bold">
        {{ postDetail.title }}
      </div>
      <div class="pb-6" style="font-weight: bold;color: #8a8a8a;">
        作者：{{ postDetail.tbUser.username }}
      </div>
      <div v-if="postDetail.postPicture.length !== 0" style="width: 600px;margin: 0 auto;">
        <el-carousel indicator-position="outside" height="400px">
          <el-carousel-item v-for="item in postDetail.postPicture" :key="item.ppid">
            <img width="100%" height="100%" :src="item.url" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="pb-6" style="width: 500px;text-align:left;margin: 0 auto;line-height: 48px">
        {{ postDetail.content }}
      </div>
      <div class="pb-6" style="color: #8a8a8a;font-size: 14px;width: 500px;text-align:left;margin: 0 auto;">
        发布时间：{{ postDetail.time }}
      </div>
    </div>
  </div>
</template>

<script>
import API from '../../../js/api'
export default {
  name: 'postDetail',
  data () {
    return {
      // 帖子ID
      postId: null,
      // 帖子详情
      postDetail: {
        title: null,
        tbUser: {username: null},
        postPicture: [],
        content: null,
        time: null
      }
    }
  },
  methods: {
    // 通过postId获取帖子详情
    async getPostDetail () {
      if (this.postId === null) {
        this.$message.error('请传帖子ID')
        return
      }
      let [err, res] = await API.postList.getPostDetail({
        id: this.postId
      })
      if (err || res.code !== '200') {
        this.$message.error('未获取帖子信息')
        return
      }
      if (!res.data) {
        return
      }
      this.postDetail = res.data
      console.log(res.data)
    }
  },
  created () {
    this.postId = this.$route.query.id
  },
  mounted () {
    this.getPostDetail()
  }
}
</script>

<style>
.v-icon.v-icon {
  font-size: 22px;
}
a {
  text-decoration:none;
  color: #333333;
}
</style>

<style scoped>
.v-application a {
  color: #333;
}
</style>
