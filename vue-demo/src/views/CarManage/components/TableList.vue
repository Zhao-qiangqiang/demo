<style lang="less">
    .tableList {
        text-align: center;
    }
    .span {
        margin-left: 5px;
        color: #4da6ff;
        cursor: pointer;
    }
</style>
<template>
    <div>
        <div>
            <so-table
                empty-text='暂无数据'
                :data="TableList"
                border
                style="width: 100%;">
                <so-table-column
                    type="index"
                    label="序号"
                    width="150"
                />
                <so-table-column
                    prop="cityName"
                    label="城市"
                    width="150"
                />
                <so-table-column
                    prop="name"
                    label="门店"
                />
                <so-table-column
                    prop="count"
                    label="车辆数量"
                    width="150"
                />
                <so-table-column
                    label="操作"
                    width="150"
                    fixed="right"
                >
                <template slot-scope="scope">
                    <span class="span" @click="editShow(scope.row)">编辑</span>
                </template>
                </so-table-column>
            </so-table>
            <!-- 分页 -->
            <div class="tableList">
            <so-pagination style="margin-top:20px;"
                layout="prev, pager, next"
                :total='total'
                :page-size="searchDtata.pageSize"
                :current-page="searchDtata.page"
                @on-current-change="Changepage"
            />
            </div>
        </div>
        <!-- 编辑 -->
        <Edit v-if="show"  :editNode="editNode" :data='EditData' :Changepage='Changepage'/>
    </div>
</template>
<script>
import Edit from './edit';

export default {
    components: {
        Edit
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
            if (value) {
                this.pageChange({page: value});
            } else {
                this.pageChange();
            }

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

