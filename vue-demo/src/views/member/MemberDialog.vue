<template>
    <div class="form">
        <el-form label-position="top" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="人脸识别图像">
                        <img :src="imageUrl" width="192" height="256" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="list" ref="listTable" border style="width: 100%;">
            <el-table-column label="手机号" prop="handphone"></el-table-column>
            <el-table-column label="客户姓名" prop="cName"></el-table-column>
            <el-table-column label="意向车型" prop="modelName"></el-table-column>
            <el-table-column label="销售" prop="sellerName"></el-table-column>
            <el-table-column label="店铺" prop="shopName"></el-table-column>
            <el-table-column label="线索时间" prop="dateCreate"></el-table-column>
        </el-table>
    </div>
</template>
<script>
import Api from "api";
import moment from "moment";
export default {
    props: {
        selectedVO: null
    },
    data() {
        return {
            list: [],
            imageUrl: ""
        };
    },

    mounted() {
        this.init(this.selectedVO);
    },
    methods: {
        init(obj) {
            this.list = [];
            this.imageUrl = obj.faceImage;
            this.get_api(obj.phone);
        },
        /**
         * 查询单个
         */
        get_api(selectedPhone) {
            Api.member.getClueList({ phone: selectedPhone }).then(res => {
                this.list = res;
            });
        }
    }
};
</script>

<style>
.form {
    padding: 12px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>
