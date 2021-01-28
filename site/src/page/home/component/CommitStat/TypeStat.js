import { PieChartOutlined } from '@ant-design/icons';
import { Pie } from '@reactchartjs/react-chart.js';

const options = {
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: true,
    position: 'right',
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
};

function TypeStat() {
  const data = {
    labels: ['前端', '后端', '数据分析', '产品', '设计'],
    datasets: [
      {
        label: '# of Votes',
        data: [60, 15, 5, 15, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },

    ],
  };

  return (
    <div className="state-type">
      <p className="state-title">
        <PieChartOutlined className="state-icon" />类型分布
      </p>
      <div className="type-pie">
        <Pie
          width={250}
          height={200}
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}

export default TypeStat;
