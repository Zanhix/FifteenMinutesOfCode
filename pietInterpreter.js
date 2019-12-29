

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
    "C000C0":["dark","magenta"],
    "FFFFFF":["white","white"],
    "000000":["black","black"]}
    return conversionTable[hexcode];
}

function testfuncObj(){
    console.log("swag");
}
function getOperation (formerlight,formerhue,light,hue){
    let hues=["red","yellow","green","cian","blue","magenta"];
    let lums=["light","normal","dark"];
    let ops=[["nothing","add","divide","greater","duplicate","inchar"],
            ["push","substract","mod","pointer","roll","outnum"],
            ["pop","multiply","not","switch","innum","outchar"]]
    let hueval,lumval;
    if(formerlight=="white"||light=="white"){
        return testfuncObj;
    }
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

function readPiet(imageArray){
    let cc=1; // values of cc -> -1 for left 1 for right
    let dp=0; // values of dp 0-> right 1-> bottom , 2-> left 3->top
    let x=0;
    let y=0;
    let pastColor;
    let currentColor;
    let keepRunning=true;
    while(keepRunning){
        pastColor=imageArray[x][y];
        /* update x and y */
        currentColor=imageArray[x][y];
        let [pl,ph] = hexToHueLum(pastColor);
        let [cl,ch] = hexToHueLum(currentColor)
        getOperation(pl,ph,cl,ch)();
    }
}
let imageArray=[["FFFFFF"]];
readPiet(imageArray);