var jsdom = require('mocha-jsdom');
expect = require('expect');
jsdom({});

describe('settings', function() {

  before(function(){
    core = require('webrtc-core');
    testUA = core.testUA;
    config = {};
    testUA.createCore('configuration', config);
    testUA.createCore('sipstack', config);
    testUA.mockWebRTC();
    testUA.createModelAndView('settings', {settings: require('../')});
    eventbus = bdsft_client_instances.test.eventbus;
  });
  afterEach(function(){
    testUA.deleteAllCookies();
  });

  it('settings icon after click', function() {
    configuration.enableSettings = true;
    settings.visible = true;
    testUA.isVisible(settingsview.settingsPopup, true);
    settings.visible = false;
    testUA.isVisible(settingsview.settingsPopup, false);
  });
  it('persist with active call', function() {
    var reload = false;
    settings.reload = function() {
      reload = true;
    }
    testUA.startCall();
    settingsview.save.trigger("click");
    expect(reload).toEqual(false);
    testUA.endCall();
    expect(reload).toEqual(true);
  });
  it('persist with userid set:', function() {
    settings.userid = 'someuserid' ;
    expect(settingsview.userid.val()).toEqual('someuserid');
    settingsview.save.trigger("click");
    expect($.cookie("settingsUserid")).toEqual("someuserid");
    expect($.cookie("settingsPassword")).toEqual(undefined);
  });
  it('persist with display name set', function() {
    expect(settings.displayName).toEqual(undefined);
    settings.displayName = 'somedisplayname';
    settingsview.save.trigger("click");
    expect($.cookie("settingsDisplayName")).toEqual("somedisplayname");
    
    
    expect(settings.displayName).toEqual("somedisplayname");
  });
  it('resolution types with config set', function() {
    configuration.displayResolution = core.constants.R_960x720;
    configuration.encodingResolution = core.constants.R_320x240;
    
    expect(configuration.displayResolution).toEqual(core.constants.R_960x720);
    expect(settings.displayResolution).toEqual(core.constants.R_960x720);
    expect(settings.encodingResolution).toEqual(core.constants.R_320x240);
    configuration.displayResolution = null;
    configuration.encodingResolution = null;
  });
  it('persist with resolution set', function() {
    testUA.val(settingsview.resolutionType, core.constants.STANDARD);
    testUA.val(settingsview.displayResolutionStandard, core.constants.R_640x480);
    testUA.val(settingsview.encodingResolutionStandard, core.constants.R_640x480);
    settingsview.save.trigger("click");
    expect(settingsview.displayResolutionStandard.val()).toEqual(core.constants.R_640x480);
    expect(settingsview.encodingResolutionStandard.val()).toEqual(core.constants.R_640x480);
    expect(settings.displayResolutionStandard).toEqual(core.constants.R_640x480);
    expect(settings.encodingResolutionStandard).toEqual(core.constants.R_640x480);
    expect(settings.displayResolution).toEqual(core.constants.R_640x480);
    expect(settings.encodingResolution).toEqual(core.constants.R_640x480);
    expect($.cookie("settingsDisplayResolution")).toEqual(core.constants.R_640x480);
    expect($.cookie("settingsEncodingResolution")).toEqual(core.constants.R_640x480);
    
    configuration.displayResolution = '';
    configuration.encodingResolution = '';
    
    expect(settingsview.resolutionType.val()).toEqual(core.constants.STANDARD);
    expect(configuration.encodingResolution).toEqual('');
    expect(settings.encodingResolution).toEqual('');
    expect(settingsview.displayResolutionStandard.val()).toEqual(core.constants.R_640x480);
    expect(settingsview.encodingResolutionStandard.val()).toEqual(core.constants.R_640x480);
    $.cookie("settingsDisplayResolution", "");
    $.cookie("settingsEncodingResolution", "");
  });
  it('persist with password set', function() {
    settings.password = '121212';
    settingsview.save.trigger("click");
    expect($.cookie("settingsPassword")).toEqual('121212');
    expect(core.utils.getSearchVariable("password")).toEqual(false);
    expect(settings.password).toEqual('121212');
    
    expect($.cookie("settingsPassword")).toEqual('121212');
    expect(settings.password).toEqual('121212');
    $.cookie("settingsPassword", "");
  });
  it('configuration.password change', function() {    
    configuration.password = 'testpassword';
    expect(settings.password).toEqual('testpassword');
    expect($.cookie("settingsPassword")).toEqual('testpassword');
    $.cookie("settingsPassword", "");
  });
  it('setResolution with standard resolution', function() {
    settings.displayResolution = core.constants.R_320x240;
    settings.encodingResolution = core.constants.R_320x240;
    expect(settingsview.resolutionType.val()).toEqual(core.constants.STANDARD);
    expect(settingsview.displayResolutionWidescreen.hasClass('hidden')).toEqual(true);
    expect(settingsview.encodingResolutionWidescreen.hasClass('hidden')).toEqual(true);
    expect(settingsview.displayResolutionStandard.hasClass('hidden')).toEqual(false);
    expect(settingsview.encodingResolutionStandard.hasClass('hidden')).toEqual(false);
  });
  it('setResolution with widescreen resolution', function() {
    settings.displayResolution = core.constants.R_320x180;
    settings.encodingResolution = core.constants.R_320x180;
    expect(settings.resolutionType).toEqual('widescreen');
    expect(settingsview.resolutionType.val()).toEqual(core.constants.WIDESCREEN);
    expect(settingsview.displayResolutionWidescreen.hasClass('hidden')).toEqual(false);
    expect(settingsview.encodingResolutionWidescreen.hasClass('hidden')).toEqual(false);
    expect(settingsview.displayResolutionStandard.hasClass('hidden')).toEqual(true);
    expect(settingsview.encodingResolutionStandard.hasClass('hidden')).toEqual(true);
  });
  it('change resolution type', function() {
    testUA.val(settingsview.resolutionType, 'standard');
    expect(settingsview.resolutionType.val()).toEqual('standard');
    expect(settings.resolutionType).toEqual('standard');
    expect(settingsview.displayResolutionWidescreen.hasClass('hidden')).toEqual(true);
    expect(settingsview.encodingResolutionWidescreen.hasClass('hidden')).toEqual(true);
    expect(settingsview.displayResolutionStandard.hasClass('hidden')).toEqual(false);
    expect(settingsview.encodingResolutionStandard.hasClass('hidden')).toEqual(false);
  });
  it('hide or disable settings when config has corresponding attributes set', function() {
    expect(settingsview.autoAnswerRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.useridRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.displayNameRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.hdRow.hasClass('hidden')).toEqual(true);
  });
});