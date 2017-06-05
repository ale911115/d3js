(function () {
  'use strict';

  angular
    .module('app')
    .controller('D3JSMyChartController', D3JSMyChartController);

  D3JSMyChartController.inject = ['$log'];

  function D3JSMyChartController($log) {
    var vm = this;
    vm.refreshData = refreshData;

    var _data;
     
    var h = 400;
    var w = 1100;
    var padding = {top: 20, right: 150, bottom: 20, left: 20};
    var margin = 20;

    var svg;

    var minDate;
    var maxDate;
    //Creat xScale
    var xScale;
    var yScale;

    var lineFun = d3.svg.line()
    .interpolate("linear")
    .x(function (d) {
      return xScale(getDate(d.key));
    })
    .y(function (d) {
      return yScale(d.value);
    });

    var color = d3.scale.ordinal().range(["#48A36D",  "#B681BE",  "#E29D58", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#56AE7C", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#64B98C", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);  

    function getDate(d) {
      return new Date(d);
    }

    function showHeader(ds) {
      d3.select("#axis").append("h4")
        .text(ds.category + "Sales (2013)");
    }

    function buildAxis(ds, svg){

      var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%b %d"));
      var yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(h / margin);

      var xAxis = svg.append("g").call(xAxisGen)
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding.bottom) + ")");

      var yAxis = svg.append("g").call(yAxisGen)
        .attr("class", "axis")
        .attr("transform", "translate(" + (padding.left + 2) + ",0)");

    }

    function buildLines(ds, svg) {

      var city = svg.selectAll(".city")
      .data(_data)
      .enter()
      .append("g")
      .attr({
        "class":"city"
      });
      
      var viz = city.append("path")
       .attr({
        "d": function(category){
          return category.visible? lineFun(category.values):null;
        },
        "stroke": function(category){
          return color(category.name);
        },
        "stroke-width": 3,
        "fill": "none",
        "class": "cityChart"
      }).on("mouseover",function(category){
        $log.info('Mouse Over '+ category.name);
         d3.selectAll(".city").selectAll(".cityChart").attr({
           "stroke":function(category){
             var c = d3.rgb(color(category.name));
             return "rgba("+c.r+","+c.g+","+c.b+ ","+ (0.3) +")";
        }
        });
        d3.select(this).attr({
          "stroke":function(category){
             var c = d3.rgb(color(category.name));
          return c;
        },
          "stroke-width": 4
        });
       
      }).on("mouseout",function(){
         d3.selectAll(".city").selectAll(".cityChart").attr({
           "stroke":function(category){
          return color(category.name);
        },
        "stroke-width": 3
        });
      });

      city.selectAll(".dot")
      .data(function(_d){
        return _d.values;
      })
      .enter()
      .append("circle")
      .attr({
        "class":"dot",
        "cx":function(_d){
          return xScale(getDate(_d.key));
        },
        "cy":function(_d){
          return yScale(_d.value);
        },
        "r":5,
        "style":"opacity:0"
      })
      .on("mouseover", function(_d) {

            //We're using the Moment.js library to get a month and year for our tooltip.
            //We're using Moment.js because our dates are in the js date format.
            var displayDate = _d.key
            var displayVal = _d.value+"%";

            //Append the values to the tooltip with some markup.
            $(".tt").html(
              "<div class='name'>"+_d.name+"</div>"+
              "<div class='date'>"+displayDate+": </div>"+
              "<div class='rate'>"+displayVal+"</div>"
            )

            //Show the tooltip.
            $(".tt").show();

            //Make the dot visible.
            d3.select(this).style("opacity", 1);
            
        })
        .on("mouseout", function(_d) {
            //Turn this dot's opacity back to 0
            //And hide the tooltip.
            d3.select(this).style("opacity", 0);
            $(".tt").hide();
        });

      var legend = city.append("rect")
       .attr({
        "width":10,
        "height": 10,
        "x": w-padding.right + margin,
        "y": function (d, i) { 
          return (margin)+i*(margin) - 8; },
        "fill": function(d) { 
          return d.visible ? color(d.name) : "#d2d2d6";},
        "class":"legend-box"
      })
      .on("click", function(d){ // On click make d.visible 
        d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

        // maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
        // yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
        // svg.select(".y.axis")
        //   .transition()
        //   .call(yAxis);   

        city.select("path")
          .transition()
          .attr("d", function(d){
            return d.visible ? lineFun(d.values) : null; // If d.visible is true then draw line for this d selection
          })

        city.select("rect")
          .transition()
          .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#d2d2d6";
        });
      });

      var legendLabels = city.append("text")
          .attr("x", w-padding.right + 2*margin) 
          .attr("y", function (d, i) { return (margin)+i*(margin); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
          .text(function(d) { return d.name; }); 

    }

    function buildChart(){
      svg = d3.select("#my-chart").append("svg").attr({
        width: w,
        height: h
      });
      
      d3.json("http://localhost:21302/api/D3Js", function (error, data) {
        //check the file loaded properly
        if (error) {
          $log.error(error);
        } else {
          $log.debug(data); //raw data
        }

        _data = data;
        for(var i = 0;i<_data.length;i++){
          _data[i].visible = true;
        }
        
        minDate = getDate(_data[0].values[0]['key']);
        maxDate = getDate(_data[0].values[_data[0].values.length - 1]['key']);
        
        //Create xScale
        xScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([padding.left + 5, w - padding.right]);
        
        yScale = d3.scale
        .linear()
        .domain([
          50,
          90
          ])
        .range([h - padding.top, 10])
        .nice();


        buildLines(_data, svg); //draw our line
        buildAxis(_data, svg); // draw our axis
      });
    }

    function refreshData(){
      d3.select("#my-chart>svg").remove();
      buildChart();
    }
   

    activate();

    ////////////////

    function activate() {
      buildChart();
    }
  }
})();
