<template>
    <div>
        <el-form
            :model="dynamicValidateForm"
            ref="dynamicValidateForm"
            label-position="left"
            label-width="80px"
        >
            <el-row :gutter="20">
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

                <el-col :span="24">
                    <el-form-item required label="主营品牌">
                        <el-select v-model="brandCode1" clearable filterable placeholder="品牌1">
                            <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.brandName"
                                :value="item.brandCode"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="margin-left: 10px;"
                            v-model="brandCode2"
                            clearable
                            filterable
                            placeholder="品牌2"
                        >
                            <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.brandName"
                                :value="item.brandCode"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="margin-left: 10px;"
                            v-model="brandCode3"
                            clearable
                            filterable
                            placeholder="品牌3"
                        >
                            <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.brandName"
                                :value="item.brandCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item
                        required
                        label="优惠"
                        v-for="domain in dynamicValidateForm.domains"
                        :key="domain.key"
                    >
                        <el-select
                            v-model="domain.activityCode"
                            style="width: 120px;"
                            clearable
                            placeholder="活动类型"
                        >
                            <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>

                        <el-date-picker
                            style="width: 150px;margin-left: 10px;"
                            v-model="domain.endTime"
                            type="date"
                            placeholder="截止日期"
                        ></el-date-picker>

                        <el-input
                            maxlength="18"
                            placeholder="标题"
                            style="width: 250px;margin-left: 10px;"
                            v-model="domain.activityTitle"
                        ></el-input>
                        <el-input
                            maxlength="50"
                            placeholder="内容"
                            style="width: 540px;"
                            v-model="domain.activityDesc"
                        ></el-input>
                        <el-button
                            style="margin-left: 10px;"
                            type="primary"
                            @click.prevent="removeActivity(domain)"
                        >删除</el-button>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item>
                        <el-button type="primary" @click="addActivity()">添加优惠</el-button>
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
export default {
    data() {
        return {
            vo: {
                /**
                 * 门店编码
                 */
                hallCode: "",
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
                supplierCityCode: "",
                activities: "",
                brandCodes: ""
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
            isShowCity: false,
            dynamicValidateForm: {
                domains: [
                    {
                        key: "",
                        /**
                         * 活动code
                         */
                        activityCode: null,
                        /**
                         * 活动标题
                         */
                        activityTitle: "",
                        /**
                         * 活动描述
                         */
                        activityDesc: "",
                        /**
                         * 截止时间
                         */
                        endTime: null,
                        endTimeStr: ""
                    }
                ]
            },
            typeList: [
                {
                    value: 1,
                    label: "新车上新"
                },
                {
                    value: 2,
                    label: "到店有礼"
                },
                {
                    value: 3,
                    label: "金融特惠"
                },
                {
                    value: 4,
                    label: "团购活动"
                },
                {
                    value: 5,
                    label: "购车礼包"
                },
                {
                    value: 6,
                    label: "置换礼包"
                },
                {
                    value: 7,
                    label: "门店大促"
                }
            ],
            /**
             * 品牌列表
             */
            brandList: [],
            brandCode1: "",
            brandCode2: "",
            brandCode3: ""
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.vo = {};
            this.supplierCityList = [];
            this.supplierList = [];
            this.isShowCity = false;
            this.selectCityList = [];
            this.brandCode1 = this.brandCode2 = this.brandCode3 = "";
            //获取城市列表
            this.getCityList_api();
            //获取品牌列表
            this.getBrandList_api();
            this.dynamicValidateForm.domains = [];
            this.dynamicValidateForm.domains.push({
                key: Date.now(),
                /**
                 * 活动code
                 */
                activityCode: null,
                /**
                 * 活动标题
                 */
                activityTitle: "",
                /**
                 * 活动描述
                 */
                activityDesc: "",
                /**
                 * 截止时间
                 */
                endTime: null,
                endTimeStr: ""
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

            if (!this.brandCode1 && !this.brandCode2 && !this.brandCode3) {
                this.$message.warning("至少添加一个主营品牌");
                return false;
            }
            let brandList = [];
            if (this.brandCode1) {
                brandList.push(this.brandCode1);
            }
            if (this.brandCode2) {
                brandList.push(this.brandCode2);
            }
            if (this.brandCode3) {
                brandList.push(this.brandCode3);
            }
            /**
             * 品牌列表
             */
            this.vo.brandCodes = JSON.stringify(brandList);

            console.log("校验活动列表");
            if (
                this.dynamicValidateForm.domains == null ||
                this.dynamicValidateForm.domains.length == 0
            ) {
                this.$message.warning("至少添加一个活动");
                return false;
            }
            for (let i = 0; i < this.dynamicValidateForm.domains.length; i++) {
                let activity = this.dynamicValidateForm.domains[i];
                if (!activity.activityCode) {
                    this.$message.warning("活动类型不能为空");
                    return false;
                }
                if (!activity.endTime) {
                    this.$message.warning("截止日期不能为空");
                    return false;
                }
                activity.endTimeStr = moment(activity.endTime).format(
                    "YYYY-MM-DD"
                );

                if (!activity.activityTitle) {
                    this.$message.warning("活动标题不能为空");
                    return false;
                }
                if (!activity.activityDesc) {
                    this.$message.warning("活动内容不能为空");
                    return false;
                }
                activity.activityTitle = activity.activityTitle.trim();
                activity.activityDesc = activity.activityDesc.trim();
            }
            this.vo.activities = JSON.stringify(
                this.dynamicValidateForm.domains
            );
            return true;
        },
        /**
         * 添加优惠
         */
        addActivity() {
            this.dynamicValidateForm.domains.push({
                key: Date.now(),
                /**
                 * 活动code
                 */
                activityCode: null,
                /**
                 * 活动标题
                 */
                activityTitle: "",
                /**
                 * 活动描述
                 */
                activityDesc: "",
                /**
                 * 截止时间
                 */
                endTime: null,
                endTimeStr: ""
            });
        },
        /**
         * 移除优惠
         */
        removeActivity(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        /**
         * 获取品牌列表
         */
        getBrandList_api() {
            Api.finance.brand().then(res => {
                this.brandList = res;
            });
        }
    }
};
</script>
