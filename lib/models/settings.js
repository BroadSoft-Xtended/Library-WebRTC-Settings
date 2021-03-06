module.exports = require('bdsft-sdk-model')(Settings, {
  config: require('../../js/config.js')
});

var Constants = require('../constants');
var coreConstants = require('webrtc-core').constants;
var Utils = require('webrtc-core').utils;

function Settings(debug, cookieconfig, urlconfig, sipstack, authentication, video) {
  var self = {};

  var getResolution = function(resolution, resolutionType){
    var standards = Constants.standardreverse;
    var widescreens = Constants.widescreenreverse;

    var index = 1;

    if(standards.indexOf(resolution) !== -1) {
      index = standards.indexOf(resolution);
    } else if(widescreens.indexOf(resolution) !== -1){
      index = widescreens.indexOf(resolution);
    } else if(resolution) {
      debug.error(resolution+' not found in standards or widescreen');
      return;
    }

    if(resolutionType === 'standard') {
      return index >= standards.length ? standards[standards.length-1] : standards[index];
    } else {
      return widescreens[index];
    }
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
      self.resolutionType = coreConstants.STANDARD;
    } else if (Utils.containsKey(Constants.WIDESCREEN_RESOLUTIONS, value)) {
      self.resolutionType = coreConstants.WIDESCREEN;
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
      sipstack: ['registered', 'sendVideo', 'receiveVideo']
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
    }
  }

  self.listeners = function(databinder, cookieconfigDatabinder, videoDatabinder, sipstackDatabinder) {
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
    databinder.onViewElChangeListener(['bandwidthLow', 'bandwidthMed', 'bandwidthHigh', 'displayResolution', 'encodingResolution', 
      'displayName', 'enableSelfView', 'hd', 'enableAutoAnswer'
    ], function(value, name) {
      cookieconfig[name] = value;
    });
    databinder.onModelPropChangeListener(['bandwidthLow', 'bandwidthMed', 'bandwidthHigh', 'displayResolution', 'encodingResolution', 
      'displayName', 'enableSelfView', 'hd', 'enableAutoAnswer'
    ], function(value, name) {
      cookieconfig[name] = value;
    });
  };

  return self;
}