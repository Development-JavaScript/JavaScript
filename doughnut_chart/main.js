// setup
const data = {
  labels: ['DIHS(50%)', '개인 및 기관 투자자(30%)', '외국인 투자자(20%)'],
  datasets: [{
    label: 'Percent(%)',
    data: [50, 30, 20],
    backgroundColor: [
      '#203d7a',
      '#4c78d4',
      '#eee'
    ],
    borderColor: [
      '#d6d6d6',
      '#d6d6d6',
      '#d6d6d6'
    ],
    borderWidth: 1,
    hoverBorderWidth: 2
  }]
};

const doughnutLabel = {
   id : 'doughnutLabel',
   beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx , data} = chart;

      ctx.save();
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      ctx.font = 'bold 24px Noto Sans KR';
      ctx.fillStyle = '#203d7a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DIHS', xCoor, yCoor);
   }
};

// config
const config = {
  type: 'doughnut',
  data,
  options: {
    plugins:{
        legend: {
            position: 'bottom',
            labels: {
                boxWidth: 20, padding: 18, font: {size: 14}
            },
        }
    }
  },
  plugins: [doughnutLabel]
  
};

// render init block
const myChart = new Chart(
  document.getElementById('myChart'),
  config
);

// Instantly assign Chart.js version
const chartVersion = document.getElementById('chartVersion');
chartVersion.innerText = Chart.version;