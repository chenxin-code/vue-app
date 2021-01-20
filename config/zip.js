let fs = require('fs')
let path = require('path')

let archiver = require('archiver')

let output = fs.createWriteStream(resolve('../app.zip'))
let archive = archiver('zip')

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes')
  console.log('压缩完成.')
  process.exit(0)
})

archive.on('error', function () {
  console.log('压缩失败.')
  process.exit(1)
})

archive.pipe(output)
archive.directory(resolve('../app'), 'app')
archive.finalize()

function resolve(file) {
  return path.join(__dirname, file)
}