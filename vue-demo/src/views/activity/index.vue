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
                hallName: '',
                brandCode: '',
                status: '',
                receiveTimeBegin: '', //领取开始日期
                receiveTimeEnd: '', //领取结束日期
                verifyTimeBegin: '', //核销日期开始
                verifyTimeEnd: '', //核销日期结束
                verifyTime: '',
                receiveTime: '',
                receiver: '',
                expired: '', //是否过期
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
            let data = {
                hallName: this.searchDtata.hallName,
                brandName: this.searchDtata.brandName,
                status: this.searchDtata.status,
                brandCode: this.searchDtata.brandCode,
                receiveTimeBegin: this.searchDtata.receiveTimeBegin, //领取开始日期
                receiveTimeEnd: this.searchDtata.receiveTimeEnd, //领取结束日期
                verifyTimeBegin: this.searchDtata.verifyTimeBegin, //核销日期开始
                verifyTimeEnd: this.searchDtata.verifyTimeEnd, //核销日期结束
                receiver: this.searchDtata.receiver,
                expired: this.searchDtata.expired,
                page: this.searchDtata.page,
                pageSize: this.searchDtata.pageSize
            };
            Api.plate.marketList(data).then((res) => {
                this.TableList = res.items;
                this.total = res.totalNumber;
            });
            // console.log(this.searchDtata, 111);
        }
    },
    mounted() {
        this.queryList();
    }
};
</script>
