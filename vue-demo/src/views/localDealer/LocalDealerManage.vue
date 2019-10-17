<template>
    <div>
        <!--搜索界面-->
        <LocalDealerSearch :search="search" :so="so"></LocalDealerSearch>
        <!--按钮-->
        <div style="margin:6px 0;"></div>
        <!--列表-->
        <div class="form">
            <el-table :data="pageList.items" ref="listTable" border style="width: 100%;">
                <el-table-column label="序号" type="index" width="100"></el-table-column>

                <el-table-column label="城市" prop="cityName"></el-table-column>
                <el-table-column label="门店" prop="name"></el-table-column>
                <el-table-column label="已配置数量" prop="localDealerNum"></el-table-column>

                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
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

        <el-dialog title="编辑" width="90%" :visible.sync="isShowEdit" @close="closeDialog()">
            <LocalDealerEdit ref="localDealerEdit" :selectedVO="selectedVO"></LocalDealerEdit>
        </el-dialog>
    </div>
</template>

<script>
import Api from "api";

import moment from "moment";
import XLSX from "xlsx";
import saveAs from "file-saver";

import LocalDealerSearch from "./LocalDealerSearch";
import LocalDealerEdit from "./LocalDealerEdit";

export default {
    components: {
        LocalDealerSearch,
        LocalDealerEdit
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
            isShowEdit: false
        };
    },
    methods: {
        /**
         * 编辑
         */
        edit(row) {
            this.selectedVO = row;
            console.log("编辑" + this.selectedVO.uuid);
            this.isShowEdit = true;
            if (this.$refs.localDealerEdit) {
                this.$refs.localDealerEdit.init(this.selectedVO.uuid);
            }
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
            Api.localDealer.getHallPageList(this.so).then(res => {
                this.pageList = res;
            });
        },

        search() {
            console.log("查询按钮");
            this.so.page = 1;
            this.getPageList_api();
        },
        /**
         * 关闭弹窗，重新查询
         */
        closeDialog() {
            console.log("关闭弹窗，重新查询");
            this.search();
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

