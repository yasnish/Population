import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

import { fetchPrefectures, fetchCompositions } from './populationAPI';

export type PrefCode = string;
export type Year = string;
export type Population = number;
export type Prefecture = {
  prefCode: PrefCode;
  prefName: string;
};

export interface PopulationState {
  prefectures: Prefecture[];
  compositions: Record<PrefCode, Record<Year, Population>>;
  checkedPrefs: PrefCode[];
  //TODO define status as constants
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PopulationState = {
  prefectures: [],
  compositions: {},
  checkedPrefs: [],
  status: 'idle',
};

export const getPrefectures = createAsyncThunk(
  'population/getPrefectures',
  async () => {
    const response = await fetchPrefectures();
    return response;
  }
);

export const getCompositions = createAsyncThunk(
  'population/getCompositions',
  async (prefCode: PrefCode) => {
    const response = await fetchCompositions(prefCode);
    return response;
  }
);

export const populationSlice = createSlice({
  name: 'population',
  initialState,
  reducers: {
    setCheckedPrefs: (
      state,
      action: PayloadAction<{ prefCode: PrefCode; checked: boolean }>
    ) => {
      const { prefCode, checked } = action.payload;
      const checkedPrefSet = new Set<PrefCode>(state.checkedPrefs);
      if (checked) {
        checkedPrefSet.add(prefCode);
      } else {
        checkedPrefSet.delete(prefCode);
      }
      state.checkedPrefs = [...checkedPrefSet];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPrefectures.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPrefectures.fulfilled, (state, action) => {
        state.status = 'idle';
        // convert prefCode to string
        state.prefectures = action.payload.prefectures.map((prefecture) => {
          return {
            prefCode: String(prefecture.prefCode),
            prefName: prefecture.prefName,
          };
        });
      })
      .addCase(getPrefectures.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getCompositions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCompositions.fulfilled, (state, action) => {
        state.status = 'idle';
        const prefCode = action.meta.arg;
        const totalPopulation = action.payload.compositions?.[0]?.data;

        // when invalid data
        if (!totalPopulation) return;

        state.compositions[prefCode] = totalPopulation.reduce((prev, curr) => {
          return { ...prev, [`${curr.year}`]: curr.value };
        }, {});
      })
      .addCase(getCompositions.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setCheckedPrefs } = populationSlice.actions;

export const selectPrefectures = (state: RootState) =>
  state.population.prefectures;

export const selectCompositions = (state: RootState) =>
  state.population.compositions;

export const selectCheckedPrefs = (state: RootState) =>
  state.population.checkedPrefs;

export const selectPrefectureMap = createSelector(
  selectPrefectures,
  (prefectures): Record<PrefCode, string> => {
    return prefectures.reduce((prev, curr) => {
      return { ...prev, [curr.prefCode]: curr.prefName };
    }, {});
  }
);

export const selectPopulationData = createSelector(
  selectCheckedPrefs,
  selectCompositions,
  (checkedPrefs, compositions) => {
    // when all not checked
    if (checkedPrefs.length === 0) {
      return [];
    }

    const populationData: {
      [key: Year]: { [key: PrefCode]: Population };
    } = {};
    checkedPrefs.forEach((prefCode) => {
      const data = compositions[prefCode] || {};
      Object.entries(data).forEach(([year, population]) => {
        populationData[year] = {
          ...populationData[year],
          [prefCode]: population,
        };
      });
    });
    return Object.keys(populationData).map((year) => {
      return { year, ...populationData[year] };
    });
  }
);

export default populationSlice.reducer;
