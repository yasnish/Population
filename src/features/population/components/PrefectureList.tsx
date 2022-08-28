import { FC, useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  PrefCode,
  Prefecture,
  getCompositions,
  selectCompositions,
  selectPrefectures,
} from '../populationSlice';

export const PrefectureList: FC = () => {
  const prefectures = useAppSelector(selectPrefectures);
  const compositions = useAppSelector(selectCompositions);
  const dispatch = useAppDispatch();
  const [checkedItems, setCheckedItems] = useState(new Set());

  const fetchCompositions = useCallback(
    (prefCode: PrefCode) => {
      // fetch data only once
      if (!compositions[prefCode]) {
        dispatch(getCompositions(prefCode));
      }
    },
    [compositions, dispatch]
  );
  const handleChange = useCallback(
    (prefCode: PrefCode) => {
      const newCheckedItems = new Set(checkedItems);
      if (checkedItems.has(prefCode)) {
        newCheckedItems.delete(prefCode);
      } else {
        newCheckedItems.add(prefCode);
        fetchCompositions(prefCode);
      }
      setCheckedItems(newCheckedItems);
    },
    [checkedItems, fetchCompositions]
  );

  const checkBoxes = prefectures.map(({ prefCode, prefName }: Prefecture) => {
    return (
      <label key={prefCode}>
        <input
          type="checkbox"
          value={prefCode}
          checked={checkedItems.has(prefCode)}
          onChange={() => handleChange(prefCode)}
        />
        <span>{prefName}</span>
      </label>
    );
  });
  return <div>{checkBoxes}</div>;
};
