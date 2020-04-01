<template>
  <div class="container">
    <div class="bodys">
      <div class="tool-div-left">
        <div class="tool-div-left-inier">
          <ul id="toolsul" class="tools">
            <div v-if="fontStyleOpen" class="font-box">
              <vue-font />
            </div>
            <li
              v-for="(item,index) in toolArr"
              :key="index"
              :class="item.select?'active':''"
              @click="clickFn(item,index)"
            >
              <svg-icon :icon-class="item.iconClass" />
            </li>
          </ul>
        </div>
      </div>
      <div class="canvasDiv">
        <vue-fabric :key="menuKey" ref="canvas" :imgObjStr='imgUrl' :index='imgIndex' :drawType='drawType'  v-on:canvasObj = 'canvasObjs($event)'></vue-fabric>
        <vue-clip v-if='clipOpen' @newImageUrl = newImageUrl($event) @clipOpen = close($event) ref="clips" :url="imgUrl"></vue-clip>
        <vue-pintu v-if="pintuOpen" ref="pintu" :pintu-img-arr="imgArr" @closePop="pintuOpen = false"/>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left">
        <mybtn :type="'text'" style="padding:8px 9px" @click.native="uploadFn()">
          <input id="file" style="display: none" type="file" @change="uploadFned()">
          <span style="color:rgba(253, 177, 0, 1);font-size:18px;line-height: 15px;">
            <svg-icon icon-class="charutupian" />&nbsp;
          </span>
          插入图片
        </mybtn>
        <mybtn :type="'text'" style="padding:8px 9px" @click.native="pintuOpened">
          <span style="color:rgba(57, 151, 255, 1);font-size:18px;line-height: 15px;">
            <svg-icon icon-class="pintu" />&nbsp;
          </span>
          拼图
        </mybtn>
        <div class="btn-box">
          <span
            class="svg-btn"
            :class="imgIndex===0?'leftBlack':'leftHeight'"
            @click="btnClick('left')"
          />
          <div>
            <span class="now-num">{{ imgIndex+1 }}</span>/
            <span>{{ imgArr.length }}</span>
          </div>
          <span
            class="svg-btn"
            :class="imgIndex+1 === imgArr.length?'rightBlack':'rightHeight'"
            @click="btnClick('right')"
          />
        </div>
        <mybtn :type="'text'" style="padding:8px 9px" @click.native="goOrCome('left')">
          <span style="color:rgba(255, 255, 255, 0.72);font-size:18px;line-height: 15px;">
            <svg-icon icon-class="cexiao" />&nbsp;
          </span>
          上一步
        </mybtn>
        <mybtn :type="'text'" style="padding:8px 9px" @click.native="goOrCome('right')">
          <span style="color:rgba(255, 255, 255, 0.72);font-size:18px;line-height: 15px;">
            <svg-icon icon-class="shangyibu" />&nbsp;
          </span>
          下一步
        </mybtn>
        <mybtn :type="'text'" style="padding:8px 9px" @click.native="resetImage()">
          <span style="color:rgba(255, 255, 255, 0.72);font-size:18px;line-height: 15px;">
            <svg-icon icon-class="yijianhuanyuan" />&nbsp;
          </span>
          一键还原
        </mybtn>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import { mapState } from 'vuex';
  import VueFabric from '@/components/fabric.vue';
  import VueClip from '@/components/clip';
  import VuePintu from '@/components/pinTu';
  import VueFont from '@/components/font';
  export default {
    name: 'demo',
    components: {
      VueFabric,
      VueClip,
      VuePintu,
      VueFont
    },
    data () {
      return {
        fontStyleOpen: false,
        // 加载过来的图片
        imgArr: null,
        menuKey: 1,
        clipOpen: false,
        pintuOpen: false,
        imgIndex: 0,
        toolArr: [
          // {
          //   iconClass: 'huaban',
          //   type: 'huaban',
          //   select: false
          // },
          {
            iconClass: 'huabi',
            type: 'pen',
            select: false
          },
          {
            iconClass: 'wenzi',
            type: 'text',
            select: false
          },
          {
            iconClass: 'zhixian',
            type: 'line',
            select: false
          },
          {
            iconClass: 'xuxian',
            type: 'dottedline',
            select: false
          },
          {
            iconClass: 'jiantou',
            type: 'arrow',
            select: false
          },
          {
            iconClass: 'juxing',
            type: 'rectangle',
            select: false
          },
          {
            iconClass: 'yuan',
            type: 'circle',
            select: false
          },
          {
            iconClass: 'tuoyuan',
            type: 'ellipse',
            select: false
          },
          {
            iconClass: 'sanjiao',
            type: 'equilateral',
            select: false
          },
          // {
          //   iconClass: 'zhijiao',
          //   type: 'rightangle',
          //   select: false
          // },
          {
            iconClass: 'xiangpi',
            type: 'remove',
            select: false
          },
          {
            iconClass: 'caijian',
            type: 'clip',
            select: false
          },
          {
            iconClass: 'fangda',
            type: 'fangda',
            select: false
          },
          {
            iconClass: 'suoxiao',
            type: 'suoxiao',
            select: false
          },
          {
            iconClass: 'xuanzuan',
            type: 'rotateLeft',
            select: false
          },
          {
            iconClass: 'rightXuanZhuan',
            type: 'rotateRight',
            select: false
          }
        ],
        imgUrl: '', // 当前图片url
        drawType: '' // 绘画类型
      };
    },
    created () {
      const that = this
      that.imgArr = that.canvasMesObjs.imageArr
      that.imgUrl = that.canvasMesObjs.imageArr[0]
    },
    watch: {
      // 监控canvasMesObjs变化
      canvasMesObjs: {
        handler: function(newVal, oldVal) {
          if (newVal.imageArr.length === 1) {
              this.imgIndex = 0
              this.imgUrl = newVal.imageArr[0]
          } else {
            this.imgIndex = newVal.activityIdex
            this.imgUrl = newVal.imageArr[newVal.activityIdex]
          }
          this.imgArr = newVal.imageArr
          this.menuKey++
          console.log(newVal)
        },
        deep: true
      }
    },
    computed: {
      ...mapState({
        canvasMesObjs: 'canvasMesObjs',
        fontObj: 'fontObj'
      })
    },
    mounted () {
    },
    methods: {
      clickFn(faitem, index) {
        var that = this
        const canvasMesObjs = that.canvasMesObjs
        that.drawType = faitem.type
        if (faitem.type === 'clip') {
          that.imgUrl = that.$refs.canvas.canvasBase64()
          that.clipOpen = true
        }
        if (faitem.type === 'rotateLeft') {
          canvasMesObjs.rotateAngle -= 90
          this.$store.dispatch('canvasMesObjsRotateAngle', canvasMesObjs.rotateAngle)
        }
        if (faitem.type === 'rotateRight') {
          canvasMesObjs.rotateAngle += 90
          this.$store.dispatch('canvasMesObjsRotateAngle', canvasMesObjs.rotateAngle)
        }
        if (faitem.type === 'text') {
          // 输入文字
          this.fontStyleOpen = !this.fontStyleOpen
          if (this.fontStyleOpen) {
            this.$refs.canvas.canvasText()
          } else {
            this.fontObj.type = 'add'
            this.$store.dispatch('fontObj', this.fontObj)
          }
        }
        if (faitem.type === 'fangda') {
          // 放大
          this.$refs.canvas.zoomFn('fangda')
        }
        if (faitem.type === 'suoxiao') {
          // 缩小
          this.$refs.canvas.zoomFn('suoxiao')
        }
        this.toolArr.forEach((item, indexSun) => {
          if (indexSun === index) {
            item.select = !item.select
            if (item.select) {
              // 选中
              this.$refs.canvas.myFn(item.type)
            } else {
              // 取消选中
              this.$refs.canvas.myFn(null)
            }
          } else {
            item.select = false
          }
        })
      },
      // 上传图片
      uploadFn () {
        let file = document.getElementById('file');
        file.click();
      },
      // 上传图片
      uploadFned () {
        let that = this;
        var files = document.getElementById('file');
        let file = files.files[0];
        let reg = /(png|jpg|gif|jpeg)$/;
        if (!reg.test(file.type)) {
          this.$message.error('请选择（.png|.jpg|.gif|.jpeg）文件！');
          return;
        }
        if (file.size > 1024 * 1024) {
          this.$message.error('请选择小与1M的文件！');
          return;
        }
        let r = new FileReader();
        r.readAsDataURL(file, 'UTF-8');
        r.onload = () => { // 读取操作完成回调方法
          that.$refs.canvas.upLoadImage(r.result);
          files.value = null;
        };
      },
      newImageUrl (url) {
        this.imgUrl = url;
      },
      close (val) {
        this.clipOpen = val;
      },
      // 打开拼图弹窗
      pintuOpened () {
        this.$refs.canvas.saveNowCanvas();
        this.pintuOpen = true;
        this.drawType = 'pintu';
      },
      // canvas子组件传来的当前图片
      canvasObjs (obj) {
        this.imgUrl = obj;
      },
      // 下一张图片
      btnClick (type) {
        if (type === 'left' && this.imgIndex > 0) {
          this.imgIndex--;
        }
        if (type === 'right' && this.imgIndex < this.imgArr.length - 1) {
          this.imgIndex++;
        }
        this.$store.dispatch('activityIdex', this.imgIndex); // 更新canvasMesObjs中的activityIdex
        this.imgUrl = this.imgArr[this.imgIndex].url;
        this.$refs.canvas.saveNowCanvas(); // 更新canvasMesObjsArr
      },
      // 一键还原
      resetImage(){
        window.location.reload()
      },
      // 上一步、下一步
      goOrCome (type) {
        this.$refs.canvas.operateListFn(type);
      }
    }
  };
