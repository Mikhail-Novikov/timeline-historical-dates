import React from 'react';
import TimelineBlock from './components/TimelineBlock/TimelineBlock';
import { timelineData } from './data/timelineData';

const App: React.FC = () => {
  return (
    <main className="app-shell">
      <header className="timeline-block__header">
        <h1 className="timeline-block__title">Исторические<br />даты</h1>
      </header>
      <TimelineBlock periods={timelineData} title={''} />
    </main>
  );
};

export default App;

