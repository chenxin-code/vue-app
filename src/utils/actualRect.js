

function actual (target,method) {


  var configs = {
    absolute: false,
    clone: false,
    includeMargin: false,
    display: 'block'
  };

  var fix, restore;
  var tmp = [];
  var style = '';
  var hiddenArr;


  fix = function () {
    // get all hidden parents
    let arr = [];
    getParentNode(target,arr);
    arr.push(target);
    hiddenArr = arr.filter(function (el) {
      return getStyle(el,"display") === 'none';
    });
    style += 'visibility: hidden !important; display: ' + configs.display + ' !important; ';

    if (configs.absolute === true) style += 'position: absolute !important; ';

    // save the origin style props
    // set the hidden el css to be got the actual value later
    hiddenArr.forEach((el,index)=>{
      // Save original style. If no style was set, attr() returns undefined
      var thisStyle = el.getAttribute('style');
      tmp.push(thisStyle);
      // Retain as much of the original style as possible, if there is one
      el.setAttribute('style', thisStyle ? thisStyle + ';' + style : style);
    })
  };

  restore = function () {
    // restore origin style values
    hiddenArr.forEach(function (el,i) {
      var _tmp = tmp[i];

      if (_tmp === undefined) {
        el.removeAttribute('style');
      } else {
        el.setAttribute('style', _tmp);
      }
    });
  };


  fix();
  // get the actual value with user specific methed
  // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
  // configs.includeMargin only works for 'outerWidth' and 'outerHeight'

  var actual = 0;
  if(method == 'width'){
    actual = target.clientWidth;
  }else if(method == 'height'){
    actual = target.clientHeight;
  }

  restore();
  // IMPORTANT, this plugin only return the value of the first element
  return actual;
}

function getParentNode(target,arr) {
  if(target && target.parentElement){
    arr.push(target.parentNode);
    getParentNode(target.parentElement,arr);
  }
}

function getStyle(el, styleName) {
  return el.style[styleName] ? el.style[styleName] : el.currentStyle ? el.currentStyle[styleName] : window.getComputedStyle(el, null)[styleName];
}


export  default actual

