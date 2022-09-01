import React, { FC, useCallback, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { useAppSelector } from '../../../app/hooks';
import { getRandomColorCode } from '../../../utils/colorCode';
import {
  PrefCode,
  Population,
  selectCheckedPrefs,
  selectPopulationData,
  selectPrefectureMap,
} from '../populationSlice';

export const PopulationGraph: FC = () => {
  const checkedPrefs = useAppSelector(selectCheckedPrefs);
  const populationData = useAppSelector(selectPopulationData);
  const prefectureMap = useAppSelector(selectPrefectureMap);

  const [colorCodes, setColorCodes] = useState<Record<PrefCode, string>>({});

  const renderLine = useCallback(
    (prefCode: PrefCode) => {
      let colorCode = colorCodes[prefCode];
      if (!colorCode) {
        colorCode = getRandomColorCode();
        setColorCodes({ ...colorCodes, [prefCode]: colorCode });
      }
      return (
        <Line
          key={prefCode}
          type="monotone"
          dataKey={prefCode}
          stroke={colorCodes[prefCode]}
        />
      );
    },
    [colorCodes]
  );

  const renderTooltipText = useCallback(
    (value: Population, name: PrefCode) => {
      return [`${value.toLocaleString()}人`, prefectureMap[name]];
    },
    [prefectureMap]
  );

  const renderLegendText = useCallback(
    (value: PrefCode) => {
      return prefectureMap[value];
    },
    [prefectureMap]
  );

  return (
    <ResponsiveContainer width="70%" height={300}>
      <LineChart
        width={500}
        height={300}
        data={populationData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={renderTooltipText} />
        <Legend formatter={renderLegendText} />
        {checkedPrefs.map(renderLine)}
      </LineChart>
    </ResponsiveContainer>
  );
};