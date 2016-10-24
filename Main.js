/// <reference path="typings/phaser.d.ts" />
var score = 0;
var platformVelocity = 150;
var loopSpeed = 490;
var Main = {
    preload: function () {
        game.stage.backgroundColor = "#4488AA"
        this.load.image('tile', 'assets/tile.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('refresh', 'assets/refresh.png')
        this.load.image('spike', 'assets/spike.png');
        this.load.image('coin', 'assets/coin.png')
    },
    create: function () {
        var me = this;
        // game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // game.scale.pageAlignHorizontally = true;
        // game.scale.pageAlignVertically = true;
        this.scale.updateLayout(true);
        me.counter = 0;
        me.speedUp = 0;
        me.gameOver = 'Game Over... Score: '
        //Get the dimensions of the tile we are using
        me.tileWidth = me.game.cache.getImage('tile').width;
        me.tileHeight = me.game.cache.getImage('tile').height;
        me.spikes = me.game.add.group();
        me.coins = me.game.add.group();
        //Set the background colour to blue
        me.game.stage.backgroundColor = '479cde';

        //Enable the Arcade physics system
        me.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Add a platforms group to hold all of our tiles, and create a bunch of them
        me.platforms = me.game.add.group();
        me.platforms.enableBody = true;
        me.platforms.createMultiple(350, 'tile');
        this.player = game.add.sprite(265, 300, 'player');
        game.physics.arcade.enable(this.player);
        // this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 600;
        this.player.body.bounce.set(0.3);
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.addPointer();
        me.timer = game.time.events;
        me.scoreTimer = me.timer.loop(500, me.updateScore, me);
        me.timer1 = me.timer.loop(450, me.addTile1, me);
        me.timer2 = me.timer.loop(450, me.addTile2, me);


        me.timer3 = me.timer.loop(1000, me.addTileRand, me);


        me.scoreCount = game.add.text(10, 10, 'Score: ' + score);
        if (localStorage.getItem('coinsCollected')) {
            me.coinsCollected = game.add.text(10, 35, 'Points: ' + localStorage.getItem('coinsCollected'));

        } else {
            localStorage.setItem('coinsCollected', 0);
            me.coinsCollected = game.add.text(10, 35, 'Points: 0');
        }
        me.bounds = me.game.add.group();
        me.bounds.enableBody = true;
        me.bounds.createMultiple(100, 'tile');
        for (var i = 0; i <= game.world.width / 70; i++) {
            var tile = me.bounds.create(i * 70, -70, 'tile');
            tile.body.immovable = true;
        }
        for (var i = 0; i <= game.world.height / 70; i++) {
            var tile1 = me.bounds.create(-70, i * 70, 'tile');
            var tile2 = me.bounds.create(game.world.width, i * 70, 'tile')
            tile1.body.immovable = true;
            tile2.body.immovable = true;
        }

    },
    updateScore: function () {
        score += 1;
    },
    addTileRand: function () {
        var me = this;
        var tile = me.platforms.getFirstDead();
        var rand = Math.floor(Math.random() * 390) + 70;
        var randCoin = Math.floor(Math.random() * 15);
        var randSpike = Math.floor(Math.random() * 5)
        if (score > 25) {
            if (randCoin == 1) {
                var coin = me.coins.create(rand, -140, 'coin');
                coin.scale.setTo(1.5, 1.5)
                game.physics.arcade.enable(coin);
                coin.body.velocity.y = platformVelocity;
                coin.body.immovable = true;
                coin.checkWorldBounds = true;
            }
            if (randSpike == 1) {
                var spike = me.spikes.create(rand, 0, 'spike');
                spike.scale.setTo(0.25, 0.25)
                game.physics.arcade.enable(spike);
                // coin.outOfBoundsKill = true;
                spike.body.velocity.y = platformVelocity;
                spike.body.immovable = true;
                spike.checkWorldBounds = true;
                spike.outOfBoundsKill = true;
            }
        }
        tile.reset(rand, -70);
        tile.body.velocity.y = platformVelocity;
        tile.body.immovable = true;

        tile.checkWorldBounds = true;
        tile.outOfBoundsKill = true;
        // game.physics.arcade.overlap(tile, me.platforms, tile.kill(), null, this);
        if (me.counter < 5) {
            me.counter++
        } else {
            me.counter = 0;
        }
    },
    addTile1: function () {

        var me = this;

        //Get a tile that is not currently on screen
        var tile = me.platforms.getFirstDead();

        //Reset it to the specified coordinates
        tile.reset(0, -70);
        tile.body.velocity.y = platformVelocity;
        tile.body.immovable = true;

        //When the tile leaves the screen, kill it
        tile.checkWorldBounds = true;
        tile.outOfBoundsKill = true;
    },
    addTile2: function () {

        var me = this;

        //Get a tile that is not currently on screen
        var tile = me.platforms.getFirstDead();

        //Reset it to the specified coordinates
        tile.reset(530, -70);
        tile.body.velocity.y = platformVelocity;
        tile.body.immovable = true;

        //When the tile leaves the screen, kill it
        tile.checkWorldBounds = true;
        tile.outOfBoundsKill = true;
    },
    update: function () {
        var me = this;
        function gameOver() {
            game.state.start('GameOver', false, false);
        }
        function collectCoin(player, coin) {
            var coins = localStorage.getItem('coinsCollected');
            localStorage.setItem('coinsCollected', parseInt(coins) + 1);
            this.coinsCount = coins + 1;
            coin.kill();
        }
        if (score < 100) {
            if (score >= this.speedUp + 10) {
                this.platforms.forEach(function (platform) {
                    platform.body.velocity.y += 5;
                })
                this.coins.forEach(function (coin) {
                    coin.body.velocity.y += 5;
                })
                this.spikes.forEach(function (spike) {
                    spike.body.velocity.y += 5;
                })
                platformVelocity += 5;
                this.timer1.delay -= 8;
                this.timer2.delay -= 8;
                this.speedUp += 5;
            }
        }
        this.scoreCount.text = 'Score: ' + score;
        this.coinsCollected.text = 'Points: ' + localStorage.getItem('coinsCollected');
        if (this.player.y >= 600) {
            this.platforms.forEach(function (platform) {
                platform.body.velocity.y = 0;
            })
            this.timer.pause();
            this.state.start('GameOver', false, false);

        }
        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.collide(this.player, this.bounds);
        this.game.physics.arcade.collide(this.player, this.spikes, gameOver);
        this.game.physics.arcade.overlap(this.player, this.coins, collectCoin);
        if (game.input.activePointer.isDown) {
            if (game.input.activePointer.worldX <= 400) {
                this.player.body.velocity.x = -100;

            } else {
                this.player.body.velocity.x = 100;
            }
            this.player.body.velocity.y = -350;
        }
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -350;
        }

    }
}
var game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: this.preload, create: this.create, update: this.update });
