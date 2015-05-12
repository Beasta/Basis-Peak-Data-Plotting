
var chartAct = function(event){
	if(event){console.log(event.srcElement.id);}
	var chartCanvas = document.getElementById("canvas");
	var context = chartCanvas.getContext("2d");
	context.strokeStyle = "blue";
	context.strokeRect(0,0,chartCanvas.width, chartCanvas.height);
	if(event.srcElement.id === 'draw'){draw();}
	function draw(){
		var startTime = document.biometrics.data[0].date;
		var endTime = document.biometrics.data[document.biometrics.data.length-2].date;

		for (var i = 0; i < document.biometrics.data.length; i++) {
			if(document.biometrics.data[i]['skin-temp']){
				context.clear
				context.strokeStyle = 'black';
				context.lineWidth = 1;
				context.strokeRect((document.biometrics.data[i].date-startTime)/(endTime-startTime) * chartCanvas.width,
					document.biometrics.data[i]['skin-temp'],1,1);
			}
		}
	}
};
