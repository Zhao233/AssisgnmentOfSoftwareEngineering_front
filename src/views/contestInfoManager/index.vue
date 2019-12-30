<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="描述" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />

      <el-select @change="typeChange" v-model="listQuery.type" class="filter-item" style="width: 130px">
        <el-option v-for="item in options" :key="item.type" :label="item.name" :value="item.type" />
      </el-select>

      <el-select v-if="isShowSelectClassifyBox" v-model="listQuery.fatherIdForItem" class="filter-item"
        style="width: 130px" :loading="selectLoading">
        <el-option v-for="item in classfiyList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit"
        @click="handleCreate">
        新增
      </el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-edit" @click="handleDelete">
        删除
      </el-button>
    </div>

    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange" fit highlight-current-row v-loading="listLoading">
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>

      <el-table-column prop=“name” label="名称" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column prop=“type” label="类型" min-width="120" align="center">
        <template slot-scope="scope">{{ getTypeName(scope.row.type) }}</template>
      </el-table-column>

      <el-table-column prop=“score” label="基数" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.score }}</template>
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
      <pagination v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page"
        :limit.sync="listQuery.limit" @pagination="getList" />
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
        <el-button type="primary" @click="handleEditDialogConfirm" :loading="updateConfirmButtonLoading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title='确认删除？' :visible.sync="showDeleteDialog" width="30%">
      <template v-for="(item) in multipleSelection">
        {{item.name}}</br>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showDeleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleDeleteDialogConfirm" :loading="deleteConfirmButtonLoading">确 定
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
    getClassifyList,
    getCompetitionInfoList,
    createCompetitionInfo,
    updateCompetitionInfo,
    deleteCompetitionInfo
  } from '@/api/competitionInfoManagement/competitionInfoManagement'
  import {
    get
  } from 'http'

  export default {
    components: {
      Pagination
    },


    data() {
      return {

        selectLoading: true,

        isShowSelectClassifyBox: false,

        options: [{
            type: 0,
            name: "类别"
          },
          {
            type: 1,
            name: "项目"
          }
        ],

        classfiyList: [{
            id: 0,
            name: "B类"
          },
          {
            id: 1,
            name: "C类"
          }
        ],

        listLoading: true,

        updateConfirmButtonLoading: false,
        deleteConfirmButtonLoading: false,

        modifyType: "新增",
        showEditDialog: false,
        formLabelWidth: '60px',

        showDeleteDialog: false,

        editForm: {
          id: '',
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
          type: 0,
          sort: '+id',
          search: '',
          fatherIdForItem: undefined
        },

        tableData: [],
        multipleSelection: []
      }
    },

    methods: {

      typeChange() {
        if (this.listQuery.type == 1) {
          this.isShowSelectClassifyBox = true

          this.selectLoading = true

          getClassifyList().then(response => {
            let {
              list
            } = response

            let options_new = []

            list.forEach(item => {
              options_new.push({
                id: item.id,
                name: item.name
              })
            })

            this.classfiyList = options_new

            this.selectLoading = false
          })
        } else {
          this.isShowSelectClassifyBox = false

        }
      },

      handleCreate() {

      },
      openDeleteDialog() {
        this.showDeleteDialog = true
      },

      openEditDialog(type) {
        this.modifyType = type
        this.showEditDialog = true
      },

      getTypeName(type) {
        return type === 0 ? "类别" : "项目"
      },

      timeTranslator(time) {
        return translateTime(time);
      },

      getList() {
        let search = this.listQuery.search.trim()
        let type = this.listQuery.type
        let fatherIdForItem = this.listQuery.fatherIdForItem
        let page = this.listQuery.page
        let size = this.listQuery.limit

        this.listLoading = true

        getCompetitionInfoList(search, page, size, type, fatherIdForItem).then(response => {
          let {
            data
          } = response

          this.tableData = data.list
          this.listQuery.total = data.total_size

          this.listLoading = false
        })
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
        this.getList()
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

      cleanDeleteInfo() {
        this.multipleSelection = []
      },

      // 数据编辑
      handleEdit(index, row) {
        this.openEditDialog("修改")

        this.editForm.id = row.id
        this.editForm.name = row.name
        this.editForm.phone = row.phone
        this.editForm.email = row.email

        console.log(index, row);
      },
      handleDelete() {
        this.multipleSelection.length === 0 ? this.$message("请选中一个教师") : this.openDeleteDialog()
      },

      handleDeleteDialogConfirm() {
        this.deleteConfirmButtonLoading = true

        let new_selected = []

        this.multipleSelection.forEach(temp => {
          new_selected.push(temp.id)
        })

        deleteTeacher(new_selected).then(response => {
          let {
            status,
            message
          } = response

          if (status != 200) {
            this.$message(message)
          } else {
            this.$message("删除成功")

            this.deleteConfirmButtonLoading = false
            this.showDeleteDialog = false
            this.cleanDeleteInfo()

            this.getList()
          }
        })
      },

      handleEditDialogConfirm() {
        this.updateConfirmButtonLoading = true

        let teacher = {
          id: this.editForm.id,
          name: this.editForm.name,
          email: this.editForm.email,
          phone: this.editForm.phone
        }

        updateTeacher(teacher).then(response => {
          this.$message('修改成功');

          this.updateConfirmButtonLoading = false

          this.handleEditDialogClose()

          this.getList()
        })
      },

      //页面组件回调事件
      handleEditDialogClose() {
        this.cleanEditForm()

        this.showEditDialog = false;
      },
    },

    mounted() {
      this.getList()
    },
  }

</script>
