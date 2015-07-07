module.exports = require('webrtc-core').bdsft.Model(Settings, {
  config: require('../../js/config.js')
});

var Constants = require('webrtc-core').constants;
var Utils = require('webrtc-core').utils;

function Settings(debug, cookieconfig, urlconfig, sipstack, authentication) {
  var self = {};

  var getResolution = function(resolution, resolutionType){
    var index = Constants.standard.indexOf(resolution) !== -1 && Constants.standard.indexOf(resolution) || 
                Constants.widescreen.indexOf(resolution) !== -1 && Constants.widescreen.indexOf(resolution);
    return Constants[resolutionType][index];
  };

  self.updateResolutions = function(resolutionType){
    if(resolutionType) {
      self.displayResolution = getResolution(self.displayResolution, resolutionType);
      self.encodingResolution = getResolution(self.encodingResolution, resolutionType);
    }
  };

  self.updateResolutionType = function(value){
    if(!value) {
      self.resolutionType = undefined;
    } else if (Utils.containsKey(Constants.STANDARD_RESOLUTIONS, value)) {
      self.resolutionType = Constants.STANDARD;
    } else if (Utils.containsKey(Constants.WIDESCREEN_RESOLUTIONS, value)) {
      self.resolutionType = Constants.WIDESCREEN;
    } else {
      throw Error('no resolution type for ' + value);
    }
  };

  self.updateDisplayResolutionStandard = function(value){
    if(Utils.containsKey(Constants.STANDARD_RESOLUTIONS, value)) {
      self.displayResolutionStandard = value;
    }
  };
  self.updateDisplayResolutionWidescreen = function(value){
    if(Utils.containsKey(Constants.WIDESCREEN_RESOLUTIONS, value)) {
      self.displayResolutionWidescreen = value;
    }
  };
  self.updateEncodingResolutionStandard = function(value){
    if(Utils.containsKey(Constants.STANDARD_RESOLUTIONS, value)) {
      self.encodingResolutionStandard = value;
    }
  };
  self.updateEncodingResolutionWidescreen = function(value){
    if(Utils.containsKey(Constants.WIDESCREEN_RESOLUTIONS, value)) {
      self.encodingResolutionWidescreen = value;
    }
  };

  self.props = ['classes', 'visible', 'displayName', 'displayResolutionStandard', 'displayResolutionWidescreen',
    'encodingResolutionStandard', 'encodingResolutionWidescreen', 'resolutionType', 'displayResolution', 'encodingResolution', 'enableSelfView',
    'hd', 'bandwidthLow', 'bandwidthMed', 'bandwidthHigh', 'enableAutoAnswer'];

  self.bindings = {
    classes: {
      settings: ['visible', 'enableSettings', 'hd', 'resolutionType'],
      sipstack: 'registered',
      urlconfig: 'view'
    },
    enableSettings: {
      urlconfig: 'enableSettings'
    },
    displayName: {
      cookieconfig: 'displayName',
      urlconfig: 'displayName'
    },
    resolutions: {
      settings: 'resolutionType'
    },
    resolutionType: {
      settings: ['displayResolution', 'displayResolutionStandard', 'displayResolutionWidescreen', 
      'encodingResolution', 'encodingResolutionStandard', 'encodingResolutionWidescreen']
    },
    displayResolution: {
      settings: ['displayResolutionStandard', 'displayResolutionWidescreen']
    },
    displayResolutionStandard: {
      settings: 'displayResolution'
    },
    displayResolutionWidescreen: {
      settings: 'displayResolution'
    },
    encodingResolution: {
      settings: ['encodingResolutionStandard', 'encodingResolutionWidescreen']
    },
    encodingResolutionStandard: {
      settings: 'encodingResolution'
    },
    encodingResolutionWidescreen: {
      settings: 'encodingResolution'
    },
    cookieconfig: {
      settings: ['bandwidthLow', 'bandwidthMed', 'bandwidthHigh', 'displayResolution', 'encodingResolution', 
      'displayName', 'enableSelfView', 'hd', 'enableAutoAnswer']
    }
  }

  self.listeners = function(databinder, cookieconfigDatabinder, callcontrolDatabinder, videoDatabinder, sipstackDatabinder) {
    sipstackDatabinder.onModelPropChange(['bandwidthLow', 'bandwidthMed', 'bandwidthHigh', 'enableAutoAnswer', 'encodingResolution'], function(value, name) {
      self[name] = value;
    });
    videoDatabinder.onModelPropChange(['displayResolution', 'enableSelfView'], function(value, name) {
      self[name] = value;
    });
    cookieconfigDatabinder.onModelPropChange(['bandwidthLow', 'bandwidthMed', 'bandwidthHigh',
      'displayResolution', 'encodingResolution', 'displayName', 'enableSelfView', 'hd', 'size', 'enableAutoAnswer'
    ], function(value, name) {
      self[name] = value;
    });
    callcontrolDatabinder.onModelPropChange('visible', function(visible) {
      visible && self.hide();
    });
  };

  return self;
}