test = require('../node_modules/webrtc-sipstack/test/includes/common')(require('../node_modules/bdsft-sdk-test/lib/common'));
describe('settings', function() {

  before(function(){
    core = require('webrtc-core');
    test.createModelAndView('core', {
      core: require('webrtc-core')
    }, 'cookieconfig');
    test.createModelAndView('sipstack', {
      sipstack: require('webrtc-sipstack'),
      eventbus: require('bdsft-sdk-eventbus'),
      debug: require('bdsft-sdk-debug'),
      core: require('webrtc-core')
    });
    test.createModelAndView('settings', {
      settings: require('../'),
      authentication: require('webrtc-authentication'),
      sipstack: require('webrtc-sipstack'),
      sound: require('webrtc-sound'),
      video: require('webrtc-video'),
      fullscreen: require('webrtc-fullscreen'),
      eventbus: require('bdsft-sdk-eventbus'),
      debug: require('bdsft-sdk-debug'),
      core: require('webrtc-core')
    });
  });
  afterEach(function(){
    test.deleteAllCookies();
  });

  it('resolution defaults', function() {
    expect(settings.encodingResolution).toEqual(core.constants.R_640x480);
    expect(settings.resolutionType).toEqual(core.constants.STANDARD);
    expect(settingsview.encodingResolutionStandard.val()).toEqual(core.constants.R_640x480);
    expect(cookieconfig.displayResolution).toEqual(undefined);
    expect(cookieconfig.encodingResolution).toEqual(undefined);
  });
  it('hd and resolutionRow visibility', function() {
    expect(settingsview.resolutionRow.css('display'), '');
    cookieconfig.hd = true;
    expect(settingsview.resolutionRow.css('display'), 'none');
    cookieconfig.hd = false;
    expect(settingsview.resolutionRow.css('display'), '');
  });
  it('settings icon after click', function() {
    settings.enableSettings = true;
    settings.visible = true;
    test.isVisible(settingsview.view.find('.settingsPopup'), true);
    settings.visible = false;
    test.isVisible(settingsview.view.find('.settingsPopup'), false);
  });
  it('persist with display name set', function() {
    expect(settings.displayName).toEqual(undefined);
    test.val(settingsview.displayName, 'somedisplayname');
    expect(settings.displayName).toEqual("somedisplayname");
    expect(cookieconfig.displayName).toEqual("somedisplayname");
  });
  it('resolution types with config set', function() {
    cookieconfig.displayResolution = core.constants.R_960x720;
    cookieconfig.encodingResolution = core.constants.R_320x240;
    
    expect(cookieconfig.displayResolution).toEqual(core.constants.R_960x720);
    expect(settings.displayResolution).toEqual(core.constants.R_960x720);
    expect(settings.encodingResolution).toEqual(core.constants.R_320x240);
    cookieconfig.displayResolution = undefined;
    cookieconfig.encodingResolution = undefined;
  });
  it('persist with resolution set', function() {
    test.val(settingsview.resolutionType, core.constants.STANDARD);
    test.val(settingsview.displayResolutionStandard, core.constants.R_640x480);
    test.val(settingsview.encodingResolutionStandard, core.constants.R_640x480);
    expect(settingsview.displayResolutionStandard.val()).toEqual(core.constants.R_640x480);
    expect(settingsview.encodingResolutionStandard.val()).toEqual(core.constants.R_640x480);
    expect(settings.displayResolutionStandard).toEqual(core.constants.R_640x480);
    expect(settings.encodingResolutionStandard).toEqual(core.constants.R_640x480);
    expect(settings.displayResolution).toEqual(core.constants.R_640x480);
    expect(settings.encodingResolution).toEqual(core.constants.R_640x480);
    expect(cookieconfig.displayResolution).toEqual(core.constants.R_640x480);
    expect(cookieconfig.encodingResolution).toEqual(core.constants.R_640x480);
    
    test.val(settingsview.resolutionType, core.constants.WIDESCREEN);
    expect(settings.resolutionType).toEqual(core.constants.WIDESCREEN);
    expect(cookieconfig.displayResolution).toEqual(core.constants.R_640x360);
    expect(cookieconfig.encodingResolution).toEqual(core.constants.R_640x360);
    expect(settings.encodingResolution).toEqual(core.constants.R_640x360);
    expect(settingsview.displayResolutionWidescreen.val()).toEqual(core.constants.R_640x360);
    expect(settingsview.encodingResolutionWidescreen.val()).toEqual(core.constants.R_640x360);
    cookieconfig.displayResolution = undefined;
    cookieconfig.encodingResolution = undefined;
  });
  it('setResolution with standard resolution', function() {
    settings.displayResolution = core.constants.R_320x240;
    settings.encodingResolution = core.constants.R_320x240;
    expect(settings.resolutionType).toEqual(core.constants.STANDARD);
    expect(settingsview.resolutionType.val()).toEqual(core.constants.STANDARD);
    expect(settingsview.displayResolutionWidescreen.css('display')).toEqual('none');
    expect(settingsview.encodingResolutionWidescreen.css('display')).toEqual('none');
    expect(settingsview.displayResolutionStandard.css('display')).toEqual('inline-block');
    expect(settingsview.encodingResolutionStandard.css('display')).toEqual('inline-block');
  });
  it('change resolution type', function() {
    settings.displayResolution = core.constants.R_320x240;
    settings.encodingResolution = core.constants.R_320x240;
    test.val(settingsview.resolutionType, 'standard');
    expect(settingsview.resolutionType.val()).toEqual('standard');
    expect(settings.resolutionType).toEqual('standard');
    expect(settingsview.displayResolutionWidescreen.css('display')).toEqual('none');
    expect(settingsview.encodingResolutionWidescreen.css('display')).toEqual('none');
    expect(settingsview.displayResolutionStandard.css('display')).toEqual('inline-block');
    expect(settingsview.encodingResolutionStandard.css('display')).toEqual('inline-block');
    expect(settings.encodingResolution).toEqual('320x240');
    test.val(settingsview.resolutionType, 'widescreen');
    expect(settings.encodingResolution).toEqual('320x180');
    expect(settings.displayResolution).toEqual('320x180');
    settings.displayResolution = core.constants.R_1280x720;
    settings.encodingResolution = core.constants.R_1280x720;
    test.val(settingsview.resolutionType, 'standard');
    expect(settings.encodingResolution).toEqual('960x720');
    expect(settings.displayResolution).toEqual('960x720');
  });
  it('setResolution with widescreen resolution', function() {
    settingsview.displayResolutionStandard[0]._clearMemoizedQueries();
    settingsview.encodingResolutionStandard[0]._clearMemoizedQueries();
    settingsview.displayResolutionWidescreen[0]._clearMemoizedQueries();
    settingsview.encodingResolutionWidescreen[0]._clearMemoizedQueries();
    settings.displayResolution = core.constants.R_320x180;
    settings.encodingResolution = core.constants.R_320x180;
    expect(settings.resolutionType).toEqual('widescreen');
    expect(settingsview.resolutionType.val()).toEqual(core.constants.WIDESCREEN);
    expect(settingsview.displayResolutionStandard.css('display')).toEqual('none');
    expect(settingsview.encodingResolutionStandard.css('display')).toEqual('none');
    expect(settingsview.displayResolutionWidescreen.css('display')).toEqual('inline-block');
    expect(settingsview.encodingResolutionWidescreen.css('display')).toEqual('inline-block');
  });
  it('hide or disable settings when config has corresponding attributes set', function() {
    expect(settingsview.enableAutoAnswerRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.displayNameRow.hasClass('hidden')).toEqual(false);
    expect(settingsview.hdRow.hasClass('hidden')).toEqual(false);
  });
});