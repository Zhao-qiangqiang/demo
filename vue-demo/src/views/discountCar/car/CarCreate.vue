<template>
    <div>
        <el-form label-position="right" label-width="140px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item required label="车型">
                        <Car ref="car"></Car>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item required label="车辆标签">
                        <el-input maxlength="50" v-model="vo.tag"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item required label="当前售价（万元）">
                        <el-input-number
                            v-model="vo.salePrice"
                            :precision="2"
                            :step="0.01"
                            step-strictly
                            :min="0.01"
                            :max="99999"
                        ></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item required label="活动结束日期">
                        <el-date-picker
                            style="width: 150px;"
                            v-model="vo.endTime"
                            type="date"
                            placeholder="请选择日期"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item required label="经销商">
                        <el-select v-model="vo.supplierCode" clearable placeholder="请选择经销商">
                            <el-option
                                v-for="item in supplierList"
                                :key="item.value"
                                :label="item.shopName"
                                :value="item.shopCode"
                            ></el-option>
                        </el-select>

                        <el-button
                            style="margin-left:10px;"
                            type="primary"
                            @click="changeCity()"
                        >切换城市</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--弹窗-->
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
import moment from "moment";
import Car from "../../components/Car";
export default {
    components: {
        Car
    },
    data() {
        return {
            vo: {
                /**
                 * 门店编码
                 */
                hallCode: "",
                /**
                 * 车型
                 */
                modelCode: "",
                /**
                 * 车辆标签
                 */
                tag: "",
                /**
                 * 当前售价
                 */
                salePrice: "",
                /**
                 * 活动结束日期
                 */
                endTime: null,
                endTimeStr: "",
                /**
                 * 供应商编码
                 */
                supplierCode: "",
                /**
                 * 供应商名称
                 */
                supplierName: "",
                /**
                 * 供应商城市编码
                 */
                supplierCityCode: ""
            },
            /**
             * 完整的城市列表
             */
            cityList: [],
            /**
             * 城市菜单中的城市列表
             */
            selectCityList: [],
            /**
             * 经销商城市列表(接口里用)
             */
            supplierCityList: [],
            /**
             * 供应商列表
             */
            supplierList: [],
            /**
             * 是否显示选择城市界面
             */
            isShowCity: false
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.vo = {};
            //清空车型
            this.$refs.car.clear();
            this.supplierCityList = [];
            this.supplierList = [];
            this.isShowCity = false;
            this.selectCityList = [];
            //获取城市列表
            this.getCityList_api();
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
         * 校验表单
         */
        check() {
            console.log("校验表单");
            if (!this.$refs.car.modelCode) {
                this.$message.warning("车型不能为空");
                return false;
            }
            this.vo.modelCode = this.$refs.car.modelCode;
            if (!this.vo.tag) {
                this.$message.warning("车辆标签不能为空");
                return false;
            }
            if (!this.vo.salePrice) {
                this.$message.warning("当前售价不能为空");
                return false;
            }
            if (!this.vo.endTime) {
                this.$message.warning("活动结束日期不能为空");
                return false;
            }
            this.vo.endTimeStr = moment(this.vo.endTime).format("YYYY-MM-DD");
            if (!this.vo.supplierCode) {
                this.$message.warning("供应商不能为空");
                return false;
            }
            //依据供应商编码，获取供应商名称
            for (let i = 0; i < this.supplierList.length; i++) {
                let supplier = this.supplierList[i];
                if (this.vo.supplierCode == supplier.shopCode) {
                    this.vo.supplierName = supplier.shopName;
                }
            }
            if (!this.vo.supplierName) {
                this.$message.warning("供应商不能为空");
                return false;
            }
            /**
             * 供应商城市列表
             */
            this.vo.supplierCityCode = JSON.stringify(this.supplierCityList);
            return true;
        }
    }
};
</script>
