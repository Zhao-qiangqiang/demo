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
        <so-form :model="searchDtataCopy" ref="ruleForm" label-position="right" label-width="90px">
            <so-col span="8">
                <so-form-item label="城市" prop="cityCodeList">
                    <City
                        ref="Citys"
                        @CityChange="changeCity"
                        style="width:100%;"
                        :dataCity="searchDtataCopy.cityCodeList"
                    />
                </so-form-item>
            </so-col>
            <so-col span="8">
                <so-form-item label="门店" prop="hallName">
                    <so-input v-model="searchDtataCopy.hallName" auto-complete="off"></so-input>
                </so-form-item>
            </so-col>
            <so-col span="8">
                <so-form-item label="交互点名称" prop="interactionName">
                    <so-input v-model="searchDtataCopy.interactionName" auto-complete="off"></so-input>
                </so-form-item>
            </so-col>
            <so-col span="8">
                <so-form-item label="状态" prop="status">
                    <so-select width="100%" v-model="searchDtataCopy.status">
                        <so-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </so-select>
                </so-form-item>
            </so-col>
            <so-col span="8">
                <so-form-item label="展位号" prop="position">
                    <so-input v-model="searchDtataCopy.position" auto-complete="off"></so-input>
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
import City from "../../components/city";

export default {
    components: {
        City
    },
    props: {
        searchDtata: Object,
        query: Function
    },
    data() {
        return {
            searchDtataCopy: { ...this.searchDtata },
            statusList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "2",
                    label: "暂停"
                },
                {
                    value: "1",
                    label: "正常"
                }
            ]
        };
    },
    methods: {
        changeCity(value) {
            this.searchDtataCopy.cityCodeList = value;
        },
        // 表单重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.$refs.Citys.resetForm();
            this.query(this.searchDtataCopy);
        }
    }
};
</script>
