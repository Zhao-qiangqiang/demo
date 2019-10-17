<template>
    <div>
        <el-form label-position="right" label-width="100px">
            <el-form-item label="业务类型">{{vo.typeStr}}</el-form-item>
            <el-form-item label="门店">{{vo.hallName}}</el-form-item>
            <el-form-item label="车型">{{vo.modelName}}</el-form-item>
            <el-form-item label="车架号">{{vo.vin}}</el-form-item>
            <el-form-item label="车牌">{{vo.plateNumber}}</el-form-item>
            <el-form-item
                v-if="vo.type==1"
                label="入库时间"
            >{{!vo.moveTime?"":vo.moveTime.split(" ")[0]}}</el-form-item>
            <el-form-item
                v-if="vo.type==2"
                label="出库时间"
            >{{!vo.moveTime?"":vo.moveTime.split(" ")[0]}}</el-form-item>
            <el-form-item label="投展商类型">{{vo.supplierTypeStr}}</el-form-item>
            <el-form-item label="投展商名称">{{vo.supplierName}}</el-form-item>
            <el-form-item label="展位">{{vo.boothNumber}}</el-form-item>
            <el-form-item label="状态">{{vo.statusStr}}</el-form-item>
            <el-form-item label="图片">
                <UpLoad ref="upLoad"></UpLoad>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import Api from "api";
import moment from "moment";
import UpLoad from "../components/UpLoad";

export default {
    components: {
        UpLoad
    },
    props: {
        selectedVO: null
    },
    data() {
        return {
            vo: {
                type: "",
                hallId: "",
                modelCode: "",
                modelName: "",
                seriesCode: "",
                seriesName: "",
                brandCode: "",
                brandName: "",
                vin: "",
                plateNumber: "",
                moveTime: null,
                moveTimeStr: "",
                boothNumber: "",
                supplierType: "",
                supplierCode: "",
                supplierName: "",
                imageUrl: ""
            }
        };
    },

    mounted() {
        this.init(this.selectedVO.uuid);
    },
    methods: {
        /**
         * 初始化
         */
        init(uuid) {
            this.vo = {};
            this.get_api(uuid);
        },
        /**
         * 查询单个
         */
        get_api(uuid) {
            Api.carRequest.getByUuid({ uuid: uuid }).then(res => {
                this.vo = res;
                //初始化图片
                this.$refs.upLoad.init(this.vo.imageUrl);
                this.$refs.upLoad.disabled = true;
            });
        },
        clear() {
            //初始化图片
            this.$refs.upLoad.init("");
        }
    }
};
</script>
