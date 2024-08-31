<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="localUser.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="localUser.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  computed: {
    // 创建计算属性来处理双向绑定
    localUser: {
      get() {
        return this.user
      } }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
