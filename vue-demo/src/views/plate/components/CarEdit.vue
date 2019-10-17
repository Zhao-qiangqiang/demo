<style lang="less">
    .so-modal__body {
        overflow: hidden;
    }
    .so-modal__header {
        background-color: #4da6ff;
        color: #fff;
    }
    .spanButton {
        padding: 11px 12px 11px 0;
        display: inline-block;
        margin-left: 30px;
        color: #4da6ff;
        cursor: pointer;
    }
    .so-upload-list {
        display: none;
    }
</style>
<template>
    <div>
        <so-modal title="车型编辑" size="large" :visible.sync="show"  @on-close="editNode({})">
            <h3>
                <span>{{this.data.hallName}}</span>
                <span style="margin-left:20px;">{{this.data.interactionName}}</span>
            </h3>
            <div>
                <!-- 头部搜索 -->
                <so-form :model="searchDtata" ref="ruleForm" label-position="right" label-width="80px">
                    <so-col span="8">
                         <so-form-item label="品牌搜索" prop="brandName" >
                             <so-input v-model="searchDtata.brandName" placeholder="请输入"></so-input>
                         </so-form-item>
                    </so-col>
                    <so-col span="8">
                         <so-form-item label="车型搜索" prop="modelName" >
                             <so-input v-model="searchDtata.modelName" placeholder="请输入"></so-input>
                         </so-form-item>
                    </so-col>
                    <so-col span="8" style="display:flex;">
                         <span class="spanButton" @click="addShow({})">新增</span>
                         <div @click="handleClick" >
                            <input type="file"  class="so-upload__input" accept=".xlsx" ref="input" @change="handleChange"  />
                            <span class="spanButton">导入</span>
                         </div>

                         <span class="spanButton" @click="deltree">删除</span>
                    </so-col>
                </so-form>
                <!-- 底部表格 -->
                <so-table
                empty-text='暂无数据'
                border
                :data="FilteringResults"
                style="width: 100%;"
                @on-select="select"
                @on-select-all="selectAll"
                >
                <so-table-column
                    label=""
                    width="100"
                >
                    <template slot-scope="scope">
                        <so-col span="12" style="text-align:center;">
                            <div  @click="swap(scope.row,1)">
                             <so-icon name="caret-top"></so-icon>
                            </div>
                        </so-col>
                         <so-col span="12" style="text-align:center;" >
                            <div  @click="swap(scope.row,2)">
                            <so-icon name="caret-bottom" span="12" ></so-icon>
                            </div>
                        </so-col>
                    </template>
                </so-table-column>
                 <so-table-column
                    type="selection"
                    :indeterminate="true"
                    width="55"/>
                <so-table-column
                    type="index"
                    label=" "
                    width="50"/>
                <so-table-column
                    label=""
                    width="150"
                >
                <template slot-scope="scope">
                    <img style="max-width:130px;" :src="scope.row.img"/>
                </template>
                </so-table-column>
                <so-table-column
                    prop="modelName"
                    label=""
                    width="200"
                />
                <so-table-column
                    prop="price"
                    label=""
                />
                <so-table-column
                    label=""
                    width="290"
                >
                    <template slot-scope="scope">
                        <so-button @click="addShow(scope.row)" style="margin-right:10px;">修改</so-button>
                        <so-button @click="del(scope.row)" style="margin-right:10px;">删除</so-button>
                        <so-button @click="below(scope.row)" style="margin-right:10px;" v-if="!scope.row.exhibitionCar">设为展车</so-button>
                    </template>
                </so-table-column>
                </so-table>
            </div>
        </so-modal>
        <AddCar v-if="addCarShow" @query="getCarList" :editNode="addShow" :electronicBrandCode="this.data" :dataPresent="dataPresent"/>
    </div>
</template>
<script>
import Api from 'api';
import AddCar from './addCar';

