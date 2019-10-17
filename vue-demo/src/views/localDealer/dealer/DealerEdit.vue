<<template>
    <div>
        <el-form
            :model="dynamicValidateForm"
            ref="dynamicValidateForm"
            label-position="left"
            label-width="80px"
        >
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item required label="经销商">
                        {{vo.shopName}}
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item required label="主营品牌">
                        <el-select v-model="brandCode1" clearable filterable placeholder="品牌1">
                            <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.brandName"
                                :value="item.brandCode"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="margin-left: 10px;"
                            v-model="brandCode2"
                            clearable
                            filterable
                            placeholder="品牌2"
                        >
                            <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.brandName"
                                :value="item.brandCode"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="margin-left: 10px;"
                            v-model="brandCode3"
                            clearable
                            filterable
                            placeholder="品牌3"
                        >
                            <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.brandName"
                                :value="item.brandCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                 <el-col :span="24">
                    <el-form-item required label="序号">
                        <el-input-number
                            v-model="vo.sort"
                            :step="1"
                            step-strictly
                            :min="1"
                            :max="99999"
                        ></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item
                        required
                        label="优惠"
                        v-for="domain in dynamicValidateForm.domains"
                        :key="domain.key"
                    >
                        <el-select
                            v-model="domain.activityCode"
                            style="width: 120px;"
                            clearable
                            placeholder="活动类型"
                        >
                            <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>

                        <el-date-picker
                            style="width: 150px;margin-left: 10px;"
                            v-model="domain.endTime"
                            type="date"
                            placeholder="截止日期"
                        ></el-date-picker>

                        <el-input
                            maxlength="18"
                            placeholder="标题"
                            style="width: 250px;margin-left: 10px;"
                            v-model="domain.activityTitle"
                        ></el-input>
                        <el-input
                            maxlength="50"
                            placeholder="内容"
                            style="width: 540px;"
                            v-model="domain.activityDesc"
                        ></el-input>
                        <el-button
                            style="margin-left: 10px;"
                            type="primary"
                            @click.prevent="removeActivity(domain)"
                        >删除</el-button>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item>
                        <el-button type="primary" @click="addActivity()">添加优惠</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import Api from "api";
