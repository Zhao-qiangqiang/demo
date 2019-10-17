<style lang="less" scoped>
.el-select {
    width: 100%;
}
</style>

<template>
    <div>
        <so-modal title="编辑车辆" size="large" :visible.sync="show" @on-close="addShow">
            <so-form
                :model="searchDtataCopy"
                :rules="rules"
                ref="addForm"
                label-position="right"
                label-width="80px"
                style="overflow:hidden;"
                v-loading="loading"
                so-loading-text="正在加载"
            >
                <so-col span="24">
                    <so-form-item label="车型">{{searchDtataCopy.modelName}}</so-form-item>
                </so-col>
                <so-col span="12">
                    <so-form-item label="车牌">
                        <el-input v-model="searchDtataCopy.plateNumber"></el-input>
                    </so-form-item>
                </so-col>
                <so-col span="12">
                    <so-form-item required v-if="!searchDtataCopy.vin" label="车架号">
                        <el-input v-model="vin"></el-input>
                    </so-form-item>
                    <so-form-item v-if="searchDtataCopy.vin" label="车架号">{{searchDtataCopy.vin}}</so-form-item>
                </so-col>
                <so-col span="24">
                    <so-col span="6" offset="2">
                        <so-checkbox v-model="searchDtataCopy.gift">购车礼</so-checkbox>
                    </so-col>
                    <so-col span="6">
                        <so-checkbox v-model="searchDtataCopy.testDrive">预约试驾</so-checkbox>
                    </so-col>
                </so-col>

                <so-col span="24">
                    <so-form-item label="展位">
                        <el-input-number
                            v-model="searchDtataCopy.boothNumber"
                            :step="1"
                            step-strictly
                            :min="1"
                            :max="999"
                        ></el-input-number>
                    </so-form-item>
                </so-col>

                <so-col span="24" style="margin-top:10px;">
                    <so-col span="10">
                        <so-form-item label="投展商" prop="supplierType">
                            <so-select
                                width="100%"
                                filterable
                                v-model="searchDtataCopy.supplierType"
                                @on-change="supplierTypeChange"
                            >
                                <so-option
                                    v-for="item in supplierTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </so-select>
                        </so-form-item>
                    </so-col>
                </so-col>
                <!-- 具体车商 供应商 supplierInfoChange-->
                <so-col
                    span="24"
                    v-if="searchDtataCopy.supplierType&&searchDtataCopy.supplierType < 3"
                >
                    <so-col span="10">
                        <so-form-item label prop="supplierCode">
                            <so-select
                                width="100%"
                                filterable
                                v-model="searchDtataCopy.supplierCode"
                                @on-change="supplierInfoChange"
                            >
                                <so-option
                                    v-for="item in supplierInfoList"
                                    :key="item.shopCode"
                                    :label="item.shopName"
                                    :value="item.shopCode"
                                />
                            </so-select>
                        </so-form-item>
                    </so-col>
                    <so-col span="4" offset="1">
                        <so-button @click="CityShow(0)">切换城市</so-button>
                    </so-col>
                </so-col>
                <!-- 主机厂手输入 -->
                <so-col
                    span="24"
                    v-if="searchDtataCopy.supplierType&&searchDtataCopy.supplierType==='4'"
                >
                    <so-col span="8">
                        <so-form-item label prop="supplierCode">
                            <so-input width="100%" v-model="searchDtataCopy.supplierName" />
                        </so-form-item>
                    </so-col>
                </so-col>
                <!--经销商-->
                <so-col span="24" style="margin-top:10px;">
                    <so-col span="10">
                        <so-form-item label="经销商" prop="distributors">
                            <el-select
                                width="100%"
                                multiple
                                v-model="searchDtataCopy.distributors"
                                filterable
                            >
                                <el-option
                                    v-for="item in distributorInfoList"
                                    :key="item.shopCode"
                                    :label="item.shopName"
                                    :value="item.shopCode"
                                />
                            </el-select>
                        </so-form-item>
                    </so-col>
                    <so-col span="4" offset="1">
                        <so-button @click="CityShow(1)">切换城市</so-button>
                    </so-col>
                </so-col>
            </so-form>
            <div slot="footer" class="modal-footer">
                <so-button @click="confirmAdd" type="info" style="margin-right:10px;">确定</so-button>
                <so-button @click="show = false">取消</so-button>
            </div>
        </so-modal>
        <!-- 切换城市 -->
        <so-modal v-if="showCity" title="选择城市" :visible.sync="showCity">
            <City :dataCity="dataCity" @CityChange="changeCity" />
            <div slot="footer" class="modal-footer">
                <so-button @click="confirmCity" type="info" style="margin-right:10px;">确定</so-button>
                <so-button @click="showCity = false">取消</so-button>
            </div>
        </so-modal>
    </div>
