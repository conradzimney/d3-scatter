var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var w = 750 - margin.left - margin.right;
    var h = 400 - margin.top - margin.bottom;

var data = [
  {name: "A", type: "tech", price: 999, tValue: 500, vol: 1200},
  {name: "B", type: "transp", price: 772, tValue: 800, vol: 367},
  {name: "C", type: "transp", price: 372, tValue: 670, vol: 558},
  {name: "D", type: "tech", price: 774, tValue: 801, vol: 431},
  {name: "E", type: "retail", price: 389, tValue: 130, vol: 123},
  {name: "F", type: "fastfood", price: 739, tValue: 888, vol: 45},
  {name: "G", type: "fastfood", price: 582, tValue: 230, vol: 999},
  {name: "H", type: "tech", price: 972, tValue: 284, vol: 87},
  {name: "I", type: "pharm", price: 791, tValue: 609, vol: 449},
  {name: "J", type: "pharm", price: 291, tValue: 701, vol: 870},
  {name: "K", type: "transp", price: 134, tValue: 921, vol: 699},
  {name: "L", type: "retail", price: 532, tValue: 731, vol: 1002},
  {name: "M", type: "retail", price: 788, tValue: 631, vol: 310}
];
var dataset;
// dataset = data;
var col = d3.scale.category10();

//Loading data from CSV:

var format = d3.time.format("%b %Y");
d3.csv("stocks.csv", function(error,stocks) {
    if (error) {
      return console.warn(error);
    }
    //console.log(stocks);
    stocks.forEach(function(d) {
      //console.log(d);
      d.price = +d.price;
      d.tValue = +d.tValue;
      d.vol = +d.vol;
    });
    dataset = stocks;
  });

// Drawing axes and margins:

var svg = d3.select("section").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("section").append("div")
  .attr("class", "tooltip")
  .style("opactiy", 0);

var x = d3.scale.linear()
  .domain([0, 1000])
  .range([0, w]);
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var y = d3.scale.linear()
  .domain([0, 1000])
  .range([h, 0]);
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
  .append("text")
    .attr("x", w)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Price");
svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy",".71em")
    .style("text-anchor", "end")
    .text("True Value");

drawVis(dataset);

// Functions for interactivity:

var mytype ="all";
var patt = new RegExp("all");

document.getElementById("myselectform").onchange = function() {
    filterType(this.value);
}

function filterType(myType) {
  mytype = myType;
  var res = patt.test(mytype);
  if(res){
    var toVisualize = dataset;
  } else {
    var toVisualize = dataset.filter(function(d,i) {
      return d["type"] == mytype;
    });
  }
drawVis(toVisualize);
}

function drawVis(data) {
  var circles = svg.selectAll("circle")
    .data(data);
  circles
    .attr("cx", function(d) { return x(d.price);  })
    .attr("cy", function(d) { return y(d.tValue);  })
    .style("fill", function(d) {return col(d.vol);});
  circles.exit().remove();

 circles.enter().append("circle")
    .attr("cx", function(d) { return x(d.price);  })
    .attr("cy", function(d) { return y(d.tValue);  })
    .attr("r", 4)
    .style("fill", function(d) {return col(d.vol);})
    .style("opacity", 0.5)
    .style("stroke", "black");
  circles 
  .on("mouseover", function(d,i) {
    d3.select(this).attr("r",8);
    tooltip.transition()
      .duration(200)
      .style("opacity", 1);
    tooltip.html("Stock <b>"+d.name+"</b>:<br>Price: "+d.price+"<br>Value: "+d.tValue+"<br>Volume: "+d.vol)
      .style("left", (d3.event.pageX + 5)+"px")
      .style("top", (d3.event.pageY -28) +"px");
  })
  .on("mouseout", function(d,i) {
    d3.select(this).attr("r",4);
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });
}

// document.onReady()(function() {
//   $("#vol").slider({
//     range: true,
//     min: 0,
//     max: maxVol,
//     values: [0, maxVol],
//     slide: function( event, ui) {
//       $("#volamount").val(ui.values[0] + "-" + ui.values[1]);
//       filterData("vol",ui.values);} });
//   $("#volamount").val($("#vol").slider("values",0) + "-"+$("#vol").slider("values",1)); });







