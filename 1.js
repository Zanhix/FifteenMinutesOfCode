//adds one day to the date
Date.prototype.addOneDay = function() {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + 1);
    return date;
}
//returns the date to print with format yyyymmdd
Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
  
    return [(dd>9 ? '' : '0') + dd+"/",
            (mm>9 ? '' : '0') + mm+"/",
            this.getFullYear()
           ].join('');
  };

//Prints my wonderfull calendar
function printCalendar(calendar){
    let startingDate = new Date(2019,11,24);
    let output = "";
    let i=0;
    let today = new Date();
    while (startingDate<today) {
        output += 
        "\n***************\n* "+startingDate.yyyymmdd()+"  * ==>  "+calendar[i]+"\n***************\n";
        startingDate = startingDate.addOneDay();
        i++;
    }
    console.log(output);
}

let myCalendar = [
    "Started printing calendar",
    "Finished printing calendar",
    "Piet operations reader",
    "Piet Op reader cycle & hextoHueLum Converter",
    "HextoHueLum Converter & understood piet CC & DP"
]

printCalendar(myCalendar);


function hexToHueLum(hexcode){
    let conversionTable = {"FFC0C0":["light","red"],
    "FFFFC0":["light","yellow"],
    "C0FFC0":["light","green"],
    "C0FFFF":["light","cyan"],
    "C0C0FF":["light","blue"],
    "FFC0FF":["light","magenta"],
    "FF0000":["normal","red"],
    "FFFF00":["normal","yellow"],
    "00FF00":["normal","green"],
    "00FFFF":["normal","cyan"],
    "0000FF":["normal","blue"],
    "FF00FF":["normal","magenta"],
    "C00000":["dark","red"],
    "C0C000":["dark","yellow"],
    "00C000":["dark","green"],
    "00C0C0":["dark","cyan"],
    "0000C0":["dark","blue"],
    "C000C0":["dark","magenta"]}
    return conversionTable[hexcode];
}

function getOperation (formerlight,formerhue,light,hue){
    let hues=["red","yellow","green","cian","blue","magenta"];
    let lums=["light","normal","dark"];
    let ops=[["","add","divide","greater","duplicate","inchar"],
            ["push","substract","mod","pointer","roll","outnum"],
            ["pop","multiply","not","switch","innum","outchar"]]
    let hueval,lumval;
    if(lums.indexOf(light)-lums.indexOf(formerlight)<0){
        lumval = 3- lums.indexOf(light)-lums.indexOf(formerlight);
    }else{
        lumval =lums.indexOf(light)-lums.indexOf(formerlight);
    }
    if(hues.indexOf(hue)-hues.indexOf(formerhue)<0){
        hueval=6-hues.indexOf(hue)-hues.indexOf(formerhue);
    }else{
        hueval=hues.indexOf(hue)-hues.indexOf(formerhue);
    }
    return ops[lumval][hueval]
}

