import React from 'react';
import TimelineBlock from './components/TimelineBlock/TimelineBlock';
import { timelineData } from './data/timelineData';

const App: React.FC = () => {
  return (
    <main className="app-shell">
      <TimelineBlock title="Исторические даты" periods={timelineData} />
    </main>
  );
};

export default App;

