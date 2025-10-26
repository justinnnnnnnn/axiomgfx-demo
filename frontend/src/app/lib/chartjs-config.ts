let isRegistered = false;

export const registerChartJS = async () => {
  if (typeof window !== 'undefined' && !isRegistered) {
    // Dynamic import to ensure Chart.js is only loaded on client side
    const chartModule = await import('chart.js');
    const {
      Chart: ChartJS,
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend,
      ArcElement,
      PointElement,
      LineElement,
    } = chartModule;

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
    return ChartJS;
  }
};

export const getChartJS = async () => {
  if (typeof window !== 'undefined') {
    const chartModule = await import('chart.js');
    return chartModule.Chart;
  }
  return null;
};
