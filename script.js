// frame for scatterplot
let svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", 500)
    .attr("height", 400),
  margin = 200,
  width = svg.attr("width") - margin,
  height = svg.attr("height") - margin;

// scaling function
let xScale = d3.scaleLinear().domain([0, 10]).range([0, width]),
  yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);

// axes for scatterplot
let g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

g.append("g").call(d3.axisLeft(yScale));

// finding index of an object in a given array
function findIndexInArray(givenArray, object) {
  for (let i = 0; i < givenArray.length; i++) {
    if (givenArray[i][0] == object[0] && givenArray[i][1] == object[1]) {
      return i;
    }
  }
  return -1;
}

let dataset1 = [];
let showBorderArr = [];

// reading in the data
d3.csv("data/scatter-data.csv").then((data) => {
  for (let i = 0; i < data.length; i++) {
    dataset1.push([data[i].x, data[i].y]);
  }

  showBorderArr = new Array(dataset1.length).fill(true);

  // plot
  svg
    .append("g")
    .selectAll("dot")
    .data(dataset1)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d[0]);
    })
    .attr("cy", function (d) {
      return yScale(d[1]);
    })
    .attr("r", 10)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "black")
    .on("mouseover", function (d) {
      d3.select(this).attr("r", 10).style("fill", "red");
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("r", 10).style("fill", "black");
    })
    .on("click", function (d) {
      cx = this.cx.baseVal.value;
      cy = this.cy.baseVal.value;

      console.log(cx, cy);

      x = (Math.round(Number(cx)) / 1.5 / 200) * 10;
      y = 10 - (Math.round(Number(cy)) / 200) * 10;

      outputText = "[" + x + ", " + y + "]";
      coordinate = [x, y];

      d3.select(".col2")
        .append("text")
        .text(outputText + " ");

      showBorderIndex = findIndexInArray(dataset1, coordinate);

      showBorder = showBorderArr[showBorderIndex];

      showBorderArr[showBorderIndex] = showBorder == true ? false : true;

      if (!showBorderArr[showBorderIndex]) {
        d3.select(this).attr("stroke", "#32CD32").attr("stroke-width", 2);
      } else {
        d3.select(this).attr("stroke", "#black").attr("stroke-width", 2);
      }
    });
});

// adding new points
function addPoint() {
  x = Number(document.getElementById("xVal").value);
  y = Number(document.getElementById("yVal").value);
  if (x < 1 || x > 9 || y < 1 || y > 9) {
    document.getElementById("addPointMsg").innerHTML =
      "X and Y value must be within 1 and 9";
  } else if (findIndexInArray(dataset1, [x, y]) != -1) {
    document.getElementById("addPointMsg").innerHTML = "Point Already Added";
  } else {
    dataset1.push([x, y]);
    showBorderArr.push(true);

    svg
      .append("g")
      .selectAll("dot")
      .data(dataset1)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d[0]);
      })
      .attr("cy", function (d) {
        return yScale(d[1]);
      })
      .attr("r", 10)
      .attr("transform", "translate(" + 100 + "," + 100 + ")")
      .style("fill", "black")
      .on("mouseover", function (d) {
        d3.select(this).attr("r", 10).style("fill", "red");
      })
      .on("mouseout", function (d) {
        d3.select(this).attr("r", 10).style("fill", "black");
      })
      .on("click", function (d) {
        cx = this.cx.baseVal.value;
        cy = this.cy.baseVal.value;

        x = (Math.round(Number(cx)) / 1.5 / 200) * 10;
        y = 10 - (Math.round(Number(cy)) / 200) * 10;

        outputText = "[" + x + ", " + y + "]";
        coordinate = [x, y];

        d3.select(".col2")
          .append("text")
          .text(outputText + " ");

        showBorderIndex = findIndexInArray(dataset1, coordinate);

        showBorder = showBorderArr[showBorderIndex];

        showBorderArr[showBorderIndex] = showBorder == true ? false : true;

        if (!showBorderArr[showBorderIndex]) {
          d3.select(this).attr("stroke", "#32CD32").attr("stroke-width", 2);
        } else {
          d3.select(this).attr("stroke", "#black").attr("stroke-width", 2);
        }
      });

    document.getElementById("addPointMsg").innerHTML = "Point Added";
  }
}

// bar margins
const bar_margin = { top: 20, right: 20, bottom: 30, left: 40 },
  bar_width = 500 - bar_margin.left - bar_margin.right,
  bar_height = 500 - bar_margin.top - bar_margin.bottom;

// set the ranges
let bar_x = d3.scaleBand().range([0, bar_width]).padding(0.1);
let bar_y = d3.scaleLinear().range([bar_height, 0]);

// frame for bar chart
let bar_svg = d3
  .select("#barchart")
  .append("svg")
  .attr("width", bar_width + bar_margin.left + bar_margin.right)
  .attr("height", bar_height + bar_margin.top + bar_margin.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + bar_margin.left + "," + bar_margin.top + ")"
  );

d3.csv("data/bar-data.csv").then((data) => {
  // format the data
  data.forEach(function (d) {
    d.amount = +d.amount;
  });

  // scale the range of the data in the domains
  bar_x.domain(
    data.map(function (d) {
      return d.category;
    })
  );
  bar_y.domain([
    0,
    d3.max(data, function (d) {
      return d.amount;
    }),
  ]);

  // tooltip
  let tooltip = d3
    .select("#barchart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // mouseover function
  const mouseover = function (event, d) {
    tooltip.style("opacity", 1);
    d3.select(this).attr("fill", "pink");
  };

  // mousemove function
  const mousemove = function (event, d) {
    let categoryName = d.category;
    let amountValue = d.amount;

    tooltip
      .html("Category: " + categoryName + "<br>" + "Amount: " + amountValue)
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - bar_height + "px");
  };

  // mouseleave function
  const mouseleave = function (event, d) {
    tooltip.style("opacity", 0);
    d3.select(this).attr("fill", "black");
  };

  // append the rectangles for the bar chart
  bar_svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return bar_x(d.category);
    })
    .attr("width", bar_x.bandwidth())
    .attr("y", function (d) {
      return bar_y(d.amount);
    })
    .attr("height", function (d) {
      return bar_height - bar_y(d.amount);
    })
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .on("mousemove", mousemove);

  // add the x axis
  bar_svg
    .append("g")
    .attr("transform", "translate(0," + bar_height + ")")
    .call(d3.axisBottom(bar_x));

  // add the y axis
  bar_svg.append("g").call(d3.axisLeft(bar_y));
});
