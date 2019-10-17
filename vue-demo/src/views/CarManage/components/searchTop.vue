<style lang="less" scoped>
.rootTop {
    overflow: hidden;
    padding: 10px;
    .ButtonList {
        text-align: left;
        padding-left: 5%;
        .so-button {
            margin-left: 1%;
        }
    }
}
</style>
<template>
    <div class="rootTop">
        <so-form :model="searchDtataCopy" ref="ruleForm" label-position="right" label-width="80px" >
            <so-col span="6">
                <so-form-item label="城市" prop="cityCodeList" >
                    <City ref="Citys" @CityChange="changeCity" style="width:100%;" :dataCity="searchDtataCopy.cityCodeList"/>
                </so-form-item>
            </so-col>
            <so-col span="6">
                <so-form-item label="门店" prop="hallName">
                   <so-input  v-model="searchDtataCopy.hallName" auto-complete="off"></so-input>
                </so-form-item>
            </so-col>
            <so-col span="24" class="ButtonList">
               <so-Button type="info" @click="query(searchDtataCopy)">查询</so-Button>
               <so-Button @click="resetForm('ruleForm')">重置</so-Button>
            </so-col>
        </so-form>
    </div>
</template>
<script>
import City from '../../components/city';

export default {
    components: {
        City
    },
    data() {
        return {
            storeList: [],
            options: [{value: '01', label: '上海'}, {value: '02', label: '杭州'}], //城市
            searchDtataCopy: {...this.searchDtata}
        };
    },
    props: {
        searchDtata: Object,
        query: Function
    },
    methods: {
        // 表单重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.$refs.Citys.resetForm();
            this.query(this.searchDtataCopy);
        },
        // 获取门店下拉选项
        getStore() {
            this.storeList.push({
                value: '',
                label: '全部'
            });
        },
        //城市选择改变
        changeCity(value) {
            this.searchDtataCopy.cityCodeList = value;
            // value.forEach((item) => {
            //     this.searchDtataCopy.cityCodeList.push(item.value);
            // });

        },
        // 城市显示处理
        customText (value) {
            return value.map(item => item.label).join(';');
        }
    }
};
</script>
