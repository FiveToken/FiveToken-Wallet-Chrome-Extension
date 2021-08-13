<template>
<div class="address-form">
    <div class="form-top">
        <div class="back-s" @click="back"><i class="el-icon-arrow-left"></i></div>
        <div class="top-name">{{pageName}}</div>
        <div class="close" @click="close" v-if="pageType === 'list'"><i class="el-icon-close"></i></div>
    </div>
    <div class="form-content">
        <div class="add-content" v-if="pageType === 'add'">
            <div class="input-item">
                <div class="label">{{$t('settingAddress.name')}}</div>
                <el-input v-model="add.name"></el-input>
            </div>
            <div class="input-item">
                <div class="label">{{$t('settingAddress.filAddress')}}</div>
                <el-input :placeholder="$t('settingAddress.placeholder')" v-model="add.address" @input="addAddressInput">
                    <!-- <el-button slot="prepend" icon="el-icon-search"></el-button> -->
                </el-input>
                <div class="error" v-if="addAddressError">{{$t('settingAddress.addressError')}}</div>
            </div>
            <div class="position">
                <div class="btn-box">
                    <el-button @click="cancelAdd">{{$t('settingAddress.cancel')}}</el-button>
                    <el-button type="primary" :disabled="addDisabled" @click="addConfirm">{{$t('settingAddress.confirm')}}</el-button>
                </div>
            </div>
        </div>
        <div class="detail-content"  v-if="pageType === 'detail'">
            <div class="yt">{{$t('settingAddress.filAddress')}}</div>
            <div class="v-c copy-box" @click="copyAddress" :data-clipboard-text="detail.address">
                <div class="value">{{detail.address | addressFormat}}</div>
                <div class="copy">
                    <i class="el-icon-document-copy"></i>
                </div>
            </div>
            <div class="notes">{{$t('settingAddress.name')}}</div>
            <div class="notes-value">{{detail.name}}</div>
            <div class="position">
                <div class="edit-btn">
                    <el-button type="primary" @click="editAddress">{{$t('settingAddress.edit')}}</el-button>
                </div>
            </div>
        </div>
        <div class="edit-content"  v-if="pageType === 'edit'">
            <div class="input-item">
                <div class="label">{{$t('settingAddress.name')}}</div>
                <el-input v-model="edit.name"></el-input>
            </div>
            <div class="input-item">
                <div class="label">{{$t('settingAddress.filAddress')}}</div>
                <el-input v-model="edit.address" @input="editAddressInput"></el-input>
                <div class="error" v-if="editAddressError">{{$t('settingAddress.addressError')}}</div>
            </div>
            <div class="position">
                <div class="btn-box">
                    <el-button @click="cancelEdit">{{$t('settingAddress.cancel')}}</el-button>
                    <el-button type="primary" :disabled="editDisabled" @click="confirmEdit">{{$t('settingAddress.confirm')}}</el-button>
                </div>
            </div>
            
        </div>
    </div>
</div>
</template>

<script>
import { isValidAddress} from '@/utils'
import ClipboardJS from 'clipboard'
export default {
    data(){
        return{
            add:{
                name:'',
                address:''
            },
            detail:{
                name:'',
                address:''
            },
            edit:{
                name:'',
                address:''
            },
            editAddressError:'',
            addAddressError:''
        }
    },
    props:{
        pageType:String,
        detailObj:Object,
        to:String
    },
    computed:{
        pageName(){
            let str = ''
            switch (this.pageType){
                case 'add':
                    str = this.$t('settingAddress.addAddress')
                    break;
                case 'detail':
                    str = this.$t('settingAddress.addressDetail')
                    break;
                case 'edit':
                    str = this.$t('settingAddress.editAddress')
                    break;
            }
            return str
        },
        addDisabled(){
            let disabled = true
            let values = Object.values(this.add)
            
            disabled = !values.every( n=> n !=='')
            return disabled
        },
        editDisabled(){
            let disabled = true
            let values = Object.values(this.edit)
            disabled = !values.every( n=> n !=='')
            return disabled
        }
    },
    watch:{
        detailObj:{
            handler(newVal, oldVal) {
                
            },
            immediate: true
        }
        
    },
    filters:{
        addressFormat(val){
            if(val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        },
    },
    mounted(){
        if(this.pageType === 'detail'){
            let { name,address } = this.detailObj
            this.detail = Object.assign({}, this.detail, { name, address})
        }
        if(this.pageType === 'add' && this.to){
            this.$set(this.add,'address',this.to)
        }
    },
    methods:{
        addAddressInput(){
            let voild = isValidAddress(this.add.address)
            if(!voild){
                this.addAddressError = '1'
            }else{
                this.addAddressError = ''
            }
            
        },
        editAddressInput(){
            let voild = isValidAddress(this.edit.address)
            if(!voild){
                this.editAddressError = '1'
            }else{
                this.editAddressError = ''
            }
            
        },
        toList(){
            this.addressList = true
        },
        cancelAdd(){
            this.$emit("update:pageType",'list')
        },
        back(){
            this.$emit("update:pageType",'list')
        },
        async addConfirm(){
            let voild = isValidAddress(this.add.address)
            if(voild){
                let create_time =  parseInt(new Date().getTime() / 1000)
                await window.filecoinwalletDb.addressBook.add({
                    address:this.add.address,
                    name:this.add.name,
                    create_time,
                    kunyao:'kunyao'
                })
                this.$emit("update:pageType",'list')
            }else{
                this.$message.error(this.$t('settingAddress.addressError')) 
            }
        },
        editAddress(){
            let { name,address } = this.detailObj
            this.edit = Object.assign({}, this.edit, { name, address})
            this.$emit("update:pageType",'edit')
        },
        copyAddress(){
            let that = this
            const clipboard = new ClipboardJS('.copy-box')
            clipboard.on('success', function(e) {
                that.$message.success(that.$t('settingAddress.copySuccess'))
            })
            clipboard.on('error', function(e) {})
        },
        close(){
            this.$emit("update:pageType",'list')
        },
        cancelEdit(){
            this.$emit("update:pageType",'detail')
        },
        confirmEdit(){
             window.filecoinwalletDb.addressBook.where("address").equals(this.detail.address).modify({
                 address:this.edit.address,
                 name:this.edit.name
            }).then(res=>{
                
                this.detail = Object.assign({}, this.detail, { name:this.edit.name, address:this.edit.address})
                this.$message.success(this.$t('settingAddress.editSuccess'))
                this.$emit("update:pageType",'detail')
                // window.location.href = './setting-address.html'
            })
        }
    }
}
</script>

<style  lang="less" scoped>
.address-form{
    .form-top{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding:10px 20px;
        border-bottom: 1px solid #eee;
        .top-name{
            font-size: 18px;
            color: #222;
            flex-grow: 1;
        }
        i{
            padding-right: 5px;
            font-size: 18px;
            cursor: pointer;
        }
    }
    .form-content{
        padding: 20px;
        position: relative;
        height: 500px;
    }
    .input-item{
        margin-bottom: 20px;
        .label{
            margin-bottom: 10px;
            font-size: 14px;
            color: #999;
        }
        .error{
            padding-top: 5px;
            font-size: 12px;
            color: #FD334C;
        }
    }
    .detail-content{
        .name{
            font-size: 18px;
            color: #222;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .yt{
            font-size: 14px;
            color: #999;
            margin-bottom: 20px;
        }
        .v-c{
            font-size: 14px;
            color: #222;
            display: flex;
            margin-bottom: 20px;
            text-align: left;
            .copy{
                padding-left: 10px;
            }
        }
        .notes{
            font-size: 14px;
            color: #999;
            margin-bottom: 20px;
        }
        .notes-value{
            font-size: 14px;
            color: #222;
            margin-bottom: 20px;
        }
        .input-item{
            margin-bottom: 20px;
            .label{
                margin-bottom: 10px;
                font-size: 14px;
                color: #999;
            }
        }
        .edit-btn{
            width: 100%;
            display: flex;
            /deep/.el-button{
                flex-grow: 1;
            }
        }
    }
    .edit-content{
        
    }
    .position{
        position: absolute;
        bottom:0;
        left: 20px;
        width: calc(100% - 40px);
        .btn-box{
            width: 100%;
            display: flex;
            align-items: center;
            /deep/.el-button{
                flex-grow: 1;
            }
        }
    }
}
</style>
