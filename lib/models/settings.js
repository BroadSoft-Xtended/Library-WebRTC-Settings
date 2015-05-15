module.exports = require('webrtc-core').bdsft.Model(Settings);

var WebRTC_C = require('webrtc-core').constants;
var Utils = require('webrtc-core').utils;

function Settings(eventbus, debug, configuration, sipstack) {
  var self = {};

  var updateClasses = function(){
    self.classes = [configuration.enableSettings ? 'enableSettings' : '', 
    self.visible ? 'settings-shown' : 'settings-hidden', 
    sipstack.registered ? 'registered' : ''];
  };

  var getResolution = function(resolutionStandard, resolutionWidescreen) {
    // console.log('self.resolutionType : '+self.resolutionType);
    if (self.resolutionType === WebRTC_C.STANDARD) {
      return self[resolutionStandard];
    } else if (self.resolutionType === WebRTC_C.WIDESCREEN) {
      return self[resolutionWidescreen];
    } else {
      return false;
    }
  };

  var setResolutionType = function(resolution) {
    if (Utils.containsKey(WebRTC_C.STANDARD_RESOLUTIONS, resolution)) {
      self.resolutionType = WebRTC_C.STANDARD;
    } else if (Utils.containsKey(WebRTC_C.WIDESCREEN_RESOLUTIONS, resolution)) {
      self.resolutionType = WebRTC_C.WIDESCREEN;
    } else {
      debug('no resolution type for ' + resolution);
    }
  };

  var setResolution = function(resolution, resolutionStandard, resolutionWidescreen) {
    if (Utils.containsKey(WebRTC_C.STANDARD_RESOLUTIONS, resolution)) {
      self.resolutionType = WebRTC_C.STANDARD;
      self[resolutionStandard] = resolution;
    } else if (Utils.containsKey(WebRTC_C.WIDESCREEN_RESOLUTIONS, resolution)) {
      self.resolutionType = WebRTC_C.WIDESCREEN;
      self[resolutionWidescreen] = resolution;
    } else {
      debug('no resolution type for ' + resolution);
    }
  };

  var updatePageColor = function() {
    var color = configuration.getBackgroundColor();
    debug('updating page color : ' + color);
    Utils.getElement('body').css('backgroundColor', color || '');
  };

  var isStarted = false;
  var _changed = false;
  var changed = function() {
    if (!isStarted) {
      self.reload();
    } else {
      _changed = true;
    }
  };

  self.props = {
    _type: 'cookie',
    classes: {type: 'default'},
    visible: {type: 'default', onSet: function(){
      updateClasses();
    }},
    userid: {
      onSet: function(value) {
        configuration.userid = value;
      }
    },
    password: {
      onSet: function(value) {
        configuration.password = value;
      },
    },
    authenticationUserid: {
      onSet: function(value) {
        configuration.authenticationUserid = value;
      },
    },
    resolutionType: {
      onSet: function(value) {
        configuration.resolutionType = value;
      },
    },
    localVideoTop: true,
    localVideoLeft: true,
    callHistoryTop: true,
    callHistoryLeft: true,
    callStatsTop: true,
    callStatsLeft: true,
    displayName: {
      value: function() {
        return configuration.sipDisplayName || $.cookie('settingsDisplayName')
      }
    },
    selfViewDisabled: {
      value: function() {
        return $.cookie('settingsSelfViewDisable') === "true"
      }
    },
    hd: {
      value: function() {
        return $.cookie('settingsHd') === "true"
      }
    },
    bandwidthLow: {
      value: function() {
        return configuration.bandwidthLow || $.cookie('settingsBandwidthLow')
      },
      onSet: function(value) {
        configuration.bandwidthLow = value;
      }
    },
    bandwidthMed: {
      value: function() {
        return configuration.bandwidthMed || $.cookie('settingsBandwidthMed')
      },
      onSet: function(value) {
        configuration.bandwidthMed = value;
      }
    },
    bandwidthHigh: {
      value: function() {
        return configuration.bandwidthHigh || $.cookie('settingsBandwidthHigh')
      },
      onSet: function(value) {
        configuration.bandwidthHigh = value;
      }
    },
    color: {
      value: function() {
        return configuration.getBackgroundColor()
      }
    },
    displayResolutionStandard: {
      onSet: function(value) {
        // console.log('displayResolutionStandard : onSet : '+value);
        if(self.resolutionType === WebRTC_C.STANDARD) {
          configuration.displayResolution = value;          
        }
      },
      value: function() {
        return configuration.displayResolution;
      }
    },
    displayResolutionWidescreen: {
      onSet: function(value) {
        // console.log('displayResolutionWidescreen : onSet : '+value);
        if(self.resolutionType === WebRTC_C.WIDESCREEN) {
          configuration.displayResolution = value;          
        }
      },
      value: function() {
        return configuration.displayResolution;
      }
    },
    encodingResolutionStandard: {
      onSet: function(value) {
        // console.log('encodingResolutionStandard : onSet : '+value);
        if(self.resolutionType === WebRTC_C.STANDARD) {
          configuration.encodingResolution = value;          
        }
      },
      value: function() {
        // console.log('encodingResolutionStandard : ', configuration.encodingResolution);
        return configuration.encodingResolution;
      }
    },
    encodingResolutionWidescreen: {
      onSet: function(value) {
        // console.log('encodingResolutionWidescreen : onSet : '+value);
        if(self.resolutionType === WebRTC_C.WIDESCREEN) {
          configuration.encodingResolution = value;          
        }
      },
      value: function() {
        return configuration.encodingResolution;
      }
    },
    // TODO - look into better handle resolution properties 
    displayResolution: {
      get: function() {
        return getResolution("displayResolutionStandard", "displayResolutionWidescreen");
      },
      set: function(resolution) {
        // console.log('displayResolution : set : '+resolution);
        configuration.displayResolution = resolution;
        setResolution(resolution, "displayResolutionStandard", "displayResolutionWidescreen");
        $.cookie('settingsDisplayResolution', resolution);
      },
      value: function() {
        return configuration.displayResolution;
      }
    },
    encodingResolution: {
      get: function() {
        return getResolution("encodingResolutionStandard", "encodingResolutionWidescreen");
      },
      set: function(resolution) {
        // console.log('encodingResolution : set : '+resolution);
        configuration.encodingResolution = resolution;
        setResolution(resolution, "encodingResolutionStandard", "encodingResolutionWidescreen")
        $.cookie('settingsEncodingResolution', resolution);
      },
      value: function() {
        return configuration.encodingResolution;
      }
    },
    size: {
      value: function() {
        return configuration.size || $.cookie('settingsSize')
      }
    },
    autoAnswer: {
      value: function() {
        var value = configuration.enableAutoAnswer !== undefined ? configuration.enableAutoAnswer : $.cookie('settingsAutoAnswer') === "true";
        return value;
      }
    },
    windowPosition: {
      get: function() {
        return ".localVideo" + "-" + self.localVideoTop + "-" + self.localVideoLeft + "|" +
          ".callHistory" + "-" + self.callHistoryTop + "-" + self.callHistoryLeft + "|" +
          ".callStats" + "-" + self.callStatsTop + "-" + self.callStatsLeft;
      },
      set: function(val) {}
    }
  };

  self.init = function() {
    updatePageColor();
  };

  self.listeners = function(configurationDatabinder, sipstackDatabinder) {
    configurationDatabinder.onModelPropChange('enableSettings', function(){
      updateClasses();
    });
    sipstackDatabinder.onModelPropChange('registered', function(){
      updateClasses();
    });
    configurationDatabinder.onModelChange(function(name, value){
      self[name] = value;
    });
    eventbus.on("viewChanged", function(e) {
      if(e.view === 'settings') {
        self.visible = e.visible;
        updateClasses();
      }
    });
    eventbus.on("ended", function() {
      isStarted = false;
      if (_changed) {
        self.reload();
      }
    });
    eventbus.on("started", function() {
      isStarted = true;
    });
  };

  self.reload = function() {
    location.reload(0);
  };
  self.save = function() {
    self.persist();
    changed();
  };
  self.signIn = function() {
    self.persist();
    eventbus.signIn();
  };
  self.signOut = function() {
    eventbus.signOut();
    self.clearConfigurationCookies();
  };
  self.resetLayout = function() {
    self.encodingResolution = WebRTC_C.DEFAULT_RESOLUTION_ENCODING;
    self.displayResolution = WebRTC_C.DEFAULT_RESOLUTION_DISPLAY;
  };
  self.clearConfigurationCookies = function() {
    $.removeCookie('settingsDisplayName');
    $.removeCookie('settingsUserid');
    $.removeCookie('settingsAuthenticationUserid');
    $.removeCookie('settingsPassword');
  };
  self.clearConfiguration = function() {
    self.displayName = null;
    self.userid = null;
    self.authenticationUserid = null;
    self.password = null;
  };
  self.clear = function() {
    for (var name in self.props) {
      self[name] = null;
    }
  };
  self.persist = function() {
    for (var name in self.props) {
      self[name] = self[name];
    }
  };

  return self;
}