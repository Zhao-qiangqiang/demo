<style lang="less">
.so-modal__body {
    overflow: hidden;
}
.so-modal__header {
    background-color: #4da6ff;
    color: #fff;
}
.spanButton {
    padding: 11px 12px 11px 0;
    display: inline-block;
    margin-left: 30px;
    color: #4da6ff;
    cursor: pointer;
}
</style>
<template>
    <div>
        <so-modal title="编辑" size="large" :visible.sync="show" class="edit" @on-close="editNode">
            <!-- 馆名 -->
            <h3>{{this.data.name}}</h3>
            <div>
                <!-- 头部搜索 -->
                <so-form
                    :model="searchDtata"
                    ref="ruleForm"
                    label-position="right"
                    label-width="80px"
                >
                    <so-col span="8">
                        <so-form-item label="品牌搜索" prop="brandName">
                            <so-input v-model="searchDtata.brandName" placeholder="请输入"></so-input>
                        </so-form-item>
                    </so-col>
                    <so-col span="8">
                        <so-form-item label="车型搜索" prop="modelName">
                            <so-input v-model="searchDtata.modelName" placeholder="请输入"></so-input>
                        </so-form-item>
                    </so-col>
                </so-form>
                <!-- 底部表格 -->
                <so-table
                    empty-text="暂无数据"
                    :data="FilteringResults"
                    border
                    ref="multipleTable"
                    style="width: 100%;"
                    @on-select="select"
                    @on-select-all="selectAll"
                >
                    <so-table-column type="index" label="序号" width="50"></so-table-column>
                    <so-table-column prop="brandName" label="品牌" width="140" />
                    <so-table-column prop="modelName" label="车型" width="230" />
                    <so-table-column prop="vin" label="车架号" width="70" />
                    <so-table-column label="经销商" width="130">
                        <template slot-scope="scope">
                            <so-button @click="look(scope.row)">查看经销商</so-button>
                        </template>
                    </so-table-column>
                    <so-table-column label="投展商">
                        <!--  prop="supplierName" -->
                        <template slot-scope="scope">
                            <span>{{scope.row.supplierType > 2 ?(scope.row.supplierType===3?'自营':'主机厂') :scope.row.supplier?scope.row.supplier.shopName:''}}</span>
                        </template>
                    </so-table-column>
                    <so-table-column prop="boothNumber" label="展位" width="50" />
                    <so-table-column label width="100">
                        <template slot-scope="scope">
                            <so-button @click="addShow(scope.row)" style="margin-right:10px;">修改</so-button>
                        </template>
                    </so-table-column>
                </so-table>
            </div>
        </so-modal>
        <!-- 车商查看 -->
        <Look v-if="LookShow" :look="look" :dataPresent="dataPresent"></Look>
        <!-- 修改车辆 -->
        <Amend v-if="AmendShow" :addShow="addShow" :dataPresent="dataPresent" @CarList="CarList" />
    </div>
</template>
<script>
import Api from "api";
import Look from "./look";
import Amend from "./amend";

export default {
    components: {
        Look,
        Amend
    },
    data() {
        return {
            show: true, //本模态框显示
            LookShow: false, //查看车商显示
            AmendShow: false, //新增修改显示
            searchDtata: {
                brandName: "",
                modelName: ""
            }, //查询条件
            TableList: [], //表格数据
            deleteList: [], //多选时当前选中的
            dataPresent: {
                hallId: this.data.uuid,
                city: this.data.cityCode
            } //当前正在操作的行
        };
    },
    props: {
        editNode: Function,
        data: Object, //当前行信息
        Changepage: Function
    },
    methods: {
        // 表格选中索引
        tableIndex(row) {
            let ind = "";
            this.TableList.forEach((item, index) => {
                if (item.id === row.id) {
                    ind = index;
                }
            });
            return ind;
        },
        // 表格选择
        select(selection, row) {
            // 获取所有选中的数据
            let data = this.deleteList.filter(item => item.id === row.id);
            if (data.length > 0) {
                this.deleteList = this.deleteList.filter(
                    item => item.id !== row.id
                );
            } else {
                this.deleteList.push(row);
            }
        },
        // 表格全选
        selectAll(selection) {
            if (selection.length > 0) {
                this.deleteList = selection;
            } else {
                this.deleteList = [];
            }
        },
        // 查看经销商
        look(row) {
            this.LookShow = !this.LookShow;
            this.dataPresent = row;
        },
        // 修改车辆
        addShow(row) {
            this.AmendShow = !this.AmendShow;
            this.dataPresent = {
                hallId: this.data.uuid,
                city: this.data.cityCode,
                ...row
                // supplierType: `${row.supplierType}`//投展商转字符串
            };
        },
        // 车辆列表查询
        CarList() {
            Api.finance.Carlist({ hallId: this.data.uuid }).then(res => {
                this.TableList = res;
                this.Changepage();
                // console.log(res)
            });
        }
    },
    mounted() {
        this.CarList();
    },
    computed: {
        FilteringResults() {
            let data = [];
            this.TableList.forEach(item => {
                if (
                    item.brandName.indexOf(this.searchDtata.brandName) >= 0 &&
                    item.modelName.indexOf(this.searchDtata.modelName) >= 0
                ) {
                    data.push(item);
                }
            });
            return data;
        }
    }
};
</script>
