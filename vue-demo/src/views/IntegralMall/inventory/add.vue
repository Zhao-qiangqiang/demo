<style lang="less">
    ::-webkit-input-placeholder { /* WebKit browsers */
        font-size: 14px;
        color: var(--text-caption);
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        font-size: 14px;
        color: var(--text-caption);
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
        font-size: 14px;
        color: var(--text-caption);
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
        font-size: 14px;
        color: var(--text-caption);
    }
    .add {
        width: 100vw;
        height: 100vh;
        background: #fff;
        .title {
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0 20px 30px;
        }
        .margin40 {
            margin-top: 40px;
        }
        .model {
            display: flex;
            align-items: center;
            margin: 20px 0 20px 30px;
            .filed {
                width: 120px;
                margin-right: 20px;
                text-align: right;
                .require {
                    color: red;
                }
            }
            .filed-model {
                display: flex;
                align-items: center;
                width: 540px;
            }
            .text-model {
                font-size: 14px;
                color: #999;
                margin-left: 100px;
                > div {
                    margin-bottom: 3px;
                }
            }
            .so-textarea {
                width: 300px;
                textarea {
                    outline: none !important;
                }
            }
            .so-input {
                width: auto;
                margin-right: 10px;
            }
            .so-date-editor__input {
                width: 100%;
            }
            button {
                margin-right: 10px;
            }
            .operation {
                margin-top: 10px;
            }
            .img {
                width: 150px;
                height: 100px;
                overflow: hidden;
                border: 1px solid #e7e7e7;
            }
            .input-model {
                position: relative;
                .input {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    background-color: #fff;
                    background-color: var(--white);
                    background-image: none;
                    border-radius: 4px;
                    border: 1px solid #bfbfbf;
                    border: var(--border-base);
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    color: #1a1a1a;
                    color: var(--text-title);
                    display: block;
                    font-size: inherit;
                    height: 36px;
                    height: var(--base-height);
                    line-height: 36px;
                    line-height: var(--base-height);
                    outline: 0;
                    padding: 3px 50px 3px 10px;
                    -webkit-transition: var(--border-transition-base);
                    transition: var(--border-transition-base);
                    width: 250px;
                }
                .label {
                    right: 0;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: end;
                    -ms-flex-pack: end;
                    justify-content: flex-end;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    padding-right: 12px;
                    text-align: right;
                    color: var(--text-caption);
                    position: absolute;
                    height: 100%;
                    top: 0;
                }
            }
        }
        .button-list {
            width: 200px;
            margin: 20px auto;
            button {
                margin-right: 20px;
            }
        }
        img {
            width: 100%;
            max-height: 100%;
        }
    }
