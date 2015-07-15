/* jQuery SSE plugin
https://github.com/byjg/jquery-sse
0.1.1 */
!function(n){function t(n){n.type="event",n.instance=new EventSource(n._url),n.instance.successCount=0,n.instance.onmessage=n._settings.onMessage,n.instance.onopen=function(t){0==n.instance.successCount++&&n._settings.onOpen(t)},n.instance.onerror=function(){event.target.readyState==EventSource.CLOSED&&n._settings.onError(event)};for(var t in n._settings.events)n.instance.addEventListener(t,n._settings.events[t],!1)}function e(n){n.type="ajax",n.instance={successCount:0,id:null,retry:3e3,data:"",event:""},s(n)}function s(t){t.instance&&n.ajax({url:t._url,method:"GET",headers:{"Last-Event-ID":t.instance.id},success:function(n,e,i){if(t.instance){0==t.instance.successCount++&&t._settings.onOpen();var a=n.split("\n");t.instance.data="";var c=0;for(var r in a){var o=a[r].split(":");switch(o[0]){case"":o[1]||1!=c++||(eventMessage={data:t.instance.data,lastEventId:t.instance.id,origin:"http://"+i.getResponseHeader("Host"),returnValue:!0},t.instance.event&&t._settings.events[t.instance.event]?t._settings.events[t.instance.event](eventMessage):t._settings.onMessage(eventMessage),t.instance.data="",t.instance.event="",c=0);break;case"retry":c=0,t.instance.retry=parseInt(o[1].trim());break;case"id":c=0,t.instance.id=o[1].trim();break;case"event":c=0,t.instance.event=o[1].trim();break;case"data":c=0,t.instance.data+=(""!=t.instance.data?"\n":"")+o[1].trim();break;default:c=0}}setTimeout(function(){s(t)},t.instance.retry)}},error:t._settings.onError})}n.extend({SSE:function(s,i){var a={instance:null,type:null},c={onOpen:function(){},onEnd:function(){},onError:function(){},onMessage:function(){},options:{},events:{}};return n.extend(c,i),a._url=s,a._settings=c,a._start=a.start,a.start=function(){return this.instance?!1:(!window.EventSource||this._settings.options.forceAjax?e(this):t(this),!0)},a.stop=function(){return this.instance?(!window.EventSource||this._settings.options.forceAjax||this.instance.close(),this._settings.onEnd(),this.instance=null,this.type=null,!0):!1},a}})}(jQuery);

(function(ext) {
    ext._shutdown = function() {}
    ext._getStatus = function() {
      return { status: 2, msg: 'Ready' }
    }

    ext.output = function(cloudBit, percent, access_token, cb) {
      $.ajax({
        url: 'https://api-http.littlebitscloud.cc/v3/devices/'
              + cloudBit
              + '/output?access_token='
              + access_token,
        method: 'post',
        percent: percent,
        success: function(res,status) {
          // console.log('got back ', res, status)
          if ( res.success ) cb()
        },
        error: function(err) {
          console.log('error sending output:', err)
        }
      })
    }

    ext.input = function(cloudBit, access_token, cb) {
      var sse = $.SSE('https://api-http.littlebitscloud.cc/v3/devices/'
                        + cloudBit
                        + '/input?access_token='
                        + access_token,
        {
          // onOpen: function(e){
        	// 	console.log("Open", e);
        	// },
        	// onEnd: function(e){
        	// 	console.log("End", e);
        	// },
        	onError: function(e) {
        		console.log("Could not connect");
        	},
          onMessage: function(e) {
            var p = JSON.parse(e.data).percent
            console.log("got", p)
            cb(p)
          }
        })
        console.log('starting input')
        sse.start()
    }

    var descriptor = {
        blocks: [
          ['w', 'set cloudBit %s output to %n percent, with access_token %s', 'output', 'ID', 100, 'get your access_token from littleBits Cloud Control'],
          ['R', 'get cloudBit %s input value, with access_token %s', 'output', 'ID', 'get your access_token from littleBits Cloud Control']
        ]
    }

    ScratchExtensions.register('littleBits cloudBit', descriptor, ext)
})({})
