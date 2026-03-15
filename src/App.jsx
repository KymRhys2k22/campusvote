import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";

import StudentLoginInfo from "./pages/StudentLoginInfo.jsx";
import ElectionBallot from "./pages/ElectionBallot.jsx";
import CandidatePlatform from "./pages/CandidatePlatform.jsx";
import ReviewBallot from "./pages/ReviewBallot.jsx";

import VotingSuccess from "./pages/VotingSuccess.jsx";
import Comelec from "./pages/Comelec.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
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
              path="/success"
              element={
                <ProtectedRoute>
                  <VotingSuccess />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<Admin />} />
            <Route path="/comelec" element={<Comelec />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}
