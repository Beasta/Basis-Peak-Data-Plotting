
window.onload = function() {
    var biometrics = {};
    document.biometrics = biometrics;
    document.biometrics.data = [];
    biometrics.average = {};


        var onSuccess=function(){ //
            // drawChart(parseForGoogle(document.biometrics));
            // chartAct();
            draw =chartAct(chartState);
        };

        function average(key){                  /*helper function to compute average values*/
            var count = 0;
            var sum = biometrics.data.reduce(function(prev, curr){
                if(curr[key]){
                    count++;
                    return prev + curr[key];
                }else{return prev;}
            },0);
            return sum/count;
        }

    function parseForGoogle(inputObject){
        var outputArray=[];

        

        outputArray=inputObject.data
            .map(function(minuteDataPoint){
                return [minuteDataPoint.date,
                        minuteDataPoint.calories,
                        minuteDataPoint.gsr,
                        minuteDataPoint["heart-rate"],
                        minuteDataPoint["skin-temp"],
                        minuteDataPoint.steps];
            });

        outputArray.unshift(inputObject.header);
        // outputArray=inputObject.header // map header data to the top of the output Array
        //     .map(function(headerDataString){
        //         return headerDataString;
        //     });

        return outputArray;
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
        var filesInput = document.getElementById("files");

        filesInput.addEventListener("change", function(event) {

            var files = event.target.files; //FileList object
            var output = document.getElementById("result");
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                //Only plain text
                if (!file.type.match('plain')) continue;

                var picReader = new FileReader();
                console.log("Loading");
                picReader.addEventListener("load", function(event) {
                    console.log("parsing");

                    parseBiometricCSV(event.target.result);
                    
                    console.log("parsed");

                   
                    onSuccess();
                    
                });

                //Read the text file
                picReader.readAsText(file);
            }

        });
    }
    else {
        console.log("Your browser does not support File API");
    }
        
    function drawChart(inputArrayStructuredForGoogle) {
        var data = google.visualization.arrayToDataTable(inputArrayStructuredForGoogle);
        var options = {
          title: 'Fuzzy Nuts',
          curveType: 'function',
          legend: { position: 'bottom' }
        };
        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        chart.draw(data, options);
        //this is a comment for testing branching in git
        //anther testing of branch
    }

      
    
};