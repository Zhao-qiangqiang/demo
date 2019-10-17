<template>
    <div class="search-form">
        <el-form label-position="right" label-width="110px">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="用户ID">
                        <el-input v-model="so.userId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="手机号">
                        <el-input v-model="so.phone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="入会时间">
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
                    <el-form-item label="来源">
                        <el-select v-model="so.source" clearable placeholder="请选择">
                            <el-option
                                v-for="item in sourceList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="入会门店">
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
                    <el-form-item label="是否为工作人员">
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
            </el-row>
            <el-row style="text-align: right;">
                <el-button type="primary" @click="searchBtn()">查询</el-button>
                <el-button @click="clear()">重置</el-button>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import Api from "api";
import moment from "moment";
export default {
    props: {
        so: {
            userId: "",
            phone: "",
            source: "",
            hallId: "",
            type: "",
            startTime: null,
            endTime: null,
            startTimeStr: "",
            endTimeStr: ""
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
             * 状态
             */
            sourceList: [
                { value: 1, label: "小程序" },
                { value: 2, label: "美斯特" },
                { value: 3, label: "APP" }
            ],
            /**
             * 门店列表
             */
            hallList: [],
            /**
             * 是否未工作人员
             */
            typeList: [{ value: 1, label: "是" }, { value: 2, label: "否" }]
        };
    },
    methods: {
        clear() {
            console.log("清空查询");
            this.so.userId = "";
            this.so.phone = "";
            this.so.source = "";
            this.so.hallId = "";
            this.so.type = "";
            this.so.startTime = null;
            this.so.endTime = null;
        },
        searchBtn() {
            this.so.startTimeStr = "";
            this.so.endTimeStr = "";
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

<style>
.search-form {
    padding: 12px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>


