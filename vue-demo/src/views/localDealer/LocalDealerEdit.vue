<template>
    <div>
        <el-form label-position="left" label-width="10px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item>{{selectedVO.name}}</el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!--按钮-->
        <div style="margin:6px 0;">
            <el-button @click="create()">新增车商</el-button>
        </div>

        <!--列表-->
        <div class="form">
            <el-table :data="list" ref="listTable" style="width: 100%;">
                <el-table-column label="序号" prop="sort"></el-table-column>
                <el-table-column label="经销商名称" prop="shopName"></el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                        <el-button @click="remove(scope.row)" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--弹出界面-->
        <el-dialog title="新增车商" width="70%" :visible.sync="isShowCreate" :append-to-body="true">
            <DealerCreate ref="dealerCreate"></DealerCreate>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowCreate = false">取消</el-button>
                <el-button type="primary" @click="createComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑车商" width="70%" :visible.sync="isShowEdit" :append-to-body="true">
            <DealerEdit ref="dealerEdit" :selectedDealer="selectedDealer"></DealerEdit>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowEdit = false">取消</el-button>
                <el-button type="primary" @click="editComplete()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style>
.form {
    padding: 12px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>

<script>
import Api from "api";
import moment from "moment";
import DealerCreate from "./dealer/DealerCreate";
import DealerEdit from "./dealer/DealerEdit";
export default {
    components: {
        DealerCreate,
        DealerEdit
    },
    props: {
        selectedVO: null
    },
    data() {
        return {
            list: [],
            /**
             * 当前选中对象
             */
            selectedDealer: null,
            isShowCreate: false,
            isShowEdit: false
        };
    },
    mounted() {
        this.init(this.selectedVO.uuid);
    },
    methods: {
        init(uuid) {
            this.getDealerList_api(uuid);
        },
        /**
         * 查询本地车商列表
         */
        getDealerList_api(uuid) {
            Api.localDealer.selectList({ hallCode: uuid }).then(res => {
                this.list = res;
            });
        },
        /**
         * 添加
         */
        create() {
            console.log("添加");
            if (this.$refs.dealerCreate) {
                this.$refs.dealerCreate.init();
            }
            this.isShowCreate = true;
        },
        /**
         * 添加完成
         */
        createComplete() {
            if (!this.$refs.dealerCreate.check()) {
                return;
            }
            console.log("添加完成");
            //门店编码
            this.$refs.dealerCreate.vo.hallCode = this.selectedVO.uuid;
            Api.localDealer.create(this.$refs.dealerCreate.vo).then(res => {
                this.isShowCreate = false;
                this.getDealerList_api(this.selectedVO.uuid);
            });
        },
        /**
         * 编辑
         */
        edit(row) {
            this.selectedDealer = row;
            console.log("编辑" + this.selectedDealer.id);
            this.isShowEdit = true;
            if (this.$refs.dealerEdit) {
                this.$refs.dealerEdit.init(this.selectedDealer.id);
            }
        },
        /**
         * 编辑完成
         */
        editComplete() {
            if (!this.$refs.dealerEdit.check()) {
                return;
            }
            console.log("编辑完成");
            //门店编码
            this.$refs.dealerEdit.vo.hallCode = this.selectedVO.uuid;
            Api.localDealer.update(this.$refs.dealerEdit.vo).then(res => {
                this.isShowEdit = false;
                this.getDealerList_api(this.selectedVO.uuid);
            });
        },
        /**
         * 删除
         */
        remove(row) {
            this.selectedDealer = row;
            console.log("删除");
            this.$confirm("您确定要删除这条数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(_ => {
                    Api.localDealer
                        .deleteDealer(this.selectedDealer)
                        .then(res => {
                            this.getDealerList_api(this.selectedVO.uuid);
                        });
                })
                .catch(_ => {});
        }
    }
};
</script>
