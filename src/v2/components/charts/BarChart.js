import Chart from "react-apexcharts";

const BarChart = (props) => {

  const defaultOptions = {
    legend: {
      show: false,
    },
   
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: props.categories
        ? props.categories
        : [],
    },


    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "17%",
        endingShape: 'rounded',
        // borderRadius:'20px'
      },
    },
    colors: ["#769DEB", "#54DAF5",],
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    grid: {
      show: false,
    },
  };

  const options = props.options ? props.options : defaultOptions;
  const series = props.series;
  const height = props.height ? props.height : "160px";
  const width = props.width ? props.width : "100%";

  return (
    <Chart
      {...props}
      options={options}
      series={series}
      type="bar"
      height={height}
      width={width}
    />
  );
};

export default BarChart;


