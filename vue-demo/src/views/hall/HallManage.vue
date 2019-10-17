<template>
    <div>
        <!--搜索界面-->
        <HallSearch :search="search" :so="so"></HallSearch>
        <!--按钮-->
        <div style="margin:6px 0;">
            <el-button @click="init()">同步门店信息</el-button>
        </div>
        <!--列表-->
        <div class="form">
            <el-table :data="pageList.items" ref="listTable" border style="width: 100%;">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="门店简称" prop="name"></el-table-column>
                <el-table-column label="店铺编码" prop="ownerShopCode"></el-table-column>
                <el-table-column label="店铺名称" prop="ownerShopName"></el-table-column>
                <el-table-column label="城市" prop="cityName"></el-table-column>
                <el-table-column label="地址" prop="address"></el-table-column>
                <el-table-column label="联系方式" prop="phone"></el-table-column>
                <el-table-column label="营业时间">
                    <template
                        slot-scope="scope"
                    >{{scope.row.openTime?scope.row.openTime+"-"+scope.row.closeTime:"暂无"}}</template>
                </el-table-column>
                <el-table-column label="状态">
                    <template
                        slot-scope="scope"
                    >{{scope.row.status===1?"正常":scope.row.status===2?"暂停":"关闭"}}</template>
                </el-table-column>

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
                :page-sizes="[ 10, 20, 50, 100]"
                :total="pageList.totalNumber"
                :current-page="so.page"
                :page-size="so.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </div>

        <el-dialog title="查看" :visible.sync="isShowDialog">
            <HallDialog ref="hallDialog" :selectedVO="selectedVO"></HallDialog>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowDialog = false">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="isShowEdit">
            <HallEdit ref="hallEdit" :selectedVO="selectedVO"></HallEdit>
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
import HallSearch from "./HallSearch";
import HallDialog from "./HallDialog";
import HallEdit from "./HallEdit";
import moment from "moment";

export default {
    components: {
        HallSearch,
        HallDialog,
        HallEdit
    },
    mounted() {
        console.log("管理界面初始化");
        this.getPageList_api();
    },
    data() {
        return {
            /**
             * 列表数据
             */
            pageList: {},

            so: {
                /**
                 * 当前页码
                 */
                page: 1,
                /**
                 * 每页数量
                 */
                pageSize: 10,
                /**
                 * 门店名称
                 */
                hallName: "",
                /**
                 * 城市编码列表
                 */
                cityCodeList: "",
                status: ""
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
            console.log(`查看${this.selectedVO.uuid}`);
            this.isShowDialog = true;
            if (this.$refs.hallDialog) {
                this.$refs.hallDialog.get_api(this.selectedVO.uuid);
            }
        },
        /**
         * 编辑
         */
        edit(row) {
            this.selectedVO = row;
            console.log(`编辑${this.selectedVO.uuid}`);
            this.isShowEdit = true;
            if (this.$refs.hallEdit) {
                this.$refs.hallEdit.get_api(this.selectedVO.uuid);
            }
        },
        /**
         * 编辑完成
         */
        editComplete() {
            if (!this.$refs.hallEdit.check()) {
                return;
            }
            console.log("编辑完成");
            let vo = this.$refs.hallEdit.vo;
            vo.hallId = vo.uuid;
            vo.hallName = vo.name;
            vo.devices = JSON.stringify(vo.deviceList);
            console.log(vo);
            Api.hall.update(vo).then(res => {
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
            Api.hall.getPageList(this.so).then(res => {
                this.pageList = res;
            });
        },

        search() {
            console.log("管理界面-查询");
            this.so.page = 1;
            console.log(this.so);
            this.getPageList_api();
        },
        /**
         * 同步门店信息
         */
        init() {
            console.log("同步门店信息");
            Api.hall.init().then(res => {
                this.$message.success("同步门店信息成功");
                this.getPageList_api();
            });
        }
    }
};
</script>

