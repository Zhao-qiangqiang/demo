<template>
    <div class="search-form">
        <el-form label-position="right" label-width="60px">
            <el-row :gutter="20">
                <el-col :span="15">
                    <el-form-item label="车型">
                        <Car ref="car"></Car>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="时间">
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
import moment from "moment";
export default {
    components: {
        Car
    },
    props: {
        so: {
            startTime: null,
            endTime: null,
            startTimeStr: "",
            endTimeStr: "",

            modelCode: "",
            hallId: "",
            phone: ""
        },
        search: Function
    },
    mounted() {
        console.log("查询界面初始化");
        this.getHallList_api();
    },
    data() {
        return {
            /**
             * 门店列表
             */
            hallList: []
        };
    },
    methods: {
        clear() {
            console.log("清空查询");
            this.so.modelCode = "";
            this.so.hallId = "";
            this.so.phone = "";

            this.so.startTime = null;
            this.so.endTime = null;
            //清空车型
            this.$refs.car.clear();
        },
        searchBtn() {
            console.log("查询");
            this.so.startTimeStr = "";
            this.so.endTimeStr = "";
            this.so.modelCode = "";
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
            if (this.so.startTime && this.so.endTime) {
                if (this.so.startTime.getTime() > this.so.endTime.getTime()) {
                    this.$message.warning("开始时间不能大于结束时间");
                    return;
                }
            }

            //选择了品牌，必须选择车型
            if (this.$refs.car.brandCode) {
                if (!this.$refs.car.modelCode) {
                    this.$message.warning("选择了品牌，必须选择车型");
                    return;
                }
                this.so.modelCode = this.$refs.car.modelCode;
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
        }
    }
};
</script>

