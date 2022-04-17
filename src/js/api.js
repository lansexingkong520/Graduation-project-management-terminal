import axios from 'axios'
import to from 'await-to-js'
import qs from 'qs'

function API () {
  let that = this

  let NODE_ENV = process.env.NODE_ENV === 'development'
  this.prefix = NODE_ENV ? '' : '' // 别忘了加上前缀/sys-admin
  this.url = function (url) {
    // if (url.search('/es') !== -1) {
    //   return (NODE_ENV ? 'http://192.168.8.110:8091' : 'http://127.0.0.1:8091') + url
    // }
    return this.prefix + url
  }

  this.get = function (url, params) {
    return to(new Promise((resolve, reject) => {
      axios.get(this.url(url), {params}).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.response)
      })
    }))
  }

  this.post = function (url, params, headers) {
    params = params || {}
    if (headers === 'urlencoded') {
      params = qs.stringify(params)
    }
    return to(new Promise((resolve, reject) => {
      axios.post(this.url(url), params).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.response)
      })
    }))
  }

  this.put = function (url, params, headers) {
    if (headers === 'urlencoded') {
      params = qs.stringify(params)
    }
    return to(new Promise((resolve, reject) => {
      axios.put(this.url(url), params).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.response)
      })
    }))
  }

  this.delete = function (url, params, headers) {
    return to(new Promise((resolve, reject) => {
      axios.delete(this.url(url), headers === 'body' ? {data: params} : {params}).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.response)
      })
    }))
  }

  this.login = {
    // 登录
    adminLogin (params) {
      return that.post('/tbAdmin/adminLogin', params)
    },
    // 获取验证码
    getCode () {
      return that.url('/getCode?' + (Math.floor(Math.random() * 1000)))
    }
  }

  this.admin = {
    // 获取修改密码的验证码
    getVerificationCode (params) {
      return that.post('/tbAdmin/mailSendCaptcha', params)
    },
    modifyPW (params) {
      return that.post('/tbAdmin/modifyPW', params)
    },
    modifyAdminInfo (params) {
      return that.post('/tbAdmin/modifyAdminInfo', params)
    }
  }

  this.postList = {
    // 查帖子列表
    getPostList (params) {
      return that.get('/tbPost/managementPosts', params)
    },
    // 删除帖子
    deletePost (id) {
      return that.delete(`/tbPost/deletePost/${id}`)
    },
    // 查帖子详情
    getPostDetail (id) {
      return that.get('/tbPost/getPostDetail', id)
    },
    // 搜索
    searchPostList (params) {
      return that.get('/tbPost/searchPostList', params)
    }
  }

  this.commentList = {
    // 查评论列表
    getCommentList (params) {
      return that.get('/tbComment/managementComments', params)
    },
    // 删除用户评论
    deleteComment (id) {
      return that.delete(`/tbComment/deleteComment/${id}`)
    },
    // 删除评论回复
    deleteReply (id) {
      return that.delete(`/tbCommentreply/deleteReply/${id}`)
    },
    // 搜索
    searchCommentList (params) {
      return that.get('/tbComment/searchCommentList', params)
    }
  }

  this.userList = {
    // 查用户列表
    getUserList (params) {
      return that.get('/tbUser/managementUsers', params)
    },
    // 搜索
    searchUserList (params) {
      return that.get('/tbUser/searchUserList', params)
    }
  }

  this.systemInfoList = {
    // 查系统消息列表
    getSystemInfoList (params) {
      return that.get('/tbSystemmessages/managementSystemInfo', params)
    },
    // 添加系统消息
    addSystemInfo (params) {
      return that.post('/tbSystemmessages/addSystemInfo', params)
    },
    // 修改系统消息
    modifySystemInfo (params) {
      return that.post('/tbSystemmessages/modifySystemInfo', params)
    },
    // 搜索
    searchSystemInfoList (params) {
      return that.get('/tbSystemmessages/searchSystemInfoList', params)
    }
  }

  this.imgList = {
    // 查帖子图片列表
    getPostImgList (params) {
      return that.get('/tbPicture/managementPostImg', params)
    },
    // 搜索
    searchPostImgList (params) {
      return that.get('/tbPicture/searchPostImgList', params)
    }
  }

  this.dataStatistics = {
    // 帖子收藏数据
    getPostConllection () {
      return that.get('/postCollection/getPostConllectionCount')
    },
    // 用户关注数据
    getUserAttention () {
      return that.get('/userAttention/getUserAttentionCount')
    },
    // 用户注册数据
    getUserReg (params) {
      return that.get('/tbUser/getUserRegCount', params)
    },
    // 帖子发布数据
    getAddPost (params) {
      return that.get('/tbPost/getAddPostCount', params)
    }
  }
}
export default new API()
