function createChart(){
	var chart = {

		state:{
				xLow:document.biometrics.data[0].date,
				xHigh:document.biometrics.data[document.biometrics.data.length-2].date,
				yLow:	dataRequest(document.biometrics.data[0].date,
						document.biometrics.data[document.biometrics.data.length-2].date,
						document.biometrics.header[4],1)[0][document.biometrics.header[4] + '_min'],
				yHigh:	dataRequest(document.biometrics.data[0].date,
						document.biometrics.data[document.biometrics.data.length-2].date,
						document.biometrics.header[4],1)[0][document.biometrics.header[4] + '_max'],
				xPts:43200000,
				yPts:5
		},
		clear:function(){
			this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
		},
		draw:function(){
			// console.log(this.state);

			this.chartData = dataRequest(this.state.xLow,this.state.xHigh,'skin-temp',1000);
			this.canvas = document.getElementById('canvas');
			this.ctx = canvas.getContext('2d');

			this.clear();

			this.ctx.strokeStyle = 'black';
			this.ctx.lineWidth = 1;

			for (var i = 0; i < this.chartData.length; i++){
					this.ctx.strokeStyle = 'black';
					this.ctx.lineWidth = 1;
					this.ctx.strokeRect(i/this.chartData.length * this.canvas.width,
						this.chartData[i]['skin-temp'],1.5,1.5);
				}
			},

		panLeft:function(){
			this.state.xLow -= Math.floor(this.state.xPts/2);
			this.state.xHigh -= Math.floor(this.state.xPts/2);
			this.draw();
		},
		panRight:function(){
			this.state.xLow += Math.floor(this.state.xPts/2);
			this.state.xHigh += Math.floor(this.state.xPts/2);
			this.draw();
		},
		panUp:function(){
			this.state.yLow += Math.floor(this.state.yPts/2);
			this.state.yHigh += Math.floor(this.state.yPts/2);
			this.draw();
		},
		panDown:function(){
			this.state.yLow -= Math.floor(this.state.yPts/2);
			this.state.yHigh -= Math.floor(this.state.yPts/2);
			this.draw();
		},
		xZoomOut:function(){
			this.state.xLow -= Math.floor(this.state.xPts/2);
			this.state.xHigh += Math.floor(this.state.xPts/2);
			this.draw();
		},
		yZoomOut:function(){
			this.state.yLow -= Math.floor(this.state.yPts/2);
			this.state.yHigh += Math.floor(this.state.yPts/2);
			this.draw();
		},
		yZoomIn:function(){
			this.state.yLow += Math.floor(this.state.yPts/2);
			this.state.yHigh -= Math.floor(this.state.yPts/2);
			this.draw();
		},
		xZoomIn:function(){
			this.state.xLow += Math.floor(this.state.xPts/2);
			this.state.xHigh -= Math.floor(this.state.xPts/2);
			this.draw();
		},
	};
	return chart;
}


