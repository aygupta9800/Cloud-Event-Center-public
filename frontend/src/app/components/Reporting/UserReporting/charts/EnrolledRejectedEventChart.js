
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

export const EnrolledRejectedEventChart = ({ approved , rejected }) => {
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
        text: "Events Enrolled/Rejected by Action Time",
      },
    },
    
  };

  const rejectedLabels = rejected.map(({ timestamp }) => timestamp);
  const approvedLabels = approved.map(({ timestamp }) => timestamp);
  const labels = [...new Set([...approvedLabels ,...rejectedLabels])]; 

  console.log(rejected.map(({ totalEvents }) => totalEvents));

  const data = {
    labels,
    datasets: [
      {
        label: "Total Approved Events",
        data: approved.map(({ totalEvents }) => totalEvents),
        // map((company) => {
        //   return company.averageRating;
        // }),
        borderColor: "rgb(0, 100, 0)",
        backgroundColor: "rgba(0, 100, 0, 0.5)",
      },

      {
        label: "Total Rejected Events",
        data: rejected.map(({ totalEvents }) => totalEvents),
        // map((company) => {
        //   return company.averageRating;
        // }),
        borderColor: "rgb(100, 0, 0)",
        backgroundColor: "rgba(100, 0, 0, 0.5)",
      }
      

    ],
  };
  return <Line options={options} data={data} style={{ width: "450px" }} />;
  // <Bar options={options} data={data} style={{ width: "450px" }} />;
};
