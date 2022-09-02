import ErrorBoundary from './app/ErrorBoundary';
import { Population } from './features/population/Population';
import './App.css';

const App = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <header className="header">都道府県別 人口推移グラフ</header>
        <Population />
      </div>
    </ErrorBoundary>
  );
};

export default App;
