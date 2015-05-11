


window.onload = function() {

    var biometrics = {};
    document.biometrics = biometrics;
    document.biometrics.data = [];
    biometrics.average = {};

    //function importBiometrics(){

        
        // $.ajax({                             /*jQuery ajax request*/
        //  url:'Data-Files/bodymetrics_bigfile.txt',
        //  beforeSend:function(){console.log('Loading Data File...');},
        //  dataFilter:function(stream){parseBiometricCSV(stream);},    function to parse data stream from text file
        //  error:function(){console.log('Error importing data');},
        //  success:function(){             /*success callback*/
        //      console.log('Success!');
        //      onSuccess();
        //      }
        // });

        var onSuccess=function(){ //
            for (var j = 2; j < biometrics.header.length; j++) {
                biometrics.average[biometrics.header[j]] = average(biometrics.header[j]);
            }
            for( var key in biometrics.average){
                writeToDiv(key);
                writeToDiv(biometrics.average[key]);
            }
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
    //}

   

    // function writeToDiv(string){                    /*write first thousand data points to a new <div> above the 'output' <div> */
    //     var div, dataLine;
    //         div = document.createElement("div");
    //         dataLine = document.createTextNode(string);
    //         div.appendChild(dataLine);
    //         var output = document.getElementById('output');
    //         //document.body.insertBefore(div, output);
    // }


    function parseBiometricCSV(stream){ //parse the datafile into an array.
        console.log(typeof stream);
         //console.log(stream);

        var headerChars = stream.search(/\n/);  /*single header line*/

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
};