</style>
<template>
    <div class="add">
        <div class="title">基本信息</div>
        <div class="model">
            <div class="filed">商品类型:</div>
            <div><so-radio class="radio" v-model="commodityType" label="0">实体商品</so-radio></div>
        </div>
        <div class="model">
            <div class="filed"><span class="require">*</span>商品标题:</div>
            <div><so-input v-model="commodityTitle" placeholder="最大输入100字符" :maxlength= "100"></so-input></div>
        </div>
        <div class="model">
            <div class="filed"><span class="require">*</span>商品原价:</div>
            <div class="input-model">
                <input v-model="commodityPrice" type="number" class="input" placeholder="输入范围1-10000">
                <span class="label">元/人民币</span>
            </div>
        </div>
        <div class="model">
            <div class="filed"><span class="require">*</span>商品图片:</div>
            <div>
                <so-upload
                    action="http://niu.souche.com/upload/aliyun"
                    accept="image/jpg,image/jpeg,image/png"
                    multiple
                    :limit-size="10"
                    list-type="text"
                    :limited="1"
                    :on-success="imgFile">
                    <so-button>上传图片</so-button>
                </so-upload>
                <div class="img">
                    <img v-if="imgFlag" mode="widthFix" :src="imgSrc"/>
                </div>
            </div>
        </div>
        <div class="model">
            <div class="filed"><span class="require">*</span>商品说明:</div>
            <div>
                <so-input
                    v-model="commodityDescription"
                    show-counter
                    :max="500"
                    placeholder="请输入内容"
                    resize="none"
                    type="textarea"
                    :rows="6"
                    >
                </so-input>
            </div>
        </div>
        <div class="model">
            <div class="filed-model">
                <div class="filed">商品列表排序:</div>
                <div class="input-model">
                    <input v-model="commoditySort" type="number" class="input" placeholder="例：1、2、10">
                </div>
            </div>
            <div class="text-model">
                <div>• 输入数字越大，列表排序越靠前。数字相同，依次进行排列</div>
                <div>• 输入限制：0-10个数字</div>
                <div>• 不填写时按创建顺序依次进行排序</div>
            </div>
        </div>
        <div class="title margin40">兑换条件</div>
        <div class="model">
            <div class="filed-model">
                <div class="filed"><span class="require">*</span>兑换积分数量:</div>
                <div class="input-model">
                    <input v-model="exChangeIntegralNum" type="number" class="input" placeholder="输入范围1-100000">
                    <span class="label">积分</span>
                </div>
            </div>
            <div class="text-model">
                <div>• 人民币：积分=1：150</div>
            </div>
        </div>
        <div class="model">
            <div class="filed-model">
                <div class="filed"><span class="require">*</span>有效期:</div>
                <div>
                    <so-date-picker
                        v-model="commodityTime"
                        range-separator=" 至 "
                        :default-time="['00:00:00', '24:00:00']"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        placeholder="start  time —— end time"
                    >
                    </so-date-picker>
                </div>
            </div>
            <div class="text-model">
                <div>• 开始时间大于当前时间，结束时间至少与开始时间间隔60分钟</div>
                <div>• 商品上架有效期开始后，可以进行兑换</div>
                <div>• 有效期到达截止时间，商品下架不支持兑换</div>
            </div>
        </div>
        <div class="model">
            <div class="filed-model">
                <div class="filed"><span class="require">*</span>现库存数量:</div>
                <div>
                    <so-input v-model="inventoryQuantity" type="number" :disabled="true"></so-input>
                    <so-Button type="info" @click="commodityOperation('add')">增加库存</so-Button>
                    <so-Button @click="commodityOperation('reduce')">减少库存</so-Button>
                    <div class="operation" v-if="operation === 'add'">
                        <so-Button @click="numOperationFun('1')">+1</so-Button>
                        <so-Button @click="numOperationFun('5')">+5</so-Button>
                        <so-Button @click="numOperationFun('10')">+10</so-Button>
                        <so-Button @click="numOperationFun('20')">+20</so-Button>
                    </div>
                    <div class="operation" v-if="operation === 'reduce'">
                        <so-Button @click="numOperationFun('1')">-1</so-Button>
                        <so-Button @click="numOperationFun('5')">-5</so-Button>
                        <so-Button @click="numOperationFun('10')">-10</so-Button>
                        <so-Button @click="numOperationFun('20')">-20</so-Button>
                    </div>
                </div>
            </div>
            <div class="text-model">
                <div>• 库存数按照实际数量填写</div>
                <div>• 库存数量再上架中可以进行调整，增加或减少</div>
            </div>
        </div>
        <div class="model">
            <div class="filed-model">
                <div class="filed">已兑换数量:</div>
                <div><so-input v-model="exChangeNum" type="number" :disabled="disabledFlag"></so-input></div>
            </div>
            <div class="text-model">
                <div>• 商品被兑换数量记录，兑换1次，数量+1，实时记录</div>
                <div>• 当已兑换数量=原库存数量时，商品库存不足，自动下架</div>
            </div>
        </div>
        <div class="model">
            <div class="filed-model">
                <div class="filed"><span class="require">*</span>开放展馆:</div>
                <div>
                    <so-select width="100%" v-model="pavilionOpen">
                        <so-option
                            v-for="item in pavilionList"
                            :key="item.uuid"
                            :label="item.name"
                            :value="item.uuid"
                        />
                    </so-select>
                </div>
            </div>
            <div class="text-model">
                <div>• 数据来自展馆管理模块启用数据</div>
                <div>• 只能选择1个展馆</div>
            </div>
        </div>
        <div class="button-list">
            <so-Button @click="commodityCancel()">取消</so-Button>
            <so-Button type="info" @click="commoditySave()">保存</so-Button>
        </div>
    </div>
</template>
<script>
import Api from 'api';

