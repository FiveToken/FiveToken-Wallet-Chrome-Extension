<template>
    <div class="token-logo">
        <div
          class="color"
          v-for="(item,index) in styleArray"
          :key="index"
          :style="{
            background:item.background,
            transform:item.transform
          }"
        >
        </div>
    </div>
</template>

<script>
import randomColor from 'randomcolor'
export default {
  data () {
    return {
      styleArray: []
    }
  },
  props: {
    contract: String
  },
  watch: {
    contract: {
      handler (val) {
        if (val) {
          this.createStyle()
        }
      },
      immediate: true
    }
  },
  methods: {
    createStyle () {
      const str10 = Number(this.contract.substring(0, 15)).toString(10)
      const numArray = this.createArr(str10, 0, 3)
      const colorList = ['green', 'orange', 'yellow']
      const style = numArray.map((n, index) => {
        const color = randomColor({
          count: 1,
          hue: colorList[index],
          seed: n
        })
        const x = Number(n.substr(0, 1))
        const y = Number(n.substr(n.length - 1, 1))
        const x1 = x % 2 > 0 ? x : -x
        const y1 = y % 2 > 0 ? y : -y
        // eslint-disable-next-line no-unused-vars
        const rotateX = Number(n.substr(0, 2)) + 'deg'
        const rotateY = Number(n.substr(n.length - 2, 2)) + 'deg'
        const transform = `translate(${2 * x1}px,${2 * y1}px) skew(0,${rotateY})`
        return {
          background: color.join(),
          transform
        }
      })
      this.styleArray = style
    },
    createArr (str, start, end) {
      const arr = []
      const counts = 3
      for (let i = 0; i < counts; i++) {
        const newStr = str.substring(start, end)
        if (arr.length >= 3) {
          return arr
        } else {
          arr.push(newStr)
          start = end
          end += counts
        }
      }
      return arr
    }
  }
}
</script>

<style  lang="less" scoped>
.token-logo{
  width: 30px;
  height: 30px;
  background: #5BC1CA;
  border-radius: 15px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  margin: 0 auto;
  .color{
    width: 30px;
    height: 30px;
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    margin-top: -15px;
    margin-left: -15px;
  }
}
</style>
