<template>
    <div>
        <!-- 品牌 -->
        <el-select
            v-model="brandCode"
            filterable
            clearable
            placeholder="请选择品牌"
            @change="changeBrand()"
        >
            <el-option
                v-for="item in brandList"
                :key="item.brandCode"
                :label="item.brandName"
                :value="item.brandCode"
            ></el-option>
        </el-select>
        <!-- 车系 -->
        <el-select
            v-model="seriesCode"
            filterable
            clearable
            placeholder="请选择车系"
            @change="changeSeries()"
        >
            <el-option
                v-for="item in seriesList"
                :key="item.seriesCode"
                :label="item.seriesName"
                :value="item.seriesCode"
            ></el-option>
        </el-select>
        <!-- 车型 -->
        <el-select
            v-model="modelCode"
            filterable
            clearable
            placeholder="请选择车型"
            @change="changeModel()"
        >
            <el-option
                v-for="item in modellist"
                :key="item.modelCode"
                :label="item.modelName"
                :value="item.modelCode"
            ></el-option>
        </el-select>
    </div>
</template>

<style lang="less" scoped>
.el-select {
    margin-right: 5px;
}
</style>

<script>
import Api from "api";
export default {
    mounted() {
        console.log("查询界面初始化");
        //获取品牌列表
        this.getBrandList();
    },
    props: {},
    data() {
        return {
            brandList: [], //品牌列表
            seriesList: [], //车系列表
            modellist: [], //车型列表
            brandCode: "",
            seriesCode: "",
            modelCode: ""
        };
    },
    methods: {
        clear() {
            console.log("清理");
            this.brandCode = "";
            this.seriesCode = "";
            this.modelCode = "";
            this.seriesList = [];
            this.modellist = [];
        },
        /**
         * 获取品牌列表
         */
        getBrandList() {
            this.brandList = [];
            Api.finance.brand().then(res => {
                this.brandList = res;
            });
        },
        /**
         * 获取车系列表
         */
        getSeriesList(value) {
            Api.finance.series({ brandCode: value }).then(res => {
                this.seriesList = res;
            });
        },
        /**
         * 获取车型列表
         */
        getModelList(value) {
            Api.finance.model({ seriesCode: value }).then(res => {
                this.modellist = res;
            });
        },
        /**
         * 改变品牌
         */
        changeBrand() {
            console.log("改变品牌");
            this.seriesList = [];
            this.modellist = [];
            this.seriesCode = "";
            this.modelCode = "";
            if (this.brandCode) {
                this.getSeriesList(this.brandCode);
            }
        },
        /**
         * 改变车系
         */
        changeSeries() {
            console.log("改变车系");
            this.modellist = [];
            this.modelCode = "";
            if (this.seriesCode) {
                this.getModelList(this.seriesCode);
            }
        },
        changeModel() {
            console.log("改变车型");
        },

        /**
         * 外部初始化数据
         */
        save(brandCode, seriesCode, modelCode) {
            this.brandCode = brandCode;
            this.seriesCode = seriesCode;
            this.modelCode = modelCode;
            this.getSeriesList(this.brandCode);
            this.getModelList(this.seriesCode);
        }
    }
};
</script>
