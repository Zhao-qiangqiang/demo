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
        <!--表格 -->
        <div>
            <so-table empty-text="暂无数据" :data="TableList" border style="width: 100%;">
                <so-table-column type="index" label="序号" width="150"></so-table-column>
                <so-table-column prop="ownerShopCode" label="店铺编码" width="120"></so-table-column>
                <so-table-column prop="cityName" label="城市" width="120"></so-table-column>
                <so-table-column prop="name" label="店铺名称" width="120"></so-table-column>
                <so-table-column prop="address" label="地址" width="300"></so-table-column>
                <so-table-column prop="phone" label="联系方式"></so-table-column>
                <so-table-column label="营业时间">
                    <template
                        slot-scope="scope"
                    >{{scope.row.openTime?scope.row.openTime+"-"+scope.row.closeTime:"暂无"}}</template>
                </so-table-column>
                <so-table-column prop="data" label="状态">
                    <template
                        slot-scope="scope"
                    >{{scope.row.status===1?"正常":scope.row.status===2?"暂停":"关闭"}}</template>
                </so-table-column>
                <so-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <!-- 产品对接确认   编辑更改为查看 -->
                        <span class="span" @click="editShow(scope.row)">查看</span>
                        <span
                            v-if="scope.row.status===1"
                            class="span"
                            @click="statusChange(0,2,scope.row)"
                        >暂停营业</span>
                        <span
                            v-if="scope.row.status!==1"
                            class="span"
                            @click="statusChange(1,1,scope.row)"
                        >恢复营业</span>
                        <span
                            v-if="scope.row.status===2"
                            class="span"
                            @click="statusChange(2,0,scope.row)"
                        >关闭店铺</span>
                    </template>
                </so-table-column>
            </so-table>
            <!-- 分页 -->
            <div class="tableList">
                <so-pagination
                    style="margin-top:20px;"
                    layout="prev, pager, next"
                    :total="total"
                    :current-page="searchDtata.page"
                    @on-current-change="Changepage"
                ></so-pagination>
            </div>
        </div>
        <!-- 编辑弹窗 -->
        <Edit v-if="show" :Changepage="Changepage" :editNode="editNode" :EditData="EditData" />
    </div>
</template>
<script>
import Edit from "./edit";

export default {
    components: {
        Edit
    },
    data() {
        return {
            show: false,
            EditData: ""
        };
    },
    props: {
        searchDtata: Object,
        pageChange: Function,
        TableList: Array,
        total: Number || String,
        editFun: Function
    },
    methods: {
        // 编辑显示
        editShow(value) {
            this.EditData = value;
            this.show = !this.show;
        },
        // 编辑隐藏
        editNode() {
            this.show = false;
        },
        // page修改
        Changepage(value) {
            if (value) {
                this.pageChange({ page: value });
            } else {
                this.pageChange();
            }
        },
        // 门店状态更改
        statusChange(num, value, row) {
            this.$message.warning("和2.0版本功能冲突，暂停使用");
            return;
            let data = ["是否暂停营业", "是否恢复营业", "是否关闭店铺"];
            this.$confirm(`${data[num]}?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.editFun({ hallId: row.uuid, status: value });
                    // Api.finance.edit({hallId:row.uuid,status:value}).then(res=>{
                    //     this.Changepage()
                    // })
                    // // console.log('已暂停!');
                })
                .catch(() => {
                    // console.log('已取消删除');
                });
        }
        // editFun(){}
        // // 暂停营业
        // suspend(value) {
        //     this.$confirm('是否暂停营业?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         // console.log('已暂停!');
        //     }).catch(() => {
        //         // console.log('已取消删除');
        //     });
        // },
        // // 关闭店铺
        // Close(value) {
        //     this.$confirm('是否关闭店铺?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         // console.log('已关闭!');
        //     }).catch(() => {
        //         // console.log('已取消删除');
        //     });
        // }
    }
};
</script>
