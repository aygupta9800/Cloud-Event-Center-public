
   import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

export const SignedUpChart = ({ signedup }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Registered Events by Action Time",
      },
    },
  };

  const labels = signedup.map(({ timestamp }) => timestamp);

  console.log(signedup.map(({ totalEvents }) => totalEvents));

  const data = {
    labels,
    datasets: [
      {
        label: "Total Events",
        data: signedup.map(({ totalEvents }) => totalEvents),
        // map((company) => {
        //   return company.averageRating;
        // }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Line options={options} data={data} style={{ width: "450px" }} />;
  // <Bar options={options} data={data} style={{ width: "450px" }} />;
};
