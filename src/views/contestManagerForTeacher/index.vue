<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="描述" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />

      <el-select @change="typeChange" v-model="listQuery.type" class="filter-item" style="width: 130px">
        <!-- <el-option v-for="item in options" :key="item.type" :label="item.name" :value="item.type" /> -->
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

    </div>

    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange" fit highlight-current-row v-loading="listLoading">
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>

      <el-table-column prop=“name” label="类别" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column prop=“type” label="项目" min-width="120" align="center">
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

    </el-table>

    <div class="block">
      <pagination v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page"
        :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <el-dialog :title="modifyType" :visible.sync="showEditDialog" width="30%" :before-close="handleEditDialogClose">
      <el-form ref="editForm" :model="editForm">

        <el-form-item label="类别">
          <el-select ref="classifyId" @change="editClassifyChange" v-model="editForm.classifyId" class="filter-item"
            :loading="editClassifyLoading">
            <el-option v-for="item in classfiyList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="isShowEditSelectClassifyBox" label="项目">
          <el-select ref="itemId" v-model="editForm.itemId" class="filter-item" :loading="editSelectLoading">
            <el-option v-for="item in itemList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input ref="name" v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleEditDialogConfirm" :loading="confirmButtonLoading">确 定</el-button>
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
    getCompetitionList,
    getClassifyList,
    getItemList,
    addCompetition
  } from '@/api/competitionManagement/competitionManagement'

  import {
    getToken
  } from '@/utils/auth'

  import {
    getUserInfo
  } from '@/api/user'
  import {
    get
  } from 'http'

  export default {
    components: {
      Pagination
    },


    data() {
      return {
        userId: undefined,

        isShowSelectClassifyBox: false,
        isShowEditSelectClassifyBox: false,

        editClassifyLoading: false,
        editItemLoading: false,

        selectLoading: true,
        editSelectLoading: true,

        isShowEditSelectItemBox: false,

        showEditDialog: false,

        itemList: [{
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

        confirmButtonLoading: false,
        deleteConfirmButtonLoading: false,

        modifyType: "新增",
        formLabelWidth: '60px',

        showDeleteDialog: false,

        editForm: {
          name: '',
          classifyId: '',
          itemId: '',
          teacherId: ''
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
      isDisableEditSelectClassifyBox() {
        return this.modifyType == "修改"
      },

      editClassifyChange() {
        if (this.editForm.type == 1) {
          this.isShowEditSelectClassifyBox = true

          this.editSelectLoading = true

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

            this.editSelectLoading = false
          })
        } else {
          this.isShowEditSelectClassifyBox = false
        }
      },

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

      //增加删除修改按钮事件
      handleCreate() {
        this.openEditDialog("新增")

      },
      handleEdit(index, row) {
        this.openEditDialog("修改")

        if (row.type == 1) {
          this.isShowEditSelectClassifyBox = true

          this.isShowSelectClassifyBox = true

          this.editSelectLoading = true

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

            this.editSelectLoading = false
          })
        } else {
          this.isShowEditSelectClassifyBox = false
        }

        this.editForm.id = row.id
        this.editForm.name = row.name
        this.editForm.type = row.type
        console.log("dd")
        this.editForm.score = row.score
        this.editForm.fatherIdForItem = this.listQuery.fatherIdForItem

        console.log(index, row);
      },


      //页面组件操作函数
      openEditDialog(type) {
        this.editClassifyLoading = true

        getClassifyList().then(response => {
          let {
            list
          } = response

          this.classfiyList = list

          editClassifyLoading = false

          this.isShowEditSelectClassifyBox = true
        })

      },


      handleEditDialogConfirm() {
        this.confirmButtonLoading = true

        let competitionInfo = {
          id: this.editForm.id,
          type: this.editForm.type,
          name: this.editForm.name,
          fatherIdForItem: this.editForm.fatherIdForItem,
          score: this.editForm.score
        }

        let res = response => {
          this.$message('操作成功');

          this.confirmButtonLoading = false

          this.handleEditDialogClose()

          this.getList()
        }

        this.modifyType === "新增" ? createCompetitionInfo(competitionInfo).then(res) : updateCompetitionInfo(
          competitionInfo).then(res)
      },


      getTypeName(type) {
        return type === 0 ? "类别" : "项目"
      },

      timeTranslator(time) {
        return translateTime(time);
      },

      getList() {
        let search = this.listQuery.search.trim()
        let page = this.listQuery.page
        let size = this.listQuery.limit

        let token = getToken()

        this.listLoading = true

        getCompetitionList(token, search, page, size).then( response => {
            let {
            data
          } = response

          this.tableData = data.list
          this.listQuery.total = data.total_size

          this.listLoading = false
        } )
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
        if (this.editForm.name != '') {
          this.editForm = {
            id: '',
            name: '',
            type: '',
            fatherIdForItem: '',
            score: '',
            phone: ''
          }
        }

        this.$refs['editForm'].resetFields()
      },

      cleanDeleteInfo() {
        this.multipleSelection = []
      },

      handleDeleteDialogConfirm() {
        this.deleteConfirmButtonLoading = true

        let new_selected = []

        this.multipleSelection.forEach(temp => {
          new_selected.push(temp.id)
        })

        deleteCompetitionInfo(new_selected).then(response => {
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

      //页面组件回调事件
      handleEditDialogClose() {
        this.cleanEditForm()

        this.isShowEditSelectItemBox = false

        this.showEditDialog = false;
      },
    },

    mounted() {
      this.getList()
    },
  }

</script>
