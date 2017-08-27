// Copyright by xRef/MamayAdesu
function MDGamepad() {
    
    this.gamepad = null;
    this.gamepads = [];
    this.interval1 = null;
    this.interval2 = null;
    this.interval3 = null;
    this.eventsList = [];
    this.buttons = [];
    this.axises = [];
    this.gamepadtype = null;
    
    this.infoUpdateInterval = 1;
    this.gamepadId = 0;
    
    this.init = function() {
        if(this.interval1 != null) {
            clearInterval(this.interval1);
        }
        if(this.interval2 != null) {
            clearInterval(this.interval2);
        }
        if(this.interval3 != null) {
            clearInterval(this.interval3);
        }
        this.interval1 = setInterval(function() {
            mdg.gamepads = navigator.getGamepads();
            if(mdg.gamepads.length > 0) {
                if(typeof mdg.gamepads[mdg.gamepadId] != "undefined" && mdg.gamepads[mdg.gamepadId] != null) {
                    if(mdg.gamepad == null) {
                        mdg.gamepad = mdg.gamepads[mdg.gamepadId];
                        mdg.gamepadtype = mdg.gamepad.id;
                        for(var i in mdg.gamepad.axes) {
                            mdg.axises[i] = mdg.gamepad.axes[i];
                        }
                        MDGamepadDoEvent('connected', []);
                        for(var i in mdg.gamepad.buttons) {
                            if(mdg.gamepad.buttons[i] instanceof GamepadButton) {
                                mdg.buttons[i] = [];
                                mdg.buttons[i].pressed = false;
                            }
                        }
                    } else {
                        if(mdg.gamepad != mdg.gamepads[mdg.gamepadId]) {
                            MDGamepadDoEvent('disconnected', []);
                            mdg.buttons = [];
                            mdg.gamepad = null;
                            mdg.gamepadtype = null;
                            
                            mdg.gamepad = mdg.gamepads[mdg.gamepadId];
                            mdg.gamepadtype = mdg.gamepad.id;
                            MDGamepadDoEvent('connected', []);
                            for(var i in mdg.gamepad.buttons) {
                                if(mdg.gamepad.buttons[i] instanceof GamepadButton) {
                                    mdg.buttons[i] = [];
                                    mdg.buttons[i].pressed = false;
                                }
                            }
                        } else {
                            mdg.gamepad = mdg.gamepads[mdg.gamepadId];
                        }
                    }
                } else {
                    if(mdg.gamepad != null && mdg.gamepad instanceof Gamepad) {
                        for(var i in mdg.buttons) {
                            if(mdg.buttons[i].pressed == true) {
                                MDGamepadDoEvent('buttonup', {'button': i});
                            }
                        }
                        MDGamepadDoEvent('disconnected', []);
                        mdg.buttons = [];
                        mdg.axises = [];
                        mdg.gamepad = null;
                        mdg.gamepadtype = null;
                    }
                }
            } else {
                if(mdg.gamepad != null && mdg.gamepad instanceof Gamepad) {
                    for(var i in mdg.buttons) {
                        if(mdg.buttons[i].pressed == true) {
                            MDGamepadDoEvent('buttonup', {'button': i});
                        }
                    }
                    MDGamepadDoEvent('disconnected', []);
                    mdg.buttons = [];
                    mdg.axises = [];
                    mdg.gamepad = null;
                    mdg.gamepadtype = null;
                }
            }
        }, this.infoUpdateInterval);
        
        this.interval2 = setInterval(function() {
            if(mdg.gamepad != null && mdg.gamepad instanceof Gamepad) {
                for(var i in mdg.gamepad.buttons) {
                    if(mdg.gamepad.buttons[i] instanceof GamepadButton) {
                        if(mdg.buttons[i].pressed == false && mdg.gamepad.buttons[i].pressed == true) {
                            MDGamepadDoEvent('buttondown', {'button': i});
                            mdg.buttons[i].pressed = true;
                        } else if(mdg.buttons[i].pressed == true && mdg.gamepad.buttons[i].pressed == false) {
                            MDGamepadDoEvent('buttonup', {'button': i});
                            mdg.buttons[i].pressed = false;
                        }
                    }
                }
            }
        }, this.infoUpdateInterval);
        
        this.interval3 = setInterval(function() {
            if(mdg.gamepad != null && mdg.gamepad instanceof Gamepad) {
                for(var i in mdg.gamepad.axes) {
                    if(mdg.axises[i] != mdg.gamepad.axes[i]) {
                        mdg.axises[i] = mdg.gamepad.axes[i];
                        MDGamepadDoEvent('newaxisposition', {'axis': i, 'position': mdg.gamepad.axes[i]});
                    }
                }
            }
        }, this.infoUpdateInterval);
    }
    
    this.init();
    
    var MDGamepadDoEvent = function(eventname, args) {
        if(typeof mdg.eventsList[eventname] != 'undefined') {
            mdg.eventsList[eventname](args);
        }
    }
    
    this.on = function(eventname, callback) {
        this.eventsList[eventname] = callback;
    }
    
    this.isGamepadConnected = function() {
        if(this.gamepad != null && this.gamepad instanceof Gamepad) {
            return true;
        } else {
            return false;
        }
    }
    
    this.getGamepadType = function() {
        return this.gamepadtype;
    }
    
    this.isButtonPressed = function(buttonIndex) {
        if(this.isGamepadConnected()) {
            if(typeof mdg.buttons[buttonIndex] != 'undefined') {
                return mdg.buttons[buttonIndex].pressed;
            }
        } else {
            return false;
        }
    }
    
    this.getAxises = function() {
        if(this.isGamepadConnected()) {
            return this.axises;
        } else {
            return false;
        }
    }
}