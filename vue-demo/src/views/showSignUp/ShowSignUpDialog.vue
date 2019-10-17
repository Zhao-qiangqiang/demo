<template>
    <div>
        <el-form label-position="left" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="id">{{vo.id}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="名称">{{vo.name}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注">{{vo.remark}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="创建时间">{{getCreateTime}}</el-form-item>
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
            Api.carRequest.get({ id: selectedId }).then(res => {
                this.vo = res;
            });
        }
    },
    computed: {
        getCreateTime() {
            return moment(this.vo.createTime).format("YYYY-MM-DD HH:mm:ss");
        }
    }
};
</script>
