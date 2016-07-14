(function( $, window ){
    window.App = {};
    App = {
        
        quad: [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ], 
        
        
        
        graphics : new PIXI.Graphics(),
        renderer : PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb}),
        stage : new PIXI.Container(),
        textures : [],
        red_t:null,
        yellow_t:null,
        tile_t:null,
        
        init:function(){
            var ww = $(window).width(),
                wh = $(window).height();
                
                
            $("body").append(this.renderer.view);
            
            
            // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
//            graphics.lineStyle(0);
//            graphics.beginFill(0xFFFF0B, 1);
//            graphics.drawCircle(470, 90,60);
//            graphics.endFill();


//            this.stage.addChild(this.graphics);
            
            animate();
            function animate(){
                requestAnimationFrame(animate);
                App.renderer.render(App.stage);
                
            }
        }, 
        
        drawScene:function(){
            var initx = 100;
            var inity = 100;
            for(var y = 1; y < 7; y++)
            {
                for(var x = 1; x < 8; x++)
                {
                    
                    var tile_s = new PIXI.Sprite(this.tile_t);
                    tile_s.x = initx + (x*64);
                    tile_s.y = inity + (y*64);
                    tile_s.interactive = true;
                    tile_s.on('mousedown',this.click);
                    tile_s.arrPos = {'y':y-1, 'x':x-1} 
                    console.log(this.click)
                    tile_s.on('touchstart',this.click);
                    this.stage.addChild(tile_s);
//                    this.quad[y-1][x-1] = {'tile':tile_s, 'num':0}; 
                    
                    if(y != 6) tile_s.visible = false;
                }
            }
        },
        
        click:function(eventData){
            var sp = new PIXI.Sprite(App.red_t);
            sp.x = this.transform.position.x;
            sp.y = this.transform.position.y;
            this.interactive = false;
            App.stage.addChild(sp);
            App.quad[this.arrPos.y][this.arrPos.x] = 1;
            var index = App.stage.getChildIndex(this) -7;
            if(index >= 0) App.stage.getChildAt(index).visible = true;
            
            console.log(App.quad);
        },
        
        setImgs:function(){
            this.red_t = PIXI.Texture.fromImage('images/game/red.png');
            this.yellow_t = PIXI.Texture.fromImage('images/game/yellow.png');
            this.tile_t = PIXI.Texture.fromImage('images/game/tile.png');
            this.drawScene();
        }
    };
    
    App.init();
    PIXI.loader
        .add('images/game/red.png')
        .add('images/game/yellow.png')
        .add('images/game/tile.png')
        .load(App.setImgs());

}(jQuery, this));