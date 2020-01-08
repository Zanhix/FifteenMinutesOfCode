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

function getExtreme(coordinatesArray,cc,dp){    
    console.log("in getExtr",cc,dp)
    let maxmain=Number.NEGATIVE_INFINITY;
    let minmain=Infinity;
    let coord;
    coordinatesArray.forEach(e=>{

        if(e!=undefined){
            let [x,y]=e;
            switch (dp) {
                case 0:
                    if(y>maxmain){
                        maxmain=y;
                        coord=[x,y];
                    }else if (y==maxmain){
                        if(cc==-1){
                            if(coord[0]>x){
                                coord=[x,y];
                            }
                        }else{
                            if(coord[0]<x){
                                coord=[x,y];
                            }
                        }
                    }
                    break;
                case 1:
                    if(x>maxmain){
                        maxmain=x;
                        coord=[x,y];
                    }else if (x==maxmain){
                        if(cc==-1){
                            if(coord[0]<y){
                                coord=[x,y];
                            }
                        }else{
                            if(coord[0]>y){
                                coord=[x,y];
                            }
                        }
                    }
                    break;

                case 2:
                    if(y<minmain){
                        minmain=y;
                        coord=[x,y];
                    }else if (y==minmain){
                        if(cc==-1){
                            if(coord[0]<x){
                                coord=[x,y];
                            }
                        }else{
                            if(coord[0]>x){
                                coord=[x,y];
                            }
                        }
                    }
                    break;

                case 3:
                    if(x<minmain){
                        minmain=x;
                        coord=[x,y];
                    }else if (x==minmain){
                        if(cc==-1){
                            if(coord[0]>y){
                                coord=[x,y];
                            }
                        }else{
                            if(coord[0]<y){
                                coord=[x,y];
                            }
                        }
                    }
                    break;
            }
        }
    });
    console.log("out getExtr",cc,dp)
    return coord;
}

function floodfill(startX,startY,image,color,cc,dp){
    console.log("in flf",cc,dp)
    let positions =[[startX,startY]];
    image[startX][startY]="filled";
    let keepgoin=true;
    while(keepgoin){
        keepgoin=false;
        positions.forEach(([startX,startY])=>{
            let a,b,c,d;
            if(image[startX+1]!=undefined&&image[startX+1][startY]!=undefined&&image[startX+1][startY][0]==color[0]&&image[startX+1][startY][1]==color[1]){
                a=1;
                image[startX+1][startY]="filled";
                positions.push([startX+1,startY]);
            }
            if(image[startX]!=undefined&&image[startX][startY+1]!=undefined&&image[startX][startY+1][0]==color[0]&&image[startX][startY+1][1]==color[1]){
                b=1;
                image[startX][startY+1]="filled";
                positions.push([startX,startY+1]);
            }
            if(image[startX-1]!=undefined&&image[startX-1][startY]!=undefined&&image[startX-1][startY][0]==color[0]&&image[startX-1][startY][1]==color[1]){
                c=1;
                image[startX-1][startY]="filled";
                positions.push([startX-1,startY]);
            }
            if(image[startX]!=undefined&&image[startX][startY-1]!=undefined&&image[startX][startY-1][0]==color[0]&&image[startX][startY-1][1]==color[1]){
                d=1;
                image[startX][startY-1]="filled";
                positions.push([startX,startY-1]);
            }
            if(!(a===undefined&&b===undefined&&c===undefined&&d===undefined)){
                keepgoin=true;
            }
        });
    }
    console.log("out flf",cc,dp)
    return getExtreme(positions,cc,dp);
}
function readPiet(imageArray){
    let cc=1; // values of cc -> -1 for left 1 for right
    let dp=0; // values of dp 0-> right 1-> bottom , 2-> left 3->top
    let x=0;
    let y=0;
    let keepRunning=true;
    while(keepRunning){
        let [pl,ph]=imageArray[x][y];
        let ccBuffer=cc;
        let newx,newy;
        let dpBuffer=dp;
        let checkingRoutes=true;
        let changecc=true;
        while(checkingRoutes){
            console.log("checking flf",x,y)
            let flf = floodfill(x,y,imageArray,imageArray[x][y],cc,dp);
            console.log("checking flfout",flf)
            console.log(flf)
            newx=flf[0];
            newy=flf[1];
            switch (dp) {
                case 0:
                    newy++;
                    break;
                case 1:
                    newx++;
                    break;
                case 2:
                    newy--;
                    break;
                case 3:
                    newx--;
                    break;

                default:
                    break;
            }
            if(imageArray[newx]==undefined||imageArray[newx][newy]==undefined||imageArray[newx][newy][0]=="black"){
                console.log("changedRoute",dp,cc)
                if(changecc){
                    cc=cc*(-1);
                    changecc=false;
                }else{
                    changecc=true;
                    dp=(dp+1)%4;
                }
                if(cc==ccBuffer&&dp==dpBuffer){
                    keepRunning=false;
                }
                console.log("changedRoute",dp,cc)
            }else{
                checkingRoutes=false;
            }
            console.log("checking routes",checkingRoutes)
        }
        if(keepRunning){
            x=newx;
            y=newy;
            let [cl,ch]=imageArray[x][y];
            console.log([cl,ch]);
            console.log(getOperation(pl,ph,cl,ch));
        }
        
    }
}
//readPiet(imageArray);

async function program(){
    let image = await getData();
    readPiet(image);
}

program();

