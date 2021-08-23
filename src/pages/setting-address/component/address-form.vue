<template>
<div class="address-form">
    <div class="back-wrap">
        <kyBack 
            @pageBack="back" 
            :name="pageName"
        />
    </div>
    <div class="form-content">
        <div class="add-content" v-if="pageType === 'add'">
            <div class="input-item">
                <div class="label">{{$t('settingAddress.name')}}</div>
                <kyInput :value="add.accountName" @changeInput="addFormChange(arguments,'accountName')"></kyInput>
            </div>
            <div class="input-item">
                <div class="label">{{$t('settingAddress.address')}}</div>
                <kyInput :value="add.address" 
                    @changeInput="addFormChange(arguments,'address')">
                </kyInput>
                <div class="error" v-if="addAddressError">{{$t('settingAddress.addressError')}}</div>
            </div>
            <div class="position">
                <div class="btn-box">
                    <kyButton @btnClick="cancelAdd">{{$t('settingAddress.cancel')}}</kyButton>
                    <kyButton type="primary" :active="addActive" @btnClick="addConfirm">
                        {{$t('settingAddress.confirm')}}
                    </kyButton>
                </div>
            </div>
        </div>
        <div class="detail-content"  v-if="pageType === 'detail'">
            <div class="notes">{{$t('settingAddress.name')}}</div>
            <div class="notes-value">{{detail.accountName}}</div>
            <div class="yt">{{$t('settingAddress.address')}}</div>
            <div class="v-c copy-box" @click="copyAddress" :data-clipboard-text="detail.address">
                <div class="value">{{detail.address | addressFormat}}</div>
                <div class="copy">
                    <i class="el-icon-document-copy"></i>
                </div>
            </div>
            <div class="position">
                <div class="edit-btn">
                    <kyButton :type="'primary'" :active="true" @btnClick="editAddress">
                        {{$t('settingAddress.edit')}}
                    </kyButton>
                </div>
            </div>
        </div>
        <div class="edit-content"  v-if="pageType === 'edit'">
            <div class="input-item">
                <div class="label">{{$t('settingAddress.name')}}</div>
                <kyInput :value="edit.accountName" @changeInput="editFormChange(arguments,'accountName')"></kyInput>
            </div>
            <div class="input-item">
                <div class="label">{{$t('settingAddress.address')}}</div>
                <kyInput :value="edit.address" @changeInput="editFormChange(arguments,'address')"></kyInput>
                <div class="error" v-if="editAddressError">{{$t('settingAddress.addressError')}}</div>
            </div>
            <div class="position">
                <div class="btn-box">
                    <kyButton @btnClick="cancelEdit">{{$t('settingAddress.cancel')}}</kyButton>
                    <kyButton :type="'primary'" :active="editActive" @btnClick="confirmEdit">
                        {{$t('settingAddress.confirm')}}
                    </kyButton>
                </div>
            </div>
            
        </div>
    </div>
    <div class="mask" v-if="mask"></div>
</div>
</template>

<script>
import { isValidAddress} from '@/utils'
import ClipboardJS from 'clipboard'
import { mapState } from 'vuex'
import kyBack from '@/components/back'
import kyButton from '@/components/button'
import kyInput from '@/components/input'
export default {
    data(){
        return{
            mask:false,
            add:{
                accountName:'',
                address:''
            },
            detail:{
                accountName:'',
                address:''
            },
            edit:{
                accountName:'',
                address:''
            },
            editAddressError:'',
            addAddressError:''
        }
    },
    props:{
        pageType:String,
        detailObj:Object,
        to:String,
        addressBook:Array
    },
    computed:{
        ...mapState('app',['rpc','networkType','accountList']),
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
        addActive(){
            let vol = true
            let values = Object.values(this.add)
            vol = values.every( n=> n !=='')
            return vol
        },
        editActive(){
            let vol = false
            let values = Object.values(this.edit)
            vol = values.every( n=> n !=='')
            return vol
        }
    },
    components:{
        kyBack,
        kyButton,
        kyInput
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
            let { accountName,address } = this.detailObj
            this.detail = Object.assign({}, this.detail, { accountName, address})
            console.log(this.detailObj,'this.detailObj')
        }
        console.log(this.to,'this.to')
        if(this.pageType === 'add' && this.to){
            this.$set(this.add,'address',this.to)
        }
    },
    methods:{
        addFormChange(arg,key){
            console.log(arg,key,'aarrgg 112233')
            if(arg){
                let value = arg[0]
                this.$set(this.add,key,value)
            }
            console.log(arg,key,'312312')
        },
        editFormChange(arg,key){
            if(arg){
                let value = arg[0]
                this.$set(this.edit,key,value)
            }
            console.log(arg,key,'312312')
        },
        addAddressInput(){
            let voild = isValidAddress(this.add.address,this.networkType)
            if(!voild){
                this.addAddressError = '1'
            }else{
                this.addAddressError = ''
            }
        },
        editAddressInput(){
            let voild = isValidAddress(this.edit.address,this.networkType)
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
            let voild = isValidAddress(this.add.address,this.networkType)
            let isExist = this.addressBook.filter(n => {
                return n.address === this.add.address
            })
            console.log(isExist,this.addressBook,this.add.address,'isExist 333')
            if(voild){
                if(isExist.length){
                    this.$message.error(this.$t('settingAddress.addressIsExist')) 
                }else{
                    let create_time =  parseInt(new Date().getTime() / 1000)
                    await window.filecoinwalletDb.addressBook.add({
                        address:this.add.address,
                        accountName:this.add.accountName,
                        create_time,
                        rpc:this.rpc,
                        khazix:'khazix'
                    })
                    this.$emit('addAddressCb')
                }
            }else{
                this.$message.error(this.$t('settingAddress.addressError')) 
            }
        },
        editAddress(){
            let { accountName,address } = this.detailObj
            this.edit = Object.assign({}, this.edit, { accountName, address})
            this.$emit("update:pageType",'edit')
        },
        copyAddress(){
            this.mask = true
            let that = this
            const clipboard = new ClipboardJS('.copy-box')
            clipboard.on('success', function(e) {
                that.$message({
                    type:'success',
                    message:that.$t('settingAddress.copySuccess'),
                    duration:1500,
                    onClose:()=>{
                        that.mask = false
                    }
                })
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
                    accountName:this.edit.accountName
                }).then(res=>{
                console.log(this.detail,this.edit,'editeditedit')
                this.detail = Object.assign({}, this.detail, { accountName:this.edit.accountName, address:this.edit.address})
                this.$message.success(this.$t('settingAddress.editSuccess'))
                this.$emit("editAddressCb")
            })
        }
    }
}
</script>

<style  lang="less" scoped>
.address-form{
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    .mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 999;
    }
    .back-wrap{
        padding:  15px 20px;
        border-bottom: 1px solid #F6F7FF;
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
            color: #101010;
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
                cursor: pointer;
            }
        }
        .notes{
            font-size: 14px;
            color: #101010;
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
            /deep/.kyButton{
                flex-grow: 1;
            }
        }
    }
    .edit-content{
        
    }
    .position{
        position: absolute;
        bottom:20px;
        left: 20px;
        width: calc(100% - 40px);
        .btn-box{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            /deep/.button-wrap{
                width: 150px;
            }
        }
    }
}
</style>
