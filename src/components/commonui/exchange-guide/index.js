/**
 * Created by steven on 2019/1/11.
 */
import Vue from 'vue';
import store from '@/vuex/store.js'
import guideoverlay from './guide-overlay'

const GuideOverlay = Vue.extend(guideoverlay);

export default function createGuide(propsData){
  // 请注意，在实例化extends组件构造器时，传入属性必须是propsData、而不是props哦
  var instance = new GuideOverlay({propsData});
  instance.$store = store;
  instance.$mount();
  document.body.appendChild(instance.$el);

  instance.remove = () => {
    document.body.removeChild(instance.$el);
    instance.$destroy();
  }

  return instance;
}
