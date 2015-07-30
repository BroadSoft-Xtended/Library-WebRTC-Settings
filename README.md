# Settings

Handles per user settings. Persists using [cookieconfig](https://github.com/BroadSoft-Xtended/Library-WebRTC-Core/lib/cookieconfig.js).

Model : bdsft_webrtc.default.settings

View : bdsft_webrtc.default.settingsview

Dependencies : [Authentication](https://github.com/BroadSoft-Xtended/Library-WebRTC-Authentication), [Fullscreen](https://github.com/BroadSoft-Xtended/Library-WebRTC-Fullscreen), [SIP Stack](https://github.com/BroadSoft-Xtended/Library-WebRTC-SIPStack), [Sound](https://github.com/BroadSoft-Xtended/Library-WebRTC-Sound), [Video](https://github.com/BroadSoft-Xtended/Library-WebRTC-Video)

## Elements
<a name="elements"></a>

Element                       |Type    |Description
------------------------------|--------|-------------------------------------------------
authenticationRow             |div     |Holds the authentication view.
displayName                   |input   |Sets the SIP display name.
displayResolutionStandard     |select  |Selects the display resolution for standard.
displayResolutionWidescreen   |select  |Selects the display resolution for widescreen.
enableAutoAnswer              |input   |Enables or disables the auto answer.
enableSelfView                |input   |Enables or disables the self view display.
encodingResolutionStandard    |select  |Selects the encoding resolution for standard.
encodingResolutionWidescreen  |select  |Selects the encoding resolution for widescreen.
hd                            |input   |Enables or disables the HD display resolution.
resolutionType                |select  |Selects the resolution type.

## Properties
<a name="properties"></a>

Property            |Type     |Description
--------------------|---------|--------------------------------------------------------------
displayName         |string   |The SIP display name.
displayResolution   |string   |The display resolution to be used on a call.
enableAutoAnswer    |boolean  |True if an incoming call should be automatically answered.
enableSelfView      |boolean  |True if the self view should be displayed.
encodingResolution  |string   |The encoding resolution to be used on a call.
hd                  |boolean  |True if an encoding resolution of 1280 x 720 should be used.

## Configuration
<a name="configuration"></a>

Property        |Type     |Default  |Description
----------------|---------|---------|------------------------------
enableSettings  |boolean  |true     |True if settings is enabled.

## Methods
<a name="methods"></a>

Method     |Parameters  |Description
-----------|------------|---------------------------------------------------------------------
signIn()   |            |Signs in using the userid, password and authenticationUserid.
signOut()  |            |Signs out and clears the userid, password and authenticationUserid.

