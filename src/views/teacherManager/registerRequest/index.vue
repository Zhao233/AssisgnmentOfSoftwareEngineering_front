<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="描述" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit"
        @click="handleBatchAgree">
        批量同意
      </el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-edit"
        @click="handleBatchRefuse">
        批量忽略
      </el-button>
    </div>

    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange" fit highlight-current-row v-loading="listLoading">
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>

      <el-table-column prop="name" label="教师姓名" min-width="120" align="center">
      </el-table-column>

      <el-table-column prop="email" label="邮箱" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="phone" label="电话" min-width="120" align="center">
      </el-table-column>

      <el-table-column prop="create_time" label="创建时间" width="200" align="center">
        <template slot-scope="scope">{{ timeTranslator(scope.row.createTime) }}</template>
      </el-table-column>

      <el-table-column prop="update_time" label="修改时间" width="200" align="center">
        <template slot-scope="scope">{{ timeTranslator(scope.row.updateTime) }}</template>
      </el-table-column>
    </el-table>

    <div class="block">
      <pagination v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page"
        :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <!-- <el-dialog :title="modifyType" :visible.sync="showEditDialog" width="30%" :before-close="handleEditDialogClose">
      <el-form ref="editForm" :model="editForm">

        <el-form-item label="姓名" prop="name">
          <el-input ref="name" v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input ref="email" v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话">
          <el-input ref="phone" v-model="editForm.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleEditDialogConfirm" :loading="updateConfirmButtonLoading">确 定</el-button>
      </div>
    </el-dialog> -->

    <el-dialog :title="operationTitle" :visible.sync="showConfirmDialog" width="30%">
      <template v-for="(item) in multipleSelection">
        {{item.name}}
        </p>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showConfirmDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialogConfirm" :loading="confirmConfirmButtonLoading">确 定
        </el-button>
      </div>
    </el-dialog>

  </div>


</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import {
    translateTime
  } from '@/utils/time'

  import {
    getNotAuthorizedTeacherList,
    agreeTeacherRegister,
    refuseTeacherRegister
  } from '@/api/teacherRegisterManagement/teacherRegisterManagement'

  export default {
    components: {
      Pagination
    },


    data() {
      return {
        operationTitle: "同意请求",

        listLoading: true,

        formLabelWidth: '60px',

        showConfirmDialog: false,

        confirmConfirmButtonLoading: false,

        listQuery: {
          page: 1,
          total: 50,
          limit: 20,
          importance: undefined,
          title: '',
          type: undefined,
          sort: '+id'
        },

        tableData: [],
        multipleSelection: []
      }
    },

    methods: {
      openConfirmDialog(type) {
        this.operationTitle = type
        this.showConfirmDialog = true
      },

      timeTranslator(time) {
        return translateTime(time);
      },

      getList() {
        let table_data = undefined
        let search = this.listQuery.title.trim()
        let page = this.listQuery.page
        let size = this.listQuery.limit

        this.listLoading = true

        getNotAuthorizedTeacherList(search, page, size).then(response => {
          let {
            data
          } = response

          this.tableData = data.list
          this.listQuery.total = data.total_size

          this.listLoading = false
        })

        console.log(this.listQuery)
      },

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

      handleFilter() {
        //this.listQuery.page = 1
        //this.getList()
      },

      cleanSelectedInfo() {
        this.multipleSelection = []
      },

      // 数据编辑
      handleBatchAgree() {
        this.multipleSelection.length == 0 ? this.$message("请选中一条记录") : this.openConfirmDialog("同意请求")
      },

      handleBatchRefuse() {
        this.multipleSelection.length == 0 ? this.$message("请选中一条记录") : this.openConfirmDialog("拒绝请求")
      },


      handleConfirmDialogConfirm() {
        this.confirmConfirmButtonLoading = true

        let new_selected = []

        this.multipleSelection.forEach(temp => {
          new_selected.push(temp.id)
        })

        let type = this.operationTitle

        var opea = response => {
          let {
            status,
            message
          } = response

          if (status != 200) {
            this.$message(message)
          } else {
            this.$message("操作成功")

            this.confirmConfirmButtonLoading = false
            this.showConfirmDialog = false
            this.cleanSelectedInfo()

            this.getList()
          }
        }

        type == "同意请求" ? agreeTeacherRegister(new_selected).then(opea) : refuseTeacherRegister(new_selected).then(opea)
      },

      //页面组件回调事件

    },

    mounted() {
      this.getList()
    },
  }

</script>
