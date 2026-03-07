import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import StudentLoginInfo from "./pages/StudentLoginInfo.jsx";
import ElectionBallot from "./pages/ElectionBallot.jsx";
import CandidatePlatform from "./pages/CandidatePlatform.jsx";
import ReviewBallot from "./pages/ReviewBallot.jsx";
import ElectionResults from "./pages/ElectionResults.jsx";
import VotingSuccess from "./pages/VotingSuccess.jsx";
import Comelec from "./pages/Comelec.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StudentLoginInfo />} />

          <Route
            path="/ballot/:electionId"
            element={
              <ProtectedRoute>
                <ElectionBallot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/:id"
            element={
              <ProtectedRoute>
                <CandidatePlatform />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review"
            element={
              <ProtectedRoute>
                <ReviewBallot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ElectionResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <VotingSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="/comelec" element={<Comelec />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
