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
  });
  afterEach(function(){
    testUA.deleteAllCookies();
  });

  it('settings icon', function() {
    configuration.enableSettings = true;
    
    testUA.isVisible(videobar.settings, true);
    expect(settingsview.attached).toEqual(false);
  });
  it('settings icon with enableSettings = false', function() {
    configuration.enableSettings = false;
    
    testUA.isVisible(videobar.settings, false);
    expect(settingsview.attached).toEqual(false);
  });
  it('settings icon after click', function() {
    configuration.enableSettings = true;
    
    videobar.settings.trigger('click');
    testUA.isVisible(videobar.settings, true);
    testUA.isVisible(settingsview.view, true);
    videobar.settings.trigger('click');
    testUA.isVisible(videobar.settings, true);
    testUA.isVisible(settingsview.view, false);
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
    expect($.cookie("settingsPassword")).toEqual("");
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
    expect(settings.resolutionDisplay).toEqual(core.constants.R_960x720);
    expect(settings.resolutionEncoding).toEqual(core.constants.R_320x240);
    configuration.displayResolution = null;
    configuration.encodingResolution = null;
  });
  it('persist with resolution set', function() {
    
    testUA.val(settingsview.resolutionType, core.constants.STANDARD);
    testUA.val(settingsview.resolutionDisplayStandard, core.constants.R_640x480);
    testUA.val(settingsview.resolutionEncodingStandard, core.constants.R_640x480);
    settingsview.save.trigger("click");
    expect(settingsview.resolutionDisplayStandard.val()).toEqual(core.constants.R_640x480);
    expect(settingsview.resolutionEncodingStandard.val()).toEqual(core.constants.R_640x480);
    expect(settings.resolutionDisplay).toEqual(core.constants.R_640x480);
    expect(settings.resolutionEncoding).toEqual(core.constants.R_640x480);
    expect($.cookie("settingsResolutionDisplay")).toEqual(core.constants.R_640x480);
    expect($.cookie("settingsResolutionEncoding")).toEqual(core.constants.R_640x480);
    
    configuration.displayResolution = '';
    configuration.encodingResolution = '';
    
    expect(settingsview.resolutionType.val()).toEqual(core.constants.STANDARD);
    expect(configuration.encodingResolution).toEqual(core.constants.R_640x480);
    expect(settings.resolutionEncoding).toEqual(core.constants.R_640x480);
    // TODO - this is not working
    // expect(settingsview.resolutionDisplayStandard.val()).toEqual(core.constants.R_640x480);
    // expect(settingsview.resolutionEncodingStandard.val()).toEqual(core.constants.R_640x480);
    $.cookie("settingsResolutionDisplay", "");
    $.cookie("settingsResolutionEncoding", "");
  });
  it('persist with password set', function() {
    
    settings.password = '121212';
    settingsview.save.trigger("click");
    expect($.cookie("settingsPassword")).toEqual('121212');
    expect(WebRTC.Utils.getSearchVariable("password")).toEqual(false);
    expect(settings.password).toEqual('121212');
    
    
    expect($.cookie("settingsPassword")).toEqual('121212');
    expect(settings.password).toEqual('121212');
    $.cookie("settingsPassword", "");
  });
  it('setResolution with standard resolution', function() {
    
    settings.resolutionDisplay = core.constants.R_320x240;
    settings.resolutionEncoding = core.constants.R_320x240;
    expect(settingsview.resolutionType.val()).toEqual(core.constants.STANDARD);
    expect(settingsview.resolutionDisplayWidescreen.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionEncodingWidescreen.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionDisplayStandard.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionEncodingStandard.hasClass('hidden')).toEqual(false);
  });
  it('setResolution with widescreen resolution', function() {
    
    settings.resolutionDisplay = core.constants.R_320x180;
    settings.resolutionEncoding = core.constants.R_320x180;
    expect(settingsview.resolutionType.val()).toEqual(core.constants.WIDESCREEN);
    expect(settingsview.resolutionDisplayWidescreen.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionEncodingWidescreen.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionDisplayStandard.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionEncodingStandard.hasClass('hidden')).toEqual(true);
  });
  it('change resolution type', function() {
    
    testUA.val(settingsview.resolutionType, 'standard');
    expect(settingsview.resolutionType.val()).toEqual('standard');
    expect(settings.resolutionType).toEqual('standard');
    expect(settingsview.resolutionDisplayWidescreen.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionEncodingWidescreen.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionDisplayStandard.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionEncodingStandard.hasClass('hidden')).toEqual(false);
  });
  it('change encoding resolution with different video resolution', function() {
    
    video.localWidth = function() {
      return 640;
    }
    video.localHeight = function() {
      return 480;
    }
    settingsview.resolutionEncodingStandard.val(core.constants.R_960x720);
    settingsview.resolutionEncodingStandard.trigger('change');
    video.local.trigger("playing");
    expect(messagesview.normal.text().trim()).toEqual("");
    expect(messagesview.success.text().trim()).toEqual("");
    expect(messagesview.alert.text().trim()).toEqual("");
    expect(messagesview.warning.text().trim()).toEqual("");
  });
  it('hide or disable settings when config has corresponding attributes set', function() {
    configuration.enableAutoAnswer = true;
    delete configuration.enableSelfView;
    delete configuration.networkUserId;
    delete configuration.enableHD;
    delete configuration.displayResolution;
    delete configuration.encodingResolution;
    delete configuration.bandwidthLow;
    delete configuration.bandwidthMed;
    delete configuration.bandwidthHigh;
    delete configuration.displayName;
    
    //  expect(settings.selfViewDisableRow.is(":visible")).toEqual( false);
    //  expect(settings.settingBandwidthLow.is(":visible")).toEqual( false);
    //  expect(settings.settingBandwidthMed.is(":visible")).toEqual( false);
    //  expect(settings.settingBandwidthHigh.is(":visible")).toEqual( false);
    //  expect(settings.bandwidthRow.is(":visible")).toEqual( false);
    settingsview.updateRowVisibility();
    settingsview.configure.trigger('click');
    expect(settingsview.autoAnswerRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.useridRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.displayNameRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.hdRow.hasClass('hidden')).toEqual(false);

    settingsview.layout.trigger('click');
    expect(settingsview.resolutionRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionTypeRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionDisplayRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionEncodingRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.bandwidthLow.hasClass('hidden')).toEqual(false);
    expect(settingsview.bandwidthMed.hasClass('hidden')).toEqual(false);
    expect(settingsview.bandwidthHigh.hasClass('hidden')).toEqual(false);
    expect(settingsview.bandwidthRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.displayNameRow.hasClass('hidden')).toEqual(false);

    configuration.enableAutoAnswer = false;
    configuration.enableSelfView = false;
    configuration.networkUserId = '12345678';
    configuration.enableHD = false;
    configuration.displayResolution = '960x720';
    configuration.encodingResolution = '960x720';
    configuration.bandwidthLow = '256';
    configuration.bandwidthMed = '1024';
    configuration.bandwidthHigh = '2048';
    configuration.displayName = 'test display name';
    settingsview.updateRowVisibility();
    
    expect(settingsview.autoAnswerRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.selfViewDisableRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.hdRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionTypeRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionDisplayRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionEncodingRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.bandwidthLow.hasClass('hidden')).toEqual(true);
    expect(settingsview.bandwidthMed.hasClass('hidden')).toEqual(true);
    expect(settingsview.bandwidthHigh.hasClass('hidden')).toEqual(true);
    expect(settingsview.bandwidthRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.displayNameRow.hasClass('hidden')).toEqual(true);

    delete configuration.displayResolution;
    settingsview.updateRowVisibility();
    settingsview.layout.trigger('click');
    expect(settingsview.resolutionRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionTypeRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionDisplayRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionEncodingRow.hasClass('hidden')).toEqual(true);

    delete configuration.encodingResolution;
    configuration.displayResolution = '960x720';
    settingsview.updateRowVisibility();
    settingsview.layout.trigger('click');
    expect(settingsview.resolutionRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.resolutionTypeRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionDisplayRow.hasClass('hidden')).toEqual(true);
    expect(settingsview.resolutionEncodingRow.hasClass('hidden')).toEqual(false);
  });
});