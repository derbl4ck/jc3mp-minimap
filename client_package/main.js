/**
 * @overview package-minimap Main
 * @author Lukas 'derbl4ck' Berwanger
 * @copyright (c) derbl4ck
 * @license
 */

'use strict';

const ui = new WebUIWindow('minimap', 'package://jc3mp-minimap/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;

jcmp.ui.AddEventHandler('minimap_getLocalPlayerPos', msg => {
  // TODO need to adjust this shit

  //const posi = [(-(Math.floor(localPlayer.GetRenderTransform(0.0).position.z)/90)), Math.floor(localPlayer.GetRenderTransform(0.0).position.x)/116];
  //const posi = [(-(Math.floor(localPlayer.GetRenderTransform(0.0).position.z + 10 ) / 1000)), Math.floor(localPlayer.GetRenderTransform(0.0).position.x -  65) / 1000];

  const map_w = 32768 * 2;
  const tiles_x = 16;

  const x = localPlayer.GetRenderTransform(0.0).position.x;
  const y = localPlayer.GetRenderTransform(0.0).position.z;

  const posi = [(y * map_w / tiles_x - map_w / 2), (x * map_w / tiles_x - map_w / 2)];

  posi[2] = y; // NOTE DEVstuff
  posi[3] = x; // NOTE DEVstuff

  jcmp.ui.BroadcastEvent('minimap_setLocalPlayerPos', JSON.stringify(posi));

});

jcmp.ui.AddEventHandler('minimap_getLocalPlayerRot', msg => {
  jcmp.ui.BroadcastEvent('minimap_setLocalPlayerRot', localPlayer.rotation.y * 100);
});

jcmp.ui.AddEventHandler('minimap_ready', msg => {
  jcmp.events.CallRemote('minimap_ready', msg);
});

jcmp.events.AddRemoteCallable('minimap_draw', drawcalls => {
  drawcalls = JSON.parse(drawcalls);
  jcmp.ui.BroadcastEvent('minimap_clear', 'Dennis best dude EUWEST');

  for (let drawcall in drawcalls) {
    if(drawcall['type'] == 'addCustomCSS') {
      jcmp.ui.BroadcastEvent('minimap_addCustomCSS', JSON.stringify(drawcall));
    }

    if(drawcall['type'] == 'drawText') {
      jcmp.ui.BroadcastEvent('minimap_addText', JSON.stringify(drawcall['data']));
    }

    if(drawcall['type'] == 'drawCircle') {
      jcmp.ui.BroadcastEvent('minimap_addCircle', JSON.stringify(drawcall['data']));
    }
  }
});

jcmp.events.AddRemoteCallable('minimap_removeCSS', identifier => {
  jcmp.ui.BroadcastEvent('minimap_removeCSS', identifier);
});