export default {
    data() {
        return {
            commodityType: '0',
            commodityTitle: '',
            commodityPrice: null,
            exChangeIntegralNum: null,
            disabledFlag: true,
            exChangeNum: null,
            pavilionOpen: '',
            commodityTime: '',
            commodityDescription: '',
            commoditySort: null,
            inventoryQuantity: null,
            oldInventoryQuantity: null,
            operateInventoryNum: null,
            operateInventoryType: null,
            pavilionList: [],
            operation: '',
            imgSrc: '',
            imgFlag: false,
            numOperation: null,
            editType: '',
            symbol: null // 加减操作符：0 是加； 1 是减
        };
    },
    mounted() {
        if (this.$route.params.commodityNo) {
            this.detail(this.$route.params.commodityNo);
            this.editType = 'edit';
        }
        this.hallList();
    },
    watch: {
        commodityPrice (val) {
            this.commodityPrice = this.numberListening(val, 10000, 1);
        },
        exChangeIntegralNum (val) {
            this.exChangeIntegralNum = this.numberListening(val, 100000, 1);
        },
        commoditySort (val) {
            if (val.length > 10) {
                this.commoditySort = this.commoditySort.slice(0, 10);
            }
        }
    },
    methods: {
        detail (commodityNo) {
            Api.finance.getCommodity({
                commodityNo: commodityNo,
                _security_token: '02_0dKX_mgq2cppvGG'
            }).then((res) => {
                if (res.type === 1) {
                    this.commodityType = '1';
                }
                this.commodityTitle = res.name;
                this.commodityPrice = res.rmbPrice;
                if (res.thumbImage) {
                    this.imgFlag = true;
                    this.imgSrc = res.thumbImage;
                }
                this.commodityDescription = res.description;
                this.commoditySort = res.position;
                this.exChangeIntegralNum = res.integral;
                this.commodityTime = [res.validStartTime, res.validEndTime];
                this.inventoryQuantity = res.inventory;
                this.oldInventoryQuantity = res.inventory;
                this.exChangeNum = res.exchangeCountTotal;
                this.pavilionOpen = res.hallCode;
            });
        },
        numberListening (val, maxNum, minNum) {
            if (parseInt(val) < minNum) {
                val = minNum;
            } else if (parseInt(val) > maxNum) {
                val = maxNum;
            }
            return val;
        },
        hallList () {
            Api.finance.getPageList({
                pageSize: 999,
                pageIndex: 1,
                _security_token: '02_0dKX_mgq2cppvGG'
            }).then((res) => {
                this.pavilionList = res.items;
            });
        },
        commoditySave () {
            if (!this.commodityTitle) {
                this.toast('请输入商品标题');
                return false;
            }
            if (!this.commodityPrice) {
                this.toast('请输入商品原价');
                return false;
            }
            if (!this.imgSrc) {
                this.toast('请上传图片');
                return false;
            }
            if (!this.commodityDescription) {
                this.toast('请填写商品说明');
                return false;
            }
            if (!this.exChangeIntegralNum) {
                this.toast('请填写兑换积分数量');
                return false;
            }
            if (!this.commodityTime.length === 0 || !this.commodityTime) {
                this.toast('请选择有效期');
                return false;
            }
            if (this.inventoryQuantity) {
                if (this.oldInventoryQuantity - this.inventoryQuantity < 0) {
                    this.numOperation = this.inventoryQuantity - this.oldInventoryQuantity;
                    this.symbol = 0;
                } else if (this.oldInventoryQuantity - this.inventoryQuantity > 0) {
                    this.numOperation = this.oldInventoryQuantity - this.inventoryQuantity;
                    this.symbol = 1;
                } else {
                    this.numOperation = 0;
                    this.symbol = 0;
                }
            } else {
                this.toast('请输入现库存数量');
                return false;
            }
            // this.pavilionOpen = '1i4wRYmcYh';
            if (!this.pavilionOpen) {
                this.toast('请选择开放展馆');
                return false;
            }
            if (this.editType === 'edit') {
                if (this.inventoryQuantity - this.oldInventoryQuantity === 0) {
                    this.operateInventoryType = 0;
                    this.operateInventoryNum = 0;
                } else if (this.inventoryQuantity - this.oldInventoryQuantity < 0) {
                    this.operateInventoryType = 1;
                    this.operateInventoryNum = this.oldInventoryQuantity - this.inventoryQuantity;
                } else if (this.inventoryQuantity - this.oldInventoryQuantity > 0) {
                    this.operateInventoryType = 0;
                    this.operateInventoryNum = this.inventoryQuantity - this.oldInventoryQuantity;
                }
            }
            var josn = {
                commodityNo: this.$route.params.commodityNo,
                name: this.commodityTitle,
                description: this.commodityDescription,
                rmbPrice: this.commodityPrice,
                integral: this.exChangeIntegralNum,
                inventory: this.inventoryQuantity,
                thumbImage: this.imgSrc,
                position: this.commoditySort,
                operateInventoryNum: this.operateInventoryNum,
                operateInventoryType: this.operateInventoryType,
                validStartTime: this.commodityTime[0],
                validEndTime: this.commodityTime[1],
                type: parseInt(this.commodityType),
                hallCode: this.pavilionOpen
            };
            if (this.editType === 'edit') {

                Api.finance.inventoryUpdate({
                    ...josn,
                    _security_token: '02_0dKX_mgq2cppvGG'
                }).then((res) => {
                    if (res) {
                        this.success('修改成功');
                    }
                });
            } else {
                Api.finance.inventoryAdd({
                    ...josn,
                    _security_token: '02_0dKX_mgq2cppvGG'
                }).then((res) => {
                    if (res) {
                        this.success('新增成功');
                    }
                });
            }
        },
        commodityCancel () {
            this.$router.push({
                name: 'inventory'
            });
        },
        commodityOperation (key) {
            this.operation = key;
        },
        numOperationFun (key) {
            if (this.operation === 'add') {
                this.inventoryQuantity = this.inventoryQuantity + parseInt(key);
            } else if (this.operation === 'reduce') {
                if (this.inventoryQuantity - parseInt(key) <= 0) {
                    this.inventoryQuantity = 0;
                } else {
                    this.inventoryQuantity = this.inventoryQuantity - parseInt(key);
                }
            }
        },
        imgFile (data) {
            this.imgSrc = data.path;
            this.imgFlag = true;
        },
        toast (text) {
            this.$toast.error({
                message: text
            });
        },
        success (text) {
            this.$toast({
                message: text,
                type: 'success',
                duration: 1000
            });
            this.$router.push({
                name: 'inventory'
            });
        }
    }
};
</script>
