window.onload = function() {
/*
 *
 * initialize biometrics object to hold data
 *
 */

    var biometrics = {};
    document.biometrics = biometrics;
    document.biometrics.data = [];
    biometrics.average = {};

/*
 *
 * event listeners
 *
 */
    document.getElementById('canvas1').addEventListener('drop', function(event){
        event.stopPropagation();
        event.preventDefault();
        importFile(event.dataTransfer.files);
    });

    window.addEventListener('dragover', function(event){
        event.stopPropagation();
        event.preventDefault();
    });

    $( window ).resize(function(event){
        window.chart.draw();
    });

    document.getElementById('heartbeatSound').addEventListener('canplaythrough',
        function(){
            window.chart.initialAnimation(true);
            playAudio();
    });

    document.getElementById('canvas1').addEventListener('mousemove',function(event){
        chart.mouse(event);
    })

/*
 *
 * create chart object and attach it to the window
 *
 */
    window.chart = {};
    createChart(window.chart);
    window.chart.draw();
    
    
    function onSuccess(){
        window.chart.draw();
    }
    
    function parseBiometricCSV(stream){ //parse the datafile into an array.

        var headerChars = stream.search(/\n/);  /*single header line*/

        biometrics.header = stream.slice(0,headerChars).split(',');
        biometrics.data = stream.slice(headerChars+1).split(/\n/);
                                                /*grab the data and add it to biometrics.data array*/
        biometrics.data = biometrics.data.map(function(line){
                    var dataPoint = {};
                            /*return each data point as object with keys from header line */
                    var lineArr = line.split(',');

                        for (var i = 0; i < lineArr.length; i++) {
                            if(biometrics.header[i]!=='date' && lineArr[i] !== ""){
                                dataPoint[biometrics.header[i]] = lineArr[i]/1;
                            }else if(lineArr[i]===""){
                                dataPoint[biometrics.header[i]] = null;
                            }else {
                                dataPoint[biometrics.header[i]] = Date.parse(lineArr[i]);
                            }
                        }
                        

                    return dataPoint;
                });
    }


    //setup file loader
    //Check File API support
    if (window.File && window.FileList && window.FileReader) {

        $('#files').change(function(event){
            importFile(event.target.files);
        });

    }else{
        console.log("Your browser does not support File API");
    }
    function importFile(files) {

            window.chart.clear();
            window.chart.ctx.strokeStyle = 'rgb(204, 42, 32)';
            window.chart.ctx.font = '40px sans-serif';
            window.chart.ctx.textAlign = 'center';
            window.chart.ctx.strokeText('Loading...',window.innerWidth/2,window.innerHeight/2);


            var output = document.getElementById("result");

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                //Only plain text
                if (!file.type.match('plain')) continue;

                var picReader = new FileReader();
                picReader.addEventListener("load", function(event) {
                    // console.log("parsing");

                    parseBiometricCSV(event.target.result);
                    
                   
                    onSuccess();
                    
                });

                //Read the text file
                picReader.readAsText(file);
            }
    }

    
};

