<template>
    <div class="search-form">
        <el-form label-position="right" label-width="70px">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="名称">
                        <el-input v-model="so.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="备注">
                        <el-input v-model="so.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建时间">
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
import moment from "moment";
export default {
    props: {
        so: {
            name: "",
            remark: "",
            startTime: null,
            endTime: null
        },
        search: Function
    },
    methods: {
        clear() {
            console.log("清空查询");
            this.so.name = "";
            this.so.remark = "";
            this.so.startTime = null;
            this.so.endTime = null;
        },
        searchBtn() {
            if (this.so.startTime && this.so.endTime) {
                if (this.so.startTime.getTime() > this.so.endTime.getTime()) {
                    this.$message.warning("开始时间不能大于结束时间");
                    return;
                }
            }
            this.search();
        }
    }
};
</script>




