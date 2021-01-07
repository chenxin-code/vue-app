import axios from 'axios'

const tools = {
  remoteLoading: false,
  ipAddress: '',
  getRemoteIP: function () {
    if (this.ipAddress) {
      return this.ipAddress
    }
    if (this.remoteLoading) {
      return this.ipAddress
    }
    this.remoteLoading = true
    this.requestRemoteIP()
    // this.jsGetRemoteIP()
  },
  requestRemoteIP: function () {
    axios.get('https://icanhazip.com').then((res) => {
      let data = res.data
      data = data.trim(data+'')
      this.ipAddress = data
    }).catch((error) => {
      console.log(error)
      this.jsGetRemoteIP()
    });
  },
  jsGetRemoteIP: function () {
    let url = 'https://pv.sohu.com/cityjson?ie=utf-8'
    const headcontent = document.head
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url
    script.onerror = () => {
      headcontent.removeChild(script)
    };
    script.onload = () => {
      setTimeout(() => {
        if (window.returnCitySN) {
          this.ipAddress = window.returnCitySN["cip"] || ''
        }
        headcontent.removeChild(script)
      }, 1000)
    };
    headcontent.appendChild(script);
  }
}

export default tools
