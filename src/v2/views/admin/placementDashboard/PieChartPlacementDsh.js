import Chart from "react-apexcharts";

export default function PieCharts() {
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
        series: [55, 30, 15],
        labels: ['A', 'B', 'C']
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