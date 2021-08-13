<template>
<div class="setting-backups">
    <div class="back">
        <i class="el-icon-arrow-left" @click="back"></i>
        <span>{{$t('settingBackups.backups')}}</span>
        <i class="el-icon-close" @click="closeSetting"></i>
    </div>
     <div class="backups-content">
         <div class="step-1" v-if="step === 1">
            <div class="show-words">{{$t('settingBackups.showWords')}}</div>
            <div class="btn-wrap" @click="backupsStep(2)">
                <el-button>{{$t('settingBackups.showWords')}}</el-button>
            </div>
        </div>
        <div class="step-2" v-if="step === 2">
            <div class="title">{{$t('settingBackups.accountWords')}}</div>
            <div class="sub-title">{{$t('settingBackups.tips')}}</div>
            <div class="wraning">
                <div class="w-left">
                    <i class="el-icon-warning-outline"></i>
                </div>
                <div class="w-right">
                    <div class="t">{{$t('settingBackups.warning')}}</div>
                    <div class="s">{{$t('settingBackups.warningTips')}}</div>
                </div>
            </div>
            <div class="input-item">
                <div class="label">{{$t('settingBackups.inputPassword')}}</div>
                <el-input v-model="password" type="password"></el-input>
            </div>
            <div class="position">
                <div class="btn-wrap">
                    <el-button @click="backupsStep(1)">{{$t('settingBackups.cancel')}}</el-button>
                    <el-button type="primary" @click="next">{{$t('settingBackups.next')}}</el-button>
                </div>
            </div>
        </div>
        
        <div class="step-3" v-if="step === 3">
            <div class="label"> {{$t('settingBackups.yourWords')}}</div>
            <div class="text">{{mnemonicWords}}</div>
            <div class="action">
                <div class="copy copy-mne" @click="copyMne" :data-clipboard-text="mnemonicWords">
                    <i class="el-icon-document-copy"></i>
                    <div class="t">{{$t('settingBackups.copy')}}</div>
                </div>
                <div class="download" @click="downloadCSV">
                    <i class="el-icon-download"></i>
                    <div class="t">{{$t('settingBackups.saveCsv')}}</div>
                </div>
            </div>
            <div class="position">
                <div class="btn-wrap">
                    <el-button @click="close">{{$t('settingBackups.close')}}</el-button>
                </div>
            </div>
        </div>
     </div>
    
</div>
</template>

<script>
import { validatePrivateKey ,privateKeyDecode} from '@/utils/key'
import { AESDecrypt } from '@/utils/f1'
import ClipboardJS from 'clipboard'
export default {
    data(){
        return{
            step:1,
            password:'',
            address:'',
            encodePrivateKey:'',
            mnemonicWords:'',
            digest:''
        }
    },
    async mounted(){
        let activeAccount = await window.filecoinwalletDb.activeAccount.where({ kunyao:'kunyao'}).toArray ()|| [];
        this.address = activeAccount.length && activeAccount[0].address
        let encodePrivateKey = activeAccount.length && activeAccount[0].privateKey
        this.digest = activeAccount.length && activeAccount[0].digest
        this.encodePrivateKey = encodePrivateKey
    },
    methods:{
        back(){
             window.location.href = './setting.html'
        },
        closeSetting(){
            window.location.href = './wallet.html'
        },
        async next(){
            let voild = await validatePrivateKey(this.address,this.password,this.encodePrivateKey,this.digest)
            if(voild){
                this.step = 3
                let activeAccount = await window.filecoinwalletDb.activeAccount.where({ kunyao:'kunyao'}).toArray ();
                let AESmnemonicWords = activeAccount.length && activeAccount[0].mnemonicWords
                let privateKey = privateKeyDecode(this.encodePrivateKey,this.address, this.password)
                
                this.mnemonicWords = AESDecrypt(AESmnemonicWords,privateKey)
            }else{
                this.$message.error(this.$t('settingBackups.passwordError'))
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
        downloadCSV(){
            let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(this.mnemonicWords);
            let link = document.createElement("a");
            link.href = uri;
            link.download =  "json.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(uri,'downloadCSV')
        },
        backupsStep(step){
            this.step = step
        },
        close(){
            this.mnemonicWords =  ''
            this.step = 1
        }
    }
}
</script>

<style  lang="less" scoped>
.setting-backups{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    .back{
        display: flex;
        align-items: center;
        padding:  10px 20px;
        color: #222;
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
        justify-content: space-between;
        i{
            width: 35px;
            height: 35px;
            font-size: 18px;
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .el-icon-arrow-left{
            justify-content: flex-start;
        }
        .el-icon-close{
            justify-content: flex-end;
        }
        span{
            flex-grow: 1;
            font-size: 18px;
            text-align: left;
        }
    }
    .backups-content{
        position: relative;
        height: 520px;
        .step-1{
            padding:0 20px;
            .page-name{
                border-bottom: 1px solid #eee;
                font-size: 18px;
                color: #222;
                padding-bottom: 20px;
            }
            .show-words{
                font-size: 14px;
                color: #999;
                margin-bottom: 20px;
            }
            .btn-wrap{
                width: 240px;
                /deep/.el-button{
                    width: 100%;
                    color: #C64345;
                    border: 1px solid #C64345;
                    &:hover{
                        background: #fff;
                    }
                    &:focus{
                        background: #fff;
                    }
                }
            }
        }
        .step-2{
            .title{
                font-size: 28px;
                color: #222;
                font-weight: bolder;
                padding:0 20px 20px;
            }
            .sub-title{
                font-size: 14px;
                color: #999;
                margin-bottom: 20px;
                padding: 0 20px;
            }
            .wraning{
                display: flex;
                align-items: center;
                padding: 20px;
                background: #FDF4F4;
                margin-bottom: 20px;
                .w-left{
                    i{
                        font-size: 18px;
                        color: #FD334C;
                    }
                }
                .w-right{
                    padding-left: 20px;
                    .t{
                        font-size: 16px;
                        color: #222;
                        margin-bottom: 5px;
                    }
                    .s{
                        font-size: 14px;
                        color: #999;
                    }
                }
            }
            .input-item{
                padding: 0 20px;
                .label{
                    font-size: 14px;
                    color: #999;
                    margin-bottom: 10px;
                }
            }
        }
        .step-3{
            padding: 20px;
            .label{
                font-size: 14px;
                color: #999;
                margin-bottom: 10px;
            }
            .text{
                padding: 15px;
                background: #fafafa;
                font-size: 14px;
                color: #666;
                border: 1px solid #eee;
            }
            .action{
                display: flex;
                align-items: center;
                .copy,.download{
                    flex-grow: 1;
                    height: 35px;
                    line-height: 35px;
                    border: 1px solid #eee;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #3295DC;
                    font-size: 14px;
                    cursor: pointer;
                    i{
                        margin-right: 10px;
                    }
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
