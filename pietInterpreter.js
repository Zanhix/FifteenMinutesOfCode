var pixels = require('image-pixels');

var cc=1; // values of cc -> -1 for left 1 for right
var dp=0; // values of dp 0-> right 1-> bottom , 2-> left 3->top
var stack = []; //Program stack
var codelSize=1;
 
async function getData(proginput){
    var {data, width, height} = await pixels(proginput);
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

{
    function push(){
        stack.push(codelSize);
    }
    
    function pop(){
        stack.pop();
    }
    
    function add(){
        let a=stack.pop();
        let b=stack.pop();
        stack.push(a+b);
    }
    
    function subtract(){
        let a=stack.pop();
        let b=stack.pop();
        stack.push(b-a);
    }
    
    function multiply(){
        let a=stack.pop();
        let b=stack.pop();
        stack.push(a*b);
    }
    
    function divide(){
        let a=stack.pop();
        let b=stack.pop();
        if(a!=0){
            stack.push(Math.round(b/a));
        }
    }
    
    function modulo(){
        let a=stack.pop();
        let b=stack.pop();
        stack.push(b%a);
    }
    
    function not(){
        let a=stack.pop();
        if(a==0){
            stack.push(1);
        }else{
            stack.push(0);
        }
    }
    
    function greater(){
        let a=stack.pop();
        let b=stack.pop();
        if(b>a){
            stack.push(1);
        }else{
            stack.push(0);
        }
    }
    
    function pointer(){
        let a=stack.pop();
        dp=(dp+a)%4;
    }
    
    function switchCC(){
        let a=stack.pop();
        if(Math.abs(a)%2!=0){
            cc=cc*(-1);
        }
    }
    
    function duplicate(){
        let a=stack.pop();
        stack.push(a);
        stack.push(a);
    }

    function outChar(){
        console.log(String.fromCharCode(stack.pop()));
    }

    function outNum(){
        console.log(stack.pop());
    }

    function roll(){
        console.log("roll");
        let tmp=[];
        let loop_count = stack.pop();
        let depth = stack.pop();
        stack.push(depth);
        stack.push(loop_count);
	    if (depth > 0) {
	    	for (let i = 0; i < depth; i++) {
	    		tmp.unshift(stack.pop());
	    	}
	    	if (loop_count < 0) {
	    		for (let i = loop_count; i > 0; i--) {
	    			tmp.push(tmp.shift());
	    		}
	    	} else {
	    		for (let i = loop_count; i < 0; i++) {
	    			tmp.unshift(tmp.pop());
	    		}
	    	}
	    	for (let i = 0; i < depth; i++) {
	    		stack.push(tmp.shift());
	    	}
	    }   
    }
}
    
function getOperation (formerlight,formerhue,light,hue){
    let hues=["red","yellow","green","cyan","blue","magenta"];
    let lums=["light","normal","dark"];
    let ops=[[()=>console.log("nothing"),add,divide,greater,duplicate,()=>console.log("inchar")],
            [push,subtract,modulo,pointer,roll,outNum],
            [pop,multiply,not,switchCC,()=>console.log("innum"),outChar]]
    let hueval,lumval;
    if(formerlight=="white"||light=="white"){
        return ()=>{};
    }
    if(lums.indexOf(light)-lums.indexOf(formerlight)<0){
        lumval = 3+ lums.indexOf(light)-lums.indexOf(formerlight);
    }else{
        lumval =lums.indexOf(light)-lums.indexOf(formerlight);
    }
    if(hues.indexOf(hue)-hues.indexOf(formerhue)<0){
        hueval=6+hues.indexOf(hue)-hues.indexOf(formerhue);
    }else{
        hueval=hues.indexOf(hue)-hues.indexOf(formerhue);
    }
    return ops[lumval][hueval]
}

function getExtreme(coordinatesArray,cc,dp){    
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
    return coord;
}

function floodfill(startX,startY,imageIN,color,cc,dp){
    let image = [];
    imageIN.forEach((a,i)=>image[i]=[...a]);
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
    return [getExtreme(positions,cc,dp),positions.length];
}


function readPiet(imageArray){
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
            let [flf,codelSize] = floodfill(x,y,imageArray,imageArray[x][y],cc,dp);
        
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
            }else{
                checkingRoutes=false;
            }
        }
        if(keepRunning){
            x=newx;
            y=newy;
            let [cl,ch]=imageArray[x][y];
          //  console.log(stack,codelSize);
            getOperation(pl,ph,cl,ch)();
        }
        
    }
}

async function programReading(imagePietProgram){
    let image = await getData(imagePietProgram);
    readPiet(image);
}



programReading('helloworld.gif');

/*
void PCalcStack::instrRoll()
{
	std::list<int> tmp;
	int loop_count = values.front();
	values.pop_front();
	int depth = values.front();
	values.pop_front();
	if (depth > 0) {
		for (int i = 0; i < depth; i++) {
			tmp.push_back(values.front());
			values.pop_front();
		}
		if (loop_count > 0) {
			for (int i = loop_count; i > 0; i--) {
				tmp.push_back(tmp.front());
				tmp.pop_front();
			}
		} else {
			for (int i = loop_count; i < 0; i++) {
				tmp.push_front(tmp.back());
				tmp.pop_back();
			}
		}
		for (int i = 0; i < depth; i++) {
			values.push_front(tmp.back());
			tmp.pop_back();
		}
	}
}
*/