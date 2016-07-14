(function( $, window ){
    window.App = {};
    App = {
        
        quad: [
            [0,0,0,0,0,2,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ], 
        
        graphics : new PIXI.Graphics(),
        renderer : PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb}),
        stage : new PIXI.Container(),
        
        init:function(){
            var ww = $(window).width(),
                wh = $(window).height();
                
                
            $("body").append(this.renderer.view);
            
            
            // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
//            graphics.lineStyle(0);
//            graphics.beginFill(0xFFFF0B, 1);
//            graphics.drawCircle(470, 90,60);
//            graphics.endFill();


            this.stage.addChild(this.graphics);
            
            animate();
            function animate(){
                requestAnimationFrame(animate);
                App.renderer.render(App.stage);
                
            }
        }, 
        
        drawScene:function(){
            this.graphics.lineStyle(4, 0xffd900, 1);
            

            for(var i = 100; i <= 800; i+=100)
            {
                this.graphics.moveTo(i,0);
                this.graphics.lineTo(i, 600);
            }
            
            this.graphics.lineStyle(4, 0x000, 1);
            for(var y = 100; y <= 600; y+=100)
            {
                this.graphics.moveTo(100,y);
                this.graphics.lineTo(800,y);
            }
        }
    };
    App.drawScene();
    App.init();
}(jQuery, this));