function createChart(o){
    var heartbeatId = null;
    o.animateDone = false;


    o.state =null;

    o.mouse = function(event){
        o.mouseCanvas = document.getElementById('mouseCanvas');
        o.mouseCtx = o.mouseCanvas.getContext('2d');
        o.mouseCtx.width = window.innerWidth;
        o.mouseCtx.height = window.innerHeight;
        // console.log(event.screenX);
        o.mouseCtx.clearRect(0,0,o.mouseCtx.width,o.mouseCtx.height);
        // o.mouseCtx.fillText('data',event.screenX,event.screenY);
        // console.log(event.screenX,' ',event.screenY);
        o.mouseCtx.beginPath();
        o.mouseCtx.lineWidth = 1;
        o.mouseCtx.moveTo(event.screenX-10,0);
        o.mouseCtx.lineTo(event.screenX-10,o.mouseCtx.height);
        o.mouseCtx.stroke();
        o.mouseCtx.closePath();
        o.mouseCtx.fillText(o.chartData['skin-temp'][
            Math.floor(event.screenX/window.innerWidth*o.chartData['skin-temp'].length)]['skin-temp'],event.screenX,40);
    };
    o.setState=function(){
        o.state ={
            xLow:document.biometrics.data[0].date,
            xHigh:document.biometrics.data[document.biometrics.data.length-2].date,
            yLow:   dataRequest(document.biometrics.data[0].date,
                    document.biometrics.data[document.biometrics.data.length-2].date,
                    document.biometrics.header[4],1)[0][document.biometrics.header[4] + '_min'],
            yHigh:  dataRequest(document.biometrics.data[0].date,
                    document.biometrics.data[document.biometrics.data.length-2].date,
                    document.biometrics.header[4],1)[0][document.biometrics.header[4] + '_max'],
            xPts:43200000,
            yPts:5
        };
    };

    o.clear=function(){
        o.ctx.clearRect(0,0,o.canvas.width, o.canvas.height);
    };


    o.draw = function(){
        o.chartData = [];
        var color = {
                gsr:'#0000FF',
                steps:'#FF0000',
                'heart-rate':'#00FF00',
                'skin-temp':'#000000',
                calories:'#FEA200'
                },
            legend = {

            },
            scale = {
                gsr:function(gsr){return -20*Math.log(gsr);},
                steps:function(steps){return steps;},
                'heart-rate':function(hr){return hr*3;},
                'skin-temp':function(st){return st;},
                calories:function(cal){return cal*100;}
            };
        if(document.biometrics.data.length){
            o.setState();
            for(var i = 1; i<document.biometrics.header.length; i++){
                var trace = document.biometrics.header[i];
                // console.log(trace);
                o.chartData[trace] = dataRequest(o.state.xLow,o.state.xHigh,trace,1400);
            }
        }


        if($('#canvas').length){
            $('#canvas').replaceWith('<canvas id="canvas" width='+$('.shell').width()+' height='+$('.shell').height()+
                '>Your browser does not support canvas. </canvas>');
        }else{
            $('.shell').append('<canvas id="canvas" width='+$('.shell').width()+' height='+$('.shell').height()+
            '>Your browser does not support canvas. </canvas>');
        }
        if($('#mouseCanvas').length){
            $('#mouseCanvas').replaceWith('<canvas id="mouseCanvas" width='+$('.shell').width()+' height='+$('.shell').height()+
                '>Your browser does not support canvas. </canvas>');
        }else{
            $('.shell').append('<canvas id="mouseCanvas" width='+$('.shell').width()+' height='+$('.shell').height()+
            '>Your browser does not support canvas. </canvas>');
        }


        o.canvas = document.getElementById('canvas');
        o.ctx = o.canvas.getContext('2d');
        o.ctx.width = $(o.canvas).parent().width();
        o.ctx.height = $(o.canvas).parent().height();

        o.clear();
        function plotVar(trace,color){
            if(o.chartData[trace].length){
                for (var i = 0; i < o.chartData[trace].length-1; i++){
                    if(o.chartData[trace][i][trace]){
                        o.ctx.strokeStyle = color;
                        o.ctx.lineWidth = 1;
                        o.ctx.beginPath();
                        o.ctx.moveTo(i/o.chartData[trace].length * o.canvas.width,
                            o.canvas.height - scale[trace]( o.chartData[trace][i][trace] ) );
                        o.ctx.lineTo((i+1)/o.chartData[trace].length * o.canvas.width,
                            o.canvas.height - scale[trace]( o.chartData[trace][i+1][trace] ));
                        o.ctx.stroke();
                        o.ctx.closePath();
                    }
                }

            }
        }
        if(o.animateDone && document.biometrics.header.length){
            for (var j = 1; j < document.biometrics.header.length; j++) {

                plotVar(document.biometrics.header[j],color[document.biometrics.header[j]]);

            }
        }
    };

    o.initialAnimation = function(animate){
        if(animate){
            var messageAlpha = 0,
                messageId = null,
                x = 0,
                heartbeatAlpha = 1;
                heartbeatId = window.requestAnimationFrame(heartbeat);
        }else if(o.animateDone){
            message();
        }
        var y,gradient,windowWidth = window.innerWidth, start, end,

            heightY = Math.floor($('.shell').height()/2);

        function heartbeat(){

            start = window.performance.now();
            o.clear();
            
            if(Math.floor(windowWidth/x) <  2 ){
                playAudio();
            }

            for(var i = 30;i>=0;i--){
                
                y = Y(x+(i-30));
                o.ctx.strokeStyle='rgba(204,42,32,'+ i/30+')';
                o.ctx.strokeRect(x+(i-30),y,1,1);
            }

            x+=5;


            if(x > windowWidth){

                window.cancelAnimationFrame(heartbeatId);

                messageId = window.setInterval(message,100);

                o.animateDone = true;
            }else{
                window.requestAnimationFrame(heartbeat);
                
            }
 
        }
        


        function Y(x){
            var y,h=50;
            x = x%400;
            if(x  < 100){y =  heightY;
            }else if(x  >= 100 && x < 125){y =h/25*(x-100) + heightY;
            }else if(x  >=125 && x < 175){y = h/20*(125-x) + heightY + h;
            }else if(x  >=125 && x < 225){y = (3*h)/100*(x-175) + heightY - 3*h/2;
            }else{y = heightY;}
            return y;
        }


        function message(){
            o.clear();
            o.ctx.fillStyle = 'rgba(204, 42, 32,'+messageAlpha+')';
            o.ctx.font = '40px sans-serif';
            o.ctx.textAlign = 'center';
            o.ctx.fillText('drag and drop Basis Peak files here',o.canvas.width/2,o.canvas.height/2);
            messageAlpha+=0.1;
            if(messageAlpha > 1 ){clearInterval(messageId);}
        }
    };


    o.controls = {
        Left:{
            action:function(){
                o.state.xLow -= Math.floor(o.state.xPts/2);
                o.state.xHigh -= Math.floor(o.state.xPts/2);
                o.draw();
            },
            symbol:'<<',
            name:'Left',
            axis:'x'
        },
        Right:{
            action:function(){
                o.state.xLow += Math.floor(o.state.xPts/2);
                o.state.xHigh += Math.floor(o.state.xPts/2);
                o.draw();
            },
            symbol:'&gt;&gt;',
            name:'Right',
            axis:'x'
        },
        Up:{
            action:function(){
                o.state.xLow += Math.floor(o.state.xPts/2);
                o.state.xHigh += Math.floor(o.state.xPts/2);
                o.draw();
            },
            symbol:'>>',
            name:'Up',
            axis:'y'
        },
        Down:{
                action:function(){
                    o.state.yLow -= Math.floor(o.state.yPts/2);
                    o.state.yHigh -= Math.floor(o.state.yPts/2);
                    o.draw();
                },
            symbol:'<<',
            name:'Down',
            axis:'y'
        },
        xZoomOut:{
                action:function(){
                    o.state.xLow -= Math.floor(o.state.xPts/2);
                    o.state.xHigh += Math.floor(o.state.xPts/2);
                    o.draw();
                },
            symbol:'-',
            name:'ZoomOut',
            axis:'x'
        },
        yZoomOut:{
                action:function(){
                    o.state.yLow -= Math.floor(o.state.yPts/2);
                    o.state.yHigh += Math.floor(o.state.yPts/2);
                    o.draw();
                },
            symbol:'-',
            name:'ZoomOut',
            axis:'y'
        },
        yZoomIn:{
                action:function(){
                    o.state.yLow += Math.floor(o.state.yPts/2);
                    o.state.yHigh -= Math.floor(o.state.yPts/2);
                    o.draw();
                },
            symbol:'+',
            name:'yZoomIn',
            axis:'y'
        },
        xZoomIn:{
                action:function(){
                    o.state.xLow += Math.floor(o.state.xPts/2);
                    o.state.xHigh -= Math.floor(o.state.xPts/2);
                    o.draw();
                },
                symbol:'+',
                name:'xZoomIn',
                axis:'x'
        }
    };

    // for(var key in o.controls){
    //     if(o.controls[key].axis === 'x'){

    //         $('.hPlotCtrl').append('<button id='+ o.controls[key].name + '>' + o.controls[key].symbol + '</button>');
    //         $('#'+key).click(o.controls[key].action);

    //     }else if(o.controls[key].axis === 'y'){

    //         $('.vPlotCtrl').append('<button id='+ o.controls[key].name + '>' + o.controls[key].symbol + '</button>');
    //         $('#'+key).click(o.controls[key].action);
    //     }
    // }

}
function playAudio(){
    var sound = document.getElementById('heartbeatSound');
    sound.play();
}


