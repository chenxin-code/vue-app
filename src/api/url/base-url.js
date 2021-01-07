const dev = process.env.NODE_ENV !== 'production'
let myUrl='';

if (dev) {
  myUrl = ''
  const urlGetter = require.context('', true, /myUrl.js$/i)
  const keys=urlGetter.keys()
  keys.forEach(item=>{
    const urlData=urlGetter(item);
    myUrl = urlData.default
  })
}

export default myUrl;
