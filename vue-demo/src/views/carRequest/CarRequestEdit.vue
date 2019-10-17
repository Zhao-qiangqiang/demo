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
                    <el-form-item label="车型">
                        <Car ref="car"></Car>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="车架号" required>
                        <el-input maxlength="30" v-model="vo.vin"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="车牌">
                        <el-input maxlength="30" v-model="vo.plateNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="入库时间">
                        <el-date-picker v-model="vo.moveTime" type="date" placeholder="请选择日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="投展商">
                        <el-select v-model="vo.supplierType" clearable placeholder="请选择供应商类型">
                            <el-option
                                v-for="item in supplierTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!--4s/二网-->
                <el-col :span="24" v-if="vo.supplierType&&vo.supplierType=='1'">
                    <el-form-item>
                        <el-select v-model="vo.supplierCode" clearable placeholder="请选择供应商名称">
                            <el-option
                                v-for="item in supplierList"
                                :key="item.value"
                                :label="item.shopName"
                                :value="item.shopCode"
                            ></el-option>
                        </el-select>

                        <el-button style="margin:10px;" type="primary" @click="changeCity()">切换城市</el-button>
                    </el-form-item>
                </el-col>
                <!--主机厂-->
                <el-col :span="24" v-if="vo.supplierType&&vo.supplierType=='4'">
                    <el-form-item>
                        <el-input maxlength="30" placeholder="请输入主机厂名称" v-model="vo.supplierName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="展位">
                        <el-input-number
                            v-model="vo.boothNumber"
                            :step="1"
                            step-strictly
                            :min="1"
                            :max="999"
                        ></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="图片">
                        <UpLoad ref="upLoad"></UpLoad>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-dialog title="选择城市" :visible.sync="isShowCity" :append-to-body="true">
            <el-form label-position="left" label-width="70px">
                <el-form-item label="城市">
                    <el-select v-model="selectCityList" multiple filterable placeholder="请选择">
                        <el-option
                            v-for="item in cityList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-row style="text-align: right;">
                <el-button @click="isShowCity = false">取消</el-button>
                <el-button type="primary" @click="changeCityComplete()">确定</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import Api from "api";
import Car from "../components/Car";
import UpLoad from "../components/UpLoad";
import moment from "moment";

export default {
    components: {
        Car,
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
             * 投展商类型
             */
            supplierTypeList: [
                { value: 1, label: "4s/二网" },
                { value: 3, label: "自营" },
                { value: 4, label: "主机厂" }
            ],
            /**
             * 投展商城市列表(接口里用)
             */
            supplierCityList: [],
            /**
             * 供应商列表
             */
            supplierList: [],
            /**
             * 是否显示选择城市界面
             */
            isShowCity: false,
            /**
             * 完整的城市列表
             */
            cityList: [],
            /**
             * 城市菜单中的城市列表
             */
            selectCityList: []
        };
    },

    methods: {
        init(uuid) {
            console.log("init");
            console.log(this.selectedVO);
            this.vo = {};
            //清空车型
            this.$refs.car.clear();
            this.supplierCityList = [];
            this.supplierList = [];
            this.isShowCity = false;
            this.selectCityList = [];
            this.getHallList_api();
            this.getCityList_api();
            this.get_api(uuid);
        },
        /**
         * 查询单个
         */
        get_api(uuid) {
            Api.carRequest.getByUuid({ uuid: uuid }).then(res => {
                this.vo = res;
                this.getComplete();
            });
        },
        getComplete() {
            console.log("查询单个回调:" + this.vo);
            // 品牌车型车系赋值
            if (this.vo.modelCode) {
                this.$refs.car.save(
                    this.vo.brandCode,
                    this.vo.seriesCode,
                    this.vo.modelCode
                );
            }
            //供应商城市列表
            if (
                this.vo.supplierCityCode &&
                this.vo.supplierCityCode.length > 3
            ) {
                let a = this.vo.supplierCityCode.substring(
                    1,
                    this.vo.supplierCityCode.length - 1
                );
                let arr = a.split(",");
                console.log(arr);
                for (let i = 0; i < arr.length; i++) {
                    let item = arr[i].substring(1, arr[i].length - 1);
                    this.supplierCityList.push(item);
                }
                this.getSupplierList_api();
            }
            //初始化图片
            this.$refs.upLoad.init(this.vo.imageUrl);
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
         * 获取供应商列表
         */
        getSupplierList_api() {
            Api.finance
                .purchaser({
                    cityCodeList: JSON.stringify(this.supplierCityList)
                })
                .then(res => {
                    this.supplierList = res;
                });
        },
        /**
         * 切换城市
         */
        changeCity() {
            this.isShowCity = true;
            this.selectCityList = this.supplierCityList.concat();
        },
        /**
         * 切换城市完成
         */
        changeCityComplete() {
            this.isShowCity = false;
            this.supplierCityList = this.selectCityList.concat();
            if (this.vo.supplierCode) {
                this.vo.supplierCode = "";
            }
            this.getSupplierList_api();
        },
        /**
         * 切换门店
         */
        changeHall() {
            console.log("切换门店");
            console.log(this.vo.hallId);
            if (
                this.vo.hallId &&
                this.supplierCityList &&
                this.supplierCityList.length == 0
            ) {
                for (let i = 0; i < this.hallList.length; i++) {
                    let hall = this.hallList[i];
                    if (this.vo.hallId == hall.uuid) {
                        console.log(hall);
                        this.supplierCityList.push(hall.cityCode);
                        this.getSupplierList_api();
                        return;
                    }
                }
            }
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
        },
        changeSupplierType() {
            if (this.vo.supplierType && this.vo.supplierType == 4) {
                this.vo.supplierCode = this.vo.supplierName = "";
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
            //选择了品牌，必须选择车型
            this.vo.modelCode = "";
            if (this.$refs.car.brandCode) {
                if (!this.$refs.car.modelCode) {
                    this.$message.warning("选择了品牌，必须选择车型");
                    return false;
                }
                this.vo.modelCode = this.$refs.car.modelCode;
            }
            if (!this.vo.vin) {
                this.$message.warning("车架号不能为空");
                return false;
            }
            if (this.vo.moveTime) {
                this.vo.moveTimeStr = moment(this.vo.moveTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
            }
            //选择了供应商类型
            if (this.vo.supplierType) {
                //4s/二网
                if (this.vo.supplierType == 1) {
                    //依据供应商编码，获取供应商名称
                    if (this.vo.supplierCode) {
                        for (let i = 0; i < this.supplierList.length; i++) {
                            let supplier = this.supplierList[i];
                            if (this.vo.supplierCode == supplier.shopCode) {
                                this.vo.supplierName = supplier.shopName;
                            }
                        }
                    }
                }
                //自营
                else if (this.vo.supplierType == 3) {
                    this.vo.supplierCode = this.vo.supplierName = "";
                }
                //主机厂
                else if (this.vo.supplierType == 4) {
                    this.vo.supplierCode = "";
                }
            }
            //没选供应商类型
            else {
                this.vo.supplierType = this.vo.supplierCode = this.vo.supplierName =
                    "";
            }
            /**
             * 供应商城市列表
             */
            this.vo.supplierCityCode = JSON.stringify(this.supplierCityList);
            this.vo.imageUrl = this.$refs.upLoad.geImagetUrls();
            //入库单
            this.vo.type = 1;
            return true;
        },
        clear() {
            //初始化图片
            this.$refs.upLoad.init("");
        }
    }
};
</script>
