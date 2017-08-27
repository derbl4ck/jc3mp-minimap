module.exports = {
    players: {},
    init: function() {
        var me = this;
        setInterval(function() {
            var players = jcmp.players;
            var hp;
            var player;
            for(var k in players) {
                player = players[k];
                if(me.players[player.client.steamId] != player.health || typeof me.players[player.client.steamId] == "undefied") {
                    jcmp.events.CallRemote("minimap_xrefmodhp", player, player.health / 800 * 100);
                    me.players[player.client.steamId] = player.health;
                }
                if(typeof player.isUnderWater == "undefined") {
                    player.isUnderWater = false;
                }
                if(player.position.y < 1023.5 && ! player.isUnderWater) {
                    player.isUnderWater = true;
                    jcmp.events.CallRemote("minimap_startuseoxygen", player);
                } else if(player.position.y > 1023.5 && player.isUnderWater) {
                    player.isUnderWater = false;
                    jcmp.events.CallRemote("minimap_stopuseoxygen", player);
                }
            }
        }, 100, me);
    }
}