import { Population } from './features/population/Population';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">都道府県別 人口推移グラフ</header>
      <Population />
    </div>
  );
}

export default App;
