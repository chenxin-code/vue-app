let textArea
// 判断是不是ios端
function isOS() {
  return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}
//创建文本元素
function createTextArea(text) {
  textArea = document.createElement('textArea')
  textArea.value = text
  document.body.appendChild(textArea)
}
//选择内容
function selectText() {
  var range,selection
  if (isOS()) {
    range = document.createRange()
    range.selectNodeContents(textArea)
    selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    textArea.setSelectionRange(0, 999999)
  } else {
    textArea.select()
  }
}
//复制到剪贴板
function copyToClipboard(callback) {
  try {
    if (document.execCommand("Copy")) {
      callback && callback(true)
    } else {
      callback && callback(false)
    }
  } catch (err) {
    callback && callback(false)
  }
  document.body.removeChild(textArea)
}

function Clipboard(text, callback) {
  createTextArea(text)
  selectText()
  copyToClipboard(callback)
}
export default Clipboard
