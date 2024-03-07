import Chart from "react-apexcharts";

export default function PieCharts({ overView }) {
    const pieData = {
        options: {
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false,
            },
            labels: overView && overView.labels,
            colors: ['#FCA5A5', '#78B2F2'],
        },
        series: overView && [overView.over_due_amount,overView.received_amount],
        labels: overView && overView.labels
    };
    return (
        <Chart
            options={pieData.options}
            series={pieData.series}
            type="donut"
            height={'140px'}
            width={'140px'}
        />
    );
}