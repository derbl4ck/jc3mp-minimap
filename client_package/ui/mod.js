function setHealth(percent) {
    var brightness;
    //brightness = 255;
    brightness = 160;
    var r, g, b;
    percent = Math.floor(percent);
    if(percent > 100) {
        percent = 100;
    } else if(percent < 0) {
        percent = 0;
    }
    
    if(percent <= 100 && percent >= 50) {
        r = (brightness - (brightness * (percent / 100))) * 2;
        g = brightness;
        b = 0;
    }
    
    if(percent <= 50 && percent >= 0) {
        r = brightness
        g = ((brightness * percent / 100) * 2);
        b = 0;
    }
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    var color = "rgb("+r+", "+g+", "+b+")";
    
    window.health.style.width = percent+"%";
    window.health.style.backgroundColor = color;
}
const HEALTH_MAX_WIDTH = 99.25;
const HEALTH_MIN_WIDTH = 59;

const OXYGEN_MAX_WIDTH = 39;
const OXYGEN_MIN_WIDTH = 0;

window.health = document.getElementById("health");
window.healthBlock = document.getElementById("healthBlock");
window.healthBlock.w = HEALTH_MAX_WIDTH;
window.healthBlock.style.width = window.healthBlock.w+"%";

window.lowOxygenWarning = null;
window.oxygen = document.getElementById("oxygen");
window.oxygen.oc = 1;
window.oxygen.p = -0.015;
window.oxygen.p1 = -0.03;
window.oxygenBlock = document.getElementById("oxygenBlock");
window.oxygenBlock.w = OXYGEN_MIN_WIDTH;
window.oxygenBlock.oc = 0;
window.oxygenBlock.style.opacity = window.oxygenBlock.oc;
window.oxygenUseInterval = null;
window.oxygenRecoveryInterval = null;
window.oxygenIndicatorOpening = null;
window.oxygenIndicatorClosing = null;
window.oxygenBlock.style.width = window.oxygenBlock.w+"%";
window.oxygenBlock.style.display = "none";
window.warningAboutOxygenIfPercentLessThan = 64;
window.superWarningAboutOxygenIfPercentLessThan = 35;

function setOxygen(percent) {
    if(percent > 100) {
        percent = 100;
    } else if(percent < 0) {
        percent = 0;
    }
    window.oxygen.style.width = percent+"%";
    window.oxygenPercent = percent;
}

function showOxygenIndicator() {
    if(window.oxygenIndicatorClosing != null) {
        clearInterval(window.oxygenIndicatorClosing);
        window.oxygenIndicatorClosing = null;
    }
    window.oxygenIndicatorOpening = setInterval(function() {
        if(window.healthBlock.w > HEALTH_MIN_WIDTH) {
            window.healthBlock.w -= 0.8;
            if(window.healthBlock.w < HEALTH_MIN_WIDTH) {
                window.healthBlock.w = HEALTH_MIN_WIDTH;
            }
            window.healthBlock.style.width = window.healthBlock.w+"%";
        } else if(window.oxygenBlock.w < OXYGEN_MAX_WIDTH) {
            window.oxygenBlock.style.display = "";
            window.oxygenBlock.w += 1;
            window.oxygenBlock.style.width = window.oxygenBlock.w+"%";
        } else if(window.oxygenBlock.oc < 1) {
            window.oxygenBlock.oc += 0.02;
            window.oxygenBlock.style.opacity = window.oxygenBlock.oc;
        } else {
            clearInterval(window.oxygenIndicatorOpening);
            window.oxygenIndicatorOpening = null;
        }
    }, 1);
}

function showOxygenIndicatorDebug() {
    window.healthBlock.w = HEALTH_MIN_WIDTH;
    window.healthBlock.style.width = window.healthBlock.w+"%";
    
    window.oxygenBlock.style.display = "";
    window.oxygenBlock.w = OXYGEN_MAX_WIDTH;
    window.oxygenBlock.style.width = window.oxygenBlock.w+"%";
    
    window.oxygenBlock.oc = 1;
    window.oxygenBlock.style.opacity = window.oxygenBlock.oc;
}

