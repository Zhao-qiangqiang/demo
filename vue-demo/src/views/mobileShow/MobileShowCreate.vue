<template>
    <div>
        <el-form
            :model="dynamicValidateForm"
            ref="dynamicValidateForm"
            label-position="right"
            label-width="100px"
        >
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="展会名称" required>
                        <el-input maxlength="50" v-model="vo.showName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="展会时间" required>
                        <el-date-picker
                            style="width: 150px;"
                            v-model="vo.openTime"
                            type="date"
                            placeholder="请选择日期"
                        ></el-date-picker>
                        <span style="display:inline-block;margin:0 10px;">至</span>
                        <el-date-picker
                            style="width: 150px;"
                            v-model="vo.endTime"
                            type="date"
                            placeholder="请选择日期"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item
                        required
                        label="城市"
                        v-for="domain in dynamicValidateForm.domains"
                        :key="domain.key"
                    >
                        <el-select
                            v-model="domain.cityCode"
                            clearable
                            filterable
                            placeholder="请选择城市"
                            style="width: 150px;"
                        >
                            <el-option
                                v-for="item in cityList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                        <el-input
                            maxlength="50"
                            placeholder="请输入展会地址"
                            style="width: 300px;margin-left: 10px;"
                            v-model="domain.address"
                        ></el-input>
                        <el-button
                            style="margin-left: 10px;"
                            type="primary"
                            @click.prevent="removeCity(domain)"
                        >删除</el-button>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item>
                        <el-button type="primary" @click="addCity()">添加城市</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
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
                 * 展会名称
                 */
                showName: "",
                /**
                 * 开始时间
                 */
                openTime: null,
                /**
                 * 结束时间
                 */
                endTime: null,
                /**
                 * 城市列表[转字符串]
                 */
                citys: "",
                openTimeStr: "",
                endTimeStr: ""
            },

            /**
             * 城市列表
             */
            cityList: [],
            cityMap: null,
            dynamicValidateForm: {
                domains: [
                    {
                        key: "",
                        /**
                         * 城市编码
                         */
                        cityCode: "",
                        /**
                         * 城市名称
                         */
                        cityName: "",
                        /**
                         * 地址
                         */
                        address: ""
                    }
                ]
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.vo = {};
            this.getCityList_api();
            this.dynamicValidateForm.domains = [];
            this.dynamicValidateForm.domains.push({
                key: Date.now(),
                cityCode: "",
                cityName: "",
                address: ""
            });
        },
        /**
         * 校验表单
         */
        check() {
            console.log("校验表单");
            if (!this.vo.showName) {
                this.$message.warning("展会名称不能为空");
                return false;
            }
            if (!this.vo.openTime) {
                this.$message.warning("展会开始时间不能为空");
                return false;
            }
            if (!this.vo.endTime) {
                this.$message.warning("展会结束时间不能为空");
                return false;
            }
            this.vo.openTimeStr = moment(this.vo.openTime).format("YYYY-MM-DD");
            this.vo.endTimeStr = moment(this.vo.endTime).format("YYYY-MM-DD");

            if (this.vo.openTime.getTime() > this.vo.endTime.getTime()) {
                this.$message.warning("展会开始时间不能大于结束时间");
                return false;
            }
            console.log("校验城市列表");
            if (
                this.dynamicValidateForm.domains == null ||
                this.dynamicValidateForm.domains.length == 0
            ) {
                this.$message.warning("至少添加一个参展城市");
                return false;
            }
            for (let i = 0; i < this.dynamicValidateForm.domains.length; i++) {
                let showCity = this.dynamicValidateForm.domains[i];
                if (!showCity.cityCode) {
                    this.$message.warning("城市不能为空");
                    return false;
                }
                if (!showCity.address) {
                    this.$message.warning("展会地址不能为空");
                    return false;
                }
                showCity.cityName = this.cityMap[showCity.cityCode];
                if (!showCity.cityName) {
                    this.$message.warning("城市名称不能为空");
                    return false;
                }
                showCity.address = showCity.address.trim();
            }
            this.vo.citys = JSON.stringify(this.dynamicValidateForm.domains);
            return true;
        },
        /**
         * 添加城市
         */
        addCity() {
            this.dynamicValidateForm.domains.push({
                key: Date.now(),
                cityCode: "",
                cityName: "",
                address: ""
            });
        },
        /**
         * 移除城市
         */
        removeCity(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        /**
         * 获取城市列表
         */
        getCityList_api() {
            console.log("获取城市列表");
            Api.hall.getCityList().then(res => {
                this.cityList = [];
                this.cityMap = {};
                for (let i = 0; i < res.length; i++) {
                    let p = res[i].children;
                    for (let j = 0; j < p.length; j++) {
                        let city = p[j];
                        this.cityList.push(city);
                        this.cityMap[city.value] = city.label;
                    }
                }
                console.log("获取城市列表成功");
            });
        }
    }
};
</script>
