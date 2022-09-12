import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Categories = () => {
    const labels = ['Teak Square Logs', 'Teak Round Logs'];
    const datasets = [
        {
            data: [12, 3],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 2,
        },
    ];

    const data = {
        labels,
        datasets
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    }

    return (
        <Doughnut data={data} options={options} />
    )
};

export default Categories;