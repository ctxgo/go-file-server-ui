<template>
  <BasicLayout>
    <template #wrapper>

      <el-card class="box-card">

        <el-row :gutter="20">
          <!-- treeComponent 放在 el-row 中，并通过 margin 控制间距 -->
          <el-col :span="24">
            <navigation-bar
              :base-path="basePath"
              class="tree-component-wrapper"
              @node-clicked="handleTreeNodeClicked"
            />
          </el-col>
        </el-row>
        <el-row :gutter="25">

          <!--用户数据-->
          <el-col :span="23" :xs="24">

            <el-row :gutter="20">
              <!-- 左侧列包含搜索和操作按钮 -->
              <el-col :span="13" :xs="24">
                <!-- 搜索表单 -->
                <el-form ref="queryForm" :model="searchParams" :inline="true" label-width="68px">
                  <el-form-item label="资源名称" prop="name">
                    <el-input
                      v-model="searchParams.name"
                      placeholder="请输入文件名称"
                      clearable
                      size="small"
                      style="width: 200px"
                      @keyup.enter.native="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                  </el-form-item>
                </el-form>

                <!-- 操作按钮 -->
                <div style="text-align: left; margin-top: 10px;">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    style="padding: 7px;"

                    :disabled="!buttonPermissions.POST"
                    @click="handleAdd"
                  >新增目录</el-button>
                  <el-button
                    style="padding: 7px;"
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="multiple || !buttonPermissions.DELETE"
                    @click="handleMultipleMove"
                  >批量移动</el-button>
                  <el-button
                    style="padding: 7px;"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple || !buttonPermissions.DELETE"
                    @click="handleDelete"
                  >批量删除</el-button>
                  <el-button
                    v-show="resetButtonPermission()"
                    style="padding: 7px;"
                    type="warning"
                    icon="el-icon-setting"
                    size="mini"
                    @click="handleReset"
                  >重建索引</el-button>
                  <el-button
                    style="padding: 7px;"
                    type="info"
                    icon="el-icon-delete-solid"
                    size="mini"
                    @click="handleTmp"
                  >回收站</el-button>
                </div>
              </el-col>

              <!-- 右侧列包含上传组件 -->
              <el-col :span="6" :xs="24">
                <!-- UploadComponent 上传组件 -->
                <upload-component
                  :is-disabled="!buttonPermissions.POST"
                  @upload-callback="handleUploadCallback"
                />
              </el-col>
            </el-row>

            <el-table
              v-loading="loading"
              :data="fsList"
              border
              :default-sort="{prop: 'type', order: 'ascending'}"
              @selection-change="handleSelectionChange"
              @sort-change="handleSortChange"
            >
              <el-table-column type="selection" width="45" align="center" />

              <!-- 名称列 -->
              <el-table-column label="名称" prop="name" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <!-- 如果类型是 'dir'，显示为可点击的链接和文件夹图标 -->
                  <span v-if="scope.row.type === 'dir'">
                    <el-button type="text" @click="handleDirClick(scope.row)">
                      <i class="el-icon-folder" /> {{ scope.row.name }}
                    </el-button>
                  </span>
                  <!-- 其他情况下正常显示名称 -->
                  <span v-else>
                    {{ scope.row.name }}
                  </span>
                  <span v-if="['zip', 'rar', 'tar', 'gz', '7z'].includes(scope.row.type)">
                    <el-button type="text" class="unzip-button" @click="handleUnzip(scope.row)">
                      <i class="el-icon-document-remove" /> 解压
                    </el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="类型" prop="type" width="70" align="center" :show-overflow-tooltip="true" />
              <el-table-column label="修改时间" prop="mtime" width="155" align="center" :show-overflow-tooltip="true" />
              <el-table-column label="大小" prop="size" width="80" align="center" :show-overflow-tooltip="true" />

              <el-table-column
                align="center"
                label="操作"
                width="270"

                fix="right"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    :disabled="!buttonPermissions.PUT"
                    size="mini"
                    type="primary"
                    plain
                    style="padding: 5px ;"
                    icon="el-icon-download"
                    @click="handleDowdload(scope.row)"
                  />
                  <el-button
                    :disabled="!buttonPermissions.PUT"
                    size="mini"
                    type="primary"
                    plain
                    style="padding: 5px;"
                    @click="handleCopyDowdloadUrl(scope.row)"
                  >
                    复制下载链接
                  </el-button>
                  <el-button
                    :disabled="!buttonPermissions.PUT"
                    size="mini"
                    type="primary"
                    plain
                    style="padding: 5px ;"
                    @click="handleUpdate(scope.row)"
                  >重命名</el-button>

                  <el-button
                    :disabled="!buttonPermissions.DELETE"
                    size="mini"
                    type="warning"
                    plain
                    style="padding: 5px ;"

                    @click="handleMove(scope.row)"
                  >移动</el-button>

                  <el-button
                    v-if="scope.row.userId !== 1"
                    :disabled="!buttonPermissions.DELETE"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    plain
                    style="padding: 5px ;"

                    @click="handleDelete(scope.row)"
                  />

                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total>0"
              style="display: flex; justify-content: center; width: 100%;"
              :total="total"
              :page.sync="queryParams.pageIndex"
              :limit.sync="queryParams.pageSize"
              @pagination="handlePageChange"
            />

          </el-col>
        </el-row>
      </el-card>

      <!-- 解压窗口 -->
      <LogViewer :show-log-obj.sync="showLogObj" @log-callback="logCallback" />

      <!-- 修改对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" @submit.native.prevent @keyup.enter.native="submitForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="资源名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入新的名称" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 移动对话框 -->
      <el-dialog :title="'移动目录'" :visible.sync="openMove" width="600px" :close-on-click-modal="false">
        <el-form ref="form" :model="form" label-width="100px" @submit.native.prevent>
          <!-- 当前目录项，带文件夹图标 -->
          <el-form-item label="当前已选路径" style="margin-bottom: 10px;">
            <div v-for="file in form.filePaths" :key="file" style="margin-bottom: -10px;">
              <!--i class="el-icon-folder blue-icon" style="margin-right: 5px;" /-->
              <span>{{ file }}</span>
            </div>
          </el-form-item>
          <!-- 目标目录项，带文件夹图标 -->
          <el-form-item label="当前目标目录" style="margin-bottom: 5px;">
            <i class="el-icon-folder blue-icon" />
            <span>{{ form.destination ? form.destination : '' }}</span>
          </el-form-item>
          <el-form-item label="选择目标目录">
            <el-tree
              ref="fsTree"
              class="tree-dropdown"
              :data="form.fsTreeData"
              :props="{ label: 'name', children: 'children', isLeaf: 'leaf' }"
              lazy
              show-checkbox
              :load="loadNode"
              node-key="id"
              :check-strictly="true"
              @check-change="handleCheckChange"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitMove">确 定</el-button>
          <el-button @click="cancelMove">取 消</el-button>
        </div>
      </el-dialog>

    </template>
  </BasicLayout>
