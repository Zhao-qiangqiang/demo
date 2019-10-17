<template>
    <div class="search-form">
        <el-form label-position="right" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="15">
                    <el-form-item label="车型">
                        <Car ref="car"></Car>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="业务类型">
                        <el-select v-model="so.type" clearable placeholder="请选择">
                            <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="城市">
                        <el-select v-model="so.cityCode" clearable filterable placeholder="请选择">
                            <el-option
                                v-for="item in cityList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="门店">
                        <el-select v-model="so.hallId" clearable filterable placeholder="请选择">
                            <el-option
                                v-for="item in hallList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.uuid"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态">
                        <el-select v-model="so.status" clearable placeholder="请选择">
                            <el-option
                                v-for="item in stateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="投展商类型">
                        <el-select v-model="so.supplierType" clearable placeholder="请选择">
                            <el-option
                                v-for="item in supplierTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="投展商">
                        <el-input maxlength="30" v-model="so.supplierName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="车牌">
                        <el-input maxlength="30" v-model="so.plateNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="车架号">
                        <el-input maxlength="30" v-model="so.vin"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="text-align: right;">
                <el-button type="primary" @click="searchBtn()">查询</el-button>
                <el-button @click="clear()">重置</el-button>
            </el-row>
        </el-form>
    </div>
</template>

<style>
.search-form {
    padding: 12px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>

<script>
import Api from "api";
import Car from "../components/Car";
export default {
    components: {
        Car
    },
    props: {
        so: {
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
        search: Function
    },
    mounted() {
        console.log("查询界面初始化");
        this.getHallList_api();
        this.getCityList_api();
    },
    data() {
        return {
            /**
             * 状态
             */
            stateList: [
                { value: 1, label: "待审批" },
                { value: 2, label: "待出库" },
                { value: 3, label: "待入库" },
                { value: 4, label: "完成" },
                { value: 5, label: "关闭" }
            ],
            /**
             * 业务类型
             */
            typeList: [
                { value: 1, label: "入库" },
                { value: 2, label: "出库" }
            ],
            /**
             * 投展商类型
             */
            supplierTypeList: [
                { value: 1, label: "4s/二网" },
                { value: 3, label: "自营" },
                { value: 4, label: "主机厂" }
            ],
            /**
             * 门店列表
             */
            hallList: [],
            /**
             * 城市列表
             */
            cityList: []
        };
    },
    methods: {
        clear() {
            console.log("清空查询");
            //清空车型
            this.$refs.car.clear();
            this.so.brandCode = "";
            this.so.type = "";
            this.so.cityCode = "";
            this.so.hallId = "";
            this.so.status = "";
            this.so.supplierType = "";
            this.so.supplierName = "";
            this.so.plateNumber = "";
            this.so.vin = "";
        },
        searchBtn() {
            console.log("查询");

            this.so.modelCode = "";
            console.log(this.carData);
            //选择了品牌，必须选择车型
            if (this.$refs.car.brandCode) {
                if (!this.$refs.car.modelCode) {
                    this.$message.warning("选择了品牌，必须选择车型");
                    return;
                }
                this.so.modelCode = this.$refs.car.modelCode;
            }
            if (!this.so.cityCode) {
                this.so.cityCode = "";
            }
            if (!this.so.hallId) {
                this.so.hallId = "";
            }

            this.search();
        },
        /**
         * 获取门店列表
         */
        getHallList_api() {
            Api.hall.getPageList().then(res => {
                this.hallList = res.items;
            });
        },
        /**
         * 获取城市列表
         */
        getCityList_api() {
            Api.hall.getCityList().then(res => {
                this.cityList = [];
                for (let i = 0; i < res.length; i++) {
                    let p = res[i].children;
                    for (let j = 0; j < p.length; j++) {
                        this.cityList.push(p[j]);
                    }
                }
            });
        }
    }
};
</script>

