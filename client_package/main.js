/**
 * @overview package-minimap Main
 * @author Lukas 'derbl4ck' Berwanger
 * @copyright (c) derbl4ck
 * @license
 */

'use strict';

const ui = new WebUIWindow('minimap', 'package://jc3mp-minimap/ui/index.html', new Vector2(viewportSize.x, viewportSize.y));
ui.autoResize = true;

jcmp.ui.AddEventHandler('getLocalPlayerPos', msg => {
  const posi = [(-(Math.floor(localPlayer.GetRenderTransform(0.0).position.z)/80)), Math.floor(localPlayer.GetRenderTransform(0.0).position.x)/120];
  jcmp.ui.BroadcastEvent('setLocalPlayerPos', JSON.stringify(posi));
});