</script>

<style lang='scss' scoped>
  .container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background:linear-gradient(143deg,rgba(10,45,91,1) 0%,rgba(9,14,36,1) 100%);
    .bodys{
      width: 100%;
      height: 92%;
      display: flex;
      justify-content: center;
      flex-direction: row;
      .tool-div-left{
        position: absolute;
        top:10px;
        left: 10px;
        z-index: 5;
        box-sizing: border-box;
        height: auto;
        width:70px;
        background:rgba(255,255,255,0.15);
        box-shadow:0px 2px 12px 0px rgba(0,0,0,0.05);
        border-radius:4px;
        .tools{
          display: flex;
          justify-content: center;
          flex-direction: column;
          .font-box {
            z-index: 50;
            position: absolute;
            top: 55px;
            left: 78px;
            width: 210px;
            height: auto;
            padding-bottom: 5px;
            background:rgba(45,49,68,1);
            box-shadow: 0px 2px 8px 0px rgba(19, 68, 113, 0.09);
          &::before {
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border: 6px solid rgba(45, 49, 68, 1);
            border-bottom-color: transparent;
            border-left-color: transparent;
            border-top-color: transparent;
            /*left: 50%;*/
            margin-left: -12px;
            top: 13px;
          }
        }
          li{
            cursor: pointer;
            font-size: 24px;
            text-align: center;
            color: rgba(255,255,255,0.4);
          }
          li:hover{
            cursor: pointer;
            color: rgba(0, 162, 255, 1);
          }
          li:active{
            cursor: pointer;
            color: rgba(0, 162, 255, 1);
          }
          .active{
            color: rgba(0, 162, 255, 1);
          }
        }
      }
      .canvasDiv {
        box-sizing: border-box;
        margin-left: 110px;
        width: 95%;
        height: 100%;
        padding-right: 50px;
        overflow: auto;
      }
    }
    .footer{
      height:8%;
      background:rgba(255,255,255,0.1);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      bottom: 0px;
      .footer-left{
        flex: 5;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn-box {
          margin: 0px 15px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 200px;
          height: 40px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.34);
          .leftBlack {
            background: url("./image/leftblack@2x.png") no-repeat;
          }
          .leftHeight {
            background: url("./image/rightHeight@2x.png") no-repeat;
            transform: rotate(180deg);
          }
          .leftHeight:hover {
            background: url("./image/rightHeightHover@2x.png") no-repeat;
            transform: rotate(180deg);
            background-size: 100%;
          }
          .rightBlack {
            background: url("./image/leftblack@2x.png") no-repeat;
            transform: rotate(180deg);
          }
          .rightHeight {
            background: url("./image/rightHeight@2x.png") no-repeat;
          }
          .rightHeight:hover {
            background: url("./image/rightHeightHover@2x.png") no-repeat;
            background-size: 100%;
          }
          .svg-btn {
            height: 20px;
            width: 20px;
            background-size: 100%;
            cursor: pointer;
          }
          span.now-num {
            color: #ffffff;
            // font-size:18px;
          }
          i {
            cursor: pointer;
          }
        }
        .icon-refres{
          font-size: 28px;
        }
      }
    }
    .hide {
      display: none;
    }
    .icon-tools {
      display: inline-block;
      width: 28px;
      height: 28px;
    //   background-image: url("../assets/tools-28.png");
      background-repeat: no-repeat;
      margin-top: 10px;
    }
  }
</style>
