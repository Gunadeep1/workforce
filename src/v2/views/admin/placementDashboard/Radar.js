import { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function Radar(props) {
    useLayoutEffect(() => {
        var root = am5.Root.new("chartdiv");

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        
        // Generate and set data
        // https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
        var cat = -1;
        
        function generateData() {
          var value = Math.round(Math.random() * 10);
          cat++;
          return {
            category: "cat" + cat,
            value: value
          };
        }
        
        function generateDatas(count) {
          cat = -1;
          var data = [];
          for (var i = 0; i < count; ++i) {
            data.push(generateData());
          }
          return data;
        }
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/radar-chart/
        var chart = root.container.children.push(am5radar.RadarChart.new(root, {
          panX: false,
          panY: false,
          inverseOrder: false,
          startAngle: 0,
          endAngle: 270,
          offsetX: 0,
          offsetY: 0,
        //   wheelX: "panX",
        //   wheelY: "zoomX",
          innerRadius: am5.percent(30)
        }));
        
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
        var cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
          behavior: "zoomX"
        }));
        
        cursor.lineY.set("visible", false);
        
        // Create axes and their renderers
        // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
        var xRenderer = am5radar.AxisRendererCircular.new(root, {
          strokeOpacity: 0.1,
          minGridDistance: 50
        });
        
        xRenderer.labels.template.setAll({
          radius: 10,
          maxPosition: 0.98
        });
        
        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
          renderer: xRenderer,
          extraMax: 0.1,
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
          categoryField: "category",
          renderer: am5radar.AxisRendererRadial.new(root, { minGridDistance: 20 })
        }));
        
        // Create series
        // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
        for (var i = 0; i < 5; i++) {
          var series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
            stacked: true,
            name: "Series " + i,
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "value",
            categoryYField: "category"
          }));
        
          series.set("stroke", root.interfaceColors.get("background"));
          series.columns.template.setAll({
            width: am5.p100,
            strokeOpacity: 0.1,
            tooltipText: "{name}: {valueX}"
          });
        
          series.data.setAll(generateDatas(6));
          series.appear(1000);
        }
        
        // Add scrollbars
        // chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal", exportable: false }));
        // chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical", exportable: false }));
        
        var data = generateDatas(10);
        yAxis.data.setAll(data);
        
        // Animate chart and series in
        // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div id="chartdiv" style={{ width: "500px", height: "500px" }}></div>
    );
}
export default Radar;