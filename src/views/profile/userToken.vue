<template>
  <div>
    <el-button type="primary" size="mini" @click="generateToken">新增令牌</el-button>
    <el-button type="danger" size="mini" :disabled="multiple" style="margin-left: 10px;" @click="handleDelete">批量删除</el-button>
    <el-table :data="tokens" style="width: 100%; margin-top: 20px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="token" label="令牌" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { genUserToken, getUserToken, delUserToken } from '@/api/admin/sys-user'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tokens: [],
      ids: [],
      multiple: true
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue.userId) {
          this.fetchTokens()
        }
      }
    }
  },

  methods: {
    fetchTokens() {
      getUserToken(this.user.userId).then(response => {
        if (response.code === 1000) {
          this.tokens = response.data
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    generateToken() {
      genUserToken(this.user.userId).then(response => {
        if (response.code === 1000) {
          this.$message.success('生成令牌成功')
          this.fetchTokens()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleDelete(row) {
      const Ids = row && row.id ? [row.id] : this.ids

      if (Ids === 0) {
        this.$message.warning('请选择要删除的令牌')
        return
      }
      this.$confirm('是否确认删除选中的 ' + Ids.length + ' 条令牌?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserToken(Ids).then(response => {
          if (response.code === 1000) {
            this.$message.success('删除令牌成功')
            this.fetchTokens()
          } else {
            this.$message.error(response.msg)
          }
        })
      }).catch(() => {})
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    }
  }
}
</script>

<style scoped>
  .el-table {
    margin-top: 20px;
  }
</style>
