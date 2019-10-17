<template>
    <div>
        <el-form label-position="left" label-width="10px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item>{{selectedVO.name}}</el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--搜索界面-->
        <div class="search-form">
            <el-form label-position="right" label-width="70px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="结束时间">
                            <el-date-picker
                                style="width: 150px;"
                                v-model="so.time"
                                type="date"
                                placeholder="请选择日期"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item label="车型">
                            <Car ref="car"></Car>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="text-align: right;">
                    <el-button type="primary" @click="searchBtn()">查询</el-button>
                    <el-button @click="clear()">重置</el-button>
                </el-row>
            </el-form>
        </div>
        <!--按钮-->
        <div style="margin:6px 0;">
            <el-button @click="create()">新增车辆</el-button>
        </div>

        <!--列表-->
        <div class="form">
            <el-table :data="list" ref="listTable" style="width: 100%;">
                <el-table-column label="序号" prop="sort"></el-table-column>
                <el-table-column label="品牌" prop="brandName"></el-table-column>
                <el-table-column label="车型" prop="modelName"></el-table-column>
                <el-table-column label="当前售价（万元）" prop="salePrice"></el-table-column>
                <el-table-column label="活动结束日期" :formatter="formatter"></el-table-column>
                <el-table-column label="状态" :formatter="statusFormatter"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                        <el-button @click="remove(scope.row)" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--弹出界面-->
        <el-dialog title="新增车辆" width="70%" :visible.sync="isShowCreate" :append-to-body="true">
            <CarCreate ref="carCreate"></CarCreate>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowCreate = false">取消</el-button>
                <el-button type="primary" @click="createComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑车辆" width="70%" :visible.sync="isShowEdit" :append-to-body="true">
            <CarEdit ref="carEdit" :selectedCar="selectedCar"></CarEdit>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowEdit = false">取消</el-button>
                <el-button type="primary" @click="editComplete()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style>
.search-form {
    padding: 12px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
.form {
    padding: 12px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>

<script>
import Api from "api";
import Car from "../components/Car";
import CarCreate from "./car/CarCreate";
import CarEdit from "./car/CarEdit";
import moment from "moment";
export default {
    components: {
        Car,
        CarCreate,
        CarEdit
    },
    props: {
        selectedVO: null
    },
    data() {
        return {
            so: {
                hallCode: "",
                time: null,
                timeStr: "",
                modelCode: ""
            },
            list: [],
            /**
             * 当前选中对象
             */
            selectedCar: null,
            isShowCreate: false,
            isShowEdit: false
        };
    },
    mounted() {
        this.init(this.selectedVO.uuid);
    },
    methods: {
        init(uuid) {
            this.so = {};
            this.so.hallCode = uuid;
            this.getCarList_api();
        },
        /**
         * 查询特价车列表
         */
        getCarList_api() {
            Api.discountCar.selectList(this.so).then(res => {
                this.list = res;
            });
        },
        formatter(row) {
            return moment(row.endTime).format("YYYY-MM-DD");
        },
        statusFormatter(row) {
            if (row.status == true) {
                return "上线";
            } else if (row.status == false) {
                return "下线";
            } else {
                return "未知";
            }
        },
        clear() {
            console.log("清空查询");
            this.so.modelCode = "";
            this.so.time = null;
            this.so.timeStr = "";
            //清空车型
            this.$refs.car.clear();
        },
        searchBtn() {
            console.log("查询");
            this.so.timeStr = "";
            this.so.modelCode = "";
            if (this.so.time) {
                this.so.timeStr = moment(this.so.time).format("YYYY-MM-DD");
            }

            //选择了品牌，必须选择车型
            if (this.$refs.car.brandCode) {
                if (!this.$refs.car.modelCode) {
                    this.$message.warning("选择了品牌，必须选择车型");
                    return;
                }
                this.so.modelCode = this.$refs.car.modelCode;
            }

            this.getCarList_api();
        },

        /**
         * 添加
         */
        create() {
            console.log("添加");
            if (this.$refs.carCreate) {
                this.$refs.carCreate.init();
            }
            this.isShowCreate = true;
        },
        /**
         * 添加完成
         */
        createComplete() {
            if (!this.$refs.carCreate.check()) {
                return;
            }
            console.log("添加完成");
            //门店编码
            this.$refs.carCreate.vo.hallCode = this.selectedVO.uuid;
            Api.discountCar.create(this.$refs.carCreate.vo).then(res => {
                this.isShowCreate = false;
                this.getCarList_api();
            });
        },
        /**
         * 编辑
         */
        edit(row) {
            this.selectedCar = row;
            console.log("编辑" + this.selectedCar.id);
            this.isShowEdit = true;
            if (this.$refs.carEdit) {
                this.$refs.carEdit.init(this.selectedCar.id);
            }
        },
        /**
         * 编辑完成
         */
        editComplete() {
            if (!this.$refs.carEdit.check()) {
                return;
            }
            console.log("编辑完成");
            //门店编码
            this.$refs.carEdit.vo.hallCode = this.selectedVO.uuid;
            Api.discountCar.update(this.$refs.carEdit.vo).then(res => {
                this.isShowEdit = false;
                this.getCarList_api();
            });
        },
        /**
         * 删除
         */
        remove(row) {
            this.selectedCar = row;
            console.log("删除");
            this.$confirm("您确定要删除这条数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(_ => {
                    Api.discountCar.deleteCar(this.selectedCar).then(res => {
                        this.getCarList_api();
                    });
                })
                .catch(_ => {});
        }
    }
};
</script>
