import { useState } from 'react';
import GameField from "./components/GameField";
import LoadingScreen from './components/LoadingScreen';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    if (isLoading) {
        return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
    }

    return <GameField />;
}

export default App;