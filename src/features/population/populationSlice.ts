import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

import { fetchPrefectures, fetchCompositions } from './populationAPI';

export type PrefCode = number;
export type Prefecture = {
  prefCode: PrefCode;
  prefName: string;
};

export type CompositionData = {
  label: string;
  data: Array<{ year: number; value: number }>;
};

export interface PopulationState {
  prefectures: Prefecture[];
  compositions: Record<PrefCode, CompositionData>;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PopulationState = {
  prefectures: [],
  compositions: {},
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPrefectures.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPrefectures.fulfilled, (state, action) => {
        state.status = 'idle';
        state.prefectures = action.payload.prefectures;
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
        state.compositions[prefCode] = action.payload.compositions?.[0];
      })
      .addCase(getCompositions.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectPrefectures = (state: RootState) =>
  state.population.prefectures;

export const selectCompositions = (state: RootState) =>
  state.population.compositions;

export default populationSlice.reducer;
