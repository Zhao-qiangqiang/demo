<template>
    <div>
        <el-form label-position="right" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="门店" required>
                        <el-select
                            v-model="vo.hallId"
                            clearable
                            filterable
                            placeholder="请选择"
                            @change="changeHall()"
                        >
                            <el-option
                                v-for="item in hallList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.uuid"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="车型">{{vo.modelName}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="车架号" required>
                        <el-select
                            v-model="vo.vin"
                            clearable
                            filterable
                            placeholder="请选择"
                            @change="changeVin()"
                        >
                            <el-option
                                v-for="item in carList"
                                :key="item.vin"
                                :label="item.vin"
                                :value="item.vin"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="车牌">
                        <el-select
                            v-model="vo.plateNumber"
                            clearable
                            filterable
                            placeholder="请选择"
                            @change="changePlate()"
                        >
                            <el-option
                                v-for="item in carPlateList"
                                :key="item.plateNumber"
                                :label="item.plateNumber"
                                :value="item.plateNumber"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="出库时间">
                        <el-date-picker v-model="vo.moveTime" type="date" placeholder="请选择日期"></el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="投展商类型">
                        {{ vo.supplierType?( vo.supplierType==1?
                        "4s/二网":vo.supplierType==3?"自营":
                        "主机厂"):""
                        }}
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="投展商名称">{{vo.supplierName}}</el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="展位">{{vo.boothNumber}}</el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="图片">
                        <UpLoad ref="upLoad"></UpLoad>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import Api from "api";
import UpLoad from "../components/UpLoad";
import moment from "moment";
export default {
    components: {
        UpLoad
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            vo: {
                type: "",
                hallId: "",
                modelCode: "",
                modelName: "",
                seriesCode: "",
                seriesName: "",
                brandCode: "",
                brandName: "",
                vin: "",
                plateNumber: "",
                moveTime: null,
                moveTimeStr: "",
                boothNumber: "",
                supplierType: "",
                supplierCode: "",
                supplierName: "",
                supplierCityCode: "",
                imageUrl: ""
            },
            /**
             * 门店列表
             */
            hallList: [],
            /**
             * 车架号带出来的车辆列表
             */
            carList: [],
            /**
             * 车牌号带出来的车辆列表
             */
            carPlateList: []
        };
    },
    methods: {
        init() {
            this.vo = {};
            //清空图片
            this.$refs.upLoad.init("");
            this.hallList = [];
            this.carList = [];
            this.carPlateList = [];
            this.getHallList_api();
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
         * 切换门店
         */
        changeHall() {
            console.log("切换门店");
            this.carList = [];
            this.carPlateList = [];
            console.log(this.vo.hallId);
            if (this.vo.hallId) {
                this.getCarList();
                this.getCarlateList();
            }
            if (this.vo.vin) {
                this.vo.vin = "";
                this.vo.modelCode = "";
                this.vo.modelName = "";
                this.vo.seriesCode = "";
                this.vo.seriesName = "";
                this.vo.brandCode = "";
                this.vo.brandName = "";
                this.vo.plateNumber = "";
                this.vo.boothNumber = "";
                this.vo.supplierType = "";
                this.vo.supplierCode = "";
                this.vo.supplierName = "";
            }
        },
        /**
         * 获取该门店的车辆-依据车架号
         */
        getCarList() {
            console.log("获取该门店的车辆-依据车架号");
            let obj = { hallId: this.vo.hallId, needVin: "Y" };
            Api.finance.Carlist(obj).then(res => {
                console.log(res);
                this.carList = res;
            });
        },

        /**
         * 获取该门店的车辆-依据车牌号
         */
        getCarlateList() {
            console.log("获取该门店的车辆-依据车牌号");
            let obj = { hallId: this.vo.hallId, needPlateNumber: "Y" };
            Api.finance.Carlist(obj).then(res => {
                console.log(res);
                this.carPlateList = res;
            });
        },

        /**
         * 切换车架号
         */
        changeVin() {
            console.log("切换车架号后：" + this.vo.vin);
            this.vo.modelCode = "";
            this.vo.modelName = "";
            this.vo.seriesCode = "";
            this.vo.seriesName = "";
            this.vo.brandCode = "";
            this.vo.brandName = "";
            this.vo.plateNumber = "";
            this.vo.boothNumber = "";
            this.vo.supplierType = "";
            this.vo.supplierCode = "";
            this.vo.supplierName = "";
            for (let i = 0; i < this.carList.length; i++) {
                let car = this.carList[i];
                if (car.vin == this.vo.vin) {
                    this.vo.modelCode = car.modelCode;
                    this.vo.modelName = car.modelName;
                    this.vo.seriesCode = car.seriesCode;
                    this.vo.seriesName = car.seriesName;
                    this.vo.brandCode = car.brandCode;
                    this.vo.brandName = car.brandName;
                    this.vo.plateNumber = car.plateNumber;
                    this.vo.boothNumber = car.boothNumber;
                    this.vo.supplierType = car.supplierType;
                    if (car.supplier) {
                        this.vo.supplierCode = car.supplier.shopCode;
                        this.vo.supplierName = car.supplier.shopName;
                    }
                }
            }
        },
        /**
         * 切换车牌号
         */
        changePlate() {
            console.log("切换车牌号后：" + this.vo.plateNumber);
            this.vo.modelCode = "";
            this.vo.modelName = "";
            this.vo.seriesCode = "";
            this.vo.seriesName = "";
            this.vo.brandCode = "";
            this.vo.brandName = "";
            this.vo.vin = "";
            this.vo.boothNumber = "";
            this.vo.supplierType = "";
            this.vo.supplierCode = "";
            this.vo.supplierName = "";
            for (let i = 0; i < this.carPlateList.length; i++) {
                let car = this.carPlateList[i];
                if (car.plateNumber == this.vo.plateNumber) {
                    this.vo.modelCode = car.modelCode;
                    this.vo.modelName = car.modelName;
                    this.vo.seriesCode = car.seriesCode;
                    this.vo.seriesName = car.seriesName;
                    this.vo.brandCode = car.brandCode;
                    this.vo.brandName = car.brandName;
                    this.vo.vin = car.vin;
                    this.vo.boothNumber = car.boothNumber;
                    this.vo.supplierType = car.supplierType;
                    if (car.supplier) {
                        this.vo.supplierCode = car.supplier.shopCode;
                        this.vo.supplierName = car.supplier.shopName;
                    }
                }
            }
        },
        /**
         * 校验表单
         */
        check() {
            console.log("校验表单");
            if (!this.vo.hallId) {
                this.$message.warning("门店不能为空");
                return false;
            }
            if (!this.vo.vin) {
                this.$message.warning("车架号不能为空");
                return false;
            }
            if (!this.vo.supplierType) {
                this.$message.warning("投展商不能为空");
                return false;
            }

            if (this.vo.moveTime) {
                this.vo.moveTimeStr = moment(this.vo.moveTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
            }
            this.vo.imageUrl = this.$refs.upLoad.geImagetUrls();
            //出单
            this.vo.type = 2;
            return true;
        },
        clear() {
            //初始化图片
            this.$refs.upLoad.init("");
        }
    }
};
</script>
