<template>
    <div>
        <so-modal title="经销商列表" size="default" :visible.sync="show" class="edit" @on-close="editNode">
            <so-table
             empty-text='暂无数据'
            :data="TableList"
            border
            style="width: 100%;">
                <so-table-column
                    prop="shopName"
                    label="车商名称"
                />
                <so-table-column
                    prop="shopCode"
                    label="车商code"
                    width="150"
                />
            </so-table>
        </so-modal>
    </div>
</template>
<script>
export default {
    data() {
        return {
            show: true,
            TableList: []
        };
    },
    methods: {
        editNode() {
            this.look();
        }
    },
    props: {
        look: Function, //关闭方法
        dataPresent: Object//当前行数据
    },
    mounted() {
        let data = [];
        if (this.dataPresent.distributorList) {
            data = this.dataPresent.distributorList;
        }
        this.TableList = data;
    }
};
</script>
