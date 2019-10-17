<style lang="less">
    .so-modal__body {
        overflow: hidden;
    }
    .so-modal__header {
        background-color: #4da6ff;
        color: #fff;
    }
</style>

<template>
    <div>
       <so-modal title="查看" size="large" :visible.sync="show" class="edit" @on-close="editNode">
           <so-form :model="editData" style="overflow:hidden;" ref="ruleForm" label-position="left" label-width="80px"
             v-loading="loading" so-loading-text="正在提交，请勿刷新页面">
               <so-col span="24">
                   <so-form-item label="门店编码" prop="">
                       <span>{{editData.ownerShopCode}}</span>
                   </so-form-item>
               </so-col>
               <so-col span="24">
                   <so-form-item label="店铺城市" prop="">
                       <span>{{editData.cityName}}</span>
                   </so-form-item>
               </so-col>
               <so-col span="12">
                   <so-form-item label="店铺名称" prop="">
                       <span>{{editData.ownerShopName}}</span>
                   </so-form-item>
               </so-col>
               <so-col span="12">
                   <so-form-item label="详细地址" prop="">
                       <span>{{editData.address}}</span>
                   </so-form-item>
               </so-col>
               <so-col span="24">
                   <so-form-item label="联系方式" prop="">
                       <span>{{editData.phone}}</span>
                   </so-form-item>
               </so-col>
               <so-col span="12">
                   <so-form-item label="门店简称" prop="">
                       <so-input style="width:80%;" disabled v-model="editData.name"></so-input>
                   </so-form-item>
               </so-col>
               <so-col span="12">
                   <so-form-item label="停车信息" prop="">
                       <so-input style="width:80%;" disabled v-model="editData.parkDesc"></so-input>
                   </so-form-item>
               </so-col>
               <so-col span="12">
                   <so-form-item label="交通信息" prop="">
                       <so-input style="width:80%;" disabled v-model="editData.trafficDesc "></so-input>
                   </so-form-item>
               </so-col>
               <so-col span="12">
                   <so-form-item label="营业时间" prop="time">
                       <so-TimePicker
                       style="width:80%;"
                       is-range
                       disabled
                       format="HH:mm"
                       placeholder="选择时间范围"
                       v-model="editData.time"
                       @on-change="timeChange"
                       />
                   </so-form-item>
               </so-col>
               <so-col span="12">
                   <so-form-item label="客服微信" prop="">
                       <so-input style="width:80%;" disabled v-model="editData.weixinNo"></so-input>
                   </so-form-item>
               </so-col>
               <!-- 编辑改查看 不需要确认 -->
               <!-- <so-col span="24" style="text-align: center;">
                   <so-Button @click="Sure">确定</so-Button>
               </so-col> -->
           </so-form>
       </so-modal>
    </div>
</template>

<script>
import Api from 'api';

export default {
    mounted() {
        Api.finance.info({hallId: this.EditData.uuid}).then((res) => {
            let time = '';
            if (res.openTime) {
                let openTime = res.openTime.split(':');
                let closeTime = res.closeTime.split(':');
                time = [new Date(2016, 9, 10, openTime[0], openTime[1]), new Date(2016, 9, 10, closeTime[0], closeTime[1])];
            }
            // console.log(time)
            let data = {
                ownerShopCode: res.ownerShopCode,
                cityName: res.cityName,
                ownerShopName: res.ownerShopName,
                address: res.address,
                phone: res.phone,
                name: res.name,
                parkDesc: res.parkDesc,
                trafficDesc: res.trafficDesc,
                time: time,
                weixinNo: res.weixinNo,
                openTime: res.openTime,
                closeTime: res.closeTime
            };
            this.editData = data;
        });
    },
    data() {
        return {
            editData: {
                ownerShopCode: '',
                cityName: '',
                ownerShopName: '',
                address: '',
                phone: '',
                name: '',
                parkDesc: '',
                trafficDesc: '',
                time: '',
                weixinNo: '',
                openTime: '',
                closeTime: ''
            },
            show: true,
            loading: false
        };
    },
    props: {
        // show:Boolean,
        editNode: Function,
        EditData: Object,
        Changepage: Function
    },
    methods: {
        // 时间更改
        timeChange(value) {
            this.editData.openTime = this.Hours(value[0]);
            this.editData.closeTime = this.Hours(value[1]);
        },
        // 获取时 分
        Hours(time) {
            let data = new Date(time);
            return `${data.getHours()}:${data.getMinutes()}`;
        },
        // 保存
        Sure() {
            this.loading = true;
            Api.finance.edit({hallId: this.EditData.uuid, ...this.editData}).then((res) => {
                this.loading = false;
                this.show = false;
                this.Changepage();
            });
        }
    }
};
</script>
