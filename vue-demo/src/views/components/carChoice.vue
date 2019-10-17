<style lang="less" scoped>
.so-select {
    margin-right: 5px;
}
</style>

<template>
    <div>
        <!-- 品牌 -->
        <so-select
            v-model="Result.brandCode"
            filterable
            clearable
            placeholder="请选择"
            @on-change="brand"
        >
            <so-option
                v-for="item in brandList"
                :key="item.value"
                :label="item.brandName"
                :value="item.brandCode"
            ></so-option>
        </so-select>
        <!-- 车系 -->
        <so-select
            v-model="Result.seriesCode"
            filterable
            clearable
            placeholder="请选择"
            @on-change="series"
        >
            <so-option
                v-for="item in seriesList"
                :key="item.value"
                :label="item.seriesName"
                :value="item.seriesCode"
            ></so-option>
        </so-select>
        <!-- 车型 -->
        <so-select
            v-model="Result.modelCode"
            filterable
            clearable
            placeholder="请选择"
            @on-change="modelChange"
        >
            <so-option
                v-for="item in modellist"
                :key="item.value"
                :label="item.modelName"
                :value="item.modelCode"
            ></so-option>
        </so-select>
    </div>
</template>
<script>
import Api from "api";

export default {
    props: {
        ResultProps: {
            type: Object,
            default: function() {
                return {
                    brandName: "",
                    brandCode: "",
                    seriesCode: "",
                    seriesName: "",
                    modelCode: "",
                    modelName: ""
                };
            }
        }
    },
    data() {
        return {
            Result: {
                ...this.ResultProps
            },
            brandList: [], //品牌列表
            seriesList: [], //车系列表
            modellist: [] //车型列表
        };
    },
    methods: {
        // 品牌变化
        brand(...args) {
            this.Result = {
                ...this.Result,
                brandName: args[1].label,
                seriesCode: "",
                seriesName: "",
                modelCode: "",
                modelName: ""
            };
            this.seriesList = [];
            this.modellist = [];
            if (args[1].value) {
                this.seriesInquire(args[1].value);
            }
            // 品牌变化   返回数据
            this.$emit("carChange", this.Result);
        },
        // 车系变化
        series(...args) {
            if (args[1].value) {
                this.modelInquire(args[1].value);
            }
            this.Result = {
                ...this.Result,
                seriesCode: args[1].value,
                seriesName: args[1].label,
                modelCode: "",
                modelName: ""
            };
            this.modellist = [];
            // 车系变化   返回数据
            this.$emit("carChange", this.Result);
        },
        // 车型变化
        modelChange(...args) {
            this.Result = {
                ...this.Result,
                modelCode: args[1].value,
                modelName: args[1].label
            };
            // 车型变化   返回数据
            this.$emit("carChange", this.Result);
        },
        // 查询品牌
        brandInquire() {
            Api.finance.brand().then(res => {
                this.brandList = res;
            });
        },
        // 查询车系
        seriesInquire(value) {
            Api.finance.series({ brandCode: value }).then(res => {
                this.seriesList = res;
            });
        },
        // 查询车型
        modelInquire(value) {
            Api.finance.model({ seriesCode: value }).then(res => {
                this.modellist = res;
            });
        },
        /**
         * 清空车型数据
         */
        clear() {
            console.log("清空车型数据");
            this.Result = {
                brandName: "",
                brandCode: "",
                seriesCode: "",
                seriesName: "",
                modelCode: "",
                modelName: ""
            };
        },
        save() {
            console.log("save");
            console.log(this.ResultProps);
            this.Result = {
                brandName: this.ResultProps.brandName,
                brandCode: this.ResultProps.brandCode,
                seriesCode: this.ResultProps.seriesCode,
                seriesName: this.ResultProps.seriesName,
                modelCode: this.ResultProps.modelCode,
                modelName: this.ResultProps.modelName
            };
            this.brandInquire();
            // 数据回显  需判断是否传入车型 车系
            if (this.ResultProps.seriesCode) {
                this.seriesInquire(this.ResultProps.brandCode);
            }
            if (this.ResultProps.modelCode) {
                this.modelInquire(this.ResultProps.seriesCode);
            }
        }
    },
    mounted() {
        this.brandInquire();
        // 数据回显  需判断是否传入车型 车系
        if (this.ResultProps.seriesCode) {
            this.seriesInquire(this.ResultProps.brandCode);
        }
        if (this.ResultProps.modelCode) {
            this.modelInquire(this.ResultProps.seriesCode);
        }
    }
};
</script>