function hideOxygenIndicator() {
    if(window.oxygenIndicatorOpening != null) {
        clearInterval(window.oxygenIndicatorOpening);
        window.oxygenIndicatorOpening = null;
    }
    window.oxygenIndicatorClosing = setInterval(function() {
        if(window.oxygenBlock.oc > 0) {
            window.oxygenBlock.oc -= 0.02;
            window.oxygenBlock.style.opacity = window.oxygenBlock.oc;
        } else if(window.oxygenBlock.w > OXYGEN_MIN_WIDTH) {
            window.oxygenBlock.w -= 1;
            window.oxygenBlock.style.width = window.oxygenBlock.w+"%";
        } else if(window.healthBlock.w < HEALTH_MAX_WIDTH) {
            window.oxygenBlock.style.display = "none";
            window.healthBlock.w += 0.8;
            if(window.healthBlock.w > HEALTH_MAX_WIDTH) {
                window.healthBlock.w = HEALTH_MAX_WIDTH;
            }
            window.healthBlock.style.width = window.healthBlock.w+"%";
        } else {
            clearInterval(window.oxygenIndicatorClosing);
            window.oxygenIndicatorClosing = null;
        }
    }, 1);
}

function hideOxygenIndicatorDebug() {
    window.oxygenBlock.oc = 0;
    window.oxygenBlock.style.opacity = window.oxygenBlock.oc;
    
    window.oxygenBlock.w = OXYGEN_MIN_WIDTH;
    window.oxygenBlock.style.width = window.oxygenBlock.w+"%";
    
    window.oxygenBlock.style.display = "none";
    window.healthBlock.w = HEALTH_MAX_WIDTH;
    window.healthBlock.style.width = window.healthBlock.w+"%";
}

function startUseOxygen() {
    showOxygenIndicator();
    if(window.oxygenRecoveryInterval != null) {
        clearInterval(window.oxygenRecoveryInterval);
        window.oxygenRecoveryInterval = null;
        setOxygen(100);
    }
    var mseconds = 34000;
    var until = mseconds + (new Date).getTime();
    window.oxygenUseInterval = setInterval(function() {
        setOxygen(100 * (until - (new Date).getTime()) / mseconds);
    }, 250, mseconds, until);
}

function stopUseOxygen() {
    setTimeout(hideOxygenIndicator, 3000);
    if(window.oxygenUseInterval != null) {
        clearInterval(window.oxygenUseInterval);
        window.oxygenUseInterval = null;
    }
    window.oxygenRecoveryInterval = setInterval(function() {
        if(window.oxygenPercent < 100) {
            setOxygen(window.oxygenPercent + 0.3);
        } else {
            clearInterval(window.oxygenRecoveryInterval);
            window.oxygenRecoveryInterval = null;
        }
    }, 10);
}

document.onkeydown = function(e) {
    if(e.which == 36) {
        toggleMapPosition();
    }
}

function toggleMapPosition() {
    var map = document.getElementById("map");
    var mainClass = map.className.split(" ")[0];
    switch(mainClass) {
        case "pos-upperright":
            map.className = map.className.replace("pos-upperright", "pos-bottomright");
            indicators.className = "ipos-bottomright";
            break;
        
        case "pos-bottomright":
            map.className = map.className.replace("pos-bottomright", "pos-bottomleft");
            indicators.className = "ipos-bottomleft";
            break;
        
        case "pos-bottomleft":
            map.className = map.className.replace("pos-bottomleft", "pos-upperleft");
            indicators.className = "ipos-upperleft";
            break;
        
        case "pos-upperleft":
            map.className = map.className.replace("pos-upperleft", "pos-upperright");
            indicators.className = "ipos-upperright";
            break;
    }
}

setInterval(function() {
    if(window.oxygenPercent < window.warningAboutOxygenIfPercentLessThan && window.lowOxygenWarning == null) {
        window.lowOxygenWarning = setInterval(function() {
            if(window.oxygen.oc < 0 || window.oxygen.oc > 1) {
                window.oxygen.p *= -1;
                window.oxygen.p1 *= -1;
            }
            if(window.oxygenPercent < window.warningAboutOxygenIfPercentLessThan && window.oxygenPercent > window.superWarningAboutOxygenIfPercentLessThan) {
                window.oxygen.oc += window.oxygen.p;
            } else if(window.oxygenPercent < window.superWarningAboutOxygenIfPercentLessThan) {
                window.oxygen.oc += window.oxygen.p1;
            }
            window.oxygen.style.opacity = window.oxygen.oc;
        }, 10);
    } else if(window.oxygenPercent > window.warningAboutOxygenIfPercentLessThan && window.lowOxygenWarning != null) {
        window.oxygen.oc = 1;
        window.oxygen.style.opacity = window.oxygen.oc;
        clearInterval(window.lowOxygenWarning);
        window.lowOxygenWarning = null;
    }
}, 50);

setHealth(100);
setOxygen(100);

jcmp.AddEvent("minimap_xrefmodhp", function(hp) {
    setHealth(hp);
});

jcmp.AddEvent("minimap_startuseoxygen", function() {
    startUseOxygen();
});

jcmp.AddEvent("minimap_stopuseoxygen", function() {
    stopUseOxygen();
});
