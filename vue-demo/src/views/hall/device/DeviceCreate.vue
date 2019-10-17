<template>
    <div>
        <el-form label-position="right" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="设备类型">
                        <el-select v-model="deviceVO.type">
                            <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="设备id" required>
                        <el-input maxlength="30" v-model="deviceVO.uuid"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="设备别名" required>
                        <el-input maxlength="30" v-model="deviceVO.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>


<script>
import Api from "api";
import moment from "moment";

export default {
    data() {
        return {
            deviceVO: {
                type: "闸机",
                uuid: null,
                name: null
            },
            /**
             * 设备类型
             */
            typeList: [
                { value: "闸机", label: "闸机" },
                { value: "抓拍机", label: "抓拍机" },
                { value: "领奖机", label: "领奖机" }
            ]
        };
    },
    methods: {
        clear() {
            console.log("清理");
            this.deviceVO.type = "闸机";
            this.deviceVO.uuid = null;
            this.deviceVO.name = null;
        },
        /**
         * 校验表单
         */
        check() {
            console.log("校验表单");
            if (!this.deviceVO.uuid) {
                this.$message.warning("设备id不能为空");
                return false;
            }
            if (!this.deviceVO.name) {
                this.$message.warning("设备别名不能为空");
                return false;
            }
            return true;
        }
    }
};
</script>
