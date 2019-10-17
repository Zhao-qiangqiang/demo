<template>
    <div>
        <so-modal title="新增/修改车辆"  size="large" :visible.sync="show"  @on-close="editNode">
            <so-form :model="dataList" :rules="rules" label-position="left" label-width="120px" class="form" ref="ruleForm">
                <so-form-item prop="modelCode">
                    <CarChoice @carChange="modeChange" :ResultProps="carData"/>
                </so-form-item>
            </so-form>
            <div slot="footer" class="modal-footer">
                <so-button @click="confirmCar" type="info" style="margin-right:10px;">确定</so-button>
                <so-button @click="show = false">取消</so-button>
            </div>
        </so-modal>
    </div>
</template>
<script>
import Api from 'api';
import CarChoice from '../../components/carChoice';

export default {
    components: {
        CarChoice
    },
    props: {
        editNode: Function,
        electronicBrandCode: Object, //主表信息
        dataPresent: Object//车辆信息
    },
    data() {
        return {
            show: true,
            dataList: {
                modelCode: ''
                // id:'',
            },
            carData: {

            },
            rules: {
                modelCode: [
                    { required: true, message: '请选择车辆信息', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        confirmCar() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (this.dataPresent.id) { //如果存在  为修改
                        Api.plate.carEdit({
                            id: this.dataPresent.id,
                            electronicBrandCode: this.electronicBrandCode.interactionCode,
                            modelCode: this.dataList.modelCode
                        }).then((res) => {
                            this.show = false;
                            this.$emit('query');
                        });
                    } else { //新增
                        Api.plate.carCreate({
                            electronicBrandCode: this.electronicBrandCode.interactionCode,
                            modelCode: this.dataList.modelCode
                        }).then((res) => {
                            this.show = false;
                            this.$emit('query');
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        modeChange(value) {
            this.dataList.modelCode = value.modelCode;
        }
    },
    mounted() {
        if (this.dataPresent) {
            this.carData = {
                brandName: this.dataPresent.brandName,
                brandCode: this.dataPresent.brandCode,
                seriesCode: this.dataPresent.seriesCode,
                seriesName: this.dataPresent.seriesName,
                modelCode: this.dataPresent.modelCode,
                modelName: this.dataPresent.modelName
            };
            this.dataList.modelCode = this.dataPresent.modelCode;
        }
    }
};
</script>
