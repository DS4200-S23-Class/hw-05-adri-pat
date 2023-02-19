var svg = d3.select("#scatterplot").append("svg")
.attr("width", 500)
.attr("height", 400),
            margin = 200,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin

var xScale = d3.scaleLinear().domain([0, 10]).range([0, width]),
    yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

g.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(xScale));

g.append("g")
.call(d3.axisLeft(yScale));

function findIndexInArray(givenArray, object) {
    for (var i = 0; i < givenArray.length; i++) {
        if (givenArray[i][0] == object[0] && givenArray[i][1] == object[1]) {
            return i
        }
    }
    return -1;
}

var dataset1 = [];
var showBorderArr = [];

d3.csv("data/scatter-data.csv").then((data) => { 
    for (var i = 0; i < data.length; i++) {
        dataset1.push([data[i].x, data[i].y]);
    }

    showBorderArr = new Array(dataset1.length).fill(true);

    svg.append('g')
    .selectAll("dot")
    .data(dataset1)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1]); } )
    .attr("r", 10)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "black")
    .on("mouseover", function(d) {
        d3.select(this).attr("r", 10).style("fill", "red");
    })
    .on("mouseout", function(d) {
        d3.select(this).attr("r", 10).style("fill", "black");
    })
    .on("click", function(d) {

        console.log(d);

        d3.select(".col2").append("text").text(d + " ")

        showBorderIndex = findIndexInArray(dataset1, d)

        showBorder = showBorderArr[showBorderIndex]

        showBorderArr[showBorderIndex] = showBorder == true ? false : true;

        if (!showBorderArr[showBorderIndex]) {
            d3.select(this)
            .attr("stroke", "#32CD32")
            .attr("stroke-width", 2)
        } else {
            d3.select(this)
            .attr("stroke", "#black")
            .attr("stroke-width", 2)
        }
    });
});

function addPoint() {
    x = Number(document.getElementById('xVal').value);
    y = Number(document.getElementById('yVal').value);
    if (x < 1 || x > 9 || y < 1 || y > 9) {
        document.getElementById('addPointMsg').innerHTML = "X and Y value must be within 1 and 9"
    } else if (findIndexInArray(dataset1, [x, y]) != -1){
        document.getElementById('addPointMsg').innerHTML = "Point Already Added"
    } else {
        dataset1.push([x, y]);
        showBorderArr.push(true);

        console.log(dataset1);

        svg.append('g')
            .selectAll("dot")
            .data(dataset1)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d[0]); } )
            .attr("cy", function (d) { return yScale(d[1]); } )
            .attr("r", 10)
            .attr("transform", "translate(" + 100 + "," + 100 + ")")
            .style("fill", "black")
            .on("mouseover", function(d) {
                d3.select(this).attr("r", 10).style("fill", "red");
            })
            .on("mouseout", function(d) {
                d3.select(this).attr("r", 10).style("fill", "black");
            })
            .on("click", function(d) {
                d3.select(".col2").append("text").text(d + " ")

                showBorderIndex = findIndexInArray(dataset1, d)

                showBorder = showBorderArr[showBorderIndex]

                showBorderArr[showBorderIndex] = showBorder == true ? false : true;

                if (!showBorderArr[showBorderIndex]) {
                    d3.select(this)
                    .attr("stroke", "#32CD32")
                    .attr("stroke-width", 2)
                } else {
                    d3.select(this)
                    .attr("stroke", "#black")
                    .attr("stroke-width", 2)
                }
            });

            document.getElementById('addPointMsg').innerHTML = "Point Added"
    
    }
}



var dataset2 = [[1,1.5],[2,2],[3,2.5],[4,3],[5,3.5],[6,4],[7,4.5],[8,5]];

var bar_margin = {top: 10, right: 10, bottom: 30, left: 30},
    bar_width = 900 - bar_margin.left - bar_margin.right,
    bar_height = 300 - bar_margin.top - bar_margin.bottom;

var bar_x = d3.scaleOrdinal()
    .domain(dataset2.map(function (d) {return d[0]; }))
    .range([bar_margin.left, bar_width]);

var bar_y = d3.scaleLinear()
     .domain([0, d3.max(dataset2, function(d) { return d[1]; })])
     .range([bar_height, 0]);

var bar_xAxis = d3.axisBottom()
    .scale(bar_x);

var bar_yAxis = d3.axisLeft()
    .scale(bar_y);

var bar_svg = d3.select("#chart").append("svg")
    .attr("width", bar_width + bar_margin.left + bar_margin.right)
    .attr("height", bar_height + bar_margin.top + bar_margin.bottom)
  .append("g")
    .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");

bar_svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(-30," + bar_height + ")")
    .call(bar_xAxis)
.append("text")
    .attr("x", bar_width)
    .attr("dy", 20)
    .attr("text-anchor", "end")
    .text("Foo");

bar_svg.append("g")
    .attr("class", "y axis")
    .call(bar_yAxis)
.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Log(Number Sts)");

        
var bars = bar_svg.selectAll("rect")
    .data(dataset2)
 .enter().append("rect")
    .attr("x", function(d) {return x(d[0]) + x.rangeBand()/2 - 40;})
    .attr("y", function(d) {return y(d[1]);})
    .attr("width", 20)
    .attr("height", function(d) {return height - y(d[1]);})
    .style("fill","blue");s