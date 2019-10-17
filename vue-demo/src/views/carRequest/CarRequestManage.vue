<template>
    <div>
        <!--搜索界面-->
        <CarRequestSearch :search="search" :so="so"></CarRequestSearch>
        <!--按钮-->
        <div style="margin:6px 0;">
            <el-button @click="createInput()">新增入库单</el-button>
            <el-button @click="createOutput()">新增出库单</el-button>
            <el-button @click="batchExport()">导出</el-button>
        </div>
        <!--列表-->
        <div class="form">
            <el-table :data="pageList.items" ref="listTable" border style="width: 100%;">
                <el-table-column label="序号" type="index" width="100"></el-table-column>

                <el-table-column label="城市" prop="cityName"></el-table-column>
                <el-table-column label="门店" prop="hallName"></el-table-column>
                <el-table-column label="业务类型" prop="typeStr"></el-table-column>

                <el-table-column label="品牌" prop="brandName"></el-table-column>
                <el-table-column label="车型" prop="modelName"></el-table-column>
                <el-table-column label="车架号" prop="vin"></el-table-column>
                <el-table-column label="车牌" prop="plateNumber"></el-table-column>

                <el-table-column label="投展商类型" prop="supplierTypeStr"></el-table-column>
                <el-table-column label="投展商" prop="supplierName"></el-table-column>

                <el-table-column label="出/入库时间">
                    <template
                        slot-scope="scope"
                    >{{!scope.row.moveTime?"":scope.row.moveTime.split(" ")[0]}}</template>
                </el-table-column>

                <el-table-column label="申请时间">
                    <template
                        slot-scope="scope"
                    >{{!scope.row.dateCreate?"":scope.row.dateCreate.split(" ")[0]}}</template>
                </el-table-column>
                <el-table-column label="展位" prop="boothNumber"></el-table-column>
                <el-table-column label="状态" prop="statusStr"></el-table-column>

                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="view(scope.row)" type="text">查看</el-button>
                        <el-button
                            v-if="scope.row.status==1"
                            @click="edit(scope.row)"
                            type="text"
                        >编辑</el-button>
                        <el-button
                            v-if="scope.row.status==1 "
                            @click="approval(scope.row)"
                            type="text"
                        >审批</el-button>
                        <el-button
                            v-if="scope.row.status==2 "
                            @click="output(scope.row)"
                            type="text"
                        >出库</el-button>
                        <el-button
                            v-if="scope.row.status==3 "
                            @click="input(scope.row)"
                            type="text"
                        >入库</el-button>
                        <el-button
                            v-if="scope.row.status<4 "
                            @click="close(scope.row)"
                            type="text"
                        >关闭</el-button>
                    </template>
                </el-table-column>
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

        <el-dialog title="查看" :visible.sync="isShowDialog" @close="closeDialog()">
            <CarRequestDialog ref="carRequestDialog" :selectedVO="selectedVO"></CarRequestDialog>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowDialog = false">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增入库单" width="55%" :visible.sync="isShowCreate" @close="closeDialog()">
            <CarRequestCreate ref="carRequestCreate"></CarRequestCreate>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowCreate = false">取消</el-button>
                <el-button type="primary" @click="createInputComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="新增出库单"
            width="55%"
            :visible.sync="isShowCreateOutput"
            @close="closeDialog()"
        >
            <CarRequestCreateOutput ref="carRequestCreateOutput"></CarRequestCreateOutput>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowCreateOutput = false">取消</el-button>
                <el-button type="primary" @click="createOutputComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑入库单" width="55%" :visible.sync="isShowEdit" @close="closeDialog()">
            <CarRequestEdit ref="carRequestEdit" :selectedVO="selectedVO"></CarRequestEdit>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowEdit = false">取消</el-button>
                <el-button type="primary" @click="editComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="编辑出库单"
            width="55%"
            :visible.sync="isShowEditOutput"
            @close="closeDialog()"
        >
            <CarRequestEditOutput ref="carRequestEditOutput" :selectedVO="selectedVO"></CarRequestEditOutput>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowEditOutput = false">取消</el-button>
                <el-button type="primary" @click="editOutputComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="入库" width="55%" :visible.sync="isShowInput" @close="closeDialog()">
            <CarRequestInput ref="carRequestInput" :selectedVO="selectedVO"></CarRequestInput>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowInput = false">取消</el-button>
                <el-button type="primary" @click="inputComplete()">入库</el-button>
            </span>
        </el-dialog>

        <el-dialog title="出库" width="55%" :visible.sync="isShowOutput" @close="closeDialog()">
            <CarRequestOutput ref="carRequestOutput" :selectedVO="selectedVO"></CarRequestOutput>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowOutput = false">取消</el-button>
                <el-button type="primary" @click="outputComplete()">出库</el-button>
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
import moment from "moment";
import XLSX from "xlsx";
import saveAs from "file-saver";
import Api from "api";
import CarRequestSearch from "./CarRequestSearch";
import CarRequestDialog from "./CarRequestDialog";
import CarRequestCreate from "./CarRequestCreate";
import CarRequestEdit from "./CarRequestEdit";
import CarRequestInput from "./CarRequestInput";

import CarRequestCreateOutput from "./CarRequestCreateOutput";
import CarRequestEditOutput from "./CarRequestEditOutput";
import CarRequestOutput from "./CarRequestOutput";

export default {
    components: {
        CarRequestSearch,
        CarRequestDialog,
        CarRequestCreate,
        CarRequestEdit,
        CarRequestInput,
        //出库单创建界面
        CarRequestCreateOutput,
        //出库单编辑界面
        CarRequestEditOutput,
        //出库界面
        CarRequestOutput
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
                type: "",
                cityCode: "",
                hallId: "",
                status: "",
                supplierType: "",
                supplierName: "",
                plateNumber: "",
                vin: ""
            },
            /**
             * 当前选中对象
             */
            selectedVO: null,

            isShowDialog: false,
            isShowCreate: false,
            isShowEdit: false,
            isShowInput: false,

            isShowCreateOutput: false,
            isShowEditOutput: false,
            isShowOutput: false
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
            if (this.$refs.carRequestDialog) {
                this.$refs.carRequestDialog.init(this.selectedVO.uuid);
            }
        },
        /**
         * 关闭弹窗，清除内部图片
         */
        closeDialog() {
            if (this.$refs.carRequestDialog) {
                this.$refs.carRequestDialog.clear();
            }
            if (this.$refs.carRequestCreate) {
                this.$refs.carRequestCreate.clear();
            }
            if (this.$refs.carRequestCreateOutput) {
                this.$refs.carRequestCreateOutput.clear();
            }
            if (this.$refs.carRequestEdit) {
                this.$refs.carRequestEdit.clear();
            }
            if (this.$refs.carRequestEditOutput) {
                this.$refs.carRequestEditOutput.clear();
            }
            if (this.$refs.carRequestInput) {
                this.$refs.carRequestInput.clear();
            }
            if (this.$refs.carRequestOutput) {
                this.$refs.carRequestOutput.clear();
            }
        },
        /**
         * 添加入库单
         */
        createInput() {
            console.log("添加入库单");
            if (this.$refs.carRequestCreate) {
                this.$refs.carRequestCreate.init();
            }
            this.isShowCreate = true;
        },
        /**
         * 添加入库单完成
         */
        createInputComplete() {
            if (!this.$refs.carRequestCreate.check()) {
                return;
            }
            console.log("添加入库单完成");
            console.log(this.$refs.carRequestCreate.vo);
            Api.carRequest.create(this.$refs.carRequestCreate.vo).then(res => {
                this.isShowCreate = false;
                this.getPageList_api();
            });
        },

        /**
         * 添加出库单
         */
        createOutput() {
            console.log("添加出库单");
            if (this.$refs.carRequestCreateOutput) {
                this.$refs.carRequestCreateOutput.init();
            }
            this.isShowCreateOutput = true;
        },
        /**
         * 添加出库单完成
         */
        createOutputComplete() {
            if (!this.$refs.carRequestCreateOutput.check()) {
                return;
            }
            console.log("添加出库单完成");
            console.log(this.$refs.carRequestCreateOutput.vo);
            Api.carRequest
                .create(this.$refs.carRequestCreateOutput.vo)
                .then(res => {
                    this.isShowCreateOutput = false;
                    this.getPageList_api();
                });
        },

        /**
         * 编辑
         */
        edit(row) {
            this.selectedVO = row;
            //入库单
            if (this.selectedVO.type == 1) {
                console.log(`编辑入库单${this.selectedVO.uuid}`);
                this.isShowEdit = true;
                if (this.$refs.carRequestEdit) {
                    this.$refs.carRequestEdit.init(this.selectedVO.uuid);
                }
            } else {
                console.log(`编辑出库单${this.selectedVO.uuid}`);
                this.isShowEditOutput = true;
                if (this.$refs.carRequestEditOutput) {
                    this.$refs.carRequestEditOutput.init(this.selectedVO.uuid);
                }
            }
        },
        /**
         * 编辑入库单完成
         */
        editComplete() {
            if (!this.$refs.carRequestEdit.check()) {
                return;
            }
            console.log("编辑入库单完成");
            console.log(this.$refs.carRequestEdit.vo);
            Api.carRequest.update(this.$refs.carRequestEdit.vo).then(res => {
                this.isShowEdit = false;
                this.getPageList_api();
            });
        },
        /**
         * 编辑出库单完成
         */
        editOutputComplete() {
            if (!this.$refs.carRequestEditOutput.check()) {
                return;
            }
            console.log("编辑出库单完成");
            console.log(this.$refs.carRequestEditOutput.vo);
            Api.carRequest
                .update(this.$refs.carRequestEditOutput.vo)
                .then(res => {
                    this.isShowEditOutput = false;
                    this.getPageList_api();
                });
        },
        /**
         * 审批
         */
        approval(row) {
            this.selectedVO = row;
            console.log(`审批入库单${this.selectedVO.uuid}`);
            let obj = { uuid: this.selectedVO.uuid };
            Api.carRequest.approval(obj).then(res => {
                this.$message.success("审批成功");
                this.getPageList_api();
            });
        },
        /**
         * 关闭
         */
        close(row) {
            this.selectedVO = row;
            console.log(`关闭入库单${this.selectedVO.uuid}`);
            let obj = { uuid: this.selectedVO.uuid };
            Api.carRequest.close(obj).then(res => {
                this.$message.success("关闭成功");
                this.getPageList_api();
            });
        },
        /**
         * 入库
         */
        input(row) {
            this.selectedVO = row;
            console.log(`入库${this.selectedVO.uuid}`);
            this.isShowInput = true;
            if (this.$refs.carRequestInput) {
                this.$refs.carRequestInput.init(this.selectedVO.uuid);
            }
        },
        /**
         * 入库完成
         */
        inputComplete() {
            if (!this.$refs.carRequestInput.check()) {
                return;
            }
            console.log("入库完成");
            console.log(this.$refs.carRequestInput.vo);
            Api.carRequest.input(this.$refs.carRequestInput.vo).then(res => {
                this.isShowInput = false;
                this.$message.success("入库成功");
                this.getPageList_api();
            });
        },
        /**
         * 出库
         */
        output(row) {
            this.selectedVO = row;
            console.log(`出库${this.selectedVO.uuid}`);
            this.isShowOutput = true;
            if (this.$refs.carRequestOutput) {
                this.$refs.carRequestOutput.init(this.selectedVO.uuid);
            }
        },
        /**
         * 出库完成
         */
        outputComplete() {
            if (!this.$refs.carRequestOutput.check()) {
                return;
            }
            console.log("出库完成");
            console.log(this.$refs.carRequestOutput.vo);
            Api.carRequest.output(this.$refs.carRequestOutput.vo).then(res => {
                this.isShowOutput = false;
                this.$message.success("出库成功");
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
            Api.carRequest.getPageList(this.so).then(res => {
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
                    业务类型: p.typeStr,
                    品牌: p.brandName,
                    车型: p.modelName,
                    车架号: p.vin,
                    车牌: p.plateNumber,
                    投展商类型: p.supplierTypeStr,
                    投展商: p.supplierName,
                    "出/入库时间": !p.moveTime ? "" : p.moveTime.split(" ")[0],
                    申请时间: !p.dateCreate ? "" : p.dateCreate.split(" ")[0],
                    展位: p.boothNumber,
                    状态: p.statusStr
                };
                data.push(obj);
            }

            const ws = XLSX.utils.json_to_sheet(data, {
                header: [
                    "序号",
                    "城市",
                    "门店",
                    "业务类型",
                    "品牌",
                    "车型",
                    "车架号",
                    "车牌",
                    "投展商类型",
                    "投展商",
                    "出/入库时间",
                    "申请时间",
                    "展位",
                    "状态"
                ]
            });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            const wbout = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array"
            });
            const name =
                "车辆申请单-" +
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

