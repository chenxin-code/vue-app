/**
 * Created by steven on 2018/5/1.
 */
(function(){function e(a,c,b,f){this.c=a;this.d=c;this.h=b;this.g=f;this.b=e.b++;this.c.a=this.c.a||{};this.c.a[this.b]=this}window.EventWrapper=window.EventWrapper||{};var d=window.EventWrapper;d.addDomListener=function(a,c,b){a.addEventListener?a.addEventListener(c,b,!1):a.attachEvent?a.attachEvent("on"+c,b):a["on"+c]=b;return new e(a,c,b,e.e)};d.addDomListenerOnce=function(a,c,b){return d.j(a,c,function(){d.i(a,c,b);return b.apply(this,arguments)})};d.addListener=function(a,c,b){a.addEventListener(c,
  b);return new e(a,c,b,e.f)};d.addListenerOnce=function(a,c,b){var f=d.k(a,c,function(){d.i(f);return b.apply(this,arguments)});return f};d.clearInstanceListeners=function(a){var c=a.a||{},b;for(b in c)d.removeListener(c[b]);a.a={}};d.clearListeners=function(a,c){var b=a.a||{},f;for(f in b)b[f].d==c&&d.removeListener(b[f])};d.removeListener=function(a){var c=a.c,b=a.d,f=a.h,d=c.a||{},g;for(g in d)d[g].b==a.b&&(a.g==e.e?c.removeEventListener?c.removeEventListener(b,f,!1):c.detachEvent?c.detachEvent("on"+
  b,f):c["on"+b]=null:a.g==e.f&&c.removeEventListener(b,f),delete d[g])};d.trigger=function(a,c){var b=a.a||{},d;for(d in b)if(b[d].d==c){var e=Array.prototype.slice.call(arguments,2);b[d].h.apply(a,e)}};e.b=1;e.e=1;e.f=2})();
