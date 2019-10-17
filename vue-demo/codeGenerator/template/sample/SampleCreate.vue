<template>
    <div>
        <el-form label-position="left" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="名称">
                        <el-input v-model="vo.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input v-model="vo.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            vo: {
                name: "",
                remark: ""
            }
        };
    },
    methods: {
        init() {
            this.vo.name = "";
            this.vo.remark = "";
        },
        /**
         * 校验表单
         */
        check() {
            return true;
        }
    }
};
</script>
