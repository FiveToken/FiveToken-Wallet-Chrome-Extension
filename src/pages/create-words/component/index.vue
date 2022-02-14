<template>
  <ky-layout>
    <div class="create-words">
      <ky-back @pageBack="back" />
      <div class="content">
        <div class="title">{{ $t("creatWords.title") }}</div>
        <div class="sub-title">{{ $t("creatWords.subTitle") }}</div>
        <div class="mnemonic-words">
          <div
            class="words-items"
            v-for="(item, index) in mnemonicArr"
            :key="index"
          >
            <div class="no">#{{ index + 1 }}</div>
            <div class="text">{{ item }}</div>
          </div>
        </div>
        <div class="tips">{{ $t("creatWords.tips1") }}</div>
        <div class="tips">{{ $t("creatWords.tips2") }}</div>
        <div class="btn-wrap">
          <ky-button :type="'primary'" :active="active" @btnClick="next">{{
            $t("creatWords.btn1")
          }}</ky-button>
        </div>
      </div>
      <div class="loading" v-if="isFetch">
        <img :src="loading" alt="" class="img" />
      </div>
      <div class="mask" v-if="mask"></div>
    </div>
  </ky-layout>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getQueryString } from '@/utils'
export default {
  data () {
    return {
      mask: false,
      active: true,
      loading: require('@/assets/image/loading.png'),
      isFetch: false,
      show: false,
      mnemonicWords: '',
      accountName: '',
      password: '',
      mnemonicArr: [],
      createType: ''
    }
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'networks',
      'networkType',
      'filecoinAddress0',
      'deriveIndex'
    ])
  },
  async mounted () {
    const mnemonicWords = getQueryString('mnemonicWords')
    this.mnemonicWords = mnemonicWords
    const mnemonicArr = mnemonicWords.split(' ')
    this.mnemonicArr = mnemonicArr
    const accountName = this.getQuery('accountName')
    const password = getQueryString('password')
    const createType = this.getQuery('createType')
    this.createType = createType
    this.accountName = decodeURIComponent(accountName)
    this.password = password
  },
  methods: {
    ...mapMutations('app', ['SET_DERIVEINDEX']),
    getQuery (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = window.location.search.substr(1).match(reg)
      let context = ''
      if (r != null) {
        context = r[2]
      }
      reg = null
      r = null
      return context == null || context === '' || context === 'undefined'
        ? ''
        : context
    },
    back () {
      window.location.href = `./create-wallet.html?backPage=wallet&createType=${this.createType}`
    },
    next () {
      const accountName = encodeURIComponent(this.accountName)
      const url = `./check-words.html?mnemonicWords=${this.mnemonicWords}&accountName=${accountName}&password=${this.password}&createType=${this.createType}`
      window.location.href = url
    }
  }
}
</script>

<style  lang="less" scoped>
.create-words {
  width: 100%;
  margin: 0 auto;
  min-height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 15px 20px;
  position: relative;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    .img {
      animation: turnX 3s linear infinite;
    }
    @keyframes turnX {
      0% {
        transform: rotateZ(0deg);
      }
      100% {
        transform: rotateZ(360deg);
      }
    }
  }
  .back {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 18px;
    color: #222;
    cursor: pointer;
  }
  .content {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 30px 0 0;
    .title {
      color: #222;
      font-size: 20px;
      font-weight: bolder;
      margin-bottom: 20px;
    }
    .sub-title {
      color: #222;
      font-size: 16px;
      margin-bottom: 20px;
      line-height: 20px;
    }
    .mnemonic-words {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .words-items {
        width: 100px;
        height: 30px;
        margin-right: 10px;
        margin-bottom: 15px;
        background: #f1f3fd;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .text {
          font-size: 14px;
          color: #101010;
        }
        .no {
          position: absolute;
          top: 0px;
          left: 3px;
          color: #6a6767;
          font-size: 12px;
          transform: scale(0.8);
        }
      }
    }
    .btn-wrap {
      display: flex;
      justify-content: space-between;
      padding-top: 60px;
      /deep/.button-wrap {
        width: 155px;
      }
    }
    .copy {
      font-size: 14px;
      color: #1c818a;
      margin-bottom: 15px;
      padding-top: 20px;
      cursor: pointer;
    }
    .tips {
      font-size: 12px;
      color: #6a6767;
      line-height: 20px;
    }
  }
}
</style>
