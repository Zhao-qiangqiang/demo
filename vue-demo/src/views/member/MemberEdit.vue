<template>
    <div>
        <el-form label-position="right" label-width="130px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="手机号">{{vo.phone}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item required label="是否为工作人员">
                        <el-select v-model="vo.type" clearable placeholder="请选择">
                            <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import moment from "moment";
export default {
    props: {
        selectedVO: null
    },
    data() {
        return {
            vo: {
                phone: "",
                type: null
            },
            /**
             * 是否未工作人员
             */
            typeList: [{ value: 1, label: "是" }, { value: 2, label: "否" }]
        };
    },
    mounted() {
        this.init(this.selectedVO);
    },
    methods: {
        init(obj) {
            console.log("初始化编辑界面");
            this.vo.phone = obj.phone;
            this.vo.type = obj.type;
        },

        /**
         * 校验表单
         */
        check() {
            if (!this.vo.type) {
                this.$message.warning("请选择是否为工作人员");
                return;
            }
            return true;
        }
    }
};
</script>
