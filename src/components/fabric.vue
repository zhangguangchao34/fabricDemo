<template>
  <div :key="fabricKey" class='VueFabric' id="VueFabric" >
    <div id = "canvasBox">
      <canvas id="canvasId" width="100" height="100"></canvas>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
  import { mapState } from 'vuex';
  import { convertImgToBase64, canvasTobase64 } from '@/untils/common.js';
  export default {
    name: 'VueFabric',
    props: {
      imgObjStr: { // 图片链接
        type: String,
        required: true
      },
      index: { // 图片index
        type: Number,
        required: true
      },
      drawType: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        fabricKey: 1,
        canvas: '',
        zoom: '',
        zoomValue: 1, // 缩放比例
        mouseFrom: {},
        mouseTo: {},
        textbox: null,
        drawWidth: 2, // 笔触宽度
        color: '#000000', // 画笔颜色
        drawingObject: null, // 当前绘制对象
        moveCount: 1, // 绘制移动计数器
        doDrawing: false, // 绘制状态
        canvasImgObj: null, // 当前画布图片对象
        textStyle: {
          fontStyle: '',
          fontWeight: '700',
          underline: true,
          fontSize: 18
        },
        clipObj: { // 裁剪默认数据
          left: 0,
          top: 0,
          fill: 'rgba(0, 0, 0, .2)',
          width: 200,
          height: 200
        },
        canvasWidth: 20,
        canvasHeight: 20,
        operateList: [], // 操作记录
        operateListIndex: 0, // 返回步数
        UseStorageMess: false, // 使用暂存中的数据
        textObj: null // 文字对象
      };
    },
    created () {
    },
    watch: {
      fontObj: {
        handler: function(newVal, oldVal) {
          this.color = newVal.fill
          this.changeText()
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
      this.initFn();
    },
    methods: {
      // 操作栏点击
      myFn(type) {
        var that = this
        that.canvas.selection = false // 取消组选中
        if (!type) {
          that.canDrawing = false
          that.canvas.isDrawingMode = false // 绘画模式关闭
          return
        }
        that.canDrawing = true
        if (type === 'pen') { // 画笔
          that.canvas.freeDrawingBrush.color = that.color // 设置自由绘颜色
          that.canvas.isDrawingMode = true // 绘画模式打开
        } else {
          that.canvas.isDrawingMode = false
          if (type === 'remove') {
            // that.canvas.selection = true
            // that.canvas.skipTargetFind = false
            // that.canvas.selectable = true // 对象选则
          }
        }
      },
      // 初始化前检查内存中是否有缓存
      checkocalStorage () {
        let that = this;
        localForage.getItem(`userId${that.canvasMesObjs.userId}`).then(function (val) {
          if (val && that.drawType !== 'rotate' && that.drawType !== 'clip' && that.drawType !== 'pintu') {
            let keys = `_${that.index}`;
            if (val[keys]) {
              that.operateList = val[keys].operateList;
              that.operateListIndex = val[keys].operateListIndex;
              that.canvasWidth = val[keys].canvasMes.width;
              that.canvasHeight = val[keys].canvasMes.height;
              that.initLocalStorageFn();
            } else {
              that.initFn();
            }
          } else {
            that.initFn();
          }
        });
      },
      // 初始化
      async initFn () {
        this.canvas = '';
        let image = await this.initCanvasSize(this.imgObjStr);
        await this.initCanvas();
        await this.eventInit();
        await this.imageAddCanvas(image);
        this.lockObj(this.canvas);
        // this.imageFn();
      },
      // 初始化画布尺寸
      initCanvasSize (str) {
        let that = this;
        var canvasEle = document.getElementById('canvasId')
        var canvasBoxEle = document.getElementById('canvasBox')
        return new Promise(function(resolve, reject) {
          var imaged = new Image()
          imaged.crossOrigin = 'Anonymous'
          imaged.src = str
          imaged.onload = function() {
            let width = imaged.width
            let height = imaged.height
            if (that.drawType === 'rotateLeft' || that.drawType === 'rotateRight') {
              if (that.canvasMesObjs.rotateAngle % 180) {
                width = imaged.height
                height = imaged.width
              }
            }
            canvasEle.width = width
            canvasEle.height = height
            // canvasBoxEle.style.width = imaged.width + 'px'
            canvasBoxEle.style.height = height + 'px'
            resolve(imaged)
          }
        })
      },
      // 初始化画布
      initCanvas () {
        let that = this;
        return new Promise(function (resolve, reject) {
          that.canvas = new fabric.Canvas('canvasId', {
            preserveObjectStacking: true,
            centeredRotation: true,
            backgroundColor: '#ffffff'
            // selection: false // 取消框选
            // isDrawingMode: true,
            // skipTargetFind: true,
            // selectable: false, //对象选择
            // skipTargetFind: true // 画板元素不能被选中
          });
          // 对fabric.Canvas扩展
          fabric.Canvas.prototype.setZoomByCenter = function (value) {
            this.zoomToPoint(
              new fabric.Point(that.canvas.width / 2, that.canvas.height / 2),
              value
            );
          };
          // that.add();
          that.zoom = that.zoom ? that.zoom : 1;
          that.canvas.freeDrawingBrush.width = that.drawWidth;
          resolve(that.canvas);
        });
      },
      // 画布事件
      eventInit () {
        let that = this;
        return new Promise(function (resolve, reject) {
          // 绑定画板事件
          that.canvas.on('mouse:down', function (options) {
            // console.log('mouse:down-----------------:', options);
            if (options.target.text) {
              that.fontObj.type = 'edit'
              that.$store.dispatch('fontObj', that.fontObj)
              that.textObj = options.target
              that.showAgainText()
            }
            var xy = that.transformMouse(options.e.offsetX, options.e.offsetY);
            that.mouseFrom.x = xy.x;
            that.mouseFrom.y = xy.y;
            that.doDrawing = true;
          });
          that.canvas.on('mouse:move', function (options) {
            if (that.moveCount % 2 && !that.doDrawing) {
              // 减少绘制频率
              return;
            }
            if (options.target) {
              if (options.target.stroke) { // 当目标对象为图形的时候
                return;
              }
            }
            // console.log('mouse:move-----------------:', options);
            that.moveCount++;
            var xy = that.transformMouse(options.e.offsetX, options.e.offsetY);
            that.mouseTo.x = xy.x;
            that.mouseTo.y = xy.y;
            that.drawing();
          });
          that.canvas.on('mouse:up', function (options) {
            var xy = that.transformMouse(options.e.offsetX, options.e.offsetY);
            that.mouseTo.x = xy.x;
            that.mouseTo.y = xy.y;
            // drawing();
            if (options.target) {
              that.operateList.push(JSON.stringify(that.canvas));// 将操作存在记录里
              that.operateListIndex = that.operateList.length - 1;
            }
            that.drawingObject = null;
            that.moveCount = 1;
            that.doDrawing = false;
            // that.changeClip(options);
            // if (that.canvas._objects.length !== that.canvas_objects.length) {
            //
            // }
            // console.log(that.canvas_objects);
            // that.canvas.isDrawingMode = false;
          });
          that.canvas.on('selection:created', function (e) {
            if (that.drawType === 'remove') {
              if (e.target._objects) {
                // 多选删除
                var etCount = e.target._objects.length;
                for (var etindex = 0; etindex < etCount; etindex++) {
                  that.canvas.remove(e.target._objects[etindex]);
                }
              } else {
                // 单选删除
                that.canvas.remove(e.target);
              }
            }
          });
          resolve(true);
        });
      },
      // 将图片加到画布中
      imageAddCanvas (image) {
        let that = this;
        return new Promise(function(resolve, reject) {
          let left = 0
          let top = 0
          let angle = 0
          // 旋转
          if (that.drawType === 'rotateLeft' || that.drawType === 'rotateRight') {
            angle = that.canvasMesObjs.rotateAngle
            angle = (angle % 360 + 360) % 360
            const height = image.height
            const width = image.width
            switch (angle) {
              case 0: left = 0; top = 0; break
              case 90: left = height; top = 0; break
              case 180: left = width; top = height; break
              case 270: left = 0; top = width; break
            }
          }
          var imaged = new fabric.Image(image, {
            cornerStyle: 'circle',
            cornerStrokeColor: 'blue',
            cornerColor: 'blue',
            cornerSize: 13,
            left,
            top,
            angle
            // selectable : false
          })
          // imaged.set('selectable',false)
          that.canvas.add(imaged)
          that.operateList[0] = JSON.stringify(that.canvas) // 将操作存在操作记录里
          that.canvas.renderAll()
          resolve(that.canvas)
        })
      },
      transformMouse (mouseX, mouseY) {
        return { x: mouseX / this.zoom, y: mouseY / this.zoom };
      },
      // 绘制箭头方法
      drawArrow (fromX, fromY, toX, toY, theta, headlen) {
        theta = typeof theta !== 'undefined' ? theta : 30;
        headlen = typeof theta !== 'undefined' ? headlen : 10;
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
          angle1 = (angle + theta) * Math.PI / 180,
          angle2 = (angle - theta) * Math.PI / 180,
          topX = headlen * Math.cos(angle1),
          topY = headlen * Math.sin(angle1),
          botX = headlen * Math.cos(angle2),
          botY = headlen * Math.sin(angle2);
          var arrowX = fromX - topX,
            arrowY = fromY - topY;
          var path = ' M ' + fromX + ' ' + fromY;
          path += ' L ' + toX + ' ' + toY;
          arrowX = toX + topX;
          arrowY = toY + topY;
          path += ' M ' + arrowX + ' ' + arrowY;
          path += ' L ' + toX + ' ' + toY;
          arrowX = toX + botX;
          arrowY = toY + botY;
          path += ' L ' + arrowX + ' ' + arrowY;
          return path;
      },
      // 绘画方法
      drawing () {
        let that = this;
        if (that.textbox) {
          // 退出文本编辑状态
          that.textbox.exitEditing();
          that.textbox = null;
        }
        if (that.drawingObject) {
          that.canvas.remove(that.drawingObject);
        }
        var canvasObject = null;
        switch (that.drawType) {
          case 'arrow': // 箭头
            canvasObject = new fabric.Path(that.drawArrow(that.mouseFrom.x, that.mouseFrom.y, that.mouseTo.x, that.mouseTo.y, 30, 30), {
              stroke: that.color,
              fill: 'rgba(255,255,255,0)',
              strokeWidth: that.drawWidth
            });
            break;
          case 'line': // 直线
            canvasObject = new fabric.Line([that.mouseFrom.x, that.mouseFrom.y, that.mouseTo.x, that.mouseTo.y], {
              stroke: that.color,
              strokeWidth: that.drawWidth
            });
            break;
          case 'dottedline': // 虚线
            canvasObject = new fabric.Line([that.mouseFrom.x, that.mouseFrom.y, that.mouseTo.x, that.mouseTo.y], {
              strokeDashArray: [3, 1],
              stroke: that.color,
              strokeWidth: that.drawWidth
            });
            break;
          case 'circle': // 正圆
            let left = that.mouseFrom.x,
            top = that.mouseFrom.y;
            var radius = Math.sqrt((that.mouseTo.x - left) * (that.mouseTo.x - left) + (that.mouseTo.y - top) * (that.mouseTo.y - top)) / 2;
            canvasObject = new fabric.Circle({
              left: left,
              top: top,
              stroke: that.color,
              fill: 'rgba(255, 255, 255, 0)',
              radius: radius,
              strokeWidth: that.drawWidth
            });
            break;
          case 'ellipse': // 椭圆
            var left1 = that.mouseFrom.x,
              top1 = that.mouseFrom.y;
            var radius = Math.sqrt((that.mouseTo.x - left1) * (that.mouseTo.x - left1) + (that.mouseTo.y - top) * (that.mouseTo.y - top)) / 2;
            canvasObject = new fabric.Ellipse({
              left: left1,
              top: top1,
              stroke: that.color,
              fill: 'rgba(255, 255, 255, 0)',
              originX: 'center',
              originY: 'center',
              rx: Math.abs(left1 - that.mouseTo.x),
              ry: Math.abs(top1 - that.mouseTo.y),
              strokeWidth: that.drawWidth
            });
            break;
          case 'square': // TODO:正方形（后期完善）
            break;
          case 'rectangle': // 长方形
            var path =
              'M ' +
              that.mouseFrom.x +
              ' ' +
              that.mouseFrom.y +
              ' L ' +
              that.mouseTo.x +
              ' ' +
              that.mouseFrom.y +
              ' L ' +
              that.mouseTo.x +
              ' ' +
              that.mouseTo.y +
              ' L ' +
              that.mouseFrom.x +
              ' ' +
              that.mouseTo.y +
              ' L ' +
              that.mouseFrom.x +
              ' ' +
              that.mouseFrom.y +
              ' z';
            canvasObject = new fabric.Path(path, {
              left: left,
              top: top,
              stroke: that.color,
              strokeWidth: that.drawWidth,
              fill: 'rgba(255, 255, 255, 0)'
            });
            // 也可以使用fabric.Rect
            break;
          case 'rightangle': // 直角三角形
            var path = 'M ' + that.mouseFrom.x + ' ' + that.mouseFrom.y + ' L ' + that.mouseFrom.x + ' ' + that.mouseTo.y + ' L ' + that.mouseTo.x + ' ' + that.mouseTo.y + ' z';
            canvasObject = new fabric.Path(path, {
              left: left,
              top: top,
              stroke: that.color,
              strokeWidth: that.drawWidth,
              fill: 'rgba(255, 255, 255, 0)'
            });
            break;
          case 'equilateral': // 等边三角形
            var height = that.mouseTo.y - that.mouseFrom.y;
            canvasObject = new fabric.Triangle({
              top: that.mouseFrom.y,
              left: that.mouseFrom.x,
              width: Math.sqrt(Math.pow(height, 2) + Math.pow(height / 2.0, 2)),
              height: height,
              stroke: that.color,
              strokeWidth: that.drawWidth,
              fill: 'rgba(255,255,255,0)'
            });
            break;
          case 'isosceles':
            break;
          case 'text':
            break;
          case 'remove':
            break;
          default:
            break;
        }
        that.addCanvasObjFn(canvasObject);
      },
      // 向画布中添加对象
      addCanvasObjFn (canvasObject) {
        if (canvasObject) {
          // canvasObject.index = getCanvasObjectIndex();
          this.canvas.add(canvasObject); // .setActiveObject(canvasObject)
          this.drawingObject = canvasObject;
        }
      },
      // 操作记录
      operateListFn (type) {
        let that = this;
        let index = '',
          svgUrl = '';
        if (type === 'left' && this.operateListIndex > 0) {
          index = this.operateListIndex - 1;
          this.operateListIndex = index;
          svgUrl = this.operateList[index];
        }
        if (type === 'right' && this.operateListIndex < this.operateList.length - 1) {
          index = this.operateListIndex + 1;
          this.operateListIndex = index;
          svgUrl = this.operateList[index];
        }
        that.canvas.loadFromJSON(svgUrl);
        that.lockObj(that.canvas);
      },
      // 放大缩小
      zoomFn (type) {
        let canvasBoxEl = document.getElementById('canvasBox');
        // let canvasEl = document.getElementById('canvasId');
        if (type === 'fangda') {
          if (this.zoomValue < 3) {
            this.zoomValue = this.zoomValue + 0.1;
            // console.log(canvasBoxEl.style.width);
            // canvasBoxEl.style.width = canvasEl.width * this.zoomValue + 'px';
            // canvasBoxEl.style.height = canvasEl.height * this.zoomValue + 'px';
          }
        }
        if (type === 'suoxiao' && this.zoomValue > 0.1) {
          this.zoomValue = this.zoomValue - 0.1;
        }
        // let divCanvasId = document.getElementById('canvasId');
        // let width = divCanvasId.getBoundingClientRect().width; // 获取div放大(缩小)后的宽度
        // let height = divCanvasId.getBoundingClientRect().height; // 获取div放大(缩小)后的高度
        // this.canvas.getObjects()[0]._element.width = width;
        // this.canvas.getObjects()[0]._element.height = height;
        // this.canvas.setZoom(this.zoomValue);
        // this.canvas.width = width;
        // this.canvas.height = height;
        // console.log(width);
        // console.log(this.canvas.getObjects());
        canvasBoxEl.style.transform = 'scale(' + this.zoomValue + ',' + this.zoomValue + ')';
        this.operateList.push(JSON.stringify(this.canvas));// 将操作存在记录里
      },
      // 锁定canvas中对象
      lockObj (arr) {
        // arr canvas对象
        setTimeout(function () {
          arr.getObjects().forEach(function (item, index) {
            item.lockMovementX = true; // 禁止水平移动
            item.lockMovementY = true; // 禁止垂直移动
            item.hasRotatingPoint = false; // 无旋转点
            item.hasControls = false; // 编辑框
            item.selectable = false; // 不可选中
          });
        }, 0);
      },
      // 插入文字
      canvasText(val) {
        if (!val) {
          val = '请输入内容'
        }
        if (this.fontObj.type === 'edit') {
          this.textObj = null
          this.fontObj.content = ''
          this.fontObj.type = 'add'
          this.$store.dispatch('fontObj', this.fontObj)
          return
        }
        if (this.fontObj.type === 'add') {
          var canvasEle = document.getElementById('VueFabric')
          var that = this
          that.textbox = new fabric.Textbox(val, {
            cornerStyle: 'circle',
            cornerStrokeColor: 'blue',
            cornerColor: 'blue',
            cornerSize: 13,
            left: canvasEle.scrollLeft + 10,
            top: canvasEle.scrollTop + 10,
            width: 50,
            borderColor: that.fontObj.fill,
            fill: that.fontObj.fill,
            fontStyle: that.fontObj.fontStyle,
            // fontFamily: that.fontObj.italic,
            fontSize: that.fontObj.fontSize,
            fontWeight: that.fontObj.fontWeight,
            underline: that.fontObj.underline,
            hasControls: true,
            textBackgroundColor: that.fontObj.bgColor
          })
          that.canvas.add(that.textbox)
          return
        }
      },
      // 更改文字
      changeText() {
        if (!this.textObj) { return }
        this.canvas.remove(this.textObj)
        this.textObj.set('text', this.fontObj.content)
        this.textObj.set('fontWeight', this.fontObj.fontWeight)
        this.textObj.set('fontStyle', this.fontObj.fontStyle)
        this.textObj.set('underline', this.fontObj.underline)
        this.textObj.set('fontSize', this.fontObj.fontSize)
        this.textObj.set('fill', this.fontObj.fill)
        this.textObj.set('textBackgroundColor', this.fontObj.bgColor)
        this.canvas.add(this.textObj)
      },
      // 文本框内容回显
      showAgainText() {
        if (!this.textObj) { return }
        this.fontObj.fontWeight = this.textObj.fontWeight
        this.fontObj.fontStyle = this.textObj.fontStyle
        this.fontObj.underline = this.textObj.underline
        this.fontObj.fontSize = this.textObj.fontSize
        this.fontObj.fill = this.textObj.fill
        this.fontObj.bgColor = this.textObj.textBackgroundColor
        this.fontObj.content = this.textObj.text
        this.$store.dispatch('fontObj', this.fontObj)
      },
      // 上传图片
      async upLoadImage (base64) {
        let image = await loadImage(base64);
        await this.imageAddCanvas(image);
        function loadImage (str) {
          return new Promise(function (resolve, reject) {
            let imaged = new Image();
            imaged.crossOrigin = 'Anonymous';
            imaged.src = str;
            imaged.onload = function () {
              resolve(imaged);
            };
          });
        }
      },
      // 当前画布转化base64
      canvasBase64 () {
        return canvasTobase64(this.canvas);
      },
      // 保存当前画布到vuex中的canvasMesObjsArr
      saveNowCanvas () {
        let index = this.index;
        let url = canvasTobase64(this.canvas);
        this.$store.dispatch('canvasMesObjsArr', {index, url});
      }
    },
  };
</script>
<style lang='scss' scoped>
  .VueFabric{
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 10px;
    overflow: auto;
    #canvasBox{
      height: auto;
      width: auto;
      /*margin: 0 auto;*/
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
