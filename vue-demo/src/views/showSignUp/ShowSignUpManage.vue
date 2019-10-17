<template>
    <div>
        <!--搜索界面-->
        <ShowSignUpSearch :search="search" :so="so"></ShowSignUpSearch>
        <!--按钮-->
        <div style="margin:6px 0;">
            <el-button @click="batchExport()">导出</el-button>
        </div>
        <!--列表-->
        <div class="form">
            <el-table :data="pageList.items" ref="listTable" border style="width: 100%;">
                <el-table-column label="id" prop="id"></el-table-column>
                <el-table-column label="手机号" prop="mobile"></el-table-column>
                <el-table-column label="报名城市" prop="cityName"></el-table-column>
                <el-table-column label="意向品牌" prop="brandName"></el-table-column>
                <el-table-column label="意向车系" prop="seriesName"></el-table-column>
                <el-table-column label="展会名称" prop="showName"></el-table-column>
                <el-table-column label="展会时间" :formatter="showFormatter"></el-table-column>
                <el-table-column label="展会城市" prop="cityNameList"></el-table-column>
                <el-table-column label="报名时间" :formatter="formatter"></el-table-column>
            </el-table>
            <!--total 总条目数   current-page 当前页数    page-size 每页显示条目个数  -->
            <el-pagination
                style="text-align: right;margin-top:5px;"
                background
                :page-sizes="[ 10, 50, 100,1000,3000]"
                :total="pageList.totalNumber"
                :current-page="so.page"
                :page-size="so.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </div>

        <el-dialog title="查看界面" width="50%" :visible.sync="isShowDialog">
            <ShowSignUpDialog ref="showSignUpDialog" :selectedVO="selectedVO"></ShowSignUpDialog>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowDialog = false">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加界面" :visible.sync="isShowCreate">
            <ShowSignUpCreate ref="showSignUpCreate"></ShowSignUpCreate>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowCreate = false">取消</el-button>
                <el-button type="primary" @click="createComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑界面" :visible.sync="isShowEdit">
            <ShowSignUpEdit ref="showSignUpEdit" :selectedVO="selectedVO"></ShowSignUpEdit>
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

import ShowSignUpSearch from "./ShowSignUpSearch";
import ShowSignUpDialog from "./ShowSignUpDialog";
import ShowSignUpCreate from "./ShowSignUpCreate";
import ShowSignUpEdit from "./ShowSignUpEdit";

export default {
    components: {
        ShowSignUpSearch,
        ShowSignUpDialog,
        ShowSignUpCreate,
        ShowSignUpEdit
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
                mobile: ""
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
            if (this.$refs.showSignUpDialog) {
                this.$refs.showSignUpDialog.init(this.selectedVO.id);
            }
        },
        /**
         * 添加
         */
        create() {
            console.log("添加");
            if (this.$refs.showSignUpCreate) {
                this.$refs.showSignUpCreate.init();
            }
            this.isShowCreate = true;
        },
        /**
         * 添加完成
         */
        createComplete() {
            if (!this.$refs.showSignUpCreate.check()) {
                return;
            }
            console.log("添加完成");
            Api.showSignUp.create(this.$refs.showSignUpCreate.vo).then(res => {
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
            if (this.$refs.showSignUpEdit) {
                this.$refs.showSignUpEdit.init(this.selectedVO.id);
            }
        },
        /**
         * 编辑完成
         */
        editComplete() {
            if (!this.$refs.showSignUpEdit.check()) {
                return;
            }
            console.log("编辑完成");
            Api.showSignUp.update(this.$refs.showSignUpEdit.vo).then(res => {
                this.isShowEdit = false;
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
            Api.showSignUp.getPageList(this.so).then(res => {
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
        showFormatter(row) {
            if (row.openTime && row.endTime) {
                return (
                    moment(row.openTime).format("YYYY/M/D") +
                    "-" +
                    moment(row.endTime).format("YYYY/M/D")
                );
            }
            return "";
        },
        formatter(row) {
            return moment(row.dateCreate).format("YYYY-MM-DD HH:mm:ss");
        },
        batchExport() {
            if (
                !this.pageList ||
                !this.pageList.items ||
                this.pageList.items.length == 0
            ) {
                this.$message.warning("无数据");
                return;
            }
            const data = [];

            for (let i = 0; i < this.pageList.items.length; i++) {
                const p = this.pageList.items[i];

                const obj = {
                    id: p.id,
                    手机号: p.mobile,
                    报名城市: p.cityName,
                    意向品牌: p.brandName,
                    意向车系: p.seriesName,
                    展会名称: p.showName,
                    展会时间: this.showFormatter(p),
                    展会城市: p.cityNameList,
                    报名时间: this.formatter(p)
                };
                data.push(obj);
            }

            const ws = XLSX.utils.json_to_sheet(data, {
                header: [
                    "id",
                    "手机号",
                    "报名城市",
                    "意向品牌",
                    "意向车系",
                    "展会名称",
                    "展会时间",
                    "展会城市",
                    "报名时间"
                ]
            });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            const wbout = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array"
            });
            const name =
                "移动车展报名报表-" +
                moment(new Date()).format("YYYY-MM-DD HH-mm-ss") +
                ".xlsx";
            saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                name
            );
            this.$message.success(`导出成功`);
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

