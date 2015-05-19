module.exports = require('webrtc-core').bdsft.Model(Settings);

var WebRTC_C = require('webrtc-core').constants;
var Utils = require('webrtc-core').utils;

function Settings(eventbus, debug, configuration, sipstack) {
  var self = {};

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
    visible: {type: 'default'},
    userid: true,
    password: true,
    authenticationUserid: true,
    resolutionType: true,
    localVideoTop: true,
    localVideoLeft: true,
    callHistoryTop: true,
    callHistoryLeft: true,
    callStatsTop: true,
    callStatsLeft: true,
    displayResolutionStandard: true,
    displayResolutionWidescreen: true,
    encodingResolutionStandard: true,
    encodingResolutionWidescreen: true,
    displayResolution: true,
    encodingResolution: true,
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
      }
    },
    bandwidthMed: {
      value: function() {
        return configuration.bandwidthMed || $.cookie('settingsBandwidthMed')
      }
    },
    bandwidthHigh: {
      value: function() {
        return configuration.bandwidthHigh || $.cookie('settingsBandwidthHigh')
      }
    },
    color: {
      value: function() {
        return configuration.getBackgroundColor()
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

  self.updateDisplayResolution = function(){
    self.displayResolution = getResolution("displayResolutionStandard", "displayResolutionWidescreen");
  };
  self.updateDisplayResolutionStandard = self.updateDisplayResolutionWidescreen = function(){
    setResolution(self.displayResolution, "displayResolutionStandard", "displayResolutionWidescreen");
  };
  self.updateEncodingResolution = function(){
    self.encodingResolution = getResolution("encodingResolutionStandard", "encodingResolutionWidescreen");
  };
  self.updateEncodingResolutionStandard = self.updateEncodingResolutionWidescreen = function(){
    setResolution(self.encodingResolution, "encodingResolutionStandard", "encodingResolutionWidescreen");
  };

  self.bindings = {
    'classes': {
        settings: 'visible',
        sipstack: 'registered',
        configuration: 'enableSettings'
    },
    'displayResolution': {
        settings: ['displayResolutionStandard', 'displayResolutionWidescreen']
    },
    'displayResolutionStandard': {
        settings: 'displayResolution'
    },
    'displayResolutionWidescreen': {
        settings: 'displayResolution'
    },
    'encodingResolution': {
        settings: ['encodingResolutionStandard', 'encodingResolutionWidescreen']
    },
    'encodingResolutionStandard': {
        settings: 'encodingResolution'
    },
    'encodingResolutionWidescreen': {
        settings: 'encodingResolution'
    },
  }

  self.init = function() {
    updatePageColor();
  };

  self.listeners = function(databinder, configurationDatabinder, callcontrolDatabinder) {
    databinder.onModelPropChange(['userid', 'password', 'authenticationUserid', 'resolutionType', 'bandwidthLow', 'bandwidthMed', 'bandwidthHigh', 
      'displayResolution', 'encodingResolution'], function(value, name){
      configuration[name] = value;
    });
    callcontrolDatabinder.onModelPropChange('visible', function(visible){
      visible && self.hide();
    });
    configurationDatabinder.onModelPropChange(['userid', 'password', 'authenticationUserid', 'resolutionType', 'bandwidthLow', 'bandwidthMed', 'bandwidthHigh', 
      'displayResolution', 'encodingResolution'], function(value, name){
      self[name] = value;
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