import moment from "moment";
export default {
    props: {
        selectedDealer: null
    },
    data() {
        return {
            vo: {
                id: "",
                /**
                 * 门店编码
                 */
                hallCode: "",
                /**
                 * 供应商编码
                 */
                supplierCode: "",
                /**
                 * 供应商名称
                 */
                supplierName: "",
                /**
                 * 供应商城市编码
                 */
                supplierCityCode: "",
                activities: "",
                /**
                 * 品牌列表
                 */
                brandCodes: "",
                /**
                 * 活动列表
                 */
                activityList: null,
                /**
                 * 品牌列表json
                 */
                brandCodeStr: "",
                sort: ""
            },
            dynamicValidateForm: {
                domains: [
                    {
                        key: "",
                        /**
                         * 活动code
                         */
                        activityCode: null,
                        /**
                         * 活动标题
                         */
                        activityTitle: "",
                        /**
                         * 活动描述
                         */
                        activityDesc: "",
                        /**
                         * 截止时间
                         */
                        endTime: null,
                        endTimeStr: ""
                    }
                ]
            },
            typeList: [
                {
                    value: 1,
                    label: "新车上新"
                },
                {
                    value: 2,
                    label: "到店有礼"
                },
                {
                    value: 3,
                    label: "金融特惠"
                },
                {
                    value: 4,
                    label: "团购活动"
                },
                {
                    value: 5,
                    label: "购车礼包"
                },
                {
                    value: 6,
                    label: "置换礼包"
                },
                {
                    value: 7,
                    label: "门店大促"
                }
            ],
            /**
             * 品牌列表
             */
            brandList: [],
            brandCode1: "",
            brandCode2: "",
            brandCode3: ""
        };
    },
    mounted() {
        this.init(this.selectedDealer.id);
    },
    methods: {
        init(id) {
            this.vo = {};
            this.dynamicValidateForm.domains = [];
            this.get_api(id);
        },
        /**
         * 查询单个
         */
        get_api(selectedId) {
            Api.localDealer.getById({ id: selectedId }).then(res => {
                this.vo = res;
                this.vo.supplierCode = this.vo.shopCode;
                this.vo.supplierName = this.vo.shopName;
                //品牌列表
                this.brandCode1 = this.brandCode2 = this.brandCode3 = "";
                if (this.vo.brandCodeStr && this.vo.brandCodeStr.length > 3) {
                    let a = this.vo.brandCodeStr.substring(
                        1,
                        this.vo.brandCodeStr.length - 1
                    );
                    let arr = a.split(",");
                    console.log("品牌列表：" + arr);
                    for (let i = 0; i < arr.length; i++) {
                        let item = arr[i].substring(1, arr[i].length - 1);
                        console.log("品牌：" + item);
                        if (i == 0) {
                            this.brandCode1 = item;
                        } else if (i == 1) {
                            this.brandCode2 = item;
                        } else if (i == 2) {
                            this.brandCode3 = item;
                        }
                    }
                }
                //活动列表
                this.dynamicValidateForm.domains = this.vo.activityList;
                console.log(this.vo);
                //获取品牌列表
                this.getBrandList_api();
            });
        },
        /**
         * 校验表单
         */
        check() {
            console.log("校验表单");
            if (!this.brandCode1 && !this.brandCode2 && !this.brandCode3) {
                this.$message.warning("至少添加一个主营品牌");
                return false;
            }
            let brandList = [];
            if (this.brandCode1) {
                brandList.push(this.brandCode1);
            }
            if (this.brandCode2) {
                brandList.push(this.brandCode2);
            }
            if (this.brandCode3) {
                brandList.push(this.brandCode3);
            }
            /**
             * 品牌列表
             */
            this.vo.brandCodes = JSON.stringify(brandList);
            console.log("校验活动列表");
            if (
                this.dynamicValidateForm.domains == null ||
                this.dynamicValidateForm.domains.length == 0
            ) {
                this.$message.warning("至少添加一个活动");
                return false;
            }
            for (let i = 0; i < this.dynamicValidateForm.domains.length; i++) {
                let activity = this.dynamicValidateForm.domains[i];
                if (!activity.activityCode) {
                    this.$message.warning("活动类型不能为空");
                    return false;
                }
                if (!activity.endTime) {
                    this.$message.warning("截止日期不能为空");
                    return false;
                }
                activity.endTimeStr = moment(activity.endTime).format(
                    "YYYY-MM-DD"
                );

                if (!activity.activityTitle) {
                    this.$message.warning("活动标题不能为空");
                    return false;
                }
                if (!activity.activityDesc) {
                    this.$message.warning("活动内容不能为空");
                    return false;
                }
                activity.activityTitle = activity.activityTitle.trim();
                activity.activityDesc = activity.activityDesc.trim();
            }
            this.vo.activities = JSON.stringify(
                this.dynamicValidateForm.domains
            );
            if (!this.vo.sort) {
                this.$message.warning("序号不能为空");
                return false;
            }
            return true;
        },
        /**
         * 添加优惠
         */
        addActivity() {
            this.dynamicValidateForm.domains.push({
                key: Date.now(),
                /**
                 * 活动code
                 */
                activityCode: null,
                /**
                 * 活动标题
                 */
                activityTitle: "",
                /**
                 * 活动描述
                 */
                activityDesc: "",
                /**
                 * 截止时间
                 */
                endTime: null,
                endTimeStr: ""
            });
        },
        /**
         * 移除优惠
         */
        removeActivity(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        /**
         * 获取品牌列表
         */
        getBrandList_api() {
            Api.finance.brand().then(res => {
                this.brandList = res;
            });
        }
    }
};
</script>
