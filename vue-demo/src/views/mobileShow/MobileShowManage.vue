<template>
    <div>
        <!--搜索界面-->
        <MobileShowSearch :search="search" :so="so"></MobileShowSearch>
        <!--按钮-->
        <div style="margin:6px 0;">
            <el-button @click="create()">新增</el-button>
        </div>
        <!--列表-->
        <div class="form">
            <el-table :data="pageList.items" ref="listTable" border style="width: 100%;">
                <el-table-column label="id" prop="id"></el-table-column>
                <el-table-column label="展会名称" prop="showName"></el-table-column>
                <el-table-column label="展会时间" :formatter="formatter"></el-table-column>

                <el-table-column label="城市" prop="cityNameList"></el-table-column>
                <el-table-column label="参展城市数量" :formatter="cityCountFormatter"></el-table-column>
                <el-table-column label="状态" :formatter="statusFormatter"></el-table-column>

                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button @click="view(scope.row)" type="text">查看</el-button> -->
                        <el-button
                            v-if="scope.row.status==1"
                            @click="updateStatus(scope.row,2)"
                            type="text"
                        >关闭</el-button>
                        <el-button
                            v-if="scope.row.status==2"
                            @click="updateStatus(scope.row,1)"
                            type="text"
                        >恢复营业</el-button>
                        <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--total 总条目数   current-page 当前页数    page-size 每页显示条目个数  -->
            <el-pagination
                style="text-align: right;margin-top:5px;"
                background
                :page-sizes="[ 10, 20, 50, 100]"
                :total="pageList.totalNumber"
                :current-page="so.page"
                :page-size="so.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </div>

        <el-dialog title="查看" width="50%" :visible.sync="isShowDialog">
            <MobileShowDialog ref="mobileShowDialog" :selectedVO="selectedVO"></MobileShowDialog>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowDialog = false">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增" width="60%" :visible.sync="isShowCreate">
            <MobileShowCreate ref="mobileShowCreate"></MobileShowCreate>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowCreate = false">取消</el-button>
                <el-button type="primary" @click="createComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑" width="60%" :visible.sync="isShowEdit">
            <MobileShowEdit ref="mobileShowEdit" :selectedVO="selectedVO"></MobileShowEdit>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowEdit = false">取消</el-button>
                <el-button type="primary" @click="editComplete()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Api from "api";

import moment from "moment";
import XLSX from "xlsx";
import saveAs from "file-saver";

import MobileShowSearch from "./MobileShowSearch";
import MobileShowDialog from "./MobileShowDialog";
import MobileShowCreate from "./MobileShowCreate";
import MobileShowEdit from "./MobileShowEdit";

export default {
    components: {
        MobileShowSearch,
        MobileShowDialog,
        MobileShowCreate,
        MobileShowEdit
    },
    mounted() {
        console.log("管理界面初始化");
        this.getPageList_api();
    },
    data() {
        return {
            //列表数据
            pageList: {},
            //查询条件
            so: {
                /**
                 * 当前页码
                 */
                page: 1,
                /**
                 * 每页数量
                 */
                pageSize: 10,
                cityCode: "",
                status: "",
                showTime: null,
                showTimeStr: ""
            },
            /**
             * 当前选中对象
             */
            selectedVO: null,

            isShowDialog: false,
            isShowCreate: false,
            isShowEdit: false
        };
    },
    methods: {
        /**
         * 查看
         */
        view(row) {
            this.selectedVO = row;
            console.log("查看" + this.selectedVO.id);
            this.isShowDialog = true;
            if (this.$refs.mobileShowDialog) {
                this.$refs.mobileShowDialog.init(this.selectedVO.id);
            }
        },
        /**
         * 添加
         */
        create() {
            console.log("添加");
            if (this.$refs.mobileShowCreate) {
                this.$refs.mobileShowCreate.init();
            }
            this.isShowCreate = true;
        },
        /**
         * 添加完成
         */
        createComplete() {
            if (!this.$refs.mobileShowCreate.check()) {
                return;
            }
            console.log("添加完成");
            Api.mobileShow.create(this.$refs.mobileShowCreate.vo).then(res => {
                this.isShowCreate = false;
                this.getPageList_api();
            });
        },
        /**
         * 编辑
         */
        edit(row) {
            this.selectedVO = row;
            console.log("编辑" + this.selectedVO.id);
            this.isShowEdit = true;
            if (this.$refs.mobileShowEdit) {
                this.$refs.mobileShowEdit.init(this.selectedVO.id);
            }
        },
        /**
         * 编辑完成
         */
        editComplete() {
            if (!this.$refs.mobileShowEdit.check()) {
                return;
            }
            console.log("编辑完成");
            Api.mobileShow.update(this.$refs.mobileShowEdit.vo).then(res => {
                this.isShowEdit = false;
                this.getPageList_api();
            });
        },
        /**
         * 编辑状态
         */
        updateStatus(row, value) {
            this.selectedVO = row;
            let obj = { id: this.selectedVO.id, status: value };
            Api.mobileShow.updateStatus(obj).then(res => {
                this.getPageList_api();
            });
        },

        /**
         * 切换页码
         */
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.so.page = val;
            this.getPageList_api();
        },
        /**
         * 改变每页数量
         */
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.so.page = 1;
            this.so.pageSize = val;
            this.getPageList_api();
        },

        /**
         * 查询
         */
        getPageList_api() {
            Api.mobileShow.getPageList(this.so).then(res => {
                this.pageList = res;
            });
        },

        search() {
            console.log("查询按钮");
            this.so.page = 1;
            this.getPageList_api();
        },
        /**
         * 展会时间格式化
         */
        formatter(row) {
            if (row.openTime && row.endTime) {
                return (
                    moment(row.openTime).format("YYYY/M/D") +
                    "-" +
                    moment(row.endTime).format("YYYY/M/D")
                );
            }
            return "";
        },
        /**
         * 参展城市数量格式化
         */
        cityCountFormatter(row) {
            if (row.cityCodeList) {
                let arr = row.cityCodeList.split(",");
                return arr.length;
            }
            return "";
        },
        /**
         * 状态格式化
         */
        statusFormatter(row) {
            if (row.status == 1) {
                return "正常";
            } else if (row.status == 2) {
                return "关闭";
            } else {
                return "";
            }
        }
    }
};
</script>

<style>
.form {
    padding: 12px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>

