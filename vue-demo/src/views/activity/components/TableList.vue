<style lang="less">
    .span {
        margin-left: 5px;
        color: #4da6ff;
        cursor: pointer;
    }
</style>
<template>
    <div>
        <so-table
        empty-text='暂无数据'
        :data="TableList"
        border
        style="width: 100%;">
        <so-table-column
            type="index"
            label="序号"
            width="50"/>
        <so-table-column
            prop="marketName"
            label="活动名称"
            width="150"/>
        <so-table-column
            prop="hallName"
            label="领取门店"
            width="150"/>
        <so-table-column
            prop="brandName"
            label="品牌"
            width="150"/>
        <so-table-column
            prop="receiveTime"
            label="领取日期"
            width="150"/>
        <so-table-column
            prop="validEndTime"
            label="截至有效期"
            width="150"
            :formatter= '(row) => `${row.validEndTime.substring(0,10)}`'
            />
        <so-table-column
            prop="verifyTime"
            label="核销日期"
            width="150"/>
        <so-table-column
            label="核销状态"
            width="150">
            <template slot-scope="scope">
                {{scope.row.status===0?'未核销':'已核销'}}
            </template>
        </so-table-column>
        <so-table-column
            label="过期状态"
            width="150">
            <template slot-scope="scope">
                {{!scope.row.expired?'未过期':'已过期'}}
            </template>
        </so-table-column>
        <so-table-column
            prop="memberPhone"
            label="领取人"/>
        <so-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
                    <span class="span" @click="editShow(scope.row)" v-if="scope.row.status !==0">查看核销凭证</span>
                </template>
        </so-table-column>
        </so-table>
        <div style="text-align: center;">
            <so-pagination style="margin-top:20px;"
                layout="prev, pager, next"
                :total='total'
                :current-page="searchDtata.page"
                :page-size="searchDtata.pageSize"
                @on-current-change="Changepage"
            />
        </div>
        <!-- 查看显示 -->
        <Look v-if="show" :editNode="editNode" :dataLook='EditData'/>
    </div>
</template>
<script>
import Look from './Look';

export default {
    components: {
        Look
    },
    data() {
        return {
            show: false,
            EditData: ''
        };
    },
    props: {
        searchDtata: Object,
        pageChange: Function,
        TableList: Array,
        total: Number || String
    },
    methods: {
        // 分页修改
        Changepage(value) {
            this.pageChange({page: value});
        },
        // 编辑显示
        editShow(value) {
            this.EditData = value;
            this.show = !this.show;
        },
        // 编辑隐藏
        editNode() {
            this.show = false;
        }
    }

};
</script>
