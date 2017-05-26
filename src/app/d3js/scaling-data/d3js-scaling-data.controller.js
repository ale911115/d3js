(function () {
  'use strict';

  angular
    .module('app')
    .controller('D3JSScalingDataController', D3JSScalingDataController);

  D3JSScalingDataController.inject;

  function D3JSScalingDataController() {
    var h = 300;
    var w = 800;

    function showHeader(ds) {
      d3.select("#scaling-data").append("h4")
        .text(ds.category + "Sales (2013)");
    }

    function buildLine(ds) {
      //Creat xScale
      var xScale = d3.scale
        .linear()
        .domain([
          d3.min(ds.monthlySales, function (d) {
            return d.month;
          }),
          d3.max(ds.monthlySales, function (d) {
            return d.month;
          })
        ])
        .range([0, w]);

      var yScale = d3.scale
        .linear()
        .domain([
          0,
          d3.max(ds.monthlySales, function (d) {
            return d.sales;
          })
        ])
        .range([h, 0]);

      var lineFun = d3.svg.line()
        .x(function (d) {
          return xScale(d.month);
        })
        .y(function (d) {
          return yScale(d.sales);
        });

      var svg = d3.select("#scaling-data").append("svg").attr({
        width: w,
        height: h
      });

      var viz = svg.append("path")
        .attr({
          d: lineFun(ds.monthlySales),
          "stroke": "purple",
          "stroke-width": 2,
          "fill": "none"
        });
    }

    d3.json("https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json", function (error, data) {

      //check the file loaded properly
      if (error) {
        console.log(error);
      } else {
        console.log(data); //raw data
      }

      //decode our base64 data
      //and convert it into an array
      var decodedData = JSON.parse(window.atob(data.content));

      //see what we've got
      //should be [Object, Object]
      console.log(decodedData.contents);


      decodedData.contents.forEach(function (ds) {
        console.log(ds);
        showHeader(ds); //give our chart a title
        buildLine(ds); //draw our line
      });
    });

    activate();

    ////////////////

    function activate() {}
  }
})();
