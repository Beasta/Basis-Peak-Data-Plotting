function averager(theArray,timeSpan,dataTyper){ //is array to find averages in
	/*
	//console.log("theArray.constructor:"+theArray.constructor + "  globalBeast.constructor:"+globalBeast.constructor);
	var items=0;
	var totalOverTime=0;
	var timeSpanCurrentlyCalculating=theArray[0][timeSpan];//currently just manually setting to Day or [8]
	var heartrateAverage= [];

	//for(var row in theArray) {
	for (var row = 0; row < theArray.length; row++) {
		if(timeSpanCurrentlyCalculating!==parseInt(theArray[row][timeSpan])){//check to see if array elemnt is a new day
			newDay(theArray[row-1][8],theArray[row-1][7],theArray[row-1][6],parseInt(theArray[row][timeSpan])); //call newDay with day month and year of previous row, also pass the current day
			//timeSpanCurrentlyCalculating=parseInt(theArray[row][timeSpan]);//start counting over a new timespan
		}//6 is year, 7 is month, 8 is day, 9 is hour, 10 is minute	
		
		if(theArray[row][dataTyper]!==""){ //pass over blank slots
			items++; //count the number of readings taken (exclude blank slots)
			totalOverTime+=parseInt(theArray[row][dataTyper]); //[3] is for heartrate, add to the total (exclude blank slots)
		};
		
	}
	//console.log("heartrateAverage:" + heartrateAverage + " on this timeSpanCurrentlyCalculating:" + timeSpanCurrentlyCalculating + " items:"+ items);		
	newDay(theArray[theArray.length-1][8],theArray[theArray.length-1][7],theArray[theArray.length-1][6],parseInt(theArray[theArray.length-1][timeSpan]));

	function newDay(day1,month1,year1,currentTimeSpan){
		//console.log(day1+" "+month1+" "+year1+"");
		var yearMonthDayString=year1.toString()+month1.toString()+timeSpanCurrentlyCalculating.toString();
		//console.log(yearMonthDayString);
		//console.log("totalOverTime:"+totalOverTime+",items:"+items+",totalOverTime/items:"+totalOverTime/items);
		heartrateAverage[parseInt(yearMonthDayString)]=totalOverTime/items;
		
		//console.log(heartrateAverage);
		//console.log("day1:"+day1+"  heartrateAverage:" + heartrateAverage[yearMonthDayString] + " on this timeSpanCurrentlyCalculating:" + timeSpanCurrentlyCalculating + " items:"+ items+",totalOverTime:"+totalOverTime);		
		
		timeSpanCurrentlyCalculating=currentTimeSpan;
		//heartrateAverage=0;
		items=0;
		totalOverTime=0;
	}

	console.log(heartrateAverage);*/

	var totaler=0;
	var items=0;
	var previousTime=[theArray[0][6],theArray[0][7],theArray[0][8],theArray[0][9]];
	var averageItems={};

	for (var yearCounter = theArray[0][6]; yearCounter <= theArray[theArray.length-1][6]; yearCounter++) {
		averageItems["y"+yearCounter]={};
		for (var monthCounter=1; monthCounter<=12;monthCounter++){
			averageItems["y"+yearCounter]["m"+monthCounter]={};
			for (var dayCounter=1; dayCounter<=31;dayCounter++){
				averageItems["y"+yearCounter]["m"+monthCounter]["d"+dayCounter]={};
			}
		}
	};

	for (var row = 0; row < theArray.length; row++) {// cycle through all rows of theArray
		var thisTime=[theArray[row][6],theArray[row][7],theArray[row][8],theArray[row][9]]; //setup a variable that allows for knowing when a new hour occurs

		if (previousTime[0]!==thisTime[0] || previousTime[1]!==thisTime[1] || previousTime[2]!==thisTime[2] || previousTime[3]!==thisTime[3]) { //check for new hour

			//console.log("previous time doesnt equal this time"+ theArray[row-1][9]);
			
			averageItems["y"+theArray[row][6]]["m"+theArray[row][7]]["d"+theArray[row][8]]["h"+theArray[row][9]]=totaler/items;
			previousTime=thisTime;
			
			

			totaler=0;
			items=0;
			
		};

		if (theArray[row][dataTyper]!=="") { 
				items++;
				totaler+=parseInt(theArray[row][dataTyper]);
		};

	};

	//console.log(previousTime,totaler/items);
	console.log(averageItems);
}