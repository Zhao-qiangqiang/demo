<template>
    <div>
        <!--搜索界面-->
        <MemberSearch :search="search" :so="so"></MemberSearch>
        <!--按钮-->
        <div style="margin:6px 0;">
            <el-button @click="batchExport()">导出</el-button>
        </div>
        <!--列表-->
        <div class="form">
            <el-table :data="pageList.items" ref="listTable" border style="width: 100%;">
                <el-table-column label="用户ID" prop="userId"></el-table-column>
                <el-table-column label="手机号" prop="phone"></el-table-column>

                <el-table-column label="入会时间" prop="dateCreate"></el-table-column>
                <el-table-column label="用户来源" prop="source" :formatter="formatter"></el-table-column>
                <el-table-column label="入会门店" prop="hallName"></el-table-column>
                <el-table-column label="入店次数" prop="entranceCount"></el-table-column>
                <el-table-column label="当前积分" prop="memberIntegral"></el-table-column>
                <el-table-column label="是否为工作人员" prop="type" :formatter="peopleFormatter"></el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="view(scope.row)" type="text">查看</el-button>
                        <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--total 总条目数   current-page 当前页数    page-size 每页显示条目个数  -->
            <el-pagination
                style="text-align: right;margin-top:5px;"
                background
                :page-sizes="[10, 20, 50,100]"
                :total="pageList.totalNumber"
                :current-page="so.page"
                :page-size="so.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </div>

        <el-dialog title="详情" width="70%" :visible.sync="isShowDialog" @close="closeDialog()">
            <MemberDialog ref="memberDialog" :selectedVO="selectedVO"></MemberDialog>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowDialog = false">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑" width="40%" :visible.sync="isShowEdit">
            <MemberEdit ref="memberEdit" :selectedVO="selectedVO"></MemberEdit>
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

import MemberSearch from "./MemberSearch";
import MemberDialog from "./MemberDialog";
import MemberEdit from "./MemberEdit";

export default {
    components: {
        MemberSearch,
        MemberDialog,
        MemberEdit
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

                userId: "",
                phone: "",
                source: "",
                hallId: "",
                type: "",
                startTime: null,
                endTime: null,
                startTimeStr: "",
                endTimeStr: ""
            },
            /**
             * 当前选中对象
             */
            selectedVO: null,

            isShowDialog: false,
            isShowEdit: false
        };
    },
    methods: {
        /**
         * 查看
         */
        view(row) {
            this.selectedVO = row;
            console.log("查看" + this.selectedVO.phone);
            this.isShowDialog = true;
            if (this.$refs.memberDialog) {
                this.$refs.memberDialog.init(this.selectedVO);
            }
        },

        /**
         * 关闭弹窗，清除内部图片
         */
        closeDialog() {
            console.log("清理图片");
            if (this.$refs.memberDialog) {
                this.$refs.memberDialog.imageUrl = "";
            }
        },

        /**
         * 编辑
         */
        edit(row) {
            this.selectedVO = row;
            console.log("编辑" + this.selectedVO.phone);
            this.isShowEdit = true;
            if (this.$refs.memberEdit) {
                this.$refs.memberEdit.init(this.selectedVO);
            }
        },
        /**
         * 编辑完成
         */
        editComplete() {
            if (!this.$refs.memberEdit.check()) {
                return;
            }
            console.log("编辑完成");
            Api.member.updateType(this.$refs.memberEdit.vo).then(res => {
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
            Api.member.getPageList(this.so).then(res => {
                this.pageList = res;
            });
        },

        search() {
            console.log("查询按钮");
            this.so.page = 1;
            this.getPageList_api();
        },
        /**
         * 来源格式化
         */
        formatter(row) {
            if (row.source == 1) {
                return "小程序";
            } else if (row.source == 2) {
                return "美斯特";
            } else if (row.source == 3) {
                return "APP";
            }
            return "未知";
        },
        /**
         * 是否为工作人员
         */
        peopleFormatter(row) {
            if (row.type == 1) {
                return "是";
            } else if (row.type == 2) {
                return "否";
            } else {
                return "未知";
            }
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
                    用户ID: p.userId,
                    手机号: p.phone,
                    入会时间: p.dateCreate,
                    用户来源: this.formatter(p),
                    入会门店: p.hallName,
                    入店次数: p.entranceCount,
                    当前积分: p.memberIntegral,
                    是否为工作人员: this.peopleFormatter(p)
                };
                data.push(obj);
            }

            const ws = XLSX.utils.json_to_sheet(data, {
                header: [
                    "用户ID",
                    "手机号",
                    "入会时间",
                    "用户来源",
                    "入会门店",
                    "入店次数",
                    "当前积分",
                    "是否为工作人员"
                ]
            });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            const wbout = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array"
            });
            const name =
                "会员报表-" +
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

