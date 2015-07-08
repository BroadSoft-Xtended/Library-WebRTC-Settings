var Constants = require('webrtc-core').constants;
var C = {};
module.exports = C;

C.STYLES = {
	settingsTabActiveColor: '#04aff0',
	settingsTabInactiveColor: '#494949'
};
C.STANDARD_RESOLUTIONS = {
  '960 x 720': Constants.R_960x720,
  '640 x 480': Constants.R_640x480,
  '320 x 240': Constants.R_320x240
};
C.standard = [Constants.R_960x720,Constants.R_640x480,Constants.R_320x240];
C.WIDESCREEN_RESOLUTIONS  = {
  '1280 x 720': Constants.R_1280x720,
  '640 x 360': Constants.R_640x360,
  '320 x 180': Constants.R_320x180
};
C.widescreen = [Constants.R_1280x720,Constants.R_640x360,Constants.R_320x180];
