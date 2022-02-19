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
      return that.url('/tbAdmin/getCode?' + (Math.floor(Math.random() * 1000)))
    }
  }
  // this.search = {
  //   getResult (params) {
  //     return that.post('/sys-es/es', params)
  //   }
  // }
  //
  // this.kgMark = {
  //   getNodeRelation (params) {
  //     return that.get(`/sys-admin/kgMark/searchNodeRelation/${params}`)
  //   }
  // }
  //
  // this.questions = {
  //   getAnswers (params) {
  //     return that.get(`/sys-admin/rest/appleyk/question/query?question=${params}`)
  //   }
  // }
}

export default new API()
