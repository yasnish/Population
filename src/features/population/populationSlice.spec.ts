import populationReducer, {
  getCompositions,
  getPrefectures,
  PopulationState,
  setCheckedPrefs,
  selectPrefectureMap,
  selectPopulationData,
} from './populationSlice';

describe('population slice', () => {
  const initialState: PopulationState = {
    prefectures: [],
    compositions: {},
    checkedPrefs: [],
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(populationReducer(undefined, { type: 'unknown' })).toEqual({
      prefectures: [],
      compositions: {},
      checkedPrefs: [],
      status: 'idle',
    });
  });
  describe('getPrefectures reducer', () => {
    it('should be loading status', () => {
      const action = { type: getPrefectures.pending.type };
      const actual = populationReducer(initialState, action);
      expect(actual.status).toEqual('loading');
    });
    it('should be idle status', () => {
      const action = {
        type: getPrefectures.fulfilled.type,
        payload: { prefectures: [] },
      };
      const actual = populationReducer(initialState, action);
      expect(actual.status).toEqual('idle');
    });
    it('should be failed status', () => {
      const action = { type: getPrefectures.rejected.type };
      const actual = populationReducer(initialState, action);
      expect(actual.status).toEqual('failed');
    });
  });
  describe('getCompositions reducer', () => {
    it('should be loading status', () => {
      const action = { type: getCompositions.pending.type };
      const actual = populationReducer(initialState, action);
      expect(actual.status).toEqual('loading');
    });
    it('should be idle status', () => {
      const data = [
        { year: 1960, value: 5504746 },
        { year: 1965, value: 6657189 },
        { year: 1970, value: 7620480 },
        { year: 1975, value: 8278925 },
        { year: 1980, value: 8473446 },
      ];
      const action = {
        type: getCompositions.fulfilled.type,
        meta: { arg: '27' },
        payload: {
          compositions: [{ data }],
        },
      };
      const actual = populationReducer(initialState, action);
      expect(actual.status).toEqual('idle');
      const expectedData = {
        '27': {
          '1960': 5504746,
          '1965': 6657189,
          '1970': 7620480,
          '1975': 8278925,
          '1980': 8473446,
        },
      };
      expect(actual.compositions).toEqual(expectedData);
    });
    it('should be failed status', () => {
      const action = { type: getCompositions.rejected.type };
      const actual = populationReducer(initialState, action);
      expect(actual.status).toEqual('failed');
    });
  });
  describe('setCheckedPrefs reducer', () => {
    it('should add "1" to empty list', () => {
      const actual = populationReducer(
        initialState,
        setCheckedPrefs({ prefCode: '1', checked: true })
      );
      expect(actual.checkedPrefs).toEqual(['1']);
    });
    it('should add "2" to one item list', () => {
      const actual = populationReducer(
        { ...initialState, checkedPrefs: ['1'] },
        setCheckedPrefs({ prefCode: '2', checked: true })
      );
      expect(actual.checkedPrefs).toEqual(['1', '2']);
    });
    it('should add "3" to two items list', () => {
      const actual = populationReducer(
        { ...initialState, checkedPrefs: ['1', '2'] },
        setCheckedPrefs({ prefCode: '3', checked: true })
      );
      expect(actual.checkedPrefs).toEqual(['1', '2', '3']);
    });
    it('should remove "2" from checkedPrefs', () => {
      const actual = populationReducer(
        { ...initialState, checkedPrefs: ['1', '2', '3'] },
        setCheckedPrefs({ prefCode: '2', checked: false })
      );
      expect(actual.checkedPrefs).toEqual(['1', '3']);
    });
  });
  describe('selectPrefectureMap', () => {
    const prefectures = [
      { prefCode: '13', prefName: '東京都' },
      { prefCode: '27', prefName: '大阪府' },
      { prefCode: '47', prefName: '沖縄県' },
    ];
    it('should return empty object', () => {
      const actual = selectPrefectureMap({ population: initialState });
      expect(actual).toEqual({});
    });
    it('should return one item object', () => {
      const population: PopulationState = {
        ...initialState,
        prefectures: [prefectures[0]],
      };
      const actual = selectPrefectureMap({ population });
      expect(actual).toEqual({ '13': '東京都' });
    });
    it('should return three items object', () => {
      const population: PopulationState = {
        ...initialState,
        prefectures,
      };
      const actual = selectPrefectureMap({ population });
      expect(actual).toEqual({
        '13': '東京都',
        '27': '大阪府',
        '47': '沖縄県',
      });
    });
  });

  describe('selectPopulationData', () => {
    const population = {
      ...initialState,
      compositions: {
        '13': {
          '1960': 9683802,
          '1965': 10869244,
          '1970': 11408071,
          '1975': 11673554,
          '1980': 11618281,
        },
        '27': {
          '1960': 5504746,
          '1965': 6657189,
          '1970': 7620480,
          '1975': 8278925,
          '1980': 8473446,
        },
        '47': {
          '1960': 883122,
          '1965': 934176,
          '1970': 945111,
          '1975': 1042572,
          '1980': 1106559,
        },
      },
    };
    it('should return empty list', () => {
      const actual = selectPopulationData({ population: initialState });
      expect(actual).toEqual([]);
    });
    it('should return empty list when prefecture unchecked', () => {
      const actual = selectPopulationData({ population });
      expect(actual).toEqual([]);
    });
    it('should return empty list when unknown checked', () => {
      const actual = selectPopulationData({
        population: { ...population, checkedPrefs: ['99'] },
      });
      expect(actual).toEqual([]);
    });
    it('should return populationData when one prefecture checked', () => {
      const actual = selectPopulationData({
        population: { ...population, checkedPrefs: ['27'] },
      });
      expect(actual).toEqual([
        { year: '1960', '27': 5504746 },
        { year: '1965', '27': 6657189 },
        { year: '1970', '27': 7620480 },
        { year: '1975', '27': 8278925 },
        { year: '1980', '27': 8473446 },
      ]);
    });
    it('should return populationData when two prefectures checked', () => {
      const actual = selectPopulationData({
        population: { ...population, checkedPrefs: ['27', '13'] },
      });
      expect(actual).toEqual([
        { year: '1960', '13': 9683802, '27': 5504746 },
        { year: '1965', '13': 10869244, '27': 6657189 },
        { year: '1970', '13': 11408071, '27': 7620480 },
        { year: '1975', '13': 11673554, '27': 8278925 },
        { year: '1980', '13': 11618281, '27': 8473446 },
      ]);
    });
    it('should return populationData when three prefectures checked', () => {
      const actual = selectPopulationData({
        population: { ...population, checkedPrefs: ['27', '13', '47'] },
      });
      expect(actual).toEqual([
        { year: '1960', '13': 9683802, '27': 5504746, '47': 883122 },
        { year: '1965', '13': 10869244, '27': 6657189, '47': 934176 },
        { year: '1970', '13': 11408071, '27': 7620480, '47': 945111 },
        { year: '1975', '13': 11673554, '27': 8278925, '47': 1042572 },
        { year: '1980', '13': 11618281, '27': 8473446, '47': 1106559 },
      ]);
    });
  });
});
