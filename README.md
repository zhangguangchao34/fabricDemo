# 本项目是基于vue2.6 vue-cli3.0 fabric4.0写的关于fabric的项目

## 
```
npm install
```

### 启动项目
```
npm run serve
```

### 打包
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
## 支持功能
#### 1、图片插入；2、拼接图片；3、图片裁剪；4、撤销；5、一键还原6、自由画笔、直线、虚线、箭头放大、缩小、橡皮擦、旋转等功能
![效果图](https://raw.githubusercontent.com/zhangguangchao34/fabricDemo/master/readmeImage/1.jpg)
![效果图](https://raw.githubusercontent.com/zhangguangchao34/fabricDemo/master/readmeImage/2.jpg)
![效果图](https://raw.githubusercontent.com/zhangguangchao34/fabricDemo/master/readmeImage/3.jpg)
![效果图](https://raw.githubusercontent.com/zhangguangchao34/fabricDemo/master/readmeImage/4.jpg)
## fabric 的使用 （官网http://fabricjs.com/）
```
1、安装：npm install fabric
2、vue引用：main.js中
    import Fabric from 'fabric';
    Vue.use(Fabric);
3、.vue组件中加入 <canvas id="canvasId" width="100" height="100"></canvas>
4、创建fabric实例
    this.canvas = new fabric.Canvas('canvasId', {
            preserveObjectStacking: true,
            centeredRotation: true,
            backgroundColor: '#ffffff' // 背景色
          });
现在最基本的fabric创建的画布完成。
```
## 将图片渲染到画布中
### 一下内容的this都是vue的实例 用来获取vue组件中的 data中变量
#### 第一种方法
```
// image可以是URL、base64
var imaged = new fabric.Image(image, {
            cornerStyle: 'circle', // 控制点的样式 为圆
            cornerStrokeColor: 'blue', // 控制点填充颜色 为圆
            cornerColor: 'blue', // 控制点框的颜色
            cornerSize: 13, // 控制点大小
            left, // 距离画布左边距离
            top, // 距离画布上边距离
            angle // 选装角度
            scaleX : // X方向缩放比例
            scaleY : // Y方向缩放比例
          })
          this.canvas.add(imaged)
          this.canvas.renderAll()
```
#### 第二种方法
```
// url 可以是base64 或者链接
fabric.Image.fromURL(url, function(oImg) {
            oImg.cornerStyle = 'circle'
            oImg.cornerStrokeColor = 'red'
            oImg.cornerColor = 'red'
            oImg.cornerSize = 20
            oImg.width = 100
            oImg.height = 100
            oImg.scaleX = item.scaleX
            oImg.scaleY = item.scaleY
            oImg.top = item.top
            oImg.left = item.left
            that.canvas.add(oImg).setActiveObject(oImg)
            that.canvas.renderAll()
            resolve(oImg)
          }, { crossOrigin: 'anonymous' }) // 图片允许跨域
        })
```
## 插入文字
```
this.text = new fabric.Textbox(val, {
            cornerStyle: 'circle', // 控制点样式
            cornerStrokeColor: 'blue',
            cornerColor: 'blue',
            cornerSize: 13,
            left: 10,
            top: 10,
            width: 50,
            borderColor: 'black', // 边框颜色
            fill: 'red', // 文字颜色
            // fontStyle: '', // 文字样式
            // fontFamily: '',
            fontSize: '36',
            fontWeight: '700',
            underline: '',
            hasControls: true, // 是否可控制
            textBackgroundColor: 'yellow' // 背景色
          })
this.canvas.add(text)

// 编辑文字
this.canvas.remove(this.text)
this.text.set('text', '文字内容')
this.text.set('fontWeight', '900')
this.text.set('fontStyle', '')
this.text.set('underline', '')
this.text.set('fontSize', '')
this.text.set('textBackgroundColor', this.fontObj.bgColor)
this.canvas.add(this.text)
```
## 绘制矩形
```
this.rect = new fabric.Rect()
this.canvas.add(this.rect)
```
# fabric总结
#### 实例属性
```
lockMovementX = true; // 禁止水平移动
lockMovementY = true; // 禁止垂直移动
hasRotatingPoint = false; // 无旋转点
hasControls = false; // 元素不显示编辑框
selectable = false; // 元素不可选中

```
#### 实例方法
```
this.canvas.getObjects() // 获取画布中所有实例 返会的是个数组
this.canvas.item(index) // 获取画布中某个实例
this.canvas.add(this.rect) // 向fabric实例中添加矩形实例
this.canvas.remove(this.rect) // 删除矩形实例
```
#### 原型中设置属性（所有新建的实例都将有该属性）
```
fabric.Object.prototype.set({
    borderColor: 'rgba(0,0,0,0.8)',
    cornerColor: 'rgba(0,0,0,0.8)', //激活状态角落图标的填充颜色
    cornerStrokeColor: "", //激活状态角落图标的边框颜色
    borderOpacityWhenMoving: 1,
    borderScaleFactor: 1,
    cornerSize: 8,
    cornerStyle: "circle", //rect,circle
    centeredScaling: false, //角落放大缩小是否是以图形中心为放大原点
    centeredRotation: true, //旋转按钮旋转是否是左上角为圆心旋转
    transparentCorners: false, //激活状态角落的图标是否透明
    rotatingPointOffset: 20, //旋转距旋转体的距离
    originX: "center",
    originY: "center",
    lockUniScaling: false, //只显示四角的操作
    hasRotatingPoint: true, //是否显示旋转按钮
    });

```
## 顺便说一下svg图标的引入 参考https://www.cnblogs.com/luoxuemei/p/12154835.html
### 1、 npm install svg-sprite-loader
#### 配置vue.config.js(在根目录自己个手动创建这个文件)
```
// vue.config.js
module.exports = {
    chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    }
  }
var path = require('path')
function resolve(dir) {
    return path.join(__dirname, './', dir)
}
```
### 2、在src下创建文件夹icons，icon下创建文件夹svg用来放svg图片、index.js、svg.vue
```
// svg.vue

<template>
    <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
        <use :xlink:href="iconName" />
    </svg>
</template>
 
<script>
    export default {
        name: 'SvgIcon',
        props: {
            iconClass: {
                type: String,
                required: true
            },
            className: {
                type: String,
                default: ''
            }
        },
        computed: {
 
            iconName() {
                return `#icon-${this.iconClass}`
            },
            svgClass() {
                if (this.className) {
                    return 'svg-icon ' + this.className
                } else {
                    return 'svg-icon'
                }
            },
            styleExternalIcon() {
                return {
                    mask: `url(${this.iconClass}) no-repeat 50% 50%`,
                    '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
                }
            }
        }
    }
</script>
 
<style scoped>
    .svg-icon {
        width: 1.5em;
        height: 1.5em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
 
    .svg-external-icon {
        background-color: currentColor;
        mask-size: cover!important;
        display: inline-block;
    }
</style>
```
### 3、icons/index.js 
```
index.js
import Vue from 'vue'
import SvgIcon from './svg' // svg组件
// 注册为全局组件
Vue.component('svg-icon', SvgIcon)
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
```
### 4、在main.js中引入 import '@/icons' 然后就svg图标就可以正常使用啦
