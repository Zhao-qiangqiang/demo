<template>
    <div>
        <SearchToplist :searchDtata="searchDtata"  :query="query"/>
        <TableList :TableListData="TableListData" :pageChange="query" :searchDtata="searchDtata" :total="total"/>
    </div>
</template>
<script>
import Api from 'api';
import SearchToplist from './components/searchTop';
import TableList from './components/TableList';

export default {
    components: {
        SearchToplist, TableList
    },
    data() {
        return {
            searchDtata: {
                cityCodeList: [],
                hallName: '',
                interactionName: '', // 交互点名称
                status: '',
                position: '', //展位号
                page: 1,
                pageSize: 10,
                interactionType: 0//区分水牌查询还是云货架查询 水牌 0 云货架 1
            },
            TableListData: [],
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
            Api.plate.getList({...this.searchDtata, cityCodeList: JSON.stringify(this.searchDtata.cityCodeList)}).then((res) => {
                this.TableListData = res.items;
                this.total = res.totalNumber;
            });
        }
        // 水牌编辑

    },
    mounted() {
        this.queryList();
        console.log(process.env.VUE_APP_DEV_URL);
    }
};
</script>

