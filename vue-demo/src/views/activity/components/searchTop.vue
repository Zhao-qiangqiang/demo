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
    .so-col {
        height: 61px;
    }
}
</style>
<template>
    <div class="rootTop">
        <so-form :model="searchDtataCopy" ref="activityForm" label-position="right" label-width="90px">
            <so-col span="8">
                <so-form-item label="门店" prop="hallName">
                    <so-input  v-model="searchDtataCopy.hallName" auto-complete="off"></so-input>
                </so-form-item>
            </so-col>
            <so-col span="8">
                <so-form-item label="品牌" prop="brandName">
                    <!-- <so-input  v-model="searchDtataCopy.brandName" auto-complete="off"></so-input> -->
                    <so-select v-model="searchDtataCopy.brandCode" style="width:100%;" placeholder="请选择">
                        <so-option
                            v-for="item in brandList"
                            :key="item.value"
                            :label="item.brandName"
                            :value="item.brandCode"
                            >
                        </so-option>
                    </so-select>
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
                <so-form-item label="是否过期" prop="expired">
                    <so-select width="100%" v-model="searchDtataCopy.expired">
                        <so-option
                            v-for="item in expiredList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </so-select>
                </so-form-item>
            </so-col>
            <so-col span="8">
                <so-form-item label="领取日期" prop="receiveTime">
                    <!--  :" -->
                    <!-- <so-input  v-model="searchDtataCopy.receiveTime" auto-complete="off"></so-input> -->
                    <so-date-picker
                        @on-change="receiveTimeChange"
                        style="width:100%;"
                        v-model="searchDtataCopy.receiveTime"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        placeholder="选择日期范围">
                    </so-date-picker>
                </so-form-item>
            </so-col>
            <so-col span="8">
                <so-form-item label="核销日期" prop="verifyTime">
                    <!-- <so-input  v-model="searchDtataCopy.verifyTime" auto-complete="off"></so-input> -->
                     <so-date-picker
                        @on-change="verifyTimeChange"
                        style="width:100%;"
                        v-model="searchDtataCopy.verifyTime"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        placeholder="选择日期范围">
                    </so-date-picker>
                </so-form-item>
            </so-col>
            <so-col span="8">
                <so-form-item label="领取人" prop="receiver">
                    <so-input  v-model="searchDtataCopy.receiver" auto-complete="off"></so-input>
                </so-form-item>
            </so-col>
            <so-col span="24" class="ButtonList">
               <so-Button type="info" @click="query(searchDtataCopy)">查询</so-Button>
               <so-Button @click="resetForm('activityForm')">重置</so-Button>
            </so-col>
        </so-form>
    </div>
</template>
<script>
import Api from 'api';

export default {
    props: {
        searchDtata: Object,
        query: Function
    },
    data() {
        return {
            searchDtataCopy: {...this.searchDtata},
            statusList: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '已核销'
            }, {
                value: '0',
                label: '未核销'
            }],
            expiredList: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '已过期'
            }, {
                value: '0',
                label: '未过期'
            }],
            brandList: []
        };
    },
    methods: {
        // 表单重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.searchDtataCopy.brandCode = '';
            this.searchDtataCopy.receiveTimeBegin = '';
            this.searchDtataCopy.receiveTimeEnd = '';
            this.searchDtataCopy.verifyTimeBegin = '';
            this.searchDtataCopy.verifyTimeEnd = '';
            this.query(this.searchDtataCopy);
            // this.$refs.Citys.resetForm();
        },
        // 领取日期更改
        receiveTimeChange(value) {
            if (value) {
                this.searchDtataCopy.receiveTimeBegin = `${value[0]} 00:00:00`;
                this.searchDtataCopy.receiveTimeEnd = `${value[1]} 23:59:59`;
            } else {
                this.searchDtataCopy.receiveTimeBegin = '';
                this.searchDtataCopy.receiveTimeEnd = '';
            }

        },
        // 领取日期更改
        verifyTimeChange(value) {
            if (value) {
                this.searchDtataCopy.verifyTimeBegin = `${value[0]} 00:00:00`;
                this.searchDtataCopy.verifyTimeEnd = `${value[1]} 23:59:59`;
            } else {
                this.searchDtataCopy.verifyTimeBegin = '';
                this.searchDtataCopy.verifyTimeEnd = '';
            }
        },
        // 查询品牌
        brandInquire() {
            Api.finance.brand().then((res) => {
                this.brandList = res;
                this.brandList.unshift({
                    brandName: '全部',
                    brandCode: ''
                });
            });
        }
    },
    mounted() {
        this.brandInquire();
    }
};
</script>
