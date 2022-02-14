<template>
    <ky-layout>
        <div class="setting-backups">
            <div class="backups-content">
                <div class="step-1" v-if="step === 1">
                    <div class="top-back">
                        <ky-back
                            @pageBack="back"
                            :name="$t('settingBackups.backupsCheck')"
                            :close="false"
                        ></ky-back>
                    </div>
                    <div class="backups-check">
                        <div class="backups-tips" v-if="backups === 'privateKey'">{{$t('settingBackups.pkTips')}}</div>
                        <div class="backups-tips" v-else>{{$t('settingBackups.mneTips')}}</div>
                        <div class="input-item" :class="{error:passwordError}">
                            <div class="label">{{$t('settingBackups.inputPassword')}}</div>
                            <ky-input
                                :value="password"
                                :suffix="suffix"
                                :type="passwordType"
                                @changeInput="passwordChange"
                                @changeEye="passwordEye"
                            ></ky-input>
                            <div class="error" v-if="passwordError">{{$t('settingBackups.passwordError')}}</div>
                        </div>
                    </div>

                </div>
                <div class="step-2" v-if="step === 2">
                    <div class="top-back">
                        <ky-back
                            @pageBack="back"
                            :name="backupsTitle"
                            :close="true"
                            @pageClose="pageClose"
                        ></ky-back>
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
                    </div>
                </div>

                <div class="position">
                    <div class="btn-wrap">
                        <ky-button
                            v-if="step === 1"
                            :type="'primary'"
                            @btnClick="next"
                            :active="password!==''"
                        >
                            {{$t('settingBackups.next')}}
                        </ky-button>
                        <ky-button
                            v-if="step === 2"
                            :type="'primary'"
                            :active="active"
                            @btnClick="pageClose"
                        >
                            {{$t('settingBackups.close')}}
                        </ky-button>
                    </div>
                </div>
            </div>
            <div class="mask" v-if="mask"></div>
        </div>
    </ky-layout>
</template>
<script>
import { getBackupsPrivateKey, getQueryString } from '@/utils'
import { mapState } from 'vuex'
import ExtensionStore from '@/utils/local-store'
import { decrypt } from '@/utils/aes-gcm.js'
import { decryptMessage, encrypt } from '@/utils/aes-gcm'
import { decryptByPrivateKey } from '@/utils/encrypt'
export default {
  data () {
    return {
      step: 1,
      password: '',
      mnemonic: '',
      backups: '',
      suffix: true,
      passwordType: 'password',
      passwordError: false,
      pk: '',
      encryptMnemonic: '',
      mask: false,
      active: true,
      walletKey: null
    }
  },
  computed: {
    ...mapState('app', [
      'address',
      'privateKey',
      'rpc',
      'networkType'
    ]),
    backupsTitle () {
      let str = ''
      if (this.backups === 'privateKey') {
        str = this.$t('settingBackups.backupsPk')
      } else {
        str = this.$t('settingBackups.backupsWords')
      }
      return str
    }
  },
  async mounted () {
    const backups = getQueryString('backups')
    this.backups = backups
    const localStore = new ExtensionStore()
    const walletKey = await localStore.get('walletKey')
    if (walletKey) {
      this.walletKey = walletKey
      this.encryptMnemonic = walletKey.mnemonicWords
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    closeSetting () {
      window.location.href = './wallet.html'
    },
    passwordChange (val) {
      this.password = val
    },
    passwordEye (eye) {
      this.passwordType = eye ? 'text' : 'password'
    },
    async next () {
      if (!this.password) {
        return
      }
      this.passwordError = false
      const voild = await decryptByPrivateKey(this.privateKey, this.password, this.address)
      if (voild) {
        this.step = 2
        if (this.backups === 'privateKey') {
          const _salt = await encrypt(this.password, this.address)
          const _privateKey = await decryptMessage(this.privateKey, _salt, this.address)
          if (_privateKey) {
            const pk = getBackupsPrivateKey(_privateKey, this.networkType)
            this.pk = pk
          }
        } else {
          const { mnemonicWords, address } = this.walletKey
          const _mnemonic = await decrypt(mnemonicWords, address)
          if (_mnemonic) {
            this.mnemonic = _mnemonic
          }
        }
      } else {
        this.passwordError = true
      }
    },
    pageClose () {
      window.location.href = './wallet.html'
    }

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

    .mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    }
    .backups-content{
        position: relative;
        height: 100%;
        .top-back{
            position: relative;
            padding: 20px;
            border-bottom:1px solid #F6F7FF;
        }
        .backups-tips{
            padding: 10px;
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
                    &.error{
                        /deep/.input-component{
                            .el-input__inner{
                                border:1px solid #EA0F0F;
                            }
                        }
                    }
                    .label{
                        font-size: 14px;
                        color: #201F1F;
                        line-height: 20px;
                        margin-bottom: 5px;
                    }
                    .error{
                        padding-top: 5px;
                        font-size: 12px;
                        color: #EA0F0F;
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
