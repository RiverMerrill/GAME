var Wait = {
    preload: function () {
        this.load.image('refresh', 'assets/refresh.png');
    },
    create: function () {
        var button = game.add.button(game.world.centerX, 300, 'refresh', this.startGame);
    },
    update: function () {

    },
    startGame: function(){
        game.state.start('Main');
    }
}