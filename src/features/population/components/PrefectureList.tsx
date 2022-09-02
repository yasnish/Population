import { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  PrefCode,
  Prefecture,
  getCompositions,
  selectCheckedPrefs,
  selectCompositions,
  selectPrefectures,
  setCheckedPrefs,
} from '../populationSlice';
import { getPrefectures } from '../populationSlice';

import styles from './PrefectureList.module.css';

const PrefectureList: FC = () => {
  const prefectures = useAppSelector(selectPrefectures);
  const checkedPrefs = useAppSelector(selectCheckedPrefs);
  const compositions = useAppSelector(selectCompositions);
  const dispatch = useAppDispatch();

  // for called twice in StrictMode
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      dispatch(getPrefectures());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCompositions = useCallback(
    (prefCode: PrefCode) => {
      // fetch data only once
      if (!compositions[prefCode]) {
        dispatch(getCompositions(prefCode));
      }
    },
    [compositions, dispatch]
  );

  const checkedPrefSet = useMemo(() => new Set(checkedPrefs), [checkedPrefs]);
  const handleChange = useCallback(
    (prefCode: PrefCode, checked: boolean) => {
      if (!checkedPrefSet.has(prefCode)) {
        fetchCompositions(prefCode);
      }
      dispatch(setCheckedPrefs({ prefCode, checked }));
    },
    [checkedPrefSet, dispatch, fetchCompositions]
  );

  const checkBoxes = useMemo(
    () =>
      prefectures.map(({ prefCode, prefName }: Prefecture) => {
        return (
          <li key={prefCode} className={styles.item}>
            <label className={styles.label}>
              <input
                type="checkbox"
                value={prefCode}
                checked={checkedPrefSet.has(prefCode)}
                onChange={(e) => handleChange(prefCode, e.target.checked)}
              />
              <span>{prefName}</span>
            </label>
          </li>
        );
      }),
    [checkedPrefSet, handleChange, prefectures]
  );

  return <ul className={styles.list}>{checkBoxes}</ul>;
};

export default PrefectureList;
