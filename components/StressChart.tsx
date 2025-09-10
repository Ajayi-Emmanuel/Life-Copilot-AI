
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { StressPoint } from '../types';

interface StressChartProps {
  data: StressPoint[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="font-bold text-brand-dark dark:text-brand-light">{`${new Date(label + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`}</p>
        <p className="text-brand-secondary">{`Stress Level: ${data.stressLevel}`}</p>
      </div>
    );
  }
  return null;
};

const StressChart: React.FC<StressChartProps> = ({ data }) => {
  const formattedData = data.map(point => ({
    ...point,
    shortDate: new Date(point.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));
  
  const gradientId = "stressGradient";

  const getGradientColor = (stressLevel: number) => {
    if (stressLevel >= 8) return "stop-accent-danger";
    if (stressLevel >= 5) return "stop-accent-warning";
    return "stop-accent-success";
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg h-96">
      <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light mb-4">7-Day Stress Forecast</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
        >
           <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="shortDate" tick={{ fill: 'rgb(100 116 139)' }} />
          <YAxis domain={[0, 10]} allowDecimals={false} tick={{ fill: 'rgb(100 116 139)' }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="stressLevel" stroke="#1e3a8a" fillOpacity={1} fill={`url(#${gradientId})`} strokeWidth={3} />
          <ReferenceLine y={7} label={{ value: "High Stress", position: 'insideTopRight', fill: '#dc2626', fontSize: 12, fontWeight: 'bold' }} stroke="#dc2626" strokeDasharray="3 3" />
          <ReferenceLine y={4} label={{ value: "Moderate", position: 'insideTopRight', fill: '#f59e0b', fontSize: 12 }} stroke="#f59e0b" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StressChart;
