import Config from '../../config.json';

import { Prefecture, PrefCode, CompositionData } from './populationSlice';

const RESAS_DOMAIN = 'https://opendata.resas-portal.go.jp';

export const fetchPrefectures = () => {
  return new Promise<{ prefectures: Prefecture[] }>((resolve, reject) => {
    const url = `${RESAS_DOMAIN}/api/v1/prefectures`;
    fetch(url, { headers: { 'X-API-KEY': Config.RESAS_API_KEY } })
      .then((response) => response.json())
      .then((data) => {
        resolve({ prefectures: data.result });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const fetchCompositions = (prefCode: PrefCode) => {
  return new Promise<{ compositions: CompositionData[] }>((resolve, reject) => {
    const api = `${RESAS_DOMAIN}/api/v1/population/composition/perYear`;
    const params = { prefCode: String(prefCode), cityCode: '-' };
    const searchParams = new URLSearchParams(params).toString();
    const url = `${api}/?${searchParams}`;
    fetch(url, { headers: { 'X-API-KEY': Config.RESAS_API_KEY } })
      .then((response) => response.json())
      .then((data) => {
        resolve({ compositions: data.result.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
