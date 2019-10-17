<template>
    <div>
        <el-form label-position="right" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="店铺编码">{{vo.ownerShopCode}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="店铺名称">{{vo.ownerShopName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="城市">{{vo.cityName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系方式">{{vo.phone}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="地址">{{vo.address}}</el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="门店简称">{{vo.name}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="营业时间">{{vo.openTime?vo.openTime+"-"+vo.closeTime:"暂无"}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="停车信息">{{vo.parkDesc}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="交通信息">{{vo.trafficDesc}}</el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="客服微信">{{vo.weixinNo}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="展位数">{{vo.boothAmount}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态">{{vo.status===1?"正常":vo.status===2?"暂停":"关闭"}}</el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--列表-->
        <div class="form">
            <el-table :data="vo.deviceList" ref="listTable" style="width: 100%;">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="设备类型" prop="type"></el-table-column>
                <el-table-column label="设备id" prop="uuid"></el-table-column>
                <el-table-column label="设备别名" prop="name"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style>
.form {
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
    props: {
        selectedVO: null
    },
    data() {
        return {
            vo: {
                name: null,
                deviceList: []
            }
        };
    },

    mounted() {
        this.get_api(this.selectedVO.uuid);
    },
    methods: {
        /**
         * 查询单个
         */
        get_api(selectedId) {
            this.vo = {};
            Api.hall.get({ hallId: selectedId }).then(res => {
                this.vo = res;
            });
        }
    }
};
</script>
