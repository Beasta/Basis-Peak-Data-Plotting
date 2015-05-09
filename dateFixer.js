
function dateFixer(data){
	for (var i = 0; i < data.length; i++) {
		//data[i][0]=data[i][0].slice(-5,0);
		data[i][6]=parseInt(data[i][0].slice(0,4));//adds year to array
		data[i][7]=parseInt(data[i][0].slice(5,7));//adds month to array
		data[i][8]=parseInt(data[i][0].slice(8,10));//adds day to array
		data[i][9]=parseInt(data[i][0].slice(11,13));//add hour to array
		data[i][10]=parseInt(data[i][0].slice(14,16));//adds minutes to array
		//console.log(data[i][6]);
	};
	return data
}