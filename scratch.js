(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {}

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'}
    }

    ext.output = function(percent, cb) {
      console.log('sending', percent)
      var access_token = '8632cdf7594e430744477516d833f3aa0aa645c62477807c44d2f24edd9a2af5'
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

    ext.get_temp = function(location, callback) {
        // Make an AJAX call to the Open Weather Maps API
        $.ajax({
              url: 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&units=imperial',
              dataType: 'jsonp',
              success: function( weather_data ) {
                  // Got the data - parse it and return the temperature
                  temperature = weather_data['main']['temp']
                  callback(temperature)
              }
        })
    }

    ext.wait_random = function(callback) {
        wait = Math.random()
        console.log('Waiting for ' + wait + ' seconds')
        window.setTimeout(function() {
            callback()
        }, wait*1000)
    }

    ext.power = function(base, exponent) {
        return Math.pow(base, exponent)
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
          ['w', 'set cloudBit output to %n percent', 'output', 100],
          ['r', '%n ^ %n', 'power', 2, 3],
          ['w', 'wait for random time', 'wait_random'],
          ['R', 'current temperature in city %s', 'get_temp', 'Boston, MA']
        ]
    }

    // Register the extension
    ScratchExtensions.register('littleBits Test', descriptor, ext)
})({})