export default {
    components: {
        AddCar
    },
    data() {
        return {
            addCarShow: false,
            show: true,
            searchDtata: {
                brandName: '',
                modelName: ''
            },
            TableList: [],
            deleteList: [], //多选时当前选中的
            dataPresent: []//当前正在操作的行
        };
    },
    props: {
        editNode: Function,
        data: Object
    },
    methods: {
        // 总删除操作
        deltree() {
            let data = [];
            this.deleteList.forEach((item) => {
                data.push(item.id);
            });
            if (data.length === 0) {
                return;
            }
            this.delFun(data);
        },
        // 单个删除
        del(row) {
            let data = [row.id];
            this.delFun(data);
            // let data = this.tableIndex(row);
            //  调用删除
            // this.TableList.splice(data, 1);
        },
        // 删除事件
        delFun(data) {
            // console.log(data)
            Api.plate.del({ids: JSON.stringify(data)}).then((res) => { // eslint-disable-line
                this.getCarList();
            });
        },
        // 表格选中索引
        tableIndex(row) {
            let ind = '';
            this.TableList.forEach((item, index) => {
                if (item.id === row.id) {
                    ind = index;
                }
            });
            return ind;
        },
        // 表格全选
        selectAll(selection) {
            if (selection.length > 0) {
                this.deleteList = selection;
            } else {
                this.deleteList = [];
            }
        },
        // 表格选择
        select(selection, row) {
            // 获取所有选中的数据
            let data = this.deleteList.filter(item => item.id === row.id);
            if (data.length > 0) {
                this.deleteList = this.deleteList.filter(item => item.id !== row.id);
            } else {
                this.deleteList.push(row);
            }
        },
        // 新增/修改车辆
        addShow(row) {
            this.addCarShow = !this.addCarShow;
            this.dataPresent = row;
            // this.AmendShow = !this.AmendShow;
            // this.dataPresent = row
        },
        // upGo(row) {
        //     let index = this.tableIndex(row);
        //     // if (index !== 0) {
        //     //     this.TableList[index] = this.TableList.splice(index - 1, 1, this.TableList[index])[0];
        //     // }
        // },
        // down(row) {
        //     let index = this.tableIndex(row);
        //     // if (index !== this.TableList.length - 1) {
        //     //     this.TableList[index] = this.TableList.splice(index + 1, 1, this.TableList[index])[0];
        //     // }
        // },
        // 接口交换位置
        swap(row, type) {
            let index = this.tableIndex(row);
            let data = {};
            if (type === 1 && index !== 0) {
                data = {
                    id1: this.TableList[index].id,
                    id2: this.TableList[index - 1].id
                };
            } else if (type === 2 && index !== this.TableList.length - 1) {
                data = {
                    id1: this.TableList[index].id,
                    id2: this.TableList[index + 1].id
                };
            } else {
                return;
            }
            Api.plate.swap(data).then((res) => { // eslint-disable-line
                this.getCarList();
            });
        },
        // 获取水牌下车辆信息
        getCarList() {
            // 通知父组件查询
            this.$emit('getCarList');
            Api.plate.getCarList({electronicBrandCode: this.data.interactionCode}).then((res) => { // eslint-disable-line
                this.TableList = res;
            });
        },
        // 设置为展车
        below(row) {
            Api.plate.exhibition({id: row.id, electronicBrandCode: this.data.interactionCode}).then((res) => { // eslint-disable-line
                this.TableList.forEach((item) => {
                    if (item.id === row.id) {
                        item.exhibitionCar = true;
                    } else {
                        item.exhibitionCar = false;
                    }
                });
                this.$toast({
                    message: '设置展车成功',
                    type: 'success',
                    duration: 300
                });
            });
        },
        handleClick() {
            this.$refs.input.click();
        },
        handleChange(ev) {
            let fileList = ev.target.files;
            Api.plate.carImport({file: fileList[0], electronicBrandCode: this.data.interactionCode}).then((res) => { // eslint-disable-line
                this.getCarList();
            });
        }
    },
    mounted() {
        this.getCarList();
    },
    computed: {
        FilteringResults() {
            let data = [];
            this.TableList.forEach((item) => {
                if (item.brandName && item.modelName) {
                    if (item.brandName.indexOf(this.searchDtata.brandName) >= 0 && item.modelName.indexOf(this.searchDtata.modelName) >= 0) {
                        data.push(item);
                    }
                }

            });
            return data;
        }
    }
};
</script>
