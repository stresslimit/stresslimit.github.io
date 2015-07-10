(function(ext) {
    ext._shutdown = function() {}
    ext._getStatus = function() {
      return { status: 2, msg: 'Ready' }
    }

    ext.output = function(cloudBit, percent, access_token, cb) {
      $.ajax({
        url: 'https://api-http.littlebitscloud.cc/v3/devices/' + cloudBit + '/output',
        method: 'post',
        headers: {
          Authorization: 'Bearer ' + access_token
        },
        percent: percent,
        success: function(res,status) {
          // console.log('got back ', res, status)
          if ( res.success ) cb()
        }
      })
    }

    var descriptor = {
        blocks: [
          ['w', 'set cloudBit %s output to %n percent, with access_token %s', 'output', 'ID', 100, 'get your access_token from littleBits Cloud Control']
        ]
    }

    ScratchExtensions.register('littleBits cloudBit', descriptor, ext)
})({})
