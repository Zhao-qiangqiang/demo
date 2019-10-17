<template>
    <div>
        <!--搜索界面-->
        <HistoryCarSearch :search="search" :so="so"></HistoryCarSearch>
        <!--按钮-->
        <div style="margin:6px 0;">
            <el-button @click="batchExport()">导出</el-button>
        </div>
        <!--列表-->
        <div class="form">
            <el-table :data="pageList.items" ref="listTable" border style="width: 100%;">
                <el-table-column label="序号" type="index" width="100"></el-table-column>

                <el-table-column label="城市" prop="cityName"></el-table-column>
                <el-table-column label="门店" prop="hallName"></el-table-column>

                <el-table-column label="品牌" prop="brandName"></el-table-column>
                <el-table-column label="车型" prop="modelName"></el-table-column>
                <el-table-column label="车架号" prop="vin"></el-table-column>
                <el-table-column label="车牌" prop="plateNumber"></el-table-column>
                <el-table-column label="投展商类型" prop="supplierTypeStr"></el-table-column>
                <el-table-column label="投展商" prop="supplierName"></el-table-column>
                <el-table-column label="展期" prop="showTime"></el-table-column>
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
import HistoryCarSearch from "./HistoryCarSearch";
import moment from "moment";
import XLSX from "xlsx";
import saveAs from "file-saver";

export default {
    components: {
        HistoryCarSearch
    },
    mounted() {
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

                modelCode: "",
                cityCode: "",
                hallId: "",
                supplierType: "",
                supplierName: "",
                plateNumber: "",
                vin: "",
                activeTime: null,
                activeTimeStr: ""
            }
        };
    },
    methods: {
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
            Api.carRequest.getHistoryPageList(this.so).then(res => {
                this.pageList = res;
            });
        },

        search() {
            console.log("查询按钮");
            this.so.page = 1;
            this.getPageList_api();
        },
        batchExport() {
            console.log("导出");
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
                    序号: i + 1,
                    城市: p.cityName,
                    门店: p.hallName,
                    品牌: p.brandName,

                    车型: p.modelName,
                    车架号: p.vin,
                    车牌: p.plateNumber,
                    投展商类型: p.supplierTypeStr,
                    投展商: p.supplierName,
                    展期: p.showTime
                };
                data.push(obj);
            }

            const ws = XLSX.utils.json_to_sheet(data, {
                header: [
                    "序号",
                    "城市",
                    "门店",
                    "品牌",

                    "车型",
                    "车架号",
                    "车牌",
                    "投展商类型",
                    "投展商",
                    "展期"
                ]
            });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            const wbout = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array"
            });
            const name =
                "历史展车-" +
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


