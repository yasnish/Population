import { FC } from 'react';

import styles from './Population.module.css';
import PopulationGraph from './components/PopulationGraph';
import PrefectureList from './components/PrefectureList';

const Population: FC = () => {
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

export default Population;
