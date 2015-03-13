var canvas,
    context,
    data,
    colour,
    label,
    value = 0,
    total = 0;

document.addEventListener("DOMContentLoaded", init);

function init() {
    getData("data/segments.json");
}

function getData(path) {
    var xhr = $.ajax({
        url: path,
        datatype: "JSON",
        type: "GET"
    }).done(gotData).fail(gotNothing);
}

function gotData(JSONdata) {
    data = JSONdata;
    console.log(data);
        
    for (i = 0; i < data.segments.length; i++) {
        colour = data.segments[i].color;
        label = data.segments[i].label;
        value = data.segments[i].value;
        console.log("Segment " + i + " - Label: " + label + ", Value: " + value + ", Colour: " + colour);
        total += value;
    }
    
    console.log("Total    = " + total);
    
    drawPie();
}

function gotNothing(){
    console.log("You've got nothing at the moment (AJAX call failed). Try again later." + xhr.status);
}

function setDefaultStyles(){
    //set default styles for canvas
    //context.strokeStyle = "#989286";	//colour of the lines
    context.strokeStyle = "#fff";
    context.lineWidth = 5;
    context.font = "italic bold 13.5pt Helvetica";
    context.fillStyle = colour;
    context.textAlign = "left";
    //document.body.style.background = "#333";
}

function drawPie() {
    var radius;
    canvas = document.querySelector("#pie-chart");
    context = canvas.getContext("2d");
    //clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //set the styles in case others have been set
    setDefaultStyles();
    var cx = canvas.width/2;
    var cy = canvas.height/2;
    
    
    var currentAngle = 0;
    
    for(var i=0; i<data.segments.length; i++) {
        
        colour = data.segments[i].color;
        label = data.segments[i].label;
        value = data.segments[i].value;
        
        var pct = value/total;
        var endAngle = currentAngle + (pct * (Math.PI * 2));
        
                
//        if (value === data.segments[2].value) {
//            radius = 90;
//        } else if (value === data.segments[1].value) {
//            radius = 110;
//        } else {
            radius = 350;
//        }
//     
    
        //draw the arc
        context.moveTo(cx, cy);
        context.beginPath();
        context.fillStyle = colour;
        context.arc(cx, cy, radius, currentAngle, endAngle, false);  
        context.lineTo(cx, cy);
        context.fill();
        context.stroke();
    
    
        //draw the lines
        context.save();
        context.translate(cx, cy);//make the middle of the circle the (0,0) point
    
        context.beginPath();
        //angle for the lines
        var midAngle = (currentAngle + endAngle)/2; //middle of two angles
    
        var dx = Math.cos(midAngle) * (0.6 * radius);
        var dy = Math.sin(midAngle) * (0.6 * radius);
        context.moveTo(dx, dy);
        //ending points for the lines
        if (value === data.segments[1].value) {
            var dx = Math.sin(midAngle) * (radius + 400); //150px beyond radius
            var dy = Math.sin(midAngle) * (radius + 400);
        } else if (value === data.segments[2].value) {
            var dx = Math.cos(midAngle) * (radius + 100); //100px beyond radius
            var dy = Math.sin(midAngle) * (radius + 100);
        }else if (value === data.segments[0].value){
            var dx = Math.cos(midAngle) * (radius + 50); //50px beyond radius
            var dy = Math.sin(midAngle) * (radius + 50);
        }
        context.lineTo(dx, dy);
        context.stroke();
        
        var halfLabel1 = data.segments[1].label.split("&", 2);
        
        //    context.fillStyle = "#fff";
        if (label === data.segments[0].label) {
            context.fillText(label, dx - 150, dy + 40);
        } else if (label === data.segments[1].label) {
            context.fillText(halfLabel1[0], dx - 140, dy - 60);
            context.fillText(halfLabel1[1], dx - 140, dy - 30);
        } else if (label === data.segments[2].label) {
            context.fillText(label, dx - 180, dy - 25);
        } 
        
        //    Put percent values on canvas;
        context.fillStyle = "#fff";
        if (label === data.segments[0].label) {
            context.fillText(value + "%", dx - 1, dy - 240);
        } else if (label === data.segments[1].label) {
            context.fillText(value + "%", dx + 180, dy + 280);
        } else if (label === data.segments[2].label) {
            context.fillText(value + "%", dx - 130, dy + 325);
        } 
        context.restore();
    
        currentAngle = endAngle;
    }
}
