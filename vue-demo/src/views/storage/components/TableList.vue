<style lang="less">
    .page {
        text-align: center;
    }
    .span {
        margin-left: 5px;
        color: #4da6ff;
        cursor: pointer;
    }
</style>
<template>
    <div class="tableList">
        <span class="span" @click="editNode({})">新增</span>
        <so-table
        empty-text='暂无数据'
        :data="TableListData"
        border
        style="width: 100%;">
        <so-table-column
            type="index"
            label="序号"
            width="50"/>
        <so-table-column
            prop="cityName"
            label="城市"
            width="150"
        />
        <so-table-column
            prop="hallName"
            label="门店"
            width="150"
        />
        <so-table-column
            prop="interactionName"
            label="交互点名称"
            width="150"
        />
        <!-- <so-table-column
            prop="position"
            label="展位号"
            width="150"
        /> -->
        <so-table-column
            prop="interactionCode"
            label="云货架编码"
            width="160"
        />
        <so-table-column
            prop="interactionCarCount"
            label="已配置数量"
        />
        <so-table-column
            prop="data"
            label="状态"
            width="150"
        >
            <template slot-scope="scope">
                {{scope.row.status===1?"正常":"暂停"}}
            </template>
        </so-table-column>
        <so-table-column
            label="操作"
            width="150"
        >
        <template slot-scope="scope">
            <span class="span" @click="editNode(scope.row)">编辑</span>
            <span v-if="scope.row.status===2" class="span" @click="startUp(scope.row,1)">启用</span>
            <span v-if="scope.row.status===1" class="span" @click="startUp(scope.row,2)">暂停</span>
        </template>
        </so-table-column>
        </so-table>
        <div class="page">
            <so-pagination style="margin-top:20px;"
                layout="prev, pager, next"
                :total='total'
                :current-page="searchDtata.page"
                @on-current-change="Changepage"
            />
        </div>
        <!-- 编辑 -->
        <Edit v-if="EditShow" :editNode="editNode" :data='EditData' :Changepage="Changepage"/>
    </div>
</template>
<script>
import Api from 'api';
import Edit from './edit';

export default {
    components: {
        Edit
    },
    data() {
        return {
            EditShow: false, //编辑显示
            EditData: {}//编辑
        };
    },
    props: {
        TableListData: {
            type: Array,
            default: function() {
                return [];
            }
        },
        searchDtata: Object,
        pageChange: Function,
        total: Number || String
    },
    methods: {
        // 分页修改
        Changepage(value) {
            let data = {};
            if (value) {
                data.page = value;
            }
            this.pageChange(data);
        },
        // 编辑显示隐藏
        editNode(value) {
            this.EditData = value;
            this.EditShow = !this.EditShow;
        },
        // 启用暂停
        startUp(row, type) {
            let data = {
                interactionCode: row.interactionCode,
                status: type
            };
            Api.plate.edit(data).then((res) => {
                this.show = false;
                this.Changepage();
                this.$toast({
                    message: '修改成功',
                    type: 'success',
                    duration: 800
                });
            });
        }
    }
};
</script>
