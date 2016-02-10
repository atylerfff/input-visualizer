(function() {
  'use strict';

    document.onselectstart = function(event)
    {
      var nodeName = event.target.nodeName;
      if (nodeName === "INPUT" || nodeName === "TEXTAREA" || nodeName === "XUI-INPUT" || nodeName === "XUI-SLIDER")
      {
        return true;
      }
      else
      {
        return false;
      }
    };
    document.onkeydown = function(event){
      if ((event.target || event.srcElement).nodeName !== 'INPUT' &&
        (event.target || event.srcElement).nodeName !== 'TEXTAREA' &&
        (event.target || event.srcElement).nodeName !== 'XUI-SLIDER' &&
        (event.target || event.srcElement).nodeName !== 'XUI-INPUT' &&
        (event.target || event.srcElement).nodeName !== 'XUI-COLORPICKER' &&
        (event.target || event.srcElement).contentEditable !== true)
      {
        if (event.keyCode == 8)
        return false;
      }
    };
    document.oncontextmenu = function(){ return false; };

  var xjs = require('xjs'),
      Item = xjs.Item,
      SourceConfigWindow = xjs.SourceConfigWindow;

  var currentSource;
  var temp = true;

  var closeBtn = document.getElementById('done');
  var selectBorderColor = document.getElementById('bordercolor');
  var selectGlowColor = document.getElementById('glowcolor');
  var opacitySlider = document.getElementById('opacitySlider');

  var elements = {
    func     : document.getElementById('function'),
    alpha    : document.getElementById('alpha'),
    system   : document.getElementById('system'),
    nav      : document.getElementById('nav'),
    arrow    : document.getElementById('arrow'),
    numpad   : document.getElementById('numpad'),
    mouse    : document.getElementById('mouse'),
    keyboard : document.getElementById('keyboard'),
  };

  var updateElements = function(config) {
    if (config.func === true) {
      elements.func.checked = true;
    }

    if (config.alpha === true) {
      elements.alpha.checked = true;
    }

    if (config.system === true) {
      elements.system.checked = true;
    }

    if (config.nav === true) {
      elements.nav.checked = true;
    }

    if (config.arrow === true) {
      elements.arrow.checked = true;
    }

    if (config.numpad === true) {
      elements.numpad.checked = true;
    }

    if (config.mouse === true) {
      elements.mouse.checked = true;
    }

    if (config.keyboard === true) {
      elements.keyboard.checked = true;
      if (temp === true){
        elements.numpad.checked = true;
        elements.arrow.checked = true;
        elements.nav.checked = true;
        elements.system.checked = true;
        elements.alpha.checked = true;
        elements.func.checked = true;
        temp = false;
      }
    }

    if (config.keyboard === false) {
      elements.keyboard.checked = false;
      if (temp === false){
        elements.numpad.checked = false;
        elements.arrow.checked = false;
        elements.nav.checked = false;
        elements.system.checked = false;
        elements.alpha.checked = false;
        elements.func.checked = false;
        temp = true;
      }
    }

    if ((config.func === false)||(config.alpha === false)||(config.system === false)||(config.nav === false)||(config.arrow === false)||(config.numpad === false)){
      elements.keyboard.checked = false;
      temp = true;
    }

    if ((config.func === true)&&(config.alpha === true)&&(config.system === true)&&(config.nav === true)&&(config.arrow === true)&&(config.numpad === true)){
      elements.keyboard.checked = true;
      temp = false;
    }



  };

  var updateConfig = function(item) {
    var borderColor = document.getElementById('bordercolor').getAttribute('value');
    var glowColor = document.getElementById('glowcolor').getAttribute('value');
    var opacityValue = document.getElementById('opacitySlider').getAttribute('value');
    
    var config = {
      func    : elements.func.checked,
      alpha   : elements.alpha.checked,
      system  : elements.system.checked,
      nav     : elements.nav.checked,
      arrow   : elements.arrow.checked,
      numpad  : elements.numpad.checked,
      mouse   : elements.mouse.checked,
      keyboard: elements.keyboard.checked,
      bordercolor   : borderColor,
      glowcolor   : glowColor,
      opacity   : opacityValue,
    };
    updateElements(config);
    item.requestSaveConfig(config);
    
  };

  xjs.ready().then(function() {
    var configWindow =  xjs.SourceConfigWindow.getInstance();
    SourceConfigWindow.getInstance().useTabbedWindow({
      customTabs: ['Keyboard/Mouse'],
      tabOrder: ['Keyboard/Mouse', 'Color', 'Layout', 'Transition']
    });

    return Item.getCurrentSource();
  }).then(function(myItem) {
    currentSource = myItem;

    function changeBorderColor() {
      myItem.requestSaveConfig({ 'bordercolor': selectBorderColor.value });
      updateConfig(currentSource);
    }

    function changeGlowColor() {
      myItem.requestSaveConfig({ 'glowcolor': selectGlowColor.value });
      updateConfig(currentSource);
    }

    function changeOpacity() {
      myItem.requestSaveConfig({ 'opacity': opacitySlider.value });
      updateConfig(currentSource);
    }

    selectBorderColor.addEventListener('click', function(event) {
      changeBorderColor();
    });

    selectBorderColor.addEventListener('keypress', function(event) {
      if (event.keyCode === 13) {
        changeBorderColor();
      }
    });

    selectGlowColor.addEventListener('click', function(event) {
      changeGlowColor();
    });

    selectGlowColor.addEventListener('keypress', function(event) {
      if (event.keyCode === 13) {
        changeGlowColor();
      }
    });

    opacitySlider.addEventListener('click', function(event) {
      changeOpacity();
    });

    opacitySlider.addEventListener('mouseup', function(event) {
      changeOpacity();
    });

    return currentSource.loadConfig();
  }).then(function(config) {
    // load last saved configuration
    // initialize to Show if no configuration set yet
    config = {
      func    : config.func !== undefined ? config.func : true,
      alpha   : config.alpha !== undefined ? config.alpha : true,
      system  : config.system !== undefined ? config.system : true,
      nav     : config.nav !== undefined ? config.nav : true,
      arrow   : config.arrow !== undefined ? config.arrow : true,
      numpad  : config.numpad !== undefined ? config.numpad : true,
      mouse   : config.mouse !== undefined ? config.mouse : true,
      keyboard   : config.keyboard !== undefined ? config.keyboard : true,
      bordercolor   : config.bordercolor !== undefined ? config.bordercolor : '#FFFFFF',
      glowcolor   : config.glowcolor !== undefined ? config.glowcolor : '#FFFFFF',
      opacity   : config.opacity !== undefined ? config.opacity : 100,
    };
    selectBorderColor.value = config.bordercolor;
    selectGlowColor.value = config.glowcolor;
    opacitySlider.value = config.opacity;

    updateElements(config);

    // initialize event listeners
    for (var i in elements) {
      elements[i].addEventListener('change', function() {
        updateConfig(currentSource);
      });
    };
  });
})();
