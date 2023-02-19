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
        console.log(this);

        x = (this.cx / 200) * 10;
        y = 10 - (this.cy / 200) * 10;

        outputText = "[" + x + ", " + y + "]";
        coordinate = [x, y]

        d3.select(".col2").append("text").text(outputText + " ")

        showBorderIndex = findIndexInArray(dataset1, coordinate)

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

