function dataRequest(startTime, endTime, numPts, k){/*times are in milliseconds and are necessary, numPts is optional*/
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

	//console.log('startIndex= ',startIndex,'endIndex= ', endIndex);

	if(numPts && numPts < (endIndex-startIndex)){

		// var resultObj = Object.create(document.biometrics.data[0]);
		// for(var k in resultObj){resultObj[k]=0;}

		var results = new Array(numPts);

		var delta = (endIndex-startIndex)/numPts;

			for (var i = 0; i < numPts; i++) {
				// resultObj[k] =0;
				counter = 0;
				min = Infinity;
				max = null;
				// console.log(counter,min,max,resultObj[k]);
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