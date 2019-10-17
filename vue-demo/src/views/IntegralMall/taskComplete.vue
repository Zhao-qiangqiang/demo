<template>
    <div class="task">
        <so-form :model="searchDtataCopy" label-position="right" label-width="120px" >
            <so-row>
                <so-col span="8">
                    <so-form-item label="任务完成时间">
                        <so-date-picker
                            v-model="searchDtataCopy.taskCompleteTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00', '24:00:00']"
                            type="datetimerange"
                            placeholder="start  time —— end time">
                        </so-date-picker>
                    </so-form-item>
                </so-col>
                <so-col span="8">
                    <so-form-item label="用户名称">
                        <so-input v-model="searchDtataCopy.memberName"></so-input>
                    </so-form-item>
                </so-col>
                <so-col span="8">
                    <so-form-item label="用户ID">
                        <so-input v-model="searchDtataCopy.memberNo"></so-input>
                    </so-form-item>
                </so-col>
            </so-row>
            <so-row>
                <so-col span="8">
                    <so-form-item label="任务类型" prop="taskType" filterable>
                        <so-select width="100%" v-model="searchDtataCopy.taskType" placeholder="全部">
                            <so-option
                                v-for="item in taskTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
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
        <so-table
            :data="TableList"
            border
            style="width: 100%;">
            <so-table-column
                prop="dateCreate"
                label="任务完成时间"
                width="350">
            </so-table-column>
            <so-table-column
                prop="taskName"
                label="任务类型"
                width="120">
            </so-table-column>
            <so-table-column
                prop="memberNo"
                label="用户ID"
                width="220">
            </so-table-column>
            <so-table-column
                prop="memberName"
                label="用户名称"
                width="300"
                :formatter= '(row, column) => row.memberName || "--"'>
            </so-table-column>
            <so-table-column
                prop="integral"
                label="获得奖励">
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
                    label: '全部',
                    value: null
                },
                {
                    label: '分享',
                    value: 0
                },
                {
                    label: '到店',
                    value: 1
                },
                {
                    label: '录脸',
                    value: 2
                }
            ],
            total: null,
            TableList: [],
            page: 1,
            pageSize: 10,
            searchDtataCopy: {
                taskCompleteTime: [],
                memberNo: '',
                memberName: '',
                taskType: null
            }
        };
    },
    mounted() {
        this.query();
    },
    watch: {},
    methods: {
        query () {
            this.dataFormat();
            Api.finance.completeList({
                ...this.searchDtataCopy,
                pageSize: this.pageSize,
                pageIndex: this.page,
                _security_token: '91558513861256923'
            }).then((res) => {
                this.TableList = res.items;
                this.total = res.totalNumber;
            });
        },
        dataFormat () {
            if (this.searchDtataCopy.taskCompleteTime.length > 0) {
                this.searchDtataCopy.startTime = this.searchDtataCopy.taskCompleteTime[0];
                this.searchDtataCopy.endTime = this.searchDtataCopy.taskCompleteTime[1];
            } else {
                this.searchDtataCopy.startTime = '';
                this.searchDtataCopy.endTime = '';
            }
        },
        exportData () {
            this.$confirm(`当前筛选结果为${this.TableList.length}条数据`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dataFormat();
                let domain = process.env.VUE_APP_FINSNCE_URL;
                var href = `${domain}api/member/exportTask.json?`;
                var param1 = `memberNo=${this.searchDtataCopy.memberNo}&`;
                var param2 = `memberName=${this.searchDtataCopy.memberName}&`;
                var param3 = `taskType=${this.searchDtataCopy.taskType}&`;
                var param4 = `startTime=${this.searchDtataCopy.startTime}&`;
                var param5 = `endTime=${this.searchDtataCopy.endTime}`;
                window.location.href = `${href}${param1}${param2}${param3}${param4}${param5}`;
            }).catch(() => {
            });
        },
        changePage(value) {
            this.page = value;
            this.query();
        }
    }
};
</script>
<style lang="less">
    .task {
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
