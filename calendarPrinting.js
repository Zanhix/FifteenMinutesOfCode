const fs = require('fs');
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
    //fs.appendFile("./README.md",output,()=>console.log("wrote to file"));
}

let myCalendar = [
    "Started printing calendar",
    "Finished printing calendar",
    "Piet operations reader",
    "Piet Op reader cycle & hextoHueLum Converter",
    "HextoHueLum Converter & understood piet CC & DP",
    "Started using git, began the main piet interpreter",
    "Printed calendar in MD and began image reading",
    "finished image reading",
    "linked getData and getOperation",
    "finaly understood CC and DP",
    "started floodfill algorithm",
    "added getExtreme Function",
    "Floodfill is working",
    "getExtreme OK, working on navigation"
]

function writeToMD(){
    fs.appendFile("./README.md","\n- "+(new Date()).yyyymmdd()+"\n   - "+myCalendar[myCalendar.length-1],()=>console.log("wrote to file"));
}

printCalendar(myCalendar);

writeToMD();