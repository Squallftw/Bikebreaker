import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PickPart } from './screens/PickPart';
import { Results } from './screens/Results';
import { MyBuild } from './screens/MyBuild';
import { useStore } from './store/useStore';

/** First run (no part chosen) starts at the picker; returning users go to results. */
function Landing() {
  const hasChosen = useStore((s) => s.hasChosen);
  return <Navigate to={hasChosen ? '/results' : '/pick'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/pick" element={<PickPart />} />
        <Route path="/results" element={<Results />} />
        <Route path="/build" element={<MyBuild />} />
        <Route path="*" element={<Landing />} />
      </Route>
    </Routes>
  );
}
