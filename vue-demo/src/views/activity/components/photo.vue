<style lang="less">
.viewer-toolbar ul {
    margin-bottom: 45px;
}
img {
    width: 260px;
}
</style>

<template>
    <div>
            <so-photo-gallery

            :visible.sync="visible"
            :img-data="dataType">
            </so-photo-gallery>
    </div>
</template>
<script>
export default {
    props: {
        editNode: Function
    },
    data() {
        return {
            visible: true,
            dataType: [{src: 'http://img.souche.com/3820ee7dfaaf150b8f45dc962d9bb46e.jpg'}]
            // data: [{
            //     src: 'http://img.souche.com/3820ee7dfaaf150b8f45dc962d9bb46e.jpg',
            //     title: '这是一辆黑色的车子',
            // },{
            //     src: 'http://img.souche.com/f2e/c59c5c5382ecb6451ed10201ff3af336.jpg',
            //     title: '这是一辆黑色的车子',
            // }]
        };
    }
};
</script>
