/**
 * @overview package-minimap Main
 * @author Lukas 'derbl4ck' Berwanger
 * @copyright (c) derbl4ck
 * @license
 */

'use strict';

const ui = new WebUIWindow('minimap', 'package://jc3mp-minimap/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;

jcmp.ui.AddEvent('minimap_getLocalPlayerPos', msg => {
  const map_w = 32768 * 2;
  const tiles_x = 16;

  const x = jcmp.localPlayer.GetRenderTransform(0.0).position.x;
  const y = jcmp.localPlayer.GetRenderTransform(0.0).position.z;

  /**
   *  TODO need to adjust this shit 
   */ 

  //const posi = [(-(Math.floor(y)/90)), Math.floor(x)/116];
  //const posi = [(-(Math.floor(y + 10 ) / 1000)), Math.floor(x -  65) / 1000];
  //const posi = [(y * map_w / tiles_x - map_w / 2), (x * map_w / tiles_x - map_w / 2)];

  const posi = [(-(y / 100)), (x / 100) + 4]; // This seems to work atm (Tested at the Statue)

  posi[2] = y; // NOTE DEVstuff
  posi[3] = x; // NOTE DEVstuff

  jcmp.ui.CallEvent('minimap_setLocalPlayerPos', JSON.stringify(posi));

});

jcmp.ui.AddEvent('minimap_getLocalPlayerRot', msg => {
  jcmp.ui.CallEvent('minimap_setLocalPlayerRot', jcmp.localPlayer.rotation.y * 100);
});

jcmp.ui.AddEvent('minimap_ready', msg => {
  jcmp.events.CallRemote('minimap_ready', msg);
});

jcmp.events.AddRemoteCallable('minimap_draw', drawcalls => {
  drawcalls = JSON.parse(drawcalls);
  jcmp.ui.CallEvent('minimap_clear', 'Dennis best dude EUWEST');

  for (let drawcall in drawcalls) {
    if(drawcall['type'] == 'addCustomCSS') {
      jcmp.ui.CallEvent('minimap_addCustomCSS', JSON.stringify(drawcall));
    }

    if(drawcall['type'] == 'drawText') {
      jcmp.ui.CallEvent('minimap_addText', JSON.stringify(drawcall['data']));
    }

    if(drawcall['type'] == 'drawCircle') {
      jcmp.ui.CallEvent('minimap_addCircle', JSON.stringify(drawcall['data']));
    }
  }
});

jcmp.events.AddRemoteCallable('minimap_removeCSS', identifier => {
  jcmp.ui.CallEvent('minimap_removeCSS', identifier);
});