import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';

import { useAppSelector } from '../../../app/hooks';
import { getRandomColorCode } from '../../../utils/colorCode';
import {
  PrefCode,
  Population,
  Year,
  selectCheckedPrefs,
  selectPopulationData,
  selectPrefectureMap,
} from '../populationSlice';

export const PopulationGraph: FC = () => {
  const checkedPrefs = useAppSelector(selectCheckedPrefs);
  const populationData = useAppSelector(selectPopulationData);
  const prefectureMap = useAppSelector(selectPrefectureMap);

  const [colorCodes, setColorCodes] = useState<Record<PrefCode, string>>({});

  const hasCheckedPrefs = useMemo(
    () => checkedPrefs.length > 0,
    [checkedPrefs.length]
  );

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

  const renderYearLabel = useCallback((value: Year) => {
    return `${value}年`;
  }, []);

  const renderPopulationLabel = useCallback((value: Population) => {
    return value >= 10000 ? `${value / 10000}万人` : `${value}人`;
  }, []);

  const renderTooltipLabel = useCallback((value: Year) => {
    return `${value}年`;
  }, []);

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
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={populationData}
        margin={{
          right: 50,
          left: 10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          tickFormatter={renderYearLabel}
          hide={!hasCheckedPrefs}
        />
        <YAxis tickFormatter={renderPopulationLabel} hide={!hasCheckedPrefs}>
          <Label value="人口" angle={-90} offset={-20} position="insideLeft" />
        </YAxis>
        <Tooltip
          labelFormatter={renderTooltipLabel}
          formatter={renderTooltipText}
        />
        <Legend formatter={renderLegendText} />
        {checkedPrefs.map(renderLine)}
      </LineChart>
    </ResponsiveContainer>
  );
};