function dataRequest(startTime, endTime, k, numPts){/*times are in milliseconds and are necessary, numPts is optional*/
    var startIndex = 0, endIndex=document.biometrics.data.length-2;
    /* check to see that data exists for requested times, if not go to the start/end of the dataset*/

    if(endTime < startTime){return "dataRequest Error: startTime must be smaller than endTime";}

    if(document.biometrics.data[0].date >= startTime){

        startTime=document.biometrics.data[0].date;
        /* keep startIndex = 0 */

    }else{

        while(document.biometrics.data[startIndex].date < startTime){

            startIndex++;

        }
    }

    if(document.biometrics.data[document.biometrics.data.length-2].date <= endTime){

        endTime=document.biometrics.data[document.biometrics.data.length-2].date;

    }else{

        while(document.biometrics.data[endIndex].date > endTime){

            endIndex--;
        }
    }



    if(numPts && numPts < (endIndex-startIndex)){



        var results = new Array(numPts);

        var delta = (endIndex-startIndex)/numPts;

            for (var i = 0; i < numPts; i++) {

                counter = 0;
                min = Infinity;
                max = null;
     
                results[i]= document.biometrics.data.slice(
                                (Math.floor( delta*i + startIndex )),
                                (Math.floor( delta*(i+1) + startIndex ))
                                ).reduce(meanMinMax, {});
            }

        return results;

    }else{
        return document.biometrics.data.slice(startIndex,endIndex);
    }

    function meanMinMax(memo, curr, index, arr){

                if(curr[k]){
                    if(memo[k]===undefined){memo[k] = null;}
                    memo[k] += curr[k];
                    counter++;
                }
                if(curr[k] > max){max = curr[k];}
                if( (curr[k]!==null) && (curr[k] < min) ){
                    min = curr[k];
                }
                if(index===arr.length-1 ){
                    memo[k] = memo[k]/counter;
                    memo[k+'_max'] = max;
                    memo[k+'_min'] = min;
                }
        return memo;
    }
}