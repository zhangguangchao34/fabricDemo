<template>
  <div id="demo" v-if="panel">
    <!-- 遮罩层 -->
    <div class="father" >
      <div class="container">
        <div id="cropper" style="margin-top:1%;margin-left: 1%;margin-right: 1%;height: 85%;margin-bottom: 1%">
          <img id="image" :src="url" alt="Picture">
        </div>
        <div>
          <div style="float: right;margin-right: 1%">
            <el-button icon="el-icon-zoom-out" @click="zoom(-1)" size="mini" circle></el-button>
            <el-button icon="el-icon-zoom-in" @click="zoom(1)" size="mini" circle></el-button>
            <el-button icon="el-icon-refresh" @click="rotate" size="mini" circle></el-button>
            <el-button type="success" icon="el-icon-check" @click="crop" size="mini" circle></el-button>
            <el-button type="danger" icon="el-icon-close" @click="closeClip" size="mini" circle></el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {canvasTobase64} from '@/untils/common.js';
import Cropper from 'cropperjs';
  export default {
    name: 'clip',
    props: {
      url: {
        type: String,
        required: true
      }
    },
    components: {

    },
    data () {
      return {
        headerImage: '',
        picValue: '',
        cropper: '',
        croppable: false,
        panel: true,
        current: 0,
        percentage: 0
      };
    },
    mounted () {
      // 初始化这个裁剪框
      var self = this;
      var image = document.getElementById('image');
      this.cropper = new Cropper(image, {
        aspectRatio: 0, // 裁剪框比例 0 为自由裁剪
        viewMode: 2,
        checkCrossOrigin: true, // 是否检查跨域 默认true
        autoCropArea: 0.98, // 裁剪框与被裁的比例
        zoomOnWheel: false, // 是否允许通过鼠标滚轮来缩放图片
        background: true, // 是否在容器上显示网格背景
        rotatable: true, // 是否允许旋转图片
        ready: function () {
          self.croppable = true;
        }
      });
    },
    methods: {
      open () {
        this.panel = true;
      },
      // 旋转
      rotate () {
        this.current = (this.current + 90) % 360;
        this.cropper.rotate(this.current);
      },
      // 缩放
      zoom (num) {
        num = num || 1;
        this.cropper.zoom(num);
      },
      closeClip () {
        this.$emit('clipOpen', false);
      },
      crop () {
        if (!this.croppable) {
          return;
        }
        var croppedCanvas = this.cropper.getCroppedCanvas();
        // 方形
        this.headerImage = canvasTobase64(croppedCanvas);
        let mes = this.headerImage;
        let indexed = this.$store.state.canvasMesObjs.activityIdex;
        this.$store.dispatch('canvasMesObjsArr', { index: indexed, url: mes })
        this.closeClip();
      }
    }
  };
</script>

