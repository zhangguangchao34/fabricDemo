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
# 支持功能
#### 1、图片插入；2、拼接图片；3、图片裁剪；4、撤销；5、一键还原6、自由画笔、直线、虚线、箭头放大、缩小、橡皮擦、旋转等功能
```
![Image text](https://github.com/zhangguangchao34/fabricDemo/blob/master/readmeImage/1.jpg)
![Image text](https://github.com/zhangguangchao34/fabricDemo/blob/master/readmeImage/2.jpg)
![Image text](https://github.com/zhangguangchao34/fabricDemo/blob/master/readmeImage/3.jpg)
![Image text](https://github.com/zhangguangchao34/fabricDemo/blob/master/readmeImage/4.jpg)
```
## 顺便说一下svg图标的引入 参考https://www.cnblogs.com/luoxuemei/p/12154835.html
### npm install svg-sprite-loader
### 配置vue.config.js(在根目录自己个手动创建这个文件)
```
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
### 在src下创建文件夹icons，icon下创建文件夹svg用来放svg图片、index.js、svg.vue
```
svg.vue 创建svg组件

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
### icons/index.js 
```
import Vue from 'vue'
import SvgIcon from './svg' // svg组件
// 注册为全局组件
Vue.component('svg-icon', SvgIcon)
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
```
### 然后就svg图标就可以正常使用啦
