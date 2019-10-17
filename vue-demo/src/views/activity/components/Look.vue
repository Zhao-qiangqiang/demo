<style lang="less">
.viewer-toolbar ul {
    margin-bottom: 45px;
}
img {
    width: 260px;
}
.viewer-container {
    z-index: 999999 !important;
}
</style>

<template>
    <div>
        <so-modal title="查看资料" size="default" :visible.sync="show"  @on-close="editNode">
            <div>
                <h3>购车发票</h3>
                <img v-for="(item,index) in data" :key="index" :src="item" @click="showLook(item)"/>
            </div>
            <div>
                <h3>合格证</h3>
                <img v-for="(item,index) in dataList" :key="index" :src="item" @click="showLook(item)"/>
            </div>
        </so-modal>
        <!--   -->
         <!-- style="" -->
        <!-- <div style="dispaly:fixed;z-index:20003;top:0;left:0;right:0;bottom:0;"> -->
            <div>
                <so-photo-gallery

            :visible.sync="visible"
            :img-data="dataType">
            </so-photo-gallery>
            </div>
        <!-- </div> -->
    </div>
</template>
<script>
export default {
    props: {
        editNode: Function,
        dataLook: Object
    },
    data() {
        return {
            show: true,
            visible: false,
            dataType: [],
            data: [],
            dataList: []
        };
    },
    methods: {
        showLook(item) {
            this.visible = true;
            this.dataType = [{src: item}];
        }
    },
    mounted() {
        this.data.push(this.dataLook.invoice);
        this.dataList.push(this.dataLook.carCertificate);
    }
};
</script>