<style>
  *{
    margin: 0;
    padding: 0;
  }
  .father{
    background-color: rgba(0,0,0,0.8);
    position: fixed;
    left:0px;
    top:0px;
    width:100%;
    height:100%;
    z-index: 33;
  }
  .i{
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  #demo .show {
    border: 1px dashed #d9d9d9;
    border-radius: 10%;
    width: 100px;
    height: 100px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
    text-align: center;
    outline: none;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  #demo .container {
    z-index: 99;
    height: 500px;
    width: 700px;
    position: fixed;
    /*padding-top: 60px;*/
    left: 35%;
    top: 20%;
    background-color: white;
  }
  #demo #image {
    max-width: 100%;

  }
  /* .cropper-view-box,.cropper-face {
     border-radius: 100%; 圆形截图设置
   }*/
  /*!
   * Cropper.js v1.0.0-rc
   * https://github.com/fengyuanchen/cropperjs
   *
   * Copyright (c) 2017 Fengyuan Chen
   * Released under the MIT license
   *
   * Date: 2017-03-25T12:02:21.062Z
   */
  .cropper-container {
    font-size: 0;
    line-height: 0;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    direction: ltr;
    -ms-touch-action: none;
    touch-action: none
  }

  .cropper-container img {
    /* Avoid margin top issue (Occur only when margin-top <= -height) */
    display: block;
    min-width: 0 !important;
    max-width: none !important;
    min-height: 0 !important;
    max-height: none !important;
    width: 100%;
    height: 100%;
    image-orientation: 0deg
  }
  .cropper-wrap-box,
  .cropper-canvas,
  .cropper-drag-box,
  .cropper-crop-box,
  .cropper-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .cropper-wrap-box {
    overflow: hidden;
  }
  .cropper-drag-box {
    opacity: 0;
    background-color: #fff;
  }
  .cropper-modal {
    opacity: .5;
    background-color: #000;
  }
  .cropper-view-box {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    outline: 1px solid #39f;
    outline-color: rgba(51, 153, 255, 0.75);
  }

  .cropper-dashed {
    position: absolute;
    display: block;
    opacity: .5;
    border: 0 dashed #eee
  }
  .cropper-dashed.dashed-h {
    top: 33.33333%;
    left: 0;
    width: 100%;
    height: 33.33333%;
    border-top-width: 1px;
    border-bottom-width: 1px
  }
  .cropper-dashed.dashed-v {
    top: 0;
    left: 33.33333%;
    width: 33.33333%;
    height: 100%;
    border-right-width: 1px;
    border-left-width: 1px
  }
  .cropper-center {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0;
    height: 0;
    opacity: .75
  }
  .cropper-center:before,
  .cropper-center:after {
    position: absolute;
    display: block;
    content: ' ';
    background-color: #eee
  }
  .cropper-center:before {
    top: 0;
    left: -3px;
    width: 7px;
    height: 1px
  }
  .cropper-center:after {
    top: -3px;
    left: 0;
    width: 1px;
    height: 7px
  }
  .cropper-face,
  .cropper-line,
  .cropper-point {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    opacity: .1;
  }
  .cropper-face {
    top: 0;
    left: 0;
    background-color: #fff;
  }
  .cropper-line {
    background-color: #39f
  }
  .cropper-line.line-e {
    top: 0;
    right: -3px;
    width: 5px;
    cursor: e-resize
  }
  .cropper-line.line-n {
    top: -3px;
    left: 0;
    height: 5px;
    cursor: n-resize
  }
  .cropper-line.line-w {
    top: 0;
    left: -3px;
    width: 5px;
    cursor: w-resize
  }
  .cropper-line.line-s {
    bottom: -3px;
    left: 0;
    height: 5px;
    cursor: s-resize
  }
  .cropper-point {
    width: 5px;
    height: 5px;

    opacity: .75;
    background-color: #39f
  }
  .cropper-point.point-e {
    top: 50%;
    right: -3px;
    margin-top: -3px;
    cursor: e-resize
  }
  .cropper-point.point-n {
    top: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize
  }
  .cropper-point.point-w {
    top: 50%;
    left: -3px;
    margin-top: -3px;
    cursor: w-resize
  }
  .cropper-point.point-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: s-resize
  }
  .cropper-point.point-ne {
    top: -3px;
    right: -3px;
    cursor: ne-resize
  }
  .cropper-point.point-nw {
    top: -3px;
    left: -3px;
    cursor: nw-resize
  }
  .cropper-point.point-sw {
    bottom: -3px;
    left: -3px;
    cursor: sw-resize
  }
  .cropper-point.point-se {
    right: -3px;
    bottom: -3px;
    width: 20px;
    height: 20px;
    cursor: se-resize;
    opacity: 1
  }
  @media (min-width: 768px) {
    .cropper-point.point-se {
      width: 15px;
      height: 15px
    }
  }
  @media (min-width: 992px) {
    .cropper-point.point-se {
      width: 10px;
      height: 10px
    }
  }
  @media (min-width: 1200px) {
    .cropper-point.point-se {
      width: 5px;
      height: 5px;
      opacity: .75
    }
  }
  .cropper-point.point-se:before {
    position: absolute;
    right: -50%;
    bottom: -50%;
    display: block;
    width: 200%;
    height: 200%;
    content: ' ';
    opacity: 0;
    background-color: #39f
  }
  .cropper-invisible {
    opacity: 0;
  }
  .cropper-bg {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
  }
  .cropper-hide {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
  }
  .cropper-hidden {
    display: none !important;
  }
  .cropper-move {
    cursor: move;
  }
  .cropper-crop {
    cursor: crosshair;
  }
  .cropper-disabled .cropper-drag-box,
  .cropper-disabled .cropper-face,
  .cropper-disabled .cropper-line,
  .cropper-disabled .cropper-point {
    cursor: not-allowed;
  }
</style>
