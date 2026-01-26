import { useEffect } from 'react';
import { runMonteCarloSimulation } from './Test';

const TestRunner = () => {
    useEffect(() => {
        runMonteCarloSimulation(1000000, 20);
    }, []);
    
    return null;
};

export default TestRunner;