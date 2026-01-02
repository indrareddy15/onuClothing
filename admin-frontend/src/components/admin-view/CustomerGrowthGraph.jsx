import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CustomerGrowthGraph = ({ customerData }) => {
  const data = {
    labels: customerData.map((data) => data.month),
    datasets: [
      {
        label: "Total Customers",
        data: customerData.map((data) => data.count),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "rgb(75, 192, 192)"
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: "Customer Growth Over Time"
      },
      tooltip: {
        mode: "index",
        intersect: false
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <Line data={data} options={options} />
    </div>
  );
};

export default CustomerGrowthGraph;
