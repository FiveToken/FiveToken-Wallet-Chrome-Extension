<template>
    <layout>
        <div class="setting-backups">
            <div class="backups-content">
                <div class="step-1" v-if="step === 1">
                    <div class="top-back">
                        <kyBack 
                            @pageBack="back" 
                            :name="$t('settingBackups.backupsCheck')" 
                            :close="false"
                        ></kyBack>
                    </div>
                    <div class="backups-check">
                        <div class="backups-tips" v-if="backups === 'privateKey'">{{$t('settingBackups.pkTips')}}</div>
                        <div class="backups-tips" v-else>{{$t('settingBackups.mneTips')}}</div>
                        <div class="input-item">
                            <div class="label">{{$t('settingBackups.inputPassword')}}</div>
                            <kyInput 
                                :value="password"
                                :suffix="suffix" 
                                :type="passwordType" 
                                @changeInput="passwordChange"
                                @changeEye="passwordEye"
                            ></kyInput>
                        </div>
                    </div>
                    
                </div>
                <div class="step-2" v-if="step === 2">
                    <div class="top-back">
                        <kyBack 
                            @pageBack="back" 
                            :name="backupsTitle" 
                            :close="true"
                            @pageClose="pageClose"
                        ></kyBack>
                    </div>
                    <div class="backups-check">
                        <div class="backups-tips" v-if="backups === 'privateKey'">{{$t('settingBackups.pkTips')}}</div>
                        <div class="backups-tips" v-else>{{$t('settingBackups.mneTips')}}</div>
                        <div class="input-item">
                            <div class="label" v-if="backups === 'privateKey'">{{$t('settingBackups.yourPk')}}</div>
                            <div class="label" v-else>{{$t('settingBackups.yourMne')}}</div>
                            <div class="value" v-if="backups === 'privateKey'">{{pk}}</div>
                            <div class="value" v-else>{{mnemonic}}</div>
                        </div>
                        <div class="copy copy-mne" v-if="backups === 'privateKey'" @click="copyMne" :data-clipboard-text="pk">
                            {{$t('settingBackups.copy')}}
                        </div>
                        <div class="copy copy-mne" v-else @click="copyMne" :data-clipboard-text="mnemonic">
                            {{$t('settingBackups.copy')}}
                        </div>
                    </div>
                </div>
                
                <div class="position">
                    <div class="btn-wrap">
                        <kyButton 
                            v-if="step === 1" 
                            :type="'primary'" 
                            @btnClick="next"
                            :active="password!==''"
                        >
                            {{$t('settingBackups.next')}}
                        </kyButton>
                        <kyButton 
                            v-if="step === 2"
                            @btnClick="pageClose"
                        >
                            {{$t('settingBackups.close')}}
                        </kyButton>
                    </div>
                </div>
            </div>
        </div>
    </layout>
</template>
<script>
import { validatePassword,getPrivateKey,getQueryString,deCodeMnePsd} from '@/utils'
import ClipboardJS from 'clipboard'
import layout from '@/components/layout'
import kyBack from '@/components/back'
import kyInput from '@/components/input'
import kyButton from '@/components/button'
import { mapState } from 'vuex'
export default {
    data(){
        return{
            step:1,
            password:'',
            mnemonic:'',
            backups:'',
            suffix:true,
            passwordType:'password',
            pk:''
        }
    },
    components:{
        layout,
        kyBack,
        kyInput,
        kyButton
    },
    computed:{
        ...mapState('app',[
            'address',
            'digest',
            'privateKey',
            'rpc'
        ]),
        backupsTitle(){
            let str = ""
            if(this.backups === 'privateKey'){
                str = this.$t('settingBackups.backupsPk')
            }else{
                str = this.$t('settingBackups.backupsWords')
            }
            return str
        }
    },
    async mounted(){
        let backups = getQueryString("backups")
        this.backups = backups
    },
    methods:{
        back(){
            this.$router.go(-1)
        },
        closeSetting(){
            window.location.href = './wallet.html'
        },
        passwordChange(val){
            this.password = val
        },
        passwordEye(eye){
            this.passwordType = eye ? 'text':'password'
        },
        async next(){
            let walletKey = await window.filecoinwalletDb.walletKey.where({khazix:'khazix'}).toArray()
            if(walletKey.length){
                let mnePsd = await deCodeMnePsd(walletKey[0].mnemonicWords,walletKey[0].password)
                let { mnemonic,password } = mnePsd
                let voild = await validatePassword(this.password,password)
                if(voild){
                    this.step = 2
                    if(this.backups === 'privateKey'){
                        let pk = await getPrivateKey(this.privateKey,this.address,password,this.networkType,true)
                        this.pk = pk
                    }else{
                        this.mnemonic = mnemonic
                    }
                }else{
                    this.$message.error(this.$t('settingBackups.passwordError'))
                }
            }
            
        },
        copyMne(){
            let that = this
            const clipboard = new ClipboardJS('.copy-mne')
            clipboard.on('success', function(e) {
                that.$message.success(that.$t('settingBackups.copySuccess'))
            })
            clipboard.on('error', function(e) {})
        },
        pageClose(){
            window.location.href = './wallet.html'
        },
        
    }
}
</script>

<style  lang="less" scoped>
.setting-backups{
    width: 100%;
    margin: 0 auto;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    .backups-content{
        position: relative;
        height: 100%;
        .top-back{
            position: relative;
            padding: 20px;
            border-bottom:1px solid #F6F7FF;
        }
        .backups-tips{
            width: 100%;
            height: 40px;
            line-height: 40px;
            background-color: #FDF8EB;
            font-size: 12px;
            color: #101010;
            text-align: center;
            margin-bottom: 15px;
            border-radius: 5px;
            border:1px solid #F7E00A;
        }
        .step-1{
            .backups-check{
                padding: 20px;
                .input-item{
                    .label{
                        font-size: 14px;
                        color: #201F1F;
                        line-height: 20px;
                        margin-bottom: 5px;
                    }
                }
            }
        }
        .step-2{
            .backups-check{
                padding: 20px;
                .input-item{
                    margin-bottom: 20px;
                    .label{
                        font-size: 14px;
                        color: #201F1F;
                        margin-bottom: 10px;
                    }
                    .value{
                        padding: 20px;
                        background: #F5F5F5;
                        border-radius: 10px;
                        color: #201F1F;
                        font-size: 14px;
                        word-break: break-all;
                    }
                }
                .copy{
                    font-size: 14px;
                    color: #1C818A;
                    cursor: pointer;
                }
            }
        }
        .position{
            position: absolute;
            left: 0;
            bottom: 0;
            padding:10px;
            border-top: 1px solid #eee;
            width: 100%;
            box-sizing: border-box;
            .btn-wrap{
                display: flex;
                /deep/.el-button{
                    flex-grow: 1;
                }
            }
        }
    }
}
</style>
