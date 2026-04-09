import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";

// Lazy-loaded components
const StudentLoginInfo = lazy(() => import("./pages/StudentLoginInfo.jsx"));
const ElectionBallot = lazy(() => import("./pages/ElectionBallot.jsx"));
const CandidatePlatform = lazy(() => import("./pages/CandidatePlatform.jsx"));
const ReviewBallot = lazy(() => import("./pages/ReviewBallot.jsx"));
const VotingSuccess = lazy(() => import("./pages/VotingSuccess.jsx"));
const Comelec = lazy(() => import("./pages/Comelec.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background-light flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-xs">
        Loading...
      </p>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}
