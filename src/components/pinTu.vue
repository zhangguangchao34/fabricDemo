<template>
  <div id="pintu" :key="menuKeys">
    <div class="pop-box">
      <div class="right-box">
        <div id="bodys" class="bodys">
          <div id="canvasBoxPintu">
            <ul class="rule-height"><li v-for="(item,index) in heightNum" :key="index">{{ index*100 }}</li></ul>
            <ul id="ruleWidth" class="rule-width"><li v-for="(item,index) in widthNum" :key="index">{{ index*100 }}</li></ul>
            <div id="canvasBoxed" class="canvas-box" v-html="newCanvas" />
          </div>
        </div>
      </div>
      <div class="left-box">
        <p class="title-text">拼接图片</p>
        <i class="el-icon-close close" @click="close()" />
        <div class="ctrol-box">
          <div class="ctrol-item">
            <p class="title">画布设置</p>
            <div class="ctrol-body">
              <div class="input-box">
                <p style="width: 56px">宽：</p>
                <el-input v-model="canvasWidthPlaceHoder" :placeholder="canvasWidthPlaceHoder" @keyup.native="canvasWidthPlaceHoder = canvasWidthPlaceHoder.replace(/\D/g,''); canvasWidthPlaceHoder = canvasWidthPlaceHoder>6000?canvasWidthPlaceHoder =6000:canvasWidthPlaceHoder " @blur="ok" @keydown.enter="ok" />
              </div>
              <div class="input-box">
                <p style="width: 56px">高：</p>
                <el-input v-model="canvasHeightPlaceHoder" :placeholder="canvasHeightPlaceHoder" @keyup.native="canvasHeightPlaceHoder = canvasHeightPlaceHoder.replace(/\D/g,''); canvasHeightPlaceHoder = canvasHeightPlaceHoder>10000?canvasHeightPlaceHoder = 10000:canvasHeightPlaceHoder " @blur="ok" @keydown.enter="ok" />
              </div>
            </div>
          </div>
          <div class="ctrol-item">
            <p class="title">画布缩放</p>
            <div class="ctrol-body block">
              <span class="demonstration">- </span>
              <div class="slide-box"><el-slider v-model="value4" :format-tooltip="formatTooltip" @input="sliderFn(value4)" /></div>
              <span class="demonstration">+</span>
            </div>
          </div>
        </div>
        <footer>
          <el-button type="primary" @click="submit()">确定</el-button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PinTu',
  props: {
    pintuImgArr: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: null,
      menuKeys: 0,
      canvas: '',
      dialogVisible: true,
      canvasHeightPlaceHoder: '',
      canvasWidthPlaceHoder: '',
      newImageArr: null,
      percentage: 0,
      headerImage: null,
      value4: 50, // 初始放大倍数(1-100)
      heightNum: 1,
      widthNum: 1,
      newCanvas: '<canvas id="pinTuCanvasId" width="800" height="200" />'
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    formatTooltip(val) {
      return Math.floor(val) + '%'
    },
    sliderFn(val) {
      val = val / 100
      var canvasBoxEl = document.getElementById('canvasBoxPintu')
      canvasBoxEl.style.transform = 'scale(' + val + ',' + val + ')'
    },
    pintuOpen() {
      this.dialogVisible = true
    },
    async init() {
      // this.loading = this.$loading()
      await this.initCanvasSize()
      await this.initCanvas()
      await this.imageTocanvas(this.newImageArr)
      await this.scaleFn()
      // this.loading.close() // 关闭loding图
    },
    // 计算缩放比例加载图片后自动缩放
    scaleFn() {
      const that = this
      return new Promise(function(resolve, reject) {
        const bodysEl = document.getElementById('bodys')
        const canvasBoxedEl = document.getElementById('canvasBoxed')
        const scaleNum = bodysEl.offsetHeight / (canvasBoxedEl.offsetHeight + 100)
        that.value4 = scaleNum * 100
        bodysEl.scrollTop = (canvasBoxedEl.offsetHeight - bodysEl.offsetHeight + 100) / 2
        resolve(scaleNum)
      })
    },
    // 获取图尺寸
    initCanvasSize() {
      var canvasEle = document.getElementById('pinTuCanvasId')
      const that = this
      const imgArr = that.pintuImgArr
      return new Promise(function(resolve, reject) {
        const pintuImgArr = []
        let canvasHeight = 0
        let canvasWidth = 0
        return imgArr.forEach(async function(item, index) {
          const p = await imageObj(item)
          p.top = canvasHeight
          canvasHeight = canvasHeight + p.height
          canvasWidth > p.width ? canvasWidth : canvasWidth = p.width
          pintuImgArr.push(p)
          if (pintuImgArr.length === imgArr.length) {
            that.newImageArr = pintuImgArr
            that.canvasHeightPlaceHoder = canvasHeight
            that.canvasWidthPlaceHoder = canvasWidth
            canvasEle.height = canvasHeight
            canvasEle.width = that.canvasWidthPlaceHoder
            that.heightNum = Math.ceil(canvasHeight / 100)
            that.widthNum = Math.ceil(canvasWidth / 100)
            document.getElementById('canvasBoxed').style.width = that.canvasWidthPlaceHoder + 'px'
            document.getElementById('ruleWidth').style.width = Math.ceil(that.canvasWidthPlaceHoder / 100) * 100 + 'px'
            resolve(pintuImgArr)
          }
        })
      })
      function imageObj(imgurl) {
        return new Promise(function(resolve, reject) {
          const image = new Image()
          image.src = imgurl
          image.onload = function() {
            const imageObj = {
              'url': imgurl,
              'width': image.width * 3 / 2,
              // 'width': image.width,
              'height': image.height,
              'top': 0,
              'left': 0,
              'scaleX': 1,
              'scaleY': 1
            }
            resolve(imageObj)
          }
        })
      }
    },
    // 初始化画布
    initCanvas() {
      const that = this
      return new Promise(function(resolve, reject) {
        // 初始化画板
        that.canvas = new fabric.Canvas('pinTuCanvasId', {
          backgroundColor: '#ffffff',
          preserveObjectStacking: true,
          centeredRotation: true
        })
        resolve(that.canvas)
      })
    },
    // 加载图片到画布
    imageTocanvas(Arr) {
      const that = this
      return new Promise(function(resolve, reject) {
        Arr.forEach(function(item, index) {
          fabric.Image.fromURL(item.url, function(oImg) {
            oImg.cornerStyle = 'circle'
            oImg.cornerStrokeColor = 'red'
            oImg.cornerColor = 'red'
            oImg.cornerSize = 20
            // oImg.width = 100
            // oImg.height = 100
            oImg.scaleX = item.scaleX
            oImg.scaleY = item.scaleY
            that.canvasImgObj = oImg
            oImg.top = item.top
            oImg.left = item.left
            that.canvas.add(oImg).setActiveObject(oImg)
            that.canvas.renderAll()
            resolve(oImg)
          }, { crossOrigin: 'anonymous' })
        })
      })
    },
    // 重新计算图片大小
    resetImageSize() {
      const that = this
      var itemArr = that.canvas.getObjects()
      this.newImageArr = itemArr.map((item, index) => {
        return {
          url: item._element.src,
          width: item.width,
          height: item.height,
          top: item.top,
          left: item.left,
          scaleX: item.scaleX,
          scaleY: item.scaleY
        }
      })
    },
    async ok() {
      const that = this
      this.resetImageSize()
      await reset()
      await this.initCanvas()
      await this.imageTocanvas(this.newImageArr)
      await this.scaleFn()
      document.getElementById('canvasBoxed').style.width = that.canvasWidthPlaceHoder + 'px'
      document.getElementById('ruleWidth').style.width = Math.ceil(that.canvasWidthPlaceHoder / 100) * 100 + 'px'
      function reset() {
        return new Promise(function(resolve, reject) {
          const canvasEle = document.getElementById('pinTuCanvasId')
          canvasEle.remove()
          that.newCanvas = `<canvas id="pinTuCanvasId" width="${that.canvasWidthPlaceHoder}" height="${that.canvasHeightPlaceHoder}" />`
          that.heightNum = Math.ceil(that.canvasHeightPlaceHoder / 100)
          that.widthNum = Math.ceil(that.canvasWidthPlaceHoder / 100)
          that.menuKeys++
          resolve(canvasEle)
        })
      }
    },
    close() {
      this.$emit('closePop', false)
    },
    submit() {
      const pintuBase64 = this.canvas.toDataURL('image/jpeg')
      this.$store.dispatch('canvasMesObjsArrOne', [pintuBase64])
      this.close()
    }
  }
}
</script>

