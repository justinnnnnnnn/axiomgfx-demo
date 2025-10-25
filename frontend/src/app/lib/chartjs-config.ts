import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

let isRegistered = false;

export const registerChartJS = () => {
  if (typeof window !== 'undefined' && !isRegistered) {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
      ArcElement
    );
    isRegistered = true;
  }
};

export { ChartJS };
