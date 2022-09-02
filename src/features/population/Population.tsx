import { FC, useEffect, useRef } from 'react';

import { useAppDispatch } from '../../app/hooks';

import styles from './Population.module.css';
import { PopulationGraph } from './components/PopulationGraph';
import { PrefectureList } from './components/PrefectureList';
import { getPrefectures } from './populationSlice';

export const Population: FC = () => {
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <PopulationGraph />
      </div>
      <div className={styles.side}>
        <PrefectureList />
      </div>
    </div>
  );
};
