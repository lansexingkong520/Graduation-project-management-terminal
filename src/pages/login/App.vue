<template>
  <div id="app">
    <v-app style="
      background-image: url(static/assets/loginBG.jpg);
      background-repeat: no-repeat;
      background-size: 100%;"
    >
      <v-card
        ref="form"
        style="width: 400px;opacity: 0.8;position: absolute"
        :style="{left: wrapWidth * 0.57 + 'px', top: wrapHeight * 0.2 + 'px'}"
        class="elevation-0">
        <div style="font-size: 24px;text-align: center;font-weight: bold;margin: 10px auto">欢迎登录</div>
        <!-- 登录框 -->
        <v-card-text>
          <v-text-field
            placeholder="请输入账号"
            ref="name"
            v-model="userName"
            :rules="[rules.required]"
            :error="err"
            rounded
            filled
            dense
            autocomplete="off"
          >
          </v-text-field>
          <v-text-field
            ref="password"
            v-model="password"
            :rules="[rules.passwd]"
            :error="err"
            type="password"
            placeholder="请输入密码"
            rounded
            filled
            dense
          >
          </v-text-field>
          <v-row>
            <v-col
              cols="6"
            >
              <v-text-field
                ref="code"
                v-model="code"
                :rules="[rules.code]"
                :error="err"
                placeholder="请输入验证码"
                rounded
                filled
                dense
                autocomplete="off"
                @keydown.enter="login"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <img
                contain
                :src="codeURL"
                max-width="160"
                max-height="40"
                @click="onclickRefreshCode"
              />
            </v-col>
          </v-row>
          <v-btn
            rounded
            color="info"
            block
            @click="login"
            :loading="btnLoading"
            elevation="0"
          >
            登录
          </v-btn>
        </v-card-text>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import API from '../../js/api'
export default {
  name: 'App',
  data () {
    return {
      wrapHeight: 0,
      wrapWidth: 0,
      userName: '',
      password: '',
      code: '',
      codeURL: '',
      role: 0,
      btnLoading: false,
      err: false,
      rules: {
        required: value => !!value || '请输入账号',
        passwd: value => !!value || '请输入密码',
        code: value => !!value || '请填写验证码'
      }
    }
  },
  methods: {
    // 初始化宽高
    initPage () {
      setTimeout(() => {
        this.wrapWidth = window.innerWidth
        this.wrapHeight = window.innerHeight
        this.initPage()
      })
    },
    // 管理员登录
    async login () {
      if (this.userName === '' || this.password === '' || this.code === '') {
        this.err = true
        return
      }
      this.btnLoading = true
      let params = {
        username: this.userName,
        password: this.password,
        captcha: this.code
      }
      let [err, res] = await API.login.adminLogin(params)
      if (err || res.code !== '200') {
        this.btnLoading = false
        this.$message.error(res.msg)
        this.onclickRefreshCode()
        return
      }
      localStorage.setItem('adminInfo', JSON.stringify(res.data))
      location.href = 'admin.html'
    },
    // 刷新验证码
    onclickRefreshCode () {
      this.codeURL = API.login.getCode()
    }
  },
  created () {
    if (localStorage.getItem('adminInfo')) {
      location.href = 'admin.html'
    }
    this.initPage()
    this.codeURL = API.login.getCode()
  }
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
}
</style>
