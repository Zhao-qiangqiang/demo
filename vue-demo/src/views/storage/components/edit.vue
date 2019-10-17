<style lang="less" scoped>
    .form {
        overflow: hidden;
    }
</style>

<template>
    <div>
        <so-modal title="新增/编辑交互点" size="default" :visible.sync="show"  @on-close="editNode">
            <so-form :model="dataList" :rules="rules" label-position="left" label-width="120px" class="form"  ref="ruleForm">
                <so-col span="18">
                    <so-form-item label="交互点编码">
                        <so-input v-model="dataList.jhdbm" :disabled="true"></so-input>
                    </so-form-item>
                </so-col>
                <so-col span="18">
                    <so-form-item label="交互点名称">
                        <so-input v-model="dataList.interactionName"></so-input>
                    </so-form-item>
                </so-col>
                <so-col span="18">
                    <so-form-item label="所属门店">
                        <so-select v-model="dataList.hallId" filterable placeholder="请选择" :disabled="this.data.interactionCode?true:false" style="width:100%;">
                            <so-option
                                v-for="item in BasicList"
                                :key="item.uuid"
                                :label="item.name"
                                :value="item.uuid">
                            </so-option>
                        </so-select>
                    </so-form-item>
                </so-col>
                <!--  -->
                <so-col span="18">
                    <so-form-item label="交互点说明">
                         <so-input v-model="dataList.interactionDesc" placeholder="请输入内容" type="textarea" resize="none"></so-input>
                    </so-form-item>
                </so-col>
            </so-form>
            <div slot="footer" class="modal-footer" style="text-align: center;">
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
                interactionDesc: ''
            },
            BasicList: [],
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
        // 查询详情
        detail() {
            Api.plate.detail({interactionCode: this.data.interactionCode}).then((res) => {
                this.dataList = {
                    interactionName: res.interactionName,
                    hallId: res.hallId,
                    interactionDesc: res.interactionDesc,
                    jhdbm: res.interactionCode
                };
            });
        },
        // 门店列表
        getPageList() {
            Api.finance.getPageList({page: 1, pageSize: 99999}).then((res) => {
                this.BasicList = res.items;
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
                            interactionDesc: this.dataList.interactionDesc
                        };
                        Api.plate.edit(data).then((res) => {
                            this.show = false;
                            this.Changepage();
                            this.$toast({
                                message: '修改成功',
                                type: 'success',
                                duration: 800
                            });
                        });
                    } else {
                        // 新建
                        let data = {
                            interactionName: this.dataList.interactionName,
                            hallId: this.dataList.hallId,
                            interactionType: 1,
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

