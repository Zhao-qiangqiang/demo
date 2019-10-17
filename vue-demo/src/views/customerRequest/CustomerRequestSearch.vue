<template>
    <div class="search-form">
        <el-form label-position="right" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="品牌">
                        <el-select v-model="so.brandCode" clearable filterable placeholder="请选择">
                            <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.brandName"
                                :value="item.brandCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="车系1">
                        <el-select
                            style="width:150px;"
                            v-model="brandCode1"
                            clearable
                            filterable
                            placeholder="请选择品牌"
                            @change="changeBrand1()"
                        >
                            <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.brandName"
                                :value="item.brandCode"
                            ></el-option>
                        </el-select>
                        <span style="display:inline-block;margin:0 5px;"></span>
                        <el-select
                            style="width:150px;"
                            v-model="so.seriesCode"
                            clearable
                            filterable
                            placeholder="请选择车系"
                        >
                            <el-option
                                v-for="item in seriesList1"
                                :key="item.value"
                                :label="item.seriesName"
                                :value="item.seriesCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="9">
                    <el-form-item label="车系2">
                        <el-select
                            style="width:150px;"
                            v-model="brandCode2"
                            clearable
                            filterable
                            placeholder="请选择品牌"
                            @change="changeBrand2()"
                        >
                            <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.brandName"
                                :value="item.brandCode"
                            ></el-option>
                        </el-select>
                        <span style="display:inline-block;margin:0 5px;"></span>
                        <el-select
                            style="width:150px;"
                            v-model="so.competingSeriesCode"
                            clearable
                            filterable
                            placeholder="请选择车系"
                        >
                            <el-option
                                v-for="item in seriesList2"
                                :key="item.value"
                                :label="item.seriesName"
                                :value="item.seriesCode"
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

                <el-col :span="6">
                    <el-form-item label="手机号">
                        <el-input maxlength="30" v-model="so.phone"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="客户级别">
                        <el-select v-model="so.grade" clearable placeholder="请选择">
                            <el-option
                                v-for="item in gradeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="购车时间">
                        <el-date-picker
                            style="width: 150px;"
                            v-model="so.planTime"
                            type="date"
                            placeholder="请选择日期"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="操作日期">
                        <el-date-picker
                            style="width: 150px;"
                            v-model="so.startTime"
                            type="date"
                            placeholder="请选择日期"
                        ></el-date-picker>
                        <span style="display:inline-block;margin:0 10px;">一</span>
                        <el-date-picker
                            style="width: 150px;"
                            v-model="so.endTime"
                            type="date"
                            placeholder="请选择日期"
                        ></el-date-picker>
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
import moment from "moment";
export default {
    components: {},
    props: {
        so: {
            startTime: null,
            endTime: null,
            startTimeStr: "",
            endTimeStr: "",

            brandCode: "",
            seriesCode: "",
            competingSeriesCode: "",
            hallId: "",
            phone: "",
            grade: "",
            planTime: null,
            planTimeStr: ""
        },
        search: Function
    },
    mounted() {
        console.log("查询界面初始化");
        this.getBrandList_api();
        this.getHallList_api();
    },
    data() {
        return {
            /**
             * 品牌列表
             */
            brandList: [],
            /**
             * 车系1列表
             */
            seriesList1: [],
            /**
             * 车系2列表
             */
            seriesList2: [],
            /**
             * 门店列表
             */
            hallList: [],
            /**
             * 客户级别
             */
            gradeList: [
                { value: "1", label: "H" },
                { value: "2", label: "A" },
                { value: "3", label: "B" },
                { value: "4", label: "C" },
                { value: "0", label: "未知" }
            ],
            /**
             * 车系1中的品牌
             */
            brandCode1: "",
            /**
             * 车系2中的品牌
             */
            brandCode2: ""
        };
    },
    methods: {
        clear() {
            console.log("清空查询");
            this.so.brandCode = "";
            this.so.seriesCode = "";
            this.so.competingSeriesCode = "";
            this.so.hallId = "";
            this.so.phone = "";
            this.so.grade = "";

            this.so.planTime = null;
            this.so.startTime = null;
            this.so.endTime = null;
            this.seriesList1 = [];
            this.seriesList2 = [];
            //车系1中的品牌
            this.brandCode1 = "";
            //车系2中的品牌
            this.brandCode2 = "";
        },
        searchBtn() {
            console.log("查询");
            this.so.startTimeStr = "";
            this.so.endTimeStr = "";
            this.so.planTimeStr = "";
            if (this.so.startTime) {
                this.so.startTimeStr = moment(this.so.startTime).format(
                    "YYYY-MM-DD"
                );
            }
            if (this.so.endTime) {
                this.so.endTimeStr = moment(this.so.endTime).format(
                    "YYYY-MM-DD"
                );
            }
            if (this.so.planTime) {
                this.so.planTimeStr = moment(this.so.planTime).format(
                    "YYYY-MM-DD"
                );
            }
            if (this.so.startTime && this.so.endTime) {
                if (this.so.startTime.getTime() > this.so.endTime.getTime()) {
                    this.$message.warning("开始时间不能大于结束时间");
                    return;
                }
            }
            if (!this.so.brandCode) {
                this.so.brandCode = "";
            }
            if (!this.so.hallId) {
                this.so.hallId = "";
            }
            if (!this.so.grade) {
                this.so.grade = "";
            }
            this.search();
        },

        /**
         * 获取品牌列表
         */
        getBrandList_api() {
            Api.finance.brand().then(res => {
                this.brandList = res;
            });
        },
        /**
         * 获取车系列表1
         */
        getSeriesList1_api() {
            let obj = { brandCode: this.brandCode1 };
            Api.finance.series(obj).then(res => {
                this.seriesList1 = res;
            });
        },
        /**
         * 获取车系列表2
         */
        getSeriesList2_api() {
            let obj = { brandCode: this.brandCode2 };
            Api.finance.series(obj).then(res => {
                this.seriesList2 = res;
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
         * 修改车系1中的品牌
         */
        changeBrand1() {
            console.log("修改品牌1");
            //清空车系
            this.so.seriesCode = "";
            this.seriesList1 = [];
            if (this.brandCode1) {
                this.getSeriesList1_api();
            }
        },
        /**
         * 修改车系2中的品牌
         */
        changeBrand2() {
            console.log("修改品牌2");
            //清空车系
            this.so.competingSeriesCode = "";
            this.seriesList2 = [];
            if (this.brandCode2) {
                this.getSeriesList2_api();
            }
        }
    }
};
</script>

