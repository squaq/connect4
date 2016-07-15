(function( $, window ){
    window.App = {};
    App = {
        //we will check the game with this array
        quad: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ], 
        
        RED:1,
        YELLOW:2,
        renderer : PIXI.autoDetectRenderer(700, 500, {backgroundColor : 0x1099bb}),
        stage : new PIXI.Container(),
        red_t:null,
        yellow_t:null,
        reload_t:null,
        tile_t:null,
        text_yellow:null,
        text_red:null,
        turn:1,
        
        init:function(){
            $("body").append(this.renderer.view);
                        
            animate();
            function animate(){
                requestAnimationFrame(animate);
                App.renderer.render(App.stage);
                
            }
        }, 
        
        //draw all game elements
        drawScene:function(){
            
            //styling fonts
            var styleTitle = {
                font : 'bold italic 36px Arial',
                fill : '#fff',
                dropShadow : true,
                dropShadowColor : '#000000',
                dropShadowAngle : Math.PI / 4,
                dropShadowDistance : 4
            };
            
            var styleRed = {
                font : 'bold italic 26px Arial',
                fill : '#ff0000',
                dropShadow : true,
                dropShadowColor : '#000000',
                dropShadowAngle : Math.PI / 2,
                dropShadowDistance : 2
            };
            
            var styleYel = {
                font : 'bold italic 26px Arial',
                fill : '#f4f44d',
                dropShadow : true,
                dropShadowColor : '#000000',
                dropShadowAngle : Math.PI / 2,
                dropShadowDistance : 2
            };

            //title text
            var title = new PIXI.Text('Connect 4', styleTitle);
            title.x = 10;
            this.stage.addChild(title);
            //Turn texts
            this.text_red = new PIXI.Text('Red turn', styleRed);
            this.text_red.y = 50;
            this.text_red.x = 10;
            
            this.stage.addChild(this.text_red);

            this.text_yellow = new PIXI.Text('Yellow turn', styleYel);
            this.text_yellow.y = 50;
            this.text_yellow.x = 10;
            this.text_yellow.visible = false;
            this.stage.addChild(this.text_yellow);
            
            //reload
            var reloadBt = new PIXI.Sprite(this.reload_t);
            reloadBt.interactive = true;
            //click event
            reloadBt.on('mousedown',this.reload);
            reloadBt.on('touchstart',this.reload);
            reloadBt.x = 50;
            reloadBt.y = 100;
            this.stage.addChild(reloadBt);
            
            console.log(this.stage.getChildIndex(reloadBt));
            //draw the grade
            var initx = 130;
            var inity = -20;
            for(var y = 1; y < 7; y++)
            {
                for(var x = 1; x < 8; x++)
                {
                    var tile_s = new PIXI.Sprite(this.tile_t);
                    tile_s.x = initx + (x*64);
                    tile_s.y = inity + (y*64);
                    tile_s.interactive = true;
                    //giving the position in quad
                    tile_s.arrPos = {'y':y-1, 'x':x-1} 
                    
                    //click event
                    tile_s.on('mousedown',this.click);
                    tile_s.on('touchstart',this.click);
                    
                    this.stage.addChild(tile_s);
                    
                    //disabed quads 
                    if(y != 6) {
                        tile_s.interactive = false;
                        tile_s.alpha = .5;
                    }
                }
            }
        },
        
        //the click of the quad
        click:function(eventData){
            App.addCoin(this, App.turn);
            
            //changing turns
            if(++App.turn>App.YELLOW) {
                App.turn = App.RED;
                App.text_red.visible = true;
                App.text_yellow.visible = false;
            }
            else {                
                App.text_red.visible = false;
                App.text_yellow.visible = true;
            }
        },
        
        
        //addin coins after click 
        addCoin:function(obj, color){
            var sp = new PIXI.Sprite(color == App.RED ? this.red_t : this.yellow_t);
            sp.x = obj.transform.position.x;
            sp.y = obj.transform.position.y;
            this.stage.addChild(sp);
            this.afterClickSetup(obj, color);
        },
        
        
        //setting all configurations after quad click
        afterClickSetup:function(obj, color){
            obj.interactive = false;
            
            this.quad[obj.arrPos.y][obj.arrPos.x] = color;
            var index = this.stage.getChildIndex(obj) -7;
            if(index >= 0){ 
                this.stage.getChildAt(index).interactive = true;
                this.stage.getChildAt(index).alpha = 1;
            }
            //checking end game
            var end = this.checkEndGame();
            if(end>0) this.endingGame(end);
        },
        
        
        endingGame:function(color){
            //adding popup text
            var style = {
                font : 'bold italic 56px Arial',
                fill : (color==this.RED?"#ff0000":"#f4f44d"),
                dropShadow : true,
                dropShadowColor : '#000000',
                dropShadowAngle : Math.PI / 6,
                dropShadowDistance : 4
            };
            
            //title text
            var title = new PIXI.Text("Player "+(color==this.RED?"red":"yellow")+" wins", style);
            title.x = color==this.RED?210:170;
            title.y = 160;
            this.stage.addChild(title);
            
            //disabling quad clicks
            console.log(this.stage.children.length)
            for(var i = 0 ; i < this.stage.children.length; i++){
                if(i!=3)this.stage.getChildAt(i).interactive = false;
            }
            
        },
        
        //find all lines and possibilities to make a four sequence
        checkEndGame:function(){
            var y = 0,
                x = 0;
            // Check down
            for (y = 0; y < 3; y++)
                for (x = 0; x < 7; x++)
                    if (this.together(this.quad[y][x], this.quad[y+1][x], this.quad[y+2][x], this.quad[y+3][x]))
                        return this.quad[y][x];

            // Check right
            for (y = 0; y < 6; y++)
                for (x = 0; x < 4; x++)
                    if (this.together(this.quad[y][x], this.quad[y][x+1], this.quad[y][x+2], this.quad[y][x+3]))
                        return this.quad[y][x];
            
            // Check down-right
            for (y = 0; y < 3; y++)
                for (x = 0; x < 4; x++)
                    if (this.together(this.quad[y][x], this.quad[y+1][x+1], this.quad[y+2][x+2], this.quad[y+3][x+3]))
                        return this.quad[y][x];

            // Check down-left
            for (y = 3; y < 6; y++)
                for (x = 0; x < 4; x++)
                    if (this.together(this.quad[y][x], this.quad[y-1][x+1], this.quad[y-2][x+2], this.quad[y-3][x+3]))
                        return this.quad[y][x];
            
            return 0;
        },
        
        //checking when the line with four is complete
        together:function(a,b,c,d){
            return ((a != 0) && (a ==b) && (a == c) && (a == d));
        },

        
        setImgs:function(){
            this.red_t = PIXI.Texture.fromImage('images/game/red.png');
            this.yellow_t = PIXI.Texture.fromImage('images/game/yellow.png');
            this.tile_t = PIXI.Texture.fromImage('images/game/tile.png');
            this.reload_t = PIXI.Texture.fromImage('images/game/reload.jpg');
            this.drawScene();
        }, 
        
        reload:function(){
            location.reload();

        }
    };
    
    $(document).ready(function(){
        App.init();
        PIXI.loader
            .add('images/game/red.png')
            .add('images/game/yellow.png')
            .add('images/game/tile.png')
            .add('images/game/reload.jpg')
            .load(App.setImgs());        
    });
    

}(jQuery, this));