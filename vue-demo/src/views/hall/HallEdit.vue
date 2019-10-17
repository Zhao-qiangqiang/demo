<template>
    <div>
        <el-form label-position="right" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="店铺编码">{{vo.ownerShopCode}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="店铺名称">{{vo.ownerShopName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="城市">{{vo.cityName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系方式">{{vo.phone}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="地址">{{vo.address}}</el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="门店简称">
                        <el-input maxlength="30" v-model="vo.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="营业时间">
                        <el-time-picker
                            style="width:100%;"
                            v-model="timeRange"
                            is-range
                            format="HH:mm"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            @change="changeTime()"
                        ></el-time-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="停车信息">
                        <el-input maxlength="30" v-model="vo.parkDesc"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="交通信息">
                        <el-input maxlength="30" v-model="vo.trafficDesc"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="客服微信">
                        <el-input maxlength="30" v-model="vo.weixinNo"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="展位数">
                        <el-input-number
                            v-model="vo.boothAmount"
                            :step="1"
                            step-strictly
                            :min="1"
                            :max="999"
                        ></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="状态">
                        <el-select style="width:100%;" v-model="vo.status">
                            <el-option
                                v-for="item in stateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--按钮-->
        <el-button type="text" @click="createDevice()">+新增设备</el-button>
        <!--列表-->
        <div class="form">
            <el-table :data="vo.deviceList" ref="listTable" style="width: 100%;">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="设备类型" prop="type"></el-table-column>
                <el-table-column label="设备id" prop="uuid"></el-table-column>
                <el-table-column label="设备别名" prop="name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editDevice(scope.row,scope.$index)" type="text">编辑</el-button>
                        <el-button @click="removeDevice(scope.row,scope.$index)" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="新增设备" :visible.sync="isShowCreate" :append-to-body="true">
            <DeviceCreate ref="deviceCreate"></DeviceCreate>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowCreate = false">取消</el-button>
                <el-button type="primary" @click="createComplete()">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑设备" :visible.sync="isShowEdit" :append-to-body="true">
            <DeviceEdit ref="deviceEdit" :deviceVO="deviceVO"></DeviceEdit>
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
import DeviceCreate from "./device/DeviceCreate";
import DeviceEdit from "./device/DeviceEdit";

export default {
    components: {
        DeviceCreate,
        DeviceEdit
    },
    props: {
        selectedVO: null
    },
    data() {
        return {
            vo: {
                name: null,
                deviceList: []
            },
            /**
             * 时间区间
             */
            timeRange: null,
            /**
             * 状态
             */
            stateList: [
                { value: 1, label: "正常" },
                { value: 2, label: "暂停" },
                { value: 0, label: "关闭" }
            ],
            isShowCreate: false,
            isShowEdit: false,

            /**
             * 当前选中设备对象
             */
            deviceVO: {},
            /**
             * 当前编辑行数
             */
            deviceIndex: null
        };
    },

    mounted() {
        this.get_api(this.selectedVO.uuid);
    },
    methods: {
        /**
         * 查询单个
         */
        get_api(selectedId) {
            this.vo = {};
            Api.hall.get({ hallId: selectedId }).then(res => {
                this.vo = res;
                this.timeRange = null;
                if (res.openTime) {
                    let openTime = res.openTime.split(":");
                    let closeTime = res.closeTime.split(":");
                    this.timeRange = [
                        new Date(2016, 9, 10, openTime[0], openTime[1]),
                        new Date(2016, 9, 10, closeTime[0], closeTime[1])
                    ];
                }
            });
        },
        changeTime() {
            console.log("修改时间");
            this.vo.openTime = "";
            this.vo.closeTime = "";
            if (this.timeRange) {
                this.vo.openTime = moment(this.timeRange[0]).format("HH:mm");
                this.vo.closeTime = moment(this.timeRange[1]).format("HH:mm");
            }
        },

        /**
         * 添加设备
         */
        createDevice() {
            console.log("添加设备");
            this.isShowCreate = true;
            if (this.$refs.deviceCreate) {
                this.$refs.deviceCreate.clear();
            }
        },
        /**
         * 添加设备完成
         */
        createComplete() {
            if (!this.$refs.deviceCreate.check()) {
                return;
            }
            this.isShowCreate = false;
            let item = this.$refs.deviceCreate.deviceVO;
            let device = {
                type: item.type,
                uuid: item.uuid,
                name: item.name
            };
            this.vo.deviceList.push(device);
        },
        /**
         * 编辑设备
         */
        editDevice(row, index) {
            this.isShowEdit = true;
            this.deviceVO = {
                type: row.type,
                uuid: row.uuid,
                name: row.name
            };
            this.deviceIndex = index;
            console.log(this.deviceIndex);
        },
        /**
         * 编辑设备完成
         */
        editComplete() {
            if (!this.$refs.deviceEdit.check()) {
                return;
            }
            this.isShowEdit = false;
            this.vo.deviceList[this.deviceIndex].type = this.deviceVO.type;
            this.vo.deviceList[this.deviceIndex].name = this.deviceVO.name;
            this.vo.deviceList[this.deviceIndex].uuid = this.deviceVO.uuid;
        },
        /**
         * 删除设备
         */
        removeDevice(row, index) {
            console.log("删除设备");
            this.vo.deviceList.splice(index, 1);
            // this.$confirm("您确定要删除这条数据吗？", "提示", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     type: "warning"
            // })
            //     .then(() => {
            //         console.log("删除设备成功");
            //         this.vo.deviceList.splice(index, 1);
            //     })
            //     .catch(() => {});
        },
        /**
         * 校验表单
         */
        check() {
            console.log("校验表单");
            if (this.vo.deviceList && this.vo.deviceList.length > 0) {
                const arr = this.vo.deviceList;
                for (let i = 0; i < arr.length - 1; i++) {
                    for (let j = i + 1; j < arr.length; j++) {
                        if (arr[i].uuid == arr[j].uuid) {
                            this.$message.warning(
                                "设备列表中第" +
                                    (i + 1) +
                                    "行和第" +
                                    (j + 1) +
                                    "行的设备id相同"
                            );
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    }
};
</script>
