<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="描述" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
        @click="handleCreate">
        添加
      </el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-edit" @click="handleDelete">
        删除
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

      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <pagination v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getList" />
    </div>

    <el-dialog :title="modifyType" :visible.sync="showEditDialog" width="30%" :before-close="handleEditDialogClose">
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
        <el-button type="primary" @click="showEditDialog = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>


</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import {
    translateTime
  } from '@/utils/time'

  import { getTeacherList } from '@/api/teacher'

  export default {
    components: {
      Pagination
    },


    data() {
      return {
        listLoading: true,

        modifyType: "新增",
        showEditDialog: false,
        formLabelWidth: '60px',
        

        editForm: {
          name: '',
          email: '',
          phone: ''
        },

        listQuery: {
          page: 1,
          total: 50,
          limit: 20,
          importance: undefined,
          title: '',
          type: undefined,
          sort: '+id'
        },

        tableData:[],
        multipleSelection: []
      }
    },

    methods: {
      openEditDialog(type) {
        this.modifyType = type
        this.showEditDialog = true
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

        getTeacherList(search, page, size).then( response => {
          let {data} = response

          this.tableData = data.list
          this.listQuery.total = data.total_size

          this.listLoading = false
        })

        // new Promise((resolve, reject) => {
        //   res_data = await getTeacherList( search, offset, size )
          
        //   this.listQuery.total = res_data.total_size
        //   this.tableData = res_data.list

        //   console.log(table_data)

        //   this.listLoading = false
        // })

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

      cleanEditForm() {
        this.$refs['editForm'].resetFields()
        if (this.editForm.name != '') {
          this.editForm = {
            name: '',
            email: '',
            phone: ''
          }
        }
      },

      // 数据编辑
      handleCreate() {
        this.openEditDialog("新增")
      },
      handleEdit(index, row) {
        this.openEditDialog("修改")
        this.editForm.name = row.name
        this.editForm.phone = row.phone
        this.editForm.email = row.email

        console.log(index, row);
      },
      handleDelete() {

      },

      //页面组件回调事件
      handleEditDialogClose() {
        this.cleanEditForm()

        this.showEditDialog = false;
      },
    },

    mounted(){
      this.getList()
    },
  }

</script>
