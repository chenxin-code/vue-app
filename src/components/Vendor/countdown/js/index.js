import store from '@/vuex/store';

let instanceTimer;
let life = 0;

const countDownJs = {
  heartbeat: function () {
    life ++

    if (!instanceTimer) {
      instanceTimer = window.setInterval(() => {
        let localTime = parseInt((new Date()).getTime()/1000)
        store.state.severTime.currentTime = localTime + store.state.severTime.jetlag
      }, 1000);
    }
  },
  removeHeartbeat: function () {
    if (life > 0) {
      life --
    }
    if (life == 0) {
      window.clearInterval(instanceTimer)
      instanceTimer = null
    }
  }
};

export default countDownJs
