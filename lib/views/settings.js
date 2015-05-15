module.exports = require('webrtc-core').bdsft.View(SettingsView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
});

var WebRTC_C = require('webrtc-core').constants;
var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;

function SettingsView(options, eventbus, debug, sound, settings) {
  var self = {};

  self.model = settings;

  self.updateRowVisibility = function() {
    self.autoAnswerRow.toggleClass('hidden', options.hasOwnProperty("enableAutoAnswer"));
    self.selfViewDisableRow.toggleClass('hidden', options.hasOwnProperty("enableSelfView"));
    self.hdRow.toggleClass('hidden', options.hasOwnProperty("enableHD"));
    self.resolutionRow.toggleClass('hidden', options.hasOwnProperty("displayResolution") && options.hasOwnProperty("encodingResolution"));
    self.displayResolutionRow.toggleClass('hidden', options.hasOwnProperty("displayResolution"));
    self.encodingResolutionRow.toggleClass('hidden', options.hasOwnProperty("encodingResolution"));
    self.resolutionTypeRow.toggleClass('hidden', options.hasOwnProperty("displayResolution") || options.hasOwnProperty("encodingResolution"));
    self.bandwidthLow.toggleClass('hidden', options.hasOwnProperty("bandwidthLow"));
    self.bandwidthMed.toggleClass('hidden', options.hasOwnProperty("bandwidthMed"));
    self.bandwidthHigh.toggleClass('hidden', options.hasOwnProperty("bandwidthHigh"));
    self.bandwidthRow.toggleClass('hidden', options.hasOwnProperty("bandwidthLow") && options.hasOwnProperty("bandwidthMed") && options.hasOwnProperty("bandwidthHigh"));
    self.displayNameRow.toggleClass('hidden', options.hasOwnProperty("displayName"));
  };

  self.elements = ['userid', 'password', 'save', 'authenticationUserid', 'signIn', 'signOut',
    'displayName', 'resolutionType', 'displayResolutionWidescreen', 'displayResolutionStandard', 'encodingResolutionWidescreen',
    'encodingResolutionStandard', 'bandwidthLow', 'bandwidthMed', 'bandwidthHigh', 'displayNameRow', 'useridRow', 'selfViewDisableRow',
    'hdRow', 'autoAnswerRow', 'resolutionTypeRow', 'displayResolutionRow', 'encodingResolutionRow', 'resolutionRow', 'bandwidthRow',
    'selfViewDisable', 'hd', 'size', 'autoAnswer', 'configure',
    'layout', 'clear', 'tabs', 'settingsPopup'
  ];

  self.init = function(options) {
    self.updateRowVisibility();
    self.updateResolutionSelectVisibility();
  };

  self.listeners = function(configurationDatabinder) {
    eventbus.on("viewChanged", function(e) {
      if (e.view === 'callcontrol' && e.visible) {
        settings.visible = false;
      }
    });
    eventbus.on(['registered', 'unregistered', 'registrationFailed'], function() {
      self.enableRegistration(true);
    });
    eventbus.on(['signIn', 'signOut'], function() {
      self.enableRegistration(false);
    });
    eventbus.on("resolutionChanged", function() {
      self.updateResolutionSelectVisibility();
    });
    self.clear.on('click', function(e) {
      e.preventDefault();
      settings.resetLayout();
      eventbus.message('Settings reset');
    });
    self.signOut.on('click', function(e) {
      e.preventDefault();
      sound.playClick();
      settings.signOut();
    });
    self.save.bind('click', function(e) {
      e.preventDefault();
      sound.playClick();
      settings.save();
      settings.visible = false;
    });
    self.signIn.bind('click', function(e) {
      e.preventDefault();
      sound.playClick();
      settings.signIn();
    });
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

  self.updateResolutionSelectVisibility = function() {
    var resolutionType = self.resolutionType.val();
    self.displayResolutionStandard.toggleClass('hidden', resolutionType !== WebRTC_C.STANDARD);
    self.encodingResolutionStandard.toggleClass('hidden', resolutionType !== WebRTC_C.STANDARD);
    self.displayResolutionWidescreen.toggleClass('hidden', resolutionType !== WebRTC_C.WIDESCREEN);
    self.encodingResolutionWidescreen.toggleClass('hidden', resolutionType !== WebRTC_C.WIDESCREEN);
  };
  self.enableRegistration = function(enable) {
    self.signIn.removeClass("disabled");
    self.signOut.removeClass("disabled");
    if (!enable) {
      self.signIn.addClass("disabled");
      self.signOut.addClass("disabled");
    }
  };

  return self;
}