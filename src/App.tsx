import GameField from "./components/GameField";
if (import.meta.env.DEV) {
    import('./components/Test');
}

const App = () => {
  return <div>
    <GameField/>
  </div>;
}

export default App;