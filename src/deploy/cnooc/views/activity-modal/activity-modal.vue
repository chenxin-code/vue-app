<template>
	<div>
		<transition name="fade-overlay">
      <div class="activity-popup" v-if="isShowActModal">
        <div class="activity-modal" :style="{backgroundImage: 'url('+ actModal.backgroundPic +')'}">
          <div class="scroll-c" :style="{ paddingTop: actModal.awardTop + 'px' }">
            <div class="content">
              <div
                class="coupon"
                v-for="(item, index) in actModal.receiveSurveyConfModels"
                :key="index"
                :style="{ backgroundImage: 'url('+ item.awardImgUrl +')'}"
              >
                <div class="left">
                  <div v-if="item.receiveType === 10">
                    <p class="amount">{{ item.couFaceValue }}</p>
                    <p class="award-name">{{ item.awardName }}</p>
                  </div>
                </div>
                <div class="right">
                  <p class="name">{{ item.awardName }}</p>
                  <p class="time">{{ validityPeriod(item) }}</p>
                </div>
                <div class="num">
                  <span class="tip">x</span>
                  {{ item.awardNum ? item.awardNum : 1 }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="receive-btn"
            :style="{backgroundImage: 'url('+ actModal.btnPic +')'}"
            @click="receiveClick(actModal.id)"
          ></div>
          <img
            src="../../assets/images/close.png"
            alt
            class="close-btn"
            @click="isShowActModal = false"
          />
        </div>
        <div class="activity-overlay"></div>
      </div>
    </transition>
	</div>
</template>
<script>
	export default {
		props: {
			stationCode: {
				type: [String, Number],
				required: false,
				default: '',
			}
		},
		data() {
			return {
				isShowActModal: false,
				actModal: {
	        title: ""
	      }
			}
		},
		watch: {},
		mounted() {},
		methods: {
			// 获取领取调查问券列表
	    queryUserConfig() {
	      if (!this.$store.state.refuelStation.stationCode) {
	      	return false;
	      }
	      let params = {
	        stationCode: this.$store.state.refuelStation.stationCode
	      };
	      // let params = {
	      // 	stationCode: 1001002003001022,
	      // }
        this.$STLoading.open();
	      this.$http.post("/app/json/survey/getUserConfigByOuCode", params).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            if (data.data.id) {
              this.actModal = data.data;
              setTimeout(() => {
                this.isShowActModal = true;
              }, 1500);
            }
          } else {
            this.$STLoading.close();
            this.$Toast(data.info);
          }
        }).catch(err => {
          this.$STLoading.close();
          this.$Toast(err);
        });
	    },
	    // 领取
	    receiveClick(activityId) {
	      this.$Loading.open();
	      this.$http.post("/app/json/survey/receiveAward", {
	        token: this.$store.state.login.token,
	        stationCode: this.$store.state.refuelStation.stationCode,
	        activityId: activityId
	      }).then(res => {
	        let data = res.data;
	        if (data.status == 0) {
	          if (data.data.mktAwardModelList.length == 0) {
	            this.$Toast("领取失败！");
	          } else {
	            this.$Toast("领取成功！");
	            this.isShowActModal = false;
	          }
	        } else {
	          this.$Toast(data.info);
	        }
	        this.$Loading.close();
	      }).catch(err => {
	        this.$Loading.close();
	        this.$Toast(err);
	      });
	    },
	    // 处理领取电子券时间
	    validityPeriod(item) {
	      if (item.startTime) {
	        return item.startTime + "至" + item.endTime;
	      } else if (item.awardDays) {
	        return "有效期" + item.awardDays + "天";
	      } else {
	        return "";
	      }
	    },
		}
	}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
// 模太框遮罩层动画
.fade-overlay-enter-active, .fade-overlay-leave-active {
  transition: opacity 0.3s;
}

.fade-overlay-enter, .fade-overlay-leave-to {
  opacity: 0;
}

.activity-popup {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2000;

  .activity-modal {
    background-size: cover;
    position: absolute;
    left: 18px;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 0 0 16px 16px;
    z-index: 4000;

    .scroll-c {
      padding: 0 12px 5px;
      overflow-y: hidden;
    }

    .content {
      margin-top: 5px;
      max-height: 298px;
      overflow-y: auto;

      .coupon {
        display: flex;
        background-size: 100% 100%;
        color: #005d9c;
        box-sizing: border-box;
        margin-bottom: 10px;
        height: 90px;
        position: relative;

        .left {
          width: 90px;
          font-size: 35px;
          font-weight: 700;
          text-align: center;
          padding-left: 15px;
          box-sizing: border-box;

          .amount {
            font-weight: 700;
            padding-top: 15px;
          }

          .award-name {
            padding-top: 4px;
            font-size: 13px;
          }
        }

        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 17px;
          line-height: 20px;
          padding: 10px;
          padding-right: 12px;

          .name {
            ellipse-2();
            padding-bottom: 3px;
          }

          .time {
            padding-top: 3px;
            font-size: 13px;
            color: #000;
          }
        }

        .num {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #000;

          .tip {
            margin-right: 2px;
          }
        }
      }
    }

    .receive-btn {
      height: 50px;
      padding: 0 25px;
      background-size: 100% 100%;
      text-align: center;
      margin: 0 40px 25px;
    }

    .close-btn {
      display: block;
      width: 28px;
      position: absolute;
      left: 50%;
      bottom: -40px;
      transform: translateX(-50%);
    }
  }

  .activity-overlay {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    position: relative;
    z-index: 3999;
  }
}
</style>
