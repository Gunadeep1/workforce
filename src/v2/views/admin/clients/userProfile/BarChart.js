import Chart from "react-apexcharts";

export default function BarChart({ overView }) {
    const pieData = {
        options: {
            chart: {
                type: 'bar',
                toolbar: {
                    show: false,
                },
            },
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '26%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: overView && overView.xaxis.categories,
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$ " + val + " thousands"
                    }
                }
            }
        },
        series: overView && overView.series,
        labels: overView && overView.labels
    };
    return (
        <Chart
            options={pieData.options}
            series={pieData.series}
            type="bar"
            height={210}
            width={'100%'}
        />
    );
}
