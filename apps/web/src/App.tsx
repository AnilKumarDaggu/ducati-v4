import { Navigate, Route, Routes } from 'react-router';
import { Esplora } from './routes/Esplora';

/**
 * Route shell (ARCH-002 §2, names per UXD-001 screen inventory).
 * Future screens mount here: /lezione/:unitId (S3), /officina/:stationId (S3).
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/esplora" replace />} />
      <Route path="/esplora/:bomId?" element={<Esplora />} />
      <Route path="*" element={<Navigate to="/esplora" replace />} />
    </Routes>
  );
}
