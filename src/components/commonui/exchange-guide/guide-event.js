
  import createGuide from '@/components/commonui/exchange-guide/index.js'

  export default (guideData)=>{
    if(guideData){
      let ver = guideData._v;
      let read = localStorage.getItem(guideData._uid);
      read != ver ? create() : null;
    }
    function create(){
      var vm = createGuide({
        active:{
          stepIdx:0,
          showGuide:true,
          production:true,
        },
        guideData,
        callback: ()=>{
          vm.remove();
        }
      })
    }
  }