<template>
    <div class="inventory">
        <so-form :model="searchDtataCopy" label-position="right" label-width="120px" >
            <so-row>
                <so-col span="8">
                    <so-form-item label="创建时间">
                        <so-date-picker
                            v-model="searchDtataCopy.createTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00', '24:00:00']"
                            type="datetimerange"
                            placeholder="start  time —— end time">
                        </so-date-picker>
                    </so-form-item>
                </so-col>
                <so-col span="8">
                    <so-form-item label="商品类型" prop="taskType" filterable>
                        <so-select width="100%" v-model="searchDtataCopy.type" placeholder="全部类型">
                            <so-option
                                v-for="item in taskTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </so-select>
                    </so-form-item>
                </so-col>
                <so-col span="8">
                    <so-form-item label="状态" prop="status" filterable>
                        <so-select width="100%" v-model="searchDtataCopy.status" placeholder="全部状态">
                            <so-option
                                v-for="item in statusList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
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
                    <so-form-item label="商品ID">
                        <so-input v-model="searchDtataCopy.commodityNo" placeholder="请输入商品ID"></so-input>
                    </so-form-item>
                </so-col>
                <so-col span="8">
                    <so-form-item label="开放展馆">
                        <so-input v-model="searchDtataCopy.hallName" placeholder="输入展馆名称查询"></so-input>
                    </so-form-item>
                </so-col>
            </so-row>
            <so-row>
                <so-col span="8">
                    <so-form-item label="库存数量">
                        <so-input v-model="searchDtataCopy.inventory" placeholder="<="></so-input>
                    </so-form-item>
                </so-col>
            </so-row>
            <so-col span="24" class="button-list">
                <so-Button @click="addCommodity()">创建</so-Button>
                <so-Button type="info" @click="query()">查询</so-Button>
            </so-col>
        </so-form>
        <so-table
            :data="TableList"
            border
            style="width: 100%;">
            <so-table-column
                prop="commodityNo"
                label="商品ID"
                width="150">
            </so-table-column>
            <so-table-column
                prop="name"
                label="商品名称"
                width="120">
            </so-table-column>
            <so-table-column
                prop="validStartTime"
                label="有效期"
                width="200"
                :formatter= '(row) => `${row.validStartTime} 至 ${row.validEndTime}`'>
            </so-table-column>
            <so-table-column
                prop="rmbPrice"
                label="原价（元）"
                width="120">
            </so-table-column>
            <so-table-column
                prop="integral"
                label="兑换积分数量（积分）"
                width="60">
            </so-table-column>
            <so-table-column
                prop="hallName"
                label="开放展馆">
            </so-table-column>
            <so-table-column
                prop="inventory"
                label="现库存数量"
                width="60">
            </so-table-column>
            <so-table-column
                prop="exchangeCountTotal"
                label="已兑换数量"
                width="60">
            </so-table-column>
            <so-table-column
                prop="dateCreate"
                label="创建时间">
            </so-table-column>
            <so-table-column
                prop="statusName"
                label="状态"
                width="50">
            </so-table-column>
            <so-table-column
                prop="zip"
                label="操作">
                <template slot-scope="scope">
                    <span class="span" @click="detail(scope.row)">查看详情</span>
                    <span class="span" v-if="scope.row.status === 1" @click="undercarriage(scope.row)">下架</span>
                    <span class="span" v-if="scope.row.status !== 1" @click="shelves(scope.row)">上架</span>
                </template>
            </so-table-column>
        </so-table>
        <!-- 分页 -->
        <so-pagination style="margin-top:20px;"
                       layout="prev, pager, next"
                       :total="total"
                       :current-page="page"
                       @on-current-change="changePage"
        >
        </so-pagination>
    </div>
</template>
<script>
import Api from 'api';

export default {
    data() {
        return {
            taskTypeList: [
                {
                    label: '全部类型',
                    value: null
                },
                {
                    label: '实物',
                    value: 0
                }
            ],
            statusList: [
                {
                    label: '全部状态',
                    value: null
                },
                {
                    label: '下架',
                    value: 0
                },
                {
                    label: '上架',
                    value: 1
                }
            ],
            total: null,
            TableList: [],
            page: 1,
            pageSize: 10,
            searchDtataCopy: {
                createTime: [],
                type: null,
                status: null,
                commodityName: '',
                commodityNo: '',
                hallName: '',
                memberName: null
            }
        };
    },
    mounted() {
        this.query();
    },
    watch: {},
    methods: {
        query () {
            if (this.searchDtataCopy.createTime.length > 0) {
                this.searchDtataCopy.startTime = this.searchDtataCopy.createTime[0];
                this.searchDtataCopy.endTime = this.searchDtataCopy.createTime[1];
            } else {
                this.searchDtataCopy.startTime = '';
                this.searchDtataCopy.endTime = '';
            }
            Api.finance.inventoryList({
                ...this.searchDtataCopy,
                pageSize: this.pageSize,
                pageIndex: this.page,
                _security_token: '91558513861256923'
            }).then((res) => {
                this.TableList = res.items;
                this.total = res.totalNumber;
            });
        },
        addCommodity () {
            this.$router.push({
                name: 'inventoryAdd'
            });
        },
        detail (row) {
            this.$router.push({
                name: 'inventoryAdd',
                params: {
                    commodityNo: row.commodityNo
                }
            });
        },
        changePage(value) {
            this.page = value;
            this.query();
        },
        undercarriage (row) {
            Api.finance.offShel({
                commodityNo: row.commodityNo,
                _security_token: '02_0dKX_mgq2cppvGG'
            }).then((res) => {
                if (res) {
                    this.toast('下架成功');
                    this.query();
                }
            });
        },
        shelves (row) {
            Api.finance.upShelf({
                commodityNo: row.commodityNo,
                _security_token: '02_0dKX_mgq2cppvGG'
            }).then((res) => {
                if (res) {
                    this.toast('上架成功');
                    this.query();
                }
            });
        },
        toast (text) {
            this.$toast({
                message: text,
                type: 'success',
                duration: 1000
            });
        }
    }
};
</script>
<style lang="less">
    .inventory {
        .button-list {
            margin-bottom: 20px;
            button {
                margin-right: 10px;
                float: right;
            }
        }
        .span {
            margin-right: 5px;
            cursor: pointer;
            text-decoration: underline;
        }
        .so-date-editor--datetimerange {
            width: 100%;
        }
    }
</style>
