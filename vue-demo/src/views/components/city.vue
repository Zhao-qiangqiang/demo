<style lang="less">
.el-select-dropdown {
    z-index: 999999 !important;
}
.el-input__inner {
    height: 36px;
}
.el-select .el-input.is-focus .el-input__inner {
    border-color: #ff571a;
}
</style>

<template>
    <div>
        <el-select v-model="city" filterable multiple @change="chang"  placeholder="请选择" style="height:36px;width:100%;">
            <el-option
            v-for="item in cityData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            />
        </el-select>
    </div>
</template>
<script>
import Api from 'api';


export default {
    props: {
        dataCity: Array
    },
    data() {
        return {
            city: [], //当前选择的城市列表
            cityListDate: []//总的城市列表
        };
    },
    computed: {
        cityData() {
            let data = [];
            this.cityListDate.forEach((item) => {
                if (item.children) {
                    data = data.concat(item.children);
                } else {
                    data = data.concat(item);
                }
            });
            return data;
        }
    },
    methods: {
        // 获取城市列表
        cityList() {
            Api.finance.city().then((res) => {
                this.cityListDate = res;
            });

        },
        chang(data) {
            this.$emit('CityChange', data);
        },
        // 重置表单
        resetForm() {
            this.city = [];
        }
    },
    mounted() {
        this.cityList();
        if (this.dataCity) {
            this.city = this.dataCity;
        }
    }
};
</script>
