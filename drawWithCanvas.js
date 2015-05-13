
var chartAct = function(event){

	console.log(event.srcElement.id);
	
	var chartState = {
			xLow:0,
			xHigh:0,
			yLow:0,
			yHigh:0,
			xPts:100,
			ypts:100
		};


	var chartCanvas = document.getElementById("canvas");
	var context = chartCanvas.getContext("2d");
	context.strokeStyle = "blue";
	context.strokeRect(0,0,chartCanvas.width, chartCanvas.height);



	if(event.srcElement.id === 'draw'){
		clear();
		draw(event);
	}
	function clear(){
		context.clearRect(0,0,chartCanvas.width, chartCanvas.height);
	}

	function draw(event){
			if(event.srcElement.id==='panLeft'){panLeft();}
			var chartCanvas = document.getElementById("canvas");
			var context = chartCanvas.getContext("2d");
			context.strokeStyle = "blue";
			context.strokeRect(0,0,chartCanvas.width, chartCanvas.height);
	}

	var startTime = document.biometrics.data[0].date;
	var endTime = document.biometrics.data[document.biometrics.data.length-2].date;

	for (var i = 0; i < document.biometrics.data.length; i++) {
		if(document.biometrics.data[i]['skin-temp']){
			context.strokeStyle = 'black';
			context.lineWidth = 1;
			context.strokeRect((document.biometrics.data[i].date-startTime)/(endTime-startTime) * chartCanvas.width,
				document.biometrics.data[i]['skin-temp'],1,1);
		}
	}


	function panLeft(){
		chartState.xLow -= Math.floor(chartState.xPts/2);
		chartState.xHigh -= Math.floor(chartState.xPts/2);
		console.log(chartState);
		chartAct(chartState);
	}
	function panRight(){
		chartState.xLow += Math.floor(chartState.xpts/2);
		chartState.xHigh += Math.floor(chartState.xpts/2);
		console.log(chartState);
	}
	function panUp(){
		
	}
	function panDown(){
		
	}
	function xZoonOut(){

	}
	function yZoomOut(){

	}
	function yZoomIn(){

	}
	function xZoomIn(){

	}


};


