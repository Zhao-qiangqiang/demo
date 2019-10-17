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
import Api from "api";
import moment from "moment";
export default {
    props: {
        selectedVO: null
    },
    data() {
        return {
            vo: {
                id: "",
                name: "",
                remark: "",
                createTime: null,
                updateTime: null
            }
        };
    },
    mounted() {
        this.init(this.selectedVO.id);
    },
    methods: {
        init(id) {
            this.vo = {};
            this.get_api(id);
        },
        /**
         * 查询单个
         */
        get_api(selectedId) {
            Api.sample.get({ id: selectedId }).then(res => {
                this.vo = res;
            });
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
