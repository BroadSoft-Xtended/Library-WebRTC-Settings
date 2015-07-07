module.exports = require('webrtc-core').bdsft.View(SettingsView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
});

var WebRTC_C = require('webrtc-core').constants;
var Utils = require('webrtc-core').utils;
var Constants = require('../constants');

function SettingsView(options, debug, sound, settings, authenticationView) {
  var self = {};

  self.model = settings;

  var updateRowVisibility = function() {
    self.enableAutoAnswerRow.toggleClass('hidden', options.hasOwnProperty("enableAutoAnswer"));
    self.enableSelfViewRow.toggleClass('hidden', options.hasOwnProperty("enableSelfView"));
    self.hdRow.toggleClass('hidden', options.hasOwnProperty("hd"));
    self.resolutionRow.toggleClass('hidden', options.hasOwnProperty("displayResolution") && options.hasOwnProperty("encodingResolution"));
    self.displayResolutionRow.toggleClass('hidden', options.hasOwnProperty("displayResolution"));
    self.encodingResolutionRow.toggleClass('hidden', options.hasOwnProperty("encodingResolution"));
    self.resolutionTypeRow.toggleClass('hidden', options.hasOwnProperty("displayResolution") || options.hasOwnProperty("encodingResolution"));
    // hide bandwidth rows because it's too technical to offer in view
    self.bandwidthLow.toggleClass('hidden', options.hasOwnProperty("bandwidthLow"));
    self.bandwidthMed.toggleClass('hidden', options.hasOwnProperty("bandwidthMed"));
    self.bandwidthHigh.toggleClass('hidden', options.hasOwnProperty("bandwidthHigh"));
    self.bandwidthRow.toggleClass('hidden', true);
    self.displayNameRow.toggleClass('hidden', options.hasOwnProperty("displayName"));
  };

  self.elements = ['displayName', 'resolutionType', 'displayResolutionWidescreen', 'displayResolutionStandard', 'encodingResolutionWidescreen',
    'encodingResolutionStandard', 'bandwidthLow', 'bandwidthMed', 'bandwidthHigh', 'displayNameRow', 'enableSelfViewRow',
    'hdRow', 'enableAutoAnswerRow', 'resolutionTypeRow', 'displayResolutionRow', 'encodingResolutionRow', 'resolutionRow', 'bandwidthRow',
    'enableSelfView', 'hd', 'enableAutoAnswer', 'tabs', 'authenticationRow'
  ];

  self.init = function(options) {
    Utils.addSelectOptions(Constants.STANDARD_RESOLUTIONS, self.displayResolutionStandard, settings.displayResolutionStandard);
    Utils.addSelectOptions(Constants.STANDARD_RESOLUTIONS, self.encodingResolutionStandard, settings.encodingResolutionStandard);
    Utils.addSelectOptions(Constants.WIDESCREEN_RESOLUTIONS, self.displayResolutionWidescreen, settings.displayResolutionWidescreen);
    Utils.addSelectOptions(Constants.WIDESCREEN_RESOLUTIONS, self.encodingResolutionWidescreen, settings.encodingResolutionWidescreen);
    authenticationView.view.appendTo(self.authenticationRow);
    updateRowVisibility();
  };

  self.listeners = function(callcontrolDatabinder) {
    self.tabs.each(function() {
      var active, activeTabSel, links = Utils.getElement(this).find('a');
      active = Utils.getElement(links.filter('[href="' + location.hash + '"]')[0] || links[0]);
      active.addClass('active');
      activeTabSel = active[0].hash;
      links.not(active).each(function() {
        Utils.getElement(this.hash).hide();
      });
      Utils.getElement(this).on('click', 'a', function(e) {
        e.preventDefault();
        active.removeClass('active');
        Utils.getElement(activeTabSel).hide();
        active = Utils.getElement(this);
        activeTabSel = this.hash;
        active.addClass('active');
        Utils.getElement(activeTabSel).show();
      });
    });
  };

  return self;
}