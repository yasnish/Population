import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';

import Population from '../Population';
import populationReducer from '../populationSlice';

describe('Population', () => {
  const server = setupServer(
    rest.get(
      'https://opendata.resas-portal.go.jp/api/v1/prefectures',
      (req, res, ctx) => {
        return res(
          ctx.status(202, 'Mocked status'),
          ctx.json({
            message: null,
            result: [
              { prefCode: 13, prefName: '東京都' },
              { prefCode: 27, prefName: '大阪府' },
              { prefCode: 47, prefName: '沖縄県' },
            ],
          })
        );
      }
    )
  );

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  const renderPopulation = () => {
    const reducer = {
      population: populationReducer,
    };
    const store = configureStore({
      reducer,
      preloadedState: {
        population: {
          prefectures: [
            { prefCode: '13', prefName: '東京都' },
            { prefCode: '27', prefName: '大阪府' },
            { prefCode: '47', prefName: '沖縄県' },
          ],
          compositions: {},
          checkedPrefs: ['27'],
          status: 'idle',
        },
      },
    });
    return render(
      <Provider store={store}>
        <Population />
      </Provider>
    );
  };
  test('render prefectures', async () => {
    renderPopulation();
    expect(screen.getByText('東京都')).toBeInTheDocument();
    expect(screen.getByText('大阪府')).toBeInTheDocument();
    expect(screen.getByText('沖縄県')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });
});
