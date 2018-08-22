import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SISpinner from './Spinner';

const SILineChart = ({ chartData, title, footer, isLoading, chartId, yAxisLabel, error }) => {
  const CustomizedAxisTick = (attributes) => {
    const { x, y, dx, dy, r, payload } = attributes;
    return (
      <g transform={`translate(${x},${y})`} style={{ height: '150%' }}>
        <text x={0} y={0} dx={dx} dy={dy} textAnchor="end" fill="#666" fontSize={10} transform={`rotate(${r})`}>{payload.value}</text>
      </g>
    );
  };

  return (
    <div className="si-linechart-container">
      <div className={`si-chart-display ${!chartData.length || isLoading || error ? 'blur' : ''}`}>
        <h1 className="si-chart-title">{title}</h1>
        <ResponsiveContainer aspect={1.0 / 0.25}>
          <LineChart
            data={chartData.length ? chartData : [{ name: '', value: 0 }]}
            margin={{ top: 5, right: 10, bottom: 5, left: 5 }}
          >
            <XAxis dataKey="xValue" tick={<CustomizedAxisTick dy={16} r={-10} />} interval={0} />
            <YAxis tick={<CustomizedAxisTick dx={-5} dy={5} r={0} />} domain={['dataMin', 'auto']} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="yValue"
              stroke="#0069ba"
              activeDot={{ r: 8 }}
              strokeWidth={3}
              name={yAxisLabel || 'Count'}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="si-chart-footer">
          { footer }
        </div>
      </div>
      {isLoading
        ? <SISpinner spinnerId={chartId} />
        : error
          ? <div className="si-dimmer"><p>{error}</p></div>
          : !chartData.length
            ? <div className="si-dimmer"><p>No data was found to display.</p></div>
            : null
      }
    </div>
  );
};

SILineChart.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  chartId: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  footer: PropTypes.node,
  yAxisLabel: PropTypes.string,
};

SILineChart.defaultProps = {
  chartId: '',
  isLoading: false,
  footer: null,
  yAxisLabel: '',
  error: '',
};

export default SILineChart;
