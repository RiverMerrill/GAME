var GameOver = {
    preload: function () {
        this.load.image('refresh', 'assets/refresh.png');
    },
    create: function () {
        this.gameOver = 'Game Over... Score: ' + score;
        game.add.text(150, 265, this.gameOver);
        var button = game.add.button(game.world.centerX - 20, 350, 'refresh', this.refresh);
        button.scale.setTo(0.1, 0.1);
        if(localStorage.getItem('highScore')){
            if(score >= localStorage.getItem('highScore')){
                localStorage.setItem('highScore', score);
                game.add.text(200, 300, 'High Score: ' + localStorage.getItem('highScore'))
            } else{
                game.add.text(200, 300, 'High Score: ' + localStorage.getItem('highScore'))
            }
        } else{
            localStorage.setItem('highScore', score);
            game.add.text(200, 300, 'High Score: ' + localStorage.getItem('highScore'))
        }
    },
    update: function () {


    },
    refresh: function(){
        location.reload(true);
    }
}