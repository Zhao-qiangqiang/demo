<template>
    <div>
        <el-form label-position="right" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="门店" required>
                        <el-select
                            disabled
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
                            disabled
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
                    <el-form-item label="车牌">{{vo.plateNumber}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item required label="出库时间">
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
        this.init(this.selectedVO.uuid);
    },
    props: {
        selectedVO: null
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
             * 车辆列表
             */
            carList: []
        };
    },
    methods: {
        init(uuid) {
            this.vo = {};
            this.hallList = [];
            this.carList = [];
            this.getHallList_api();
            this.get_api(uuid);
        },
        /**
         * 查询单个
         */
        get_api(uuid) {
            Api.carRequest.getByUuid({ uuid: uuid }).then(res => {
                this.vo = res;
                console.log(this.vo);
                //初始化图片
                this.$refs.upLoad.init(this.vo.imageUrl);
                this.getCarList();
            });
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
         * 获取该门店的车辆
         */
        getCarList() {
            console.log("获取该门店的车辆");
            let obj = { hallId: this.vo.hallId, needVin: "Y" };
            Api.finance.Carlist(obj).then(res => {
                console.log(res);
                this.carList = res;
            });
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
            } else {
                this.$message.warning("出库时间不能为空");
                return false;
            }
            this.vo.imageUrl = this.$refs.upLoad.geImagetUrls();
            //出库单
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
