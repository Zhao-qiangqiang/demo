<template>
    <div class="search-form">
        <el-form label-position="right" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="报名城市">
                        <el-select v-model="so.cityCode" clearable filterable placeholder="请选择">
                            <el-option
                                v-for="item in cityList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="手机号">
                        <el-input maxlength="30" v-model="so.mobile"></el-input>
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
            cityCode: "",
            mobile: ""
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
            cityList: []
        };
    },
    methods: {
        clear() {
            console.log("清空查询");
            this.so.cityCode = "";
            this.so.mobile = "";
        },
        searchBtn() {
            if (!this.so.cityCode) {
                this.so.cityCode = "";
            }
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

<style>
.search-form {
    padding: 12px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>


