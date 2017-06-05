(function () {
  'use strict';

  angular
    .module('app')
    .controller('D3JSAxisController', D3JSAxisController);

  D3JSAxisController.inject = ['$log'];

  function D3JSAxisController($log) {
    var h = 200;
    var w = 800;
    var padding = 20;

    var svg = d3.select("#axis").append("svg").attr({
      width: w,
      height: h
    });

    function getDate(d) {
      //20130101
      var strDate = new String(d);

      var year = strDate.substr(0, 4);
      var month = strDate.substr(4, 2) - 1; //zero based index
      var day = strDate.substr(6, 2);

      return new Date(year, month, day);
    }

    // Adapted from http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
    function hslToRgb(h, s, l) {
      var r, g, b;

      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
    };

    var randomColor = function () {
      var golden_ratio_conjugate = 0.618033988749895;
      var h = Math.random();

      h += golden_ratio_conjugate;
      h %= 1;
      return hslToRgb(h, 0.5, 0.60);
    };


    function showHeader(ds) {
      d3.select("#axis").append("h4")
        .text(ds.category + "Sales (2013)");
    }

    function buildLine(ds, svg) {
      var minDate = getDate(ds.monthlySales[0]['month']);
      var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1]['month']);

      //Creat xScale
      var xScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([padding + 5, w - padding]);

      var yScale = d3.scale
        .linear()
        .domain([
          0,
          d3.max(ds.monthlySales, function (d) {
            return d.sales;
          })
        ])
        .range([h - padding, 10])
        .nice();

      var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%b"));
      var yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(h / padding);

      var lineFun = d3.svg.line()
        .x(function (d) {
          return xScale(getDate(d.month));
        })
        .y(function (d) {
          return yScale(d.sales);
        });



      var xAxis = svg.append("g").call(xAxisGen)
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")");

      var yAxis = svg.append("g").call(yAxisGen)
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)");

      var viz = svg.append("path")
        .attr({
          d: lineFun(ds.monthlySales),
          "stroke": randomColor,
          "stroke-width": 2,
          "fill": "none"
        });

    
    
  
}

    d3.json("https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json", function (error, data) {

      //check the file loaded properly
      if (error) {
        $log.error(error);
      } else {
        $log.debug(data); //raw data
      }

      //decode our base64 data
      //and convert it into an array
      var decodedData = JSON.parse(window.atob(data.content));

      //see what we've got
      //should be [Object, Object]
      $log.debug(decodedData.contents)


      // $log.debug(decodedData.contents[0])
      // showHeader(decodedData.contents[0]); //give our chart a title
      // buildLine(decodedData.contents[0]); //draw our line

      decodedData.contents.forEach(function (ds, i) {
        // console.log(ds);
        // showHeader(ds); //give our chart a title

        buildLine(ds, svg); //draw our line
      });
    });

    activate();

    ////////////////

    function activate() {}
  }
})();
