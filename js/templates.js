(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof root === 'undefined' || root !== Object(root)) {
        throw new Error('templatizer: window does not exist or is not an object');
    } else {
        root.templatizer = factory();
    }
}(this, function () {
    var jade=function(){function e(e){return null!=e&&""!==e}function n(t){return(Array.isArray(t)?t.map(n):t&&"object"==typeof t?Object.keys(t).filter(function(e){return t[e]}):[t]).filter(e).join(" ")}var t={};return t.merge=function r(n,t){if(1===arguments.length){for(var a=n[0],i=1;i<n.length;i++)a=r(a,n[i]);return a}var o=n["class"],s=t["class"];(o||s)&&(o=o||[],s=s||[],Array.isArray(o)||(o=[o]),Array.isArray(s)||(s=[s]),n["class"]=o.concat(s).filter(e));for(var l in t)"class"!=l&&(n[l]=t[l]);return n},t.joinClasses=n,t.cls=function(e,r){for(var a=[],i=0;i<e.length;i++)a.push(r&&r[i]?t.escape(n([e[i]])):n(e[i]));var o=n(a);return o.length?' class="'+o+'"':""},t.style=function(e){return e&&"object"==typeof e?Object.keys(e).map(function(n){return n+":"+e[n]}).join(";"):e},t.attr=function(e,n,r,a){return"style"===e&&(n=t.style(n)),"boolean"==typeof n||null==n?n?" "+(a?e:e+'="'+e+'"'):"":0==e.indexOf("data")&&"string"!=typeof n?(-1!==JSON.stringify(n).indexOf("&")&&console.warn("Since Jade 2.0.0, ampersands (`&`) in data attributes will be escaped to `&amp;`"),n&&"function"==typeof n.toISOString&&console.warn("Jade will eliminate the double quotes around dates in ISO form after 2.0.0")," "+e+"='"+JSON.stringify(n).replace(/'/g,"&apos;")+"'"):r?(n&&"function"==typeof n.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+e+'="'+t.escape(n)+'"'):(n&&"function"==typeof n.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+e+'="'+n+'"')},t.attrs=function(e,r){var a=[],i=Object.keys(e);if(i.length)for(var o=0;o<i.length;++o){var s=i[o],l=e[s];"class"==s?(l=n(l))&&a.push(" "+s+'="'+l+'"'):a.push(t.attr(s,l,!1,r))}return a.join("")},t.escape=function(e){var n=String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return n===""+e?e:n},t.rethrow=function a(e,n,t,r){if(!(e instanceof Error))throw e;if(!("undefined"==typeof window&&n||r))throw e.message+=" on line "+t,e;try{r=r||require("fs").readFileSync(n,"utf8")}catch(i){a(e,null,t)}var o=3,s=r.split("\n"),l=Math.max(t-o,0),f=Math.min(s.length,t+o),o=s.slice(l,f).map(function(e,n){var r=n+l+1;return(r==t?"  > ":"    ")+r+"| "+e}).join("\n");throw e.path=n,e.message=(n||"Jade")+":"+t+"\n"+o+"\n\n"+e.message,e},t}();

    var templatizer = {};


    // authentication.jade compiled template
    templatizer["authentication"] = function tmpl_authentication() {
        return '<div class="bdsft-webrtc"><div class="authenticationView fadeable classes"><div class="useridRow row"><span class="cell">User ID</span><input type="text" value="" class="userid cell"/></div><div class="authenticationUseridRow row"><span class="cell">Auth User ID</span><input type="text" value="" class="authenticationUserid authUserid cell"/></div><div class="passwordRow row"><span class="cell">Password</span><input type="password" value="" class="password cell"/></div><div class="row"><div class="alert"></div></div><div class="row"><span class="cell"><a href="" title="Sign In" class="btn signIn">Sign In</a><a href="" title="Sign Out" class="btn signOut">Sign Out</a></span></div></div></div>';
    };

    // settings.jade compiled template
    templatizer["settings"] = function tmpl_settings() {
        return '<div class="bdsft-webrtc"><div class="settingsPopup table collapse fixed fadeable popup classes"><div class="row"><ul class="tabs"><li><a href="#tab1" class="configure"><span class="icon-cog"></span>Configure</a></li><li><a href="#tab2" class="layout"><span class="icon-th"></span>Layout</a></li></ul><div id="tab1"><div class="enableAutoAnswerRow row"><span class="cell">Auto Answer</span><input type="checkbox" class="enableAutoAnswer cell"/></div><div class="bandwidthRow row"><span class="cell">Bandwidth</span><span class="cell"><input type="text" maxlength="4" value="" placeholder="low" class="bandwidthLow short"/><input type="text" maxlength="4" value="" placeholder="medium" class="bandwidthMed short"/><input type="text" maxlength="4" value="" placeholder="high" class="bandwidthHigh short"/></span></div><div class="displayNameRow row"><span class="cell">Display Name</span><input type="text" value="" class="displayName cell"/></div><div class="authenticationRow"></div></div><div id="tab2"><div class="enableSelfViewRow row"><span class="cell">Enable Self View</span><input type="checkbox" class="enableSelfView cell"/></div><div class="hdRow row"><span class="cell">Use HD</span><input type="checkbox" class="hd cell"/></div><div class="resolutionRow"><div class="row"><span class="resolutionTypeRow cell">Mode</span><select class="resolutionType cell"><option value="standard">standard</option><option value="widescreen">widescreen</option></select></div><div class="row"><span class="displayResolutionRow cell">Resolution</span><span class="cell"><select class="displayResolutionStandard resolutionSubType"></select><select class="displayResolutionWidescreen resolutionSubType"></select></span></div><div class="row"><span class="encodingResolutionRow cell">Encoding</span><span class="cell"><select class="encodingResolutionStandard resolutionSubType"></select><select class="encodingResolutionWidescreen resolutionSubType"></select></span></div></div></div></div></div></div>';
    };

    // settingscontrol.jade compiled template
    templatizer["settingscontrol"] = function tmpl_settingscontrol() {
        return '<div class="bdsft-webrtc"><div class="cell cell-settings"><div class="settings icon fadeable"><a href="" title="Settings" class="icon-settings"></a></div></div></div>';
    };

    return templatizer;
}));