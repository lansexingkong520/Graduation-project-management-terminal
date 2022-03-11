<template>
  <div>
    <div style="height: 500px;width: 600px;margin: 0 auto;">
      <div style="font-size: 18px;font-weight: bold;padding: 10px 0">发布系统消息</div>
      <el-form
        label-position="right"
        label-width="120px"
        :model="systemMsgForm"
        ref="systemMsgForm"
      >
        <el-form-item label="系统消息标题">
          <el-input
            placeholder="请输入消息标题"
            :maxlength="50"
            :show-word-limit="true"
            v-model="systemMsgForm.title"></el-input>
        </el-form-item>
        <el-form-item label="系统消息内容">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 12}"
            :maxlength="255"
            :show-word-limit="true"
            placeholder="请输入消息内容"
            v-model="systemMsgForm.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('systemMsgForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('systemMsgForm')">发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import API from '../../../js/api'

export default {
  name: 'releaseSystemMessage',
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
  data () {
    return {
      systemMsgForm: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    // 上传提交表单
    submitForm (formName) {
      if (this[formName].title === '' || this[formName].title === null) {
        this.$message.warning('请填写系统消息标题')
        return
      }
      if (this[formName].content === '' || this[formName].content === null) {
        this.$message.warning('请填写系统消息标题')
        return
      }
      let params = {
        title: this.systemMsgForm.title,
        content: this.systemMsgForm.content
      }
      let [err, res] = API.systemInfoList.addSystemInfo(params)
      console.log(res)
      if (err || res.code !== '200') {
        this.$message.error('系统消息发布失败')
        return
      }
      this[formName] = {}
      // 清空表单内容
      this.$refs[formName].resetFields()
    },
    // 重置表单
    resetForm (formName) {
      this[formName] = {}
      // 清空表单内容
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
