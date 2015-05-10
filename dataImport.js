(function(){

	var biometrics = {};
	biometrics.data = [];
	function importBiometrics(){
		$.ajax({								/*jQuery ajax request*/
			url:'Data-Files/bodymetrics_bigfile.txt',
			beforeSend:function(){console.log('Loading Data File...');},
			dataFilter:function(stream){parseBiometricCSV(stream);},	/*function to parse data stream from text file*/
			error:function(){console.log('Error importing data');},
			success:function(){				/*success callback*/
				console.log('Success!');
				writeToDiv();
				}
		});
	}

	function parseBiometricCSV(stream){

		var headerChars = stream.search(/\n/);	/*single header line*/

		biometrics.header = stream.slice(0,headerChars).split(',');
		biometrics.data = stream.slice(headerChars+1).split(/\n/);
												/*grab the data and add it to biometrics.data array*/
		biometrics.data = biometrics.data.map(function(line){
					var dataPoint = {};
							/*return each data point as object with keys from header line */
					var lineArr = line.split(',');

						for (var i = 0; i < lineArr.length; i++) {
							if(biometrics.header[i]!=='date'){
								dataPoint[biometrics.header[i]] = lineArr[i]/1;
							}else{dataPoint[biometrics.header[i]] = Date.parse(lineArr[i]);
							}
						}

					return dataPoint;
				});
	}

	function writeToDiv(){					/*write first thousand data points to a new <div> above the 'output' <div> */

		var div, dataLine;

		for (var i = 0; i < 1000; i++) {
			div = document.createElement("div");
			dataLine = document.createTextNode(biometrics.data[i].date + '   ' + biometrics.data[i].calories +'   '+ biometrics.data[i].gsr);
			div.appendChild(dataLine);
			var output = document.getElementById('output');
			document.body.insertBefore(div, output);
		}

	}
	document.biometrics = biometrics;
	importBiometrics();

}());