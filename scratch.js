(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {}

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'}
    }

    ext.output = function(percent, access_token, cb) {
      console.log('sending', percent)
      // var access_token = '8632cdf7594e430744477516d833f3aa0aa645c62477807c44d2f24edd9a2af5'
      $.ajax({
        url: 'https://api-http.littlebitscloud.cc/v3/devices/scratch_test_device/output',
        method: 'post',
        headers: {
          Authorization: 'Bearer ' + access_token
        },
        percent: percent,
        success: function(res,status) {
          console.log('got back ', res, status)
          if ( res.success ) cb()
        }
      })
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
          ['w', 'set cloudBit output to %n percent, with access_token %s', 'output', 100, 'get your access_token from littleBits Cloud Control']
        ]
    }

    // Register the extension
    ScratchExtensions.register('littleBits cloudBit', descriptor, ext)
})({})
