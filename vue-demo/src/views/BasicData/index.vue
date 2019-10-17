<style lang="less">
</style>

<template>
    <div class="root">
        <SearchTop :searchDtata="searchDtata" :query="query" />
        <TableList
            :searchDtata="searchDtata"
            :pageChange="query"
            :TableList="TableList"
            :total="total"
            :editFun="editFun"
        />
    </div>
</template>

<script>
import Api from 'api';
import SearchTop from './components/searchTop';
import TableList from './components/TableList';

export default {
    components: {
        SearchTop,
        TableList
    },
    mounted() {
        this.queryList();
        // 初始同步门店信息  不做任何操作
        Api.finance.init().then((res) => {});
    },
    data() {
        return {
            // 搜索
            searchDtata: {
                cityCodeList: [],
                hallName: '',
                status: '',
                page: 1,
                pageSize: 10
            },
            // 表格数据
            TableList: [],
            // 总页数
            total: 0
        };
    },
    methods: {
        query(value) {
            // 查询重置页数
            this.searchDtata = Object.assign({}, this.searchDtata, {
                ...value
            });
            this.queryList();
            // console.log(this.searchDtata)
        },
        // 查询数据
        queryList() {
            Api.finance
                .getPageList({
                    ...this.searchDtata,
                    cityCodeList: JSON.stringify(this.searchDtata.cityCodeList)
                })
                .then((res) => {
                    this.TableList = res.items;
                    this.total = res.totalNumber;
                });
        },
        // 修改
        editFun(data) {
            Api.finance.edit(data).then((res) => {
                this.queryList();
            });
        }
    }
};
</script>
