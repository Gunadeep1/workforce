import Chart from "react-apexcharts";

export default function PieChartPlacement(props) {
    const pieData = {
        options: {
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false,
            },
            labels: [ "In Training", "In Marketing", "In Project"],
            colors: ['#60B2EE', '#77D2B7', "#FEB127"],
        },
        series: [Number(props.data && props.data.employees_in_training), Number(props.data && props.data.employees_in_marketing), Number(props.data && props.data.employees_in_project)],
        labels: ["In Training", "In Marketing", "In Project"]
    };
    return (
        <Chart
            options={pieData.options}
            series={pieData.series}
            type="donut"
            height={'162px'}
            width={'162px'}
        />
    );
}