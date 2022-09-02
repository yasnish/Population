import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './app/store';

describe('App', () => {
  test('renders title text', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/都道府県別 人口推移グラフ/)).toBeInTheDocument();
  });
});