</template>
<script>
import Api from "api";
import City from "../../components/city";

export default {
    components: {
        City
    },
    props: {
        addShow: Function,
        dataPresent: Object
    },
    computed: {
        distributors() {
            let data = [];
            this.searchDtataCopy.distributors.forEach(item => {
                data.push(item.value);
            });
            return data;
        }
    },
    data() {
        return {
            loading: false,
            carData: {}, // 默认车型
            distributorInfoCity: [], //经销商城市
            supplierInfoCtiy: [], // 供应商城市
            cityType: "", //那个调用的组件 0 供应商 1 经销商
            dataCity: [], // 传给组件的城市
            show: true,
            // distributorsNew: [], //供应商当前选择
            showCity: false, //切换城市显示
            supplierTypeList: [
                {
                    value: "1",
                    label: "4s/二网"
                },
                {
                    value: "3",
                    label: "自营"
                },
                {
                    value: "4",
                    label: "主机厂"
                }
            ], //车辆供应列表
            supplierInfoList: [], //车商供应列表
            distributorInfoList: [], //经销商列表
            searchDtataCopy: {
                zjcName: "", //供应商为主机厂时  手动输入
                brandName: "",
                brandCode: "",
                seriesCode: "",
                seriesName: "",
                modelCode: "",
                modelName: "",
                supplierCode: "",
                supplierName: "",
                gift: false, //购车礼
                testDrive: false, //是否支持试驾
                supplierType: "", //车辆提供 -- 供应商类型
                distributors: [], //经销商列表
                vin: "",
                plateNumber: "",
                boothNumber: null,
                ...this.dataPresent
            },
            //输入框中的车架号
            vin: "",
            rules: {
                modelCode: [
                    {
                        required: true,
                        message: "请选择车辆信息",
                        trigger: "blur"
                    }
                ],
                supplierType: [
                    {
                        required: true,
                        message: "请选择提供方",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        // 车辆提供改变
        supplierTypeChange() {
            this.searchDtataCopy.supplierCode = "";
            this.searchDtataCopy.supplierName = "";
        },
        // 车商改变事件
        supplierInfoChange(value, options) {
            this.searchDtataCopy = {
                ...this.searchDtataCopy,
                supplierCode: options.value,
                supplierName: options.label
            };
        },
        // 经销商
        // distributorsChange(value) {
        //     this.searchDtataCopy.distributors = value
        // },
        // 供应商多选显示
        customText(value) {
            return value.map(item => item.label).join(";");
        },
        // 切换城市显示
        CityShow(type) {
            this.showCity = true;
            this.cityType = type;
            if (type) {
                // 1  经销商
                this.dataCity = this.distributorInfoCity;
            } else {
                // 0 供应商
                this.dataCity = this.supplierInfoCtiy;
            }
        },
        // 城市改变事件
        changeCity(value) {
            this.dataCity = value;
        },
        // 城市改变确认事件
        confirmCity() {
            if (this.cityType) {
                // 1  经销商
                this.distributorInfoCity = this.dataCity;
                this.distributorInfoList = [];
                // 清空当前选择
                // this.searchDtataCopy.distributors = [];
            } else {
                // 0 供应商
                this.supplierInfoCtiy = this.dataCity;
                this.supplierInfoList = [];
                // this.searchDtataCopy.supplierCode = '';
                // this.searchDtataCopy.supplierName = '';
            }
            this.showCity = false;
            this.purchaser(this.cityType);
        },
        // 车型发生变化
        modeChange(value) {
            this.searchDtataCopy = {
                ...this.searchDtataCopy,
                ...value
            };
        },
        // 新增车辆确定事件
        confirmAdd() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    //原先没有车架号的情况
                    if (!this.searchDtataCopy.vin) {
                        if (!this.vin) {
                            this.$message.warning("车架号不能为空");
                            return;
                        }
                        this.searchDtataCopy.vin = this.vin;
                    }
                    this.loading = true;
                    let data = {
                        modelCode: this.searchDtataCopy.modelCode,
                        supplierType: this.searchDtataCopy.supplierType,
                        supplierCode: this.searchDtataCopy.supplierCode,
                        supplierName: this.searchDtataCopy.supplierName,
                        distributors: JSON.stringify(
                            this.searchDtataCopy.distributors
                        ),
                        gift: this.searchDtataCopy.gift,
                        testDrive: this.searchDtataCopy.testDrive,
                        distributorsCityCodeList: JSON.stringify(
                            this.distributorInfoCity
                        ),
                        supplierCityCodeList: JSON.stringify(
                            this.supplierInfoCtiy
                        ),
                        vin: this.searchDtataCopy.vin,
                        plateNumber: this.searchDtataCopy.plateNumber,
                        boothNumber: this.searchDtataCopy.boothNumber
                    };
                    data.id = this.searchDtataCopy.id;
                    this.Caredit(data, 1);
                } else {
                    return false;
                }
            });
        },
        // 新增/修改车辆信息接口
        Caredit(data, type) {
            let url = "Caredit";
            Api.finance[url]({ ...data })
                .then(res => {
                    this.loading = false;
                    this.show = false;
                    if (res) {
                        this.$emit("CarList");
                    }
                })
                .catch(res => {
                    this.loading = false;
                });
        },
        // 获取供应商
        purchaser(type) {
            // 0 供应商   1 经销商
            let data =
                type !== 1 ? this.supplierInfoCtiy : this.distributorInfoCity;
            Api.finance
                .purchaser({ cityCodeList: JSON.stringify(data) })
                .then(res => {
                    if (type !== 1) {
                        // let data = this.supplierInfoList.concat(res)
                        // this.supplierInfoList = data
                        let dataList = this.supplierInfoList;
                        for (let i = 0; i < res.length; i += 1) {
                            let dataNew = [];
                            dataList.forEach(item => {
                                if (item.shopCode === res[i].shopCode) {
                                    dataNew.push(item);
                                }
                            });
                            if (dataNew.length === 0) {
                                this.supplierInfoList.push(res[i]);
                            }
                        }
                    } else {
                        let dataList = this.distributorInfoList;
                        for (let i = 0; i < res.length; i += 1) {
                            let dataNew = [];
                            dataList.forEach(item => {
                                if (item.shopCode === res[i].shopCode) {
                                    dataNew.push(item);
                                }
                            });
                            if (dataNew.length === 0) {
                                this.distributorInfoList.push(res[i]);
                            }
                        }
                    }
                });
        },
        // 深拷贝
        deepCopy(obj) {
            var result = Array.isArray(obj) ? [] : {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    // eslint-disable-line
                    if (typeof obj[key] === "object") {
                        result[key] = this.deepCopy(obj[key]); //递归复制
                    } else {
                        result[key] = obj[key];
                    }
                }
            }
            return result;
        }
    },
    mounted() {
        console.log("界面初始化");
        console.log(this.dataPresent);
        this.searchDtataCopy.boothNumber = this.dataPresent.boothNumber;

        //supplierCityCodeList
        let datalist = this.deepCopy(this.dataPresent);
        // Object.assign({},this.dataPresent)
        if (!datalist.supplierCityCodeList) {
            //判断当前条数是否存在供应商城市   不存在  取场馆所在的城市 已和王源确认 无城市  不会返回改字段
            this.supplierInfoCtiy.push(datalist.city); //供应商城市code
        } else {
            this.supplierInfoCtiy = datalist.supplierCityCodeList; //供应商城市code
        }
        if (!datalist.distributorCityCodeList) {
            //判断当前条数是否存在经销商城市   不存在  取场馆所在的城市
            this.distributorInfoCity.push(datalist.city); //经销商城市code
        } else {
            this.distributorInfoCity = datalist.distributorCityCodeList; //经销商城市code
        }
        // 供应商回显
        if (datalist.distributorList) {
            let data = [];
            datalist.distributorList.forEach(item => {
                data.push(item.shopCode);
            });
            this.searchDtataCopy.distributors = data;
            this.distributorInfoList = datalist.distributorList;
        }
        // 经销商回显
        if (datalist.supplier && datalist.supplier.shopCode) {
            this.searchDtataCopy.supplierCode = datalist.supplier.shopCode;
            this.supplierInfoList.push(datalist.supplier);
        }
        // 自营回显
        if (
            datalist.supplier &&
            datalist.supplier.shopName &&
            !datalist.supplier.shopCode
        ) {
            this.searchDtataCopy.supplierName = datalist.supplier.shopName;
            // this.supplierInfoList.push(datalist.supplier);
        }
        if (datalist.supplierType) {
            this.searchDtataCopy.supplierType = `${datalist.supplierType}`;
        }
        // 品牌车型车系赋值
        if (datalist.brandCode) {
            this.carData = {
                brandName: datalist.brandName,
                brandCode: datalist.brandCode,
                seriesCode: datalist.seriesCode,
                seriesName: datalist.seriesName,
                modelCode: datalist.modelCode,
                modelName: datalist.modelName
            };
        }
        // 经销商默认值
        // if (datalist.distributors) { //经销商存在
        //     JSON.parse(datalist.distributors).forEach((item) => {
        //         this.distributorsNew.push(item.value);
        //     });
        // }
        // 供应商查询
        this.purchaser(0); //供应商
        this.purchaser(1); //经销商
    }
};
</script>
