<template>
  <div>
    <div style="height: 500px;width: 900px;margin: 0 auto;">
      <div style="font-size: 18px;font-weight: bold;padding: 10px 0">上传图片</div>
      <el-form
        label-position="right"
        label-width="80px"
        :model="pictureForm"
        ref="pictureForm"
      >
        <el-form-item label="图片标题">
          <el-input v-model="pictureForm.title"></el-input>
        </el-form-item>
        <el-form-item label="图片类型">
          <el-input v-model="pictureForm.type"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleAddChange"
            :auto-upload="false"
            :limit="9"
            ref="upload"
          >
            <i class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">（最多只能上传9张图片）</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('pictureForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('pictureForm')">上传</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      :width="wrapWidth * 0.3 + 'px'"
      :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'uploadPicture',
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
      pictureForm: {
        title: '',
        type: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      fileListAdd: []
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAddChange (file, fileList) {
      this.fileListAdd = fileList
      console.log(fileList)
    },
    // 上传提交表单
    submitForm (formName) {
      if (this[formName].title === '') {
        this.$message.warning('请填写图片标题')
        return
      }
      if (this[formName].type === '') {
        this.$message.warning('请填写图片类型')
        return
      }
      if (this.fileListAdd.length === 0) {
        this.$message.warning('请选取图片')
        return
      }
      let formData = new FormData()
      // 将文件循环放进文件数组
      this.fileListAdd.forEach(file => {
        formData.append('file', file.raw)
      })
      formData.append('title', this.pictureForm.title)
      formData.append('type', this.pictureForm.type)
      axios({
        method: 'post',
        url: 'http://localhost:8888/upPic',
        data: formData
      }).then(res => {
        if (res.data.code !== '200') {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
      setTimeout(() => {
        this.$refs.upload.clearFiles()
        this.$refs['pictureForm'].resetFields()
        this.fileListAdd = []
        this.pictureForm = {}
      }, 500)
    },
    // 重置表单
    resetForm (formName) {
      this[formName] = {}
      // 清空上传的图片
      this.$refs.upload.clearFiles()
      // 清空表单内容
      this.$refs[formName].resetFields()
      this.fileListAdd = []
    }
  }
}
</script>

<style>

</style>
<style scoped>

</style>
