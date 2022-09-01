import { PrefCode } from './populationSlice';
const RESAS_API_KEY = process.env.REACT_APP_RESAS_API_KEY || '<YOUR_API_KEY>';
const RESAS_DOMAIN = 'https://opendata.resas-portal.go.jp';

// TODO fetch部分の共通化
type Prefecture = {
  prefCode: number;
  prefName: string;
};
export const fetchPrefectures = () => {
  return new Promise<{ prefectures: Prefecture[] }>((resolve, reject) => {
    const url = `${RESAS_DOMAIN}/api/v1/prefectures`;
    fetch(url, { headers: { 'X-API-KEY': RESAS_API_KEY } })
      .then((response) => response.json())
      .then((data) => {
        if (data.message !== null) {
          throw new Error(
            `API error: status(${data.statusCode}) ${data.message}`
          );
        }
        resolve({ prefectures: data.result });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

type Composition = {
  label: string;
  data: Array<{ year: number; value: number }>;
};
export const fetchCompositions = (prefCode: PrefCode) => {
  return new Promise<{ compositions: Composition[] }>((resolve, reject) => {
    const api = `${RESAS_DOMAIN}/api/v1/population/composition/perYear`;
    const params = { prefCode: String(prefCode), cityCode: '-' };
    const searchParams = new URLSearchParams(params).toString();
    const url = `${api}/?${searchParams}`;
    fetch(url, { headers: { 'X-API-KEY': RESAS_API_KEY } })
      .then((response) => response.json())
      .then((data) => {
        if (data.message !== null) {
          throw new Error(
            `API error: status(${data.statusCode}) ${data.message}`
          );
        }
        resolve({ compositions: data.result.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
