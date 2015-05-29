window.onload = function() {
    var biometrics = {},
        canvas = document.getElementById('canvas');
    document.biometrics = biometrics;
    document.biometrics.data = [];
    biometrics.average = {};

    canvas.addEventListener('drop', function(event){
        event.stopPropagation();
        event.preventDefault();
        importFile(event.dataTransfer.files);
    });

    window.addEventListener('dragover', function(event){
        event.stopPropagation();
        event.preventDefault();
    });

    var onSuccess=function(){
        chart = createChart();
        chart.draw();
    };

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
            // var files = event.target.files; //FileList object
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

    }

  
    
};