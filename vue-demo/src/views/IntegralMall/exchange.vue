<template>
    <div class="exchange">
        <so-form :model="searchDtataCopy" label-position="right" label-width="90px">
            <so-row>
                <so-col span="8">
                    <so-form-item label="兑换时间">
                        <so-date-picker
                            v-model="searchDtataCopy.exchangeTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00', '24:00:00']"
                            type="datetimerange"
                            placeholder="start  time —— end time"
                        ></so-date-picker>
                    </so-form-item>
                </so-col>
                <so-col span="8">
                    <so-form-item label="领取时间">
                        <so-date-picker
                            v-model="searchDtataCopy.takeTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00', '24:00:00']"
                            type="datetimerange"
                            placeholder="start  time —— end time"
                        ></so-date-picker>
                    </so-form-item>
                </so-col>
                <so-col span="8">
                    <so-form-item label="领取状态" prop="type">
                        <!-- <so-input  v-model="searchDtataCopy.city" auto-complete="off"></so-input> -->
                        <so-select width="100%" v-model="searchDtataCopy.status" placeholder="全部状态">
                            <so-option
                                v-for="item in receiveStateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></so-option>
                        </so-select>
                    </so-form-item>
                </so-col>
            </so-row>
            <so-row>
                <so-col span="8">
                    <so-form-item label="商品名称">
                        <so-input v-model="searchDtataCopy.commodityName" placeholder="名称支持模糊音查询"></so-input>
                    </so-form-item>
                </so-col>
                <so-col span="8">
                    <so-form-item label="兑换流水号">
                        <so-input v-model="searchDtataCopy.orderNo"></so-input>
                    </so-form-item>
                </so-col>
                <so-col span="8">
                    <so-form-item label="开放展馆" prop="hallCode" filterable>
                        <so-select width="100%" v-model="searchDtataCopy.hallCode">
                            <so-option
                                v-for="item in pavilionList"
                                :key="item.uuid"
                                :label="item.name"
                                :value="item.uuid"
                            />
                        </so-select>
                    </so-form-item>
                </so-col>
            </so-row>
            <so-col span="24" class="button-list">
                <so-Button @click="exportData()">导出数据</so-Button>
                <so-Button type="info" @click="query()">查询</so-Button>
            </so-col>
        </so-form>
        <so-table :data="TableList" border style="width: 100%;">
            <so-table-column prop="orderNo" label="兑换流水号" width="180"></so-table-column>
            <so-table-column prop="commodityName" label="商品名称" width="120"></so-table-column>
            <so-table-column prop="num" label="商品数量（个）" width="120"></so-table-column>
            <so-table-column prop="hallName" label="开放展馆" width="120"></so-table-column>
            <so-table-column prop="exchangeIntegral" label="积分数量" width="100"></so-table-column>
            <so-table-column prop="exchangeTime" label="兑换时间"></so-table-column>
            <so-table-column prop="statusName" label="领取状态"></so-table-column>
            <so-table-column
                prop="takeTime"
                label="领取时间"
                :formatter="(row, column) => row.takeTime || "--""
            ></so-table-column>
        </so-table>
        <!-- 分页 -->
        <so-pagination
            style="margin-top:20px;"
            layout="prev, pager, next"
            :total="total"
            :current-page="page"
            @on-current-change="changePage"
        ></so-pagination>
    </div>
</template>
<script>
import Api from 'api';

export default {
    data() {
        return {
            receiveStateList: [
                {
                    label: '全部状态',
                    value: null
                },
                {
                    label: '未核销',
                    value: 0
                },
                {
                    label: '已核销',
                    value: 1
                }
            ],
            pavilionList: [],
            total: null,
            TableList: [],
            page: 1,
            pageSize: 10,
            searchDtataCopy: {
                exchangeTime: [],
                takeTime: [],
                status: null,
                commodityName: '',
                orderNo: '',
                hallCode: ''
            }
        };
    },
    mounted() {
        this.query();
        this.hallList();
    },
    watch: {},
    methods: {
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        query() {
            this.dataFormat();
            Api.finance
                .exChangeList({
                    ...this.searchDtataCopy,
                    pageSize: this.pageSize,
                    pageIndex: this.page,
                    _security_token: '91558513861256923'
                })
                .then((res) => {
                    this.TableList = res.items;
                    this.total = res.totalNumber;
                });
        },
        dataFormat() {
            if (this.searchDtataCopy.exchangeTime.length > 0) {
                this.searchDtataCopy.exchangeStartTime = this.searchDtataCopy.exchangeTime[0];
                this.searchDtataCopy.exchangeEndTime = this.searchDtataCopy.exchangeTime[1];
            } else {
                this.searchDtataCopy.exchangeStartTime = '';
                this.searchDtataCopy.exchangeEndTime = '';
            }
            if (this.searchDtataCopy.takeTime.length > 0) {
                this.searchDtataCopy.takeStartTime = this.searchDtataCopy.takeTime[0];
                this.searchDtataCopy.takeEndTime = this.searchDtataCopy.takeTime[1];
            } else {
                this.searchDtataCopy.takeStartTime = '';
                this.searchDtataCopy.takeEndTime = '';
            }
        },
        hallList() {
            Api.finance
                .getPageList({
                    pageSize: 999,
                    pageIndex: 1,
                    _security_token: '91558513861256923'
                })
                .then((res) => {
                    this.pavilionList = res.items;
                    this.total = res.totalPage;
                });
        },
        exportData() {
            this.$confirm(
                `当前筛选结果为${this.TableList.length}条数据`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(() => {
                    this.dataFormat();
                    let domain = process.env.VUE_APP_FINSNCE_URL;
                    var href = `${domain}api/manage/mall/exportOrder.json?`;
                    var param1 = `status=${this.searchDtataCopy.status}&`;
                    var param2 = `commodityName=${this.searchDtataCopy.commodityName}&`;
                    var param3 = `orderNo=${this.searchDtataCopy.orderNo}&`;
                    var param4 = `hallCode=${this.searchDtataCopy.hallCode}&`;
                    var param5 = `exchangeStartTime=${this.searchDtataCopy.exchangeStartTime}&`;
                    var param6 = `exchangeEndTime=${this.searchDtataCopy.exchangeEndTime}&`;
                    var param7 = `takeStartTime=${this.searchDtataCopy.takeStartTime}&`;
                    var param8 = `takeEndTime=${this.searchDtataCopy.takeEndTime}`;
                    window.location.href = `${href}${param1}${param2}${param3}${param4}${param5}${param6}${param7}${param8}`;
                })
                .catch(() => {});
        },
        changePage(value) {
            this.page = value;
            this.query();
        }
    }
};
</script>
<style lang="less">
.exchange {
    .button-list {
        margin-bottom: 20px;
        button {
            margin-right: 10px;
            float: right;
        }
    }
    .so-date-editor--datetimerange {
        width: 100%;
    }
}
</style>
