<template>
    <div>
        <!--搜索界面-->
        <SampleSearch :search="search" :so="so"></SampleSearch>
        <!--按钮-->
        <div style="margin:6px 0;">
            <el-button @click="create()">添加</el-button>
            <el-button @click="batchExport()">导出</el-button>
        </div>
        <!--列表-->
        <div class="form">
            <el-table :data="pageList.items" ref="listTable" border style="width: 100%;">
                <el-table-column label="id" prop="id"></el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column label="创建日期" prop="createTime" :formatter="formatter"></el-table-column>

                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="view(scope.row)" type="text">查看</el-button>
                        <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                        <el-button @click="remove(scope.row)" type="text">删除</el-button>
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
            <SampleDialog ref="sampleDialog" :selectedVO="selectedVO"></SampleDialog>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowDialog = false">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加" :visible.sync="isShowCreate">
            <SampleCreate ref="sampleCreate"></SampleCreate>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowCreate = false">取消</el-button>
                <el-button type="primary" @click="createComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑" :visible.sync="isShowEdit">
            <SampleEdit ref="sampleEdit" :selectedVO="selectedVO"></SampleEdit>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowEdit = false">取消</el-button>
                <el-button type="primary" @click="editComplete()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style>
.form {
    padding: 12px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>

<script>
import Api from "api";

import moment from "moment";
import XLSX from "xlsx";
import saveAs from "file-saver";

import SampleSearch from "./SampleSearch";
import SampleDialog from "./SampleDialog";
import SampleCreate from "./SampleCreate";
import SampleEdit from "./SampleEdit";

export default {
    components: {
        SampleSearch,
        SampleDialog,
        SampleCreate,
        SampleEdit
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
                name: "",
                remark: "",
                startTime: null,
                endTime: null
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
            if (this.$refs.sampleDialog) {
                this.$refs.sampleDialog.init(this.selectedVO.id);
            }
        },
        /**
         * 添加
         */
        create() {
            console.log("添加");
            if (this.$refs.sampleCreate) {
                this.$refs.sampleCreate.init();
            }
            this.isShowCreate = true;
        },
        /**
         * 添加完成
         */
        createComplete() {
            if (!this.$refs.sampleCreate.check()) {
                return;
            }
            console.log("添加完成");
            Api.sample.create(this.$refs.sampleCreate.vo).then(res => {
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
            if (this.$refs.sampleEdit) {
                this.$refs.sampleEdit.init(this.selectedVO.id);
            }
        },
        /**
         * 编辑完成
         */
        editComplete() {
            if (!this.$refs.sampleEdit.check()) {
                return;
            }
            console.log("编辑完成");
            Api.sample.update(this.$refs.sampleEdit.vo).then(res => {
                this.isShowEdit = false;
                this.getPageList_api();
            });
        },
        /**
         * 删除
         */
        remove(row) {
            this.selectedVO = row;
            console.log("删除");
            this.$confirm("您确定要删除这条数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(_ => {
                    Api.sample.remove(this.selectedVO).then(res => {
                        this.getPageList_api();
                    });
                })
                .catch(_ => {});
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
            Api.sample.getPageList(this.so).then(res => {
                this.pageList = res;
            });
        },

        search() {
            console.log("查询按钮");
            this.so.page = 1;
            this.getPageList_api();
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
                    名称: p.name,
                    备注: p.remark,
                    创建时间: this.formatter(p)
                };
                data.push(obj);
            }

            const ws = XLSX.utils.json_to_sheet(data, {
                header: ["id", "名称", "备注", "创建时间"]
            });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            const wbout = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array"
            });
            const name =
                "报表-" +
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



