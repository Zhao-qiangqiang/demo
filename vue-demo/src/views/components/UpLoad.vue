<template>
    <div>
        <el-upload
            ref="my-upload"
            action="http://niu.souche.com/upload/aliyun"
            accept="image/jpg, image/jpeg, image/png"
            list-type="picture-card"
            :limit="limit"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :beforeUpload="beforeAvatarUpload"
            :file-list="fileList"
            :disabled="disabled"
        >
            <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog title="查看图片" :visible.sync="isShow" :append-to-body="true">
            <el-image :src="src"></el-image>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            /**
             * 最大数量
             */
            limit: 15,
            fileList: [],
            disabled: false,
            /**
             * 当前选中文件的src
             */
            src: "",
            isShow: false
        };
    },
    methods: {
        beforeRemove(file) {
            return this.$confirm("确定移除？");
        },
        handleExceed(files, fileList) {
            this.$message.warning("最多可选择" + this.limit + "个文件");
        },
        handlePreview(file) {
            console.log("查看文件");
            console.log(file);
            this.src = file.url;
            this.isShow = true;
        },
        handleSuccess(response, file, fileList) {
            console.log("添加文件");
            this.fileList = fileList;
            console.log(this.fileList);
        },
        handleRemove(file, fileList) {
            console.log("移除文件");
            this.fileList = fileList;
            console.log(this.fileList);
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 5;
            if (!isLt2M) {
                this.$message.warning("上传文件大小不能超过 5MB!");
            }
            return isLt2M;
        },
        /**
         * 获取当前选中的文件列表
         */
        geImagetUrls() {
            console.log("获取当前选中的文件列表");
            console.log(this.fileList);
            let result = "";
            if (this.fileList && this.fileList.length > 0) {
                for (let i = 0; i < this.fileList.length; i++) {
                    let file = this.fileList[i];
                    let url = "";
                    if (file.response && file.response.path) {
                        url = file.response.path;
                    } else {
                        url = file.url;
                    }
                    result += url;
                    if (i < this.fileList.length - 1) {
                        result += "_";
                    }
                }
            }
            return result;
        },
        /**
         * 初始化
         */
        init(imageUrl) {
            console.log("初始化");
            this.fileList = [];
            if (imageUrl) {
                console.log("初始数组");
                let imageUrlList = imageUrl.split("_");
                if (imageUrlList) {
                    for (let i = 0; i < imageUrlList.length; i++) {
                        let file = {
                            name: i,
                            url: imageUrlList[i]
                        };
                        this.fileList.push(file);
                    }
                }
            }

            // this.$refs["my-upload"].clearFiles();
        }
    }
};
</script>
