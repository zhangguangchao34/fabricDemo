// 图片链接转化成base64
export function convertImgToBase64(url, callback) {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function() {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      // var dataURL = canvas.toDataURL('image/png');
      var dataURL = canvas.toDataURL('image/jpeg')
      callback.call(this, dataURL)
      canvas = null
    }
    img.src = url
  }
// canvas转化成base64
export function canvasTobase64(canvas) {
    const width = canvas.width
    const height = canvas.height
    const URL = canvas.toDataURL({
      format: 'jpeg',
      quality: 1,
      multiplier: 1,
      left: 0,
      top: 0,
      width: width,
      height: height
    })
    return URL
  }