<style scoped lang='scss'>
  #pintu{
    background-color: rgba(0,0,0,0.8);
    position: fixed;
    left:0px;
    top:0px;
    width:100%;
    height:100%;
    z-index: 30;
    display: flex;
    justify-content: center;
    align-items: center;
    .pop-box{
      width: 90%;
      height: 90%;
      padding: 10px;
      display: flex;
      justify-content: center;
      flex-direction: row;
      align-items: center;
      background-color: #ffffff;
      border-radius:8px;
      position: relative;
      .left-box{
        height: 100%;
        width: 20%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        .title-text{
          font-size:18px;
          font-weight:600;
          color:rgba(51,51,51,1);
        }
        .close{
          position: absolute;
          right: 5px;
          top:5px;
        }
        .ctrol-box{
          width: 100%;
          margin-top: 30px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          padding: 0 30px;
          .ctrol-item{
            margin-top: 20px;
            widows: 90%;
            box-sizing: border-box;
            border-radius:2px;
            border:1px solid rgba(232,235,243,1);
            overflow: hidden;
            .title{
              text-align: center;
              padding: 12px 0px;
              box-sizing: border-box;
              background:rgba(242,248,252,1);
              border-bottom:1px solid rgba(232,235,243,1);
              font-weight:400;
              color:rgba(144,147,154,1);
              font-size:14px;
            }
            .ctrol-body{
              padding: 0px 14px 14px 14px;
              box-sizing: border-box;
            }
          }
          .input-box{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            margin-top: 20px;
            p{
              font-size:14px;
              font-weight:400;
              color:rgba(51,51,51,1);
            }
          }
          .block{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            margin-top: 14px;
            .demonstration{
              color: #DCDFE6;
              font-size: 24px;
            }
            .slide-box{
              width: 200px;
              margin: 0 10px;
            }
          }
        }
        footer{
          position: absolute;
          bottom: 10px;
        }
      }
      .right-box{
        height: 100%;
        width: 80%;
        .bodys{
        width: 100%;
        height: 100%;
        overflow: auto;
        background: #E5EDF2;
        border:1px solid rgba(193,202,207,1);
        // /deep/ .canvas-container{
        //   margin: 0 auto;
        // }
        #canvasBoxPintu{
          transform-origin:0;
          margin: 30px;
          padding: 20px;
          position: relative;
          .rule-height{
            position: absolute;
            left: -25px;
            top: 5;
            border-right: 1px solid #C5D3DA;
            li{
              box-sizing: border-box;
              border-top: 1px solid #C5D3DA;
              color: #9CA9B1;
              width: 40px;
              height: 100px;
              // font-size: 26px;
            }
          }
          .rule-width{
            position: absolute;
            left: 20px;
            top: -25px;
            border-bottom: 1px solid #C5D3DA;
            overflow: hidden;
            li{
              color: #9CA9B1;
              float: left;
              box-sizing: border-box;
              border-left: 1px solid #C5D3DA;
              width: 100px;
              height: 40px;
              // font-size: 26px;
            }
          }
          .canvas-box{
            width: auto;
            // background: url(../image/canvas_bg.jpg) repeat;
            // box-shadow:0px 2px 12px 2px rgba(0,0,0,0.5);
          }
          // #pinTuCanvasId{
          //   // background-color: #eeeeee;
          //   background: url(../image/canvas_bg.jpg) repeat;
          //   /*border: 1px solid silver;*/
          //   box-shadow:0px 2px 12px 2px rgba(0,0,0,0.5);
          // }
        }
      }
      }

    }

  }
</style>
