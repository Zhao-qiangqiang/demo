<style lang="less">

</style>
<template>
    <div class="root">
        <SearchTopCar :searchDtata="searchDtata" :query="query"/>
        <TableListCar :searchDtata="searchDtata" :pageChange="query" :TableList="TableList" :total="total"/>
    </div>
</template>
<script>
import Api from 'api';
import SearchTopCar from './components/searchTop';
import TableListCar from './components/TableList';

export default {
    components: {
        SearchTopCar, TableListCar
    },
    data() {
        return {
            searchDtata: {
                cityCodeList: [],
                hallName: '',
                page: 1,
                pageSize: 10
            },
            // 表格数据
            TableList: [],
            total: 0
        };
    },
    methods: {
        query(value) {
            // 查询重置页数
            this.searchDtata = Object.assign({}, this.searchDtata, {...value});
            this.queryList();
        },
        // 查询数据
        queryList() {
            Api.finance.intro({...this.searchDtata, cityCodeList: JSON.stringify(this.searchDtata.cityCodeList)}).then((res) => {
                this.TableList = res.items;
                this.total = res.totalNumber;
            });
        }
    },
    mounted() {
        this.queryList();
    }
};
</script>
