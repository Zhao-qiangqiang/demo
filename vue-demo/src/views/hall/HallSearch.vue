<template>
    <div class="search-form">
        <el-form label-position="right" label-width="70px">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="门店简称">
                        <el-input maxlength="30" v-model="so.hallName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
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

export default {
    props: {
        so: {
            hallName: "",
            cityCodeList: "",
            status: ""
        },
        search: Function
    },
    mounted() {
        console.log("查询界面初始化");
        this.getCityList_api();
    },
    data() {
        return {
            /**
             * 城市列表
             */
            cityList: [],
            /**
             * 选中的城市列表
             */
            selectCityList: [],
            /**
             * 状态
             */
            stateList: [
                { value: 1, label: "正常" },
                { value: 2, label: "暂停" },
                { value: 0, label: "关闭" }
            ]
        };
    },
    methods: {
        clear() {
            console.log("清空查询");
            this.selectCityList = [];

            this.so.hallName = "";
            this.so.cityCodeList = "";
            this.so.status = "";
        },
        searchBtn() {
            console.log("查询");
            this.so.cityCodeList = JSON.stringify(this.selectCityList);
            this.search();
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

