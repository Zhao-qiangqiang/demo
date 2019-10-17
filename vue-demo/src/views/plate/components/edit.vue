<style lang="less" scoped>
    .form {
        overflow: hidden;
    }
</style>

<template>
    <div>
        <so-modal title="新增/编辑交互点"  size="default" :visible.sync="show"  @on-close="editNode">
            <so-form :model="dataList" :rules="rules" label-position="left" label-width="120px" class="form" ref="ruleForm">
                <so-col span="18">
                    <so-form-item label="交互点编码" prop="jhdbm">
                        <so-input v-model="dataList.jhdbm" :disabled="true"></so-input>
                    </so-form-item>
                </so-col>
                <so-col span="18">
                    <so-form-item label="交互点名称" prop="interactionName">
                        <so-input v-model="dataList.interactionName"></so-input>
                    </so-form-item>
                </so-col>
                <so-col span="18">
                    <so-form-item label="所属门店" prop="hallId">
                        <so-select v-model="dataList.hallId" :disabled="this.data.interactionCode?true:false" filterable placeholder="请选择" style="width:100%;">
                            <so-option
                                v-for="item in BasicList"
                                :key="item.uuid"
                                :label="item.name"
                                :value="item.uuid">
                            </so-option>
                        </so-select>
                    </so-form-item>
                </so-col>
                <so-col span="18">
                    <so-form-item label="展位号" prop="position">
                        <so-input v-model="dataList.position"></so-input>
                    </so-form-item>
                </so-col>
                <!-- <so-col span="18">
                    <so-form-item label="展车">
                        <so-select v-model="dataList.ssmd" filterable placeholder="请选择" style="width:100%;">
                            <so-option
                                v-for="item in mdlist"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </so-option>
                        </so-select>
                    </so-form-item>
                </so-col> -->
                <so-col span="18">
                    <so-form-item label="交互点说明">
                         <so-input v-model="dataList.interactionDesc" placeholder="请输入内容" type="textarea" resize="none"></so-input>
                    </so-form-item>
                </so-col>
                <!-- <so-col span="18"> -->
                    <!-- <so-form-item> -->
                         <!-- <so-input  disabled type="textarea" resize="none">{{modelName}}</so-input> -->
                         <!-- <div style="border:1px solid rgb(169, 169, 169);background: var(--disabled-fill-base)
                         ;padding-left:9px;box-sizing: border-box;min-height:80px;"> -->
                             <!-- <div v-for="(item,index) in dataList.modelNameList" :key="index">{{item}}</div> -->
                         <!-- </div> -->
                    <!-- </so-form-item> -->
                <!-- </so-col> -->
            </so-form>
            <div slot="footer" class="modal-footer" style="text-align: center;padding-left:2px;" >
                <so-button type="info" @click="edit">确定</so-button>
            </div>
        </so-modal>
    </div>
</template>
<script>
import Api from 'api';

export default {
    props: {
        editNode: Function,
        data: Object,
        Changepage: Function
    },
    data() {
        return {
            show: true,
            dataList: {
                jhdbm: '',
                interactionName: '',
                hallId: '',
                position: '',
                interactionDesc: '',
                modelNameList: []
            },
            BasicList: [],
            mdlist: [],
            rules: {
                interactionName: [
                    { required: true, message: '请输入交互点名称', trigger: 'blur' }
                ],
                hallId: [
                    { required: true, message: '请选择门店', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        // 门店列表
        getPageList() {
            Api.finance.getPageList({page: 1, pageSize: 99999}).then((res) => {
                this.BasicList = res.items;
            });
        },
        // 查询详情
        detail() {
            Api.plate.detail({interactionCode: this.data.interactionCode}).then((res) => {
                this.dataList = {
                    jhdbm: res.interactionCode,
                    interactionName: res.interactionName,
                    position: res.position,
                    hallId: res.hallId,
                    interactionDesc: res.interactionDesc,
                    modelNameList: res.modelNameList
                };
            });
        },
        // 保存
        edit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (this.data.interactionCode) {
                        // 存在code  编辑
                        let data = {
                            interactionCode: this.data.interactionCode,
                            interactionName: this.dataList.interactionName,
                            position: this.dataList.position,
                            interactionDesc: this.dataList.interactionDesc
                        };
                        Api.plate.edit(data).then((res) => {
                            this.show = false;
                            this.$toast({
                                message: '修改成功',
                                type: 'success',
                                duration: 800
                            });
                            this.Changepage();
                        });
                    } else {
                        // 新建
                        let data = {
                            interactionName: this.dataList.interactionName,
                            hallId: this.dataList.hallId,
                            interactionType: 0,
                            position: this.dataList.position,
                            interactionDesc: this.dataList.interactionDesc
                        };
                        Api.plate.createElectronicBrand(data).then((res) => {
                            this.show = false;
                            this.$toast({
                                message: '修改成功',
                                type: 'success',
                                duration: 800
                            });
                            this.Changepage();
                        });
                    }
                } else {
                    return false;
                }
            });
        }

    },
    mounted() {
        if (this.data.interactionCode) {
            this.detail();
            this.getPageList();
        } else {
            this.getPageList();
        }
    }
};
</script>