</template>

<script>
import { getFs, getDownloadUrl, makePath, renameFs, resetFs, createFs, moveFs, deleteFs } from '@/api/admin/sys-fs'

import NavigationBar from './commpoents/NavigationBar.vue'
import UploadComponent from './commpoents/Upload.vue'
import LogViewer from './commpoents/LogViewer.vue'
import { mapGetters } from 'vuex'

import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {

  name: 'SysUserManage',
  components: { NavigationBar, UploadComponent, LogViewer },
  data() {
    return {
      basePath: {
        path: '',
        rid: ''
      },
      showLogObj: {
        open: false,
        path: ''
      },
      buttonPermissions: {
        GET: false,
        DELETE: false,
        PUT: false,
        POST: false
      },
      searchParams: {
        name: ''
      },
      form: {},
      // 遮罩层
      loading: true,
      // 选中数组
      files: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 文件表格数据
      fsList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openMove: false,
      // 部门名称
      deptName: undefined,
      // 表单校验
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { pattern: /^[.a-zA-Z0-9-_\p{Script=Han}]+$/, message: '名称仅能包含字母、数字、破折号、下划线和中文', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles' // 映射 this.roles 到 store.getters.roles
    ]),
    queryParams() {
      const query = this.$route.query
      const result = {
        pageIndex: parseInt(query.pageIndex) || 1,
        pageSize: parseInt(query.pageSize) || 10
      }
      if (query.name) {
        result.name = query.name
      }
      if (query.rid) {
        result.rid = query.rid
      }
      return result
    }
  },
  watch: {
    '$route'(route) {
      if (!route.name.startsWith('FileManage')) {
        return
      }
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询文件列表 */
    getList() {
      this.loading = true
      this.basePath = { path: this.$route.path, rid: this.queryParams.rid }
      getFs(this.$route.path, this.queryParams).then(response => {
        if (!response) {
          return
        }
        if (response.code !== 1000) {
          this.msgError(response.msg)
          return
        }
        if (response.data.items.length === 0 && this.queryParams.pageIndex > 1) {
          this.queryParams.pageIndex -= 1
          this.$router.push({ path: this.$route.path, query: this.queryParams })
        }
        this.fsList = response.data.items
        this.total = response.data.count
        this.buildButtonPermissions(response.data.permissions)
        this.loading = false
      }
      )
    },
    buildButtonPermissions(data) {
      data.forEach(perm => {
        this.buttonPermissions[perm] = true
      })
    },
    resetButtonPermission() {
      if (this.roles.length === 0) {
        return false
      }
      if (this.roles[0] !== 'admin') {
        return false
      }
      return true
    },
    handleReset() {
      this.$confirm('仅当直接从服务器工作目录增删文件时,才需执行此操作', '是否重建索引?', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return resetFs()
      }).then((response) => {
        if (response.code === 1000) {
          this.msgSuccess(response.msg)
          if (this.$route.path === '/admin/file') {
            this.getList()
          } else {
            this.$router.push({ path: '/admin/file' })
          }
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {})
    },
    handleTmp() {
      const newPath = this.buildPath('/admin/file/.tmp', this.roles[0])
      const query = this.getDefaultQuery()
      if (this.roles[0] !== 'admin') {
        query.rid = btoa('/.tmp/' + this.roles[0])
      }

      if (newPath === this.$route.path &&
        this.$route.query.pageIndex === query.pageIndex.toString() &&
        this.$route.query.pageSize === query.pageSize.toString()) {
        this.getList()
        return
      }
      this.$router.push({ path: newPath, query: query })
    },
    getDefaultQuery(data) {
      const query = { pageIndex: 1, pageSize: 10 }
      // 确保data是一个有效的对象
      if (typeof data !== 'object' || data === null) {
        return query
      }
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          query[key] = data[key]
        }
      }
      return query
    },
    handleUnzip(item) {
      this.showLogObj = {
        open: true,
        path: makePath(this.buildPath(this.$route.path, item.name))
      }
    },
    handleDirClick(item) {
      const newPath = this.buildPath(this.$route.path, item.name)
      const rid = btoa(item.roleDir)
      this.$router.push({ path: newPath, query: this.getDefaultQuery({ rid: rid }) })
    },
    buildPath(path, name) {
      return `${path}/${name}`.replace(/\/\/+/g, '/')
    },
    getLastElement(path) {
      return path.substring(path.lastIndexOf('/') + 1)
    },
    buildfilePaths(files) {
      const basePath = this.$route.path
      return files.map(name => makePath(this.buildPath(basePath, name)))
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        // Load root level nodes
        return resolve([{ name: '/', id: 'root', leaf: false, fullPath: '/' }])
      }
      // Assuming getFs returns a list of directories in `items` and fullPath needs to be constructed
      getFs(node.data.fullPath, { onlyDir: true }).then(response => {
        const children = response.data.items.map((dir, index) => {
          // 处理根目录路径问题
          const path = node.data.fullPath === '/' ? `/${dir.name}` : `${node.data.fullPath}/${dir.name}`
          return {
            name: dir.name,
            id: node.data.id + '-' + index, // Generate a unique id based on parent id and index
            leaf: dir.leaf !== undefined ? dir.leaf : false, // If backend specifies, use it, otherwise assume it's a leaf
            fullPath: path // Construct the full path for each directory, avoiding double slashes
          }
        })
        resolve(children)
      }).catch(error => {
        console.error('Error loading directories:', error)
        resolve([]) // Return an empty array on error
      })
    },
    handleCheckChange(data, checked, tree) {
      if (checked) {
        this.form.destination = data.fullPath.replace(/\/\/+/g, '/')
        // this.$nextTick(() => {
        this.$refs.fsTree.setCheckedKeys([data.id])
        // })
      }
    },
    // 节点单击事件
    handleTreeNodeClicked(data) {
      const newPath = this.buildPath('/admin/file', data)
      if (newPath === this.$route.path && this.queryParams.index !== 1) {
        this.getList()
        return
      }

      this.$router.push({ path: newPath, query: this.getDefaultQuery({ rid: this.queryParams.rid }) })
    },
    handleUploadCallback() {
      this.getList()
    },
    handlePageChange() {
      this.$router.push({
        path: this.$route.path,
        query: this.getDefaultQuery(
          {
            pageIndex: this.queryParams.pageIndex,
            pageSize: this.queryParams.pageSize,
            name: this.queryParams.name,
            rid: this.queryParams.rid
          }
        )
      })
    },
    /** 排序回调函数 */
    handleSortChange({ column, prop, order }) {
      // 这里可以调用后端API或使用前端逻辑进行排序

    },
    logCallback() {
      this.getList()
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    cancelMove() {
      this.openMove = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        currentName: undefined,
        currentPath: undefined,
        destination: undefined,
        files: [],
        filePaths: [],
        fsTreeData: [{ name: '/', id: 'root', leaf: false, fullPath: '/' }]
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      const query = this.$route.query

      if (this.searchParams.name === query.name || (this.searchParams.name === '' && !query.name)) {
        if (query.pageIndex === '1' && query.pageSize === '10') {
          this.getList()
          return
        }
      }

      this.$router.push({
        path: this.$route.path,
        query: this.getDefaultQuery(
          {
            name: this.searchParams.name,
            rid: this.queryParams.rid
          }
        )
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.searchParams.name = ''
      delete this.queryParams.name
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.files = selection.map(item => item.name)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleDowdload(row) {
      const currentPath = this.buildPath(this.$route.path, row.name)
      getDownloadUrl(currentPath, this.queryParams).then(response => {
        if (response.code === 1000) {
          location.href = response.data
        } else {
          this.msgError(response.msg)
        }
      })
    },
    copyToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      // textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          this.msgSuccess('复制成功!')
        } else {
          this.msgError('复制失败!')
        }
      } catch (err) {
        this.msgError('复制失败!')
        console.error('无法复制内容', err)
      }
      document.body.removeChild(textArea)
    },

    handleCopyDowdloadUrl(row) {
      const currentPath = this.buildPath(this.$route.path, row.name)
      getDownloadUrl(currentPath, this.queryParams).then(response => {
        if (response.code === 1000) {
          this.copyToClipboard(response.data)
        } else {
          this.msgError(response.msg)
        }
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加目录'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const name = this.getLastElement(row.name)
      this.form.currentName = name
      this.form.name = name
      this.form.currentPath = this.buildPath(this.$route.path, row.name)
      this.open = true
      this.title = '重命名'
    },
    handleMultipleMove() {
      if (this.$refs.fsTree) {
        this.$refs.fsTree.setCheckedKeys([])
      }
      this.reset()
      this.form.filePaths = this.buildfilePaths(this.files)
      this.form.currentPath = makePath(this.$route.path)
      this.openMove = true
    },
    handleMove(row) {
      if (this.$refs.fsTree) {
        this.$refs.fsTree.setCheckedKeys([])
      }
      this.reset()
      this.form.filePaths = this.buildfilePaths([row.name])
      this.form.currentPath = makePath(this.$route.path)
      this.openMove = true
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (!valid) return
        let filePath = this.$route.path
        let action
        if (this.title === '重命名') {
          if (this.form.name === this.form.currentName) {
            this.open = false
            return
          }
          filePath = this.form.currentPath
          action = renameFs
        } else {
          action = createFs
        }
        action(filePath, this.form.name).then(response => {
          if (response.code === 1000) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      })
    },
    /** 提交按钮 */
    submitMove: function() {
      const data = { destination: this.form.destination }
      let hasError = false
      const movePromises = this.form.filePaths.map(filePath => {
        return moveFs(filePath, data).then(response => {
          if (response.data.code !== 1000) {
            console.error('Error with file:', filePath, response)
            this.$message.error(filePath + '移动失败: ' + response.data.msg)
            hasError = true
          }
        }).catch(error => {
          console.error('Error moving file:', filePath, error)
          hasError = true
        })
      })
      return Promise.allSettled(movePromises).then(() => {
        if (!hasError) {
          this.msgSuccess('移动成功')
          this.getList()
        }
        this.openMove = false
      })
    },
    /** 删除按钮操作 */
    handleDelete(rows) {
      // 定义基本路径
      // 根据是否存在rows且包含name，选择数据源构造文件名列表
      const files = rows && rows.name ? [rows.name] : this.files

      // 构造完整的文件路径列表用于显示
      const filePaths = this.buildfilePaths(files)
      const fileList = filePaths.join('<br>')
      const msg = '是否删除选中的 ' + files.length + ' 个文件?'
      // 显示确认对话框
      this.$confirm(`<div style="max-height: 50vh; overflow-y: scroll;"
        >显示不全可下拉查看<br>${fileList}</div>`, msg, {
        // this.$confirm(`是否删除选中的文件:<br>${fileList}`, '警告', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let hasError = false
        const deletePromises = filePaths.map(filePath =>
          deleteFs(filePath).then(response => {
            if (response.data.code !== 1000) {
              console.error(response)
              this.msgError(filePath + '删除失败: ' + response.data.msg)
              hasError = true
            }
          }).catch(() => {
            hasError = true
          })
        )

        return Promise.allSettled(deletePromises).then(() => {
          if (!hasError) {
            this.msgSuccess('所有文件成功删除')
          }
        })
      }).then(() => {
        this.open = false
        this.getList() // 更新列表
      }).catch(() => {
        // 处理取消操作或异常情况

      })
    }

  }
}
</script>

<style scoped>
.tree-component-wrapper {
  margin-bottom: 10px; /* 控制 treeComponent 和下方 el-row 之间的间距 */
}
.blue-icon {
    color: #339CFF; /* 设置为浅蓝色 */
    margin-right: 3px; /* 设置右侧间距为10px */
}
.unzip-button {

  color: #dc34c0; /* 设置文字和图标的颜色为蓝色 */
}
.custom-button {
  padding: 5px 20px; /* 调整上下5px, 左右20px的内边距 */
}

</style>
