export default {
  getLocation() {
    return new Promise((resolve, reject) => {
      my.getLocation({
        success: resolve,
        fail: reject
      })
    })
  },
  chooseImage() {
    return new Promise((resolve, reject) => {
      my.chooseImage({
        sourceType: ['camera', 'album'],
        count: 1, // 默认9
        sizeType: ['compressed'],
        success: (result) => {
          let apFilePath = result.apFilePathsV2 || result.apFilePaths || [];
          if (typeof apFilePath === 'string') {
            try {
              apFilePath = JSON.parse(apFilePath);
            } catch (e) {}
          }

          if (!apFilePath.length || !/^https?:/.test(apFilePath[0])) {
            return;
          }
          let image = new Image();
          image.crossOrigin = 'anonymous';
          image.onload = function() {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.height = image.height;
            canvas.width = image.width;
            context.drawImage(image, 0, 0);
            try {
              var dataURL = canvas.toDataURL('image/png');
              resolve(dataURL)
              console.log('支付宝选择图片', dataURL)
            } catch (e) {
              resolve(apFilePath[0])
              console.log(e)
            }
            canvas = null;
          }
          image.src = apFilePath[0]
        },
        fail: reject
      })
    })
  }
}
