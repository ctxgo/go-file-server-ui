<template>
  <el-upload
    class="upload-demo"
    :action="getUploadApi()"
    :headers="getUploadHeads()"
    drag
    multiple
    :before-upload="onBeforeUpload"
    :limit="1000"
    :on-exceed="handleExceed"
    :on-error="handleUploadErr"
    :on-success="handleUploadSuccess"
  >
    <i class="el-icon-upload" />
    <div class="el-upload__tip" style="position: absolute; top: 1px; width: 100%; text-align: center; font-size: 12px;">文件大小限制10G</div>

    <div class="el-upload__text">
      将文件拖到此处，或<em>点击上传</em>
    </div>
    <div v-if="isDisabled" class="upload-mask" @click.stop />

  </el-upload>
</template>

<script>
import { makePath } from '@/api/admin/sys-fs'
import { getToken } from '@/utils/auth'

export default {
  props: {
    isDisabled: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    // 上传文件前校验
    onBeforeUpload(file) {
      const isLt10G = file.size / 1024 / 1024 / 1024 < 10
      if (!isLt10G) {
        this.$message.error('上传文件大小不能超过 10G!')
      }
      return isLt10G
    },
    // 文件上传数量超出触发函数
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    getUploadApi() {
      return process.env.VUE_APP_BASE_API + '/api/v1/fs' + makePath(this.$route.path)
    },
    getUploadHeads() {
      return { Authorization: 'Bearer ' + getToken() }
    },
    // 上传失败回调
    handleUploadErr() {
      this.$message.error('上传失败')
    },
    // 上传成功回调
    handleUploadSuccess(a, b, c) {
      this.$emit('upload-callback')
    }
  }
}
</script>

<style scoped>

::v-deep .el-upload .el-upload-dragger {
  width: 200%;
  height: 100%;
}
::v-deep .el-upload .el-icon-upload {
    font-size: 30px;
    color: #908be8;
    margin: 40px 0 16px;
    line-height: 20px;
}

.upload-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.5); /* 半透明遮罩层 */
  cursor: not-allowed;
  z-index: 10; /* 确保遮罩层位于上传组件之上 */
}

</style>
