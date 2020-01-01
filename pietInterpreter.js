var pixels = require('image-pixels');
 
// load single source
async function getData(){
    var {data, width, height} = await pixels('helloworld.gif');
    let convertedData=[];
    data.forEach(e=>{
        if(e==0){
            convertedData.push( "00");
        }else if (e==255){
            convertedData.push( "FF");
        }else if (e==192){
            convertedData.push( "C0");
        }
    });
    let newConverteddata =[];
    convertedData.forEach((elt,i)=>{
        if(i%4==0){
            newConverteddata.push(convertedData[i]+convertedData[i+1]+convertedData[i+2]);
        }
    });
    let dataInConv=[];
    let j=-1;
    newConverteddata.forEach((elt,i)=>{
        if(i%width==0){
            j++;
            dataInConv[j]=[];
        }
        dataInConv[j][i%width]=elt;
    });
    let finalData = dataInConv.map(e=>e.map(e2=>hexToHueLum(e2)));
    return finalData;
}
getData();
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
    let pl,ph;
    let cl,ch;
    let keepRunning=true;
    while(keepRunning){
        [pl,ph]=imageArray[y][x];
        /* update x and y */
        [cl,ch]=imageArray[y][x+15];
        console.log(getOperation(pl,ph,cl,ch));
    }
}
//readPiet(imageArray);

async function program(){
    let image = await getData();
    readPiet(image);
}

program();