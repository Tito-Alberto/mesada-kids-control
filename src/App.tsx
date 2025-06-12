import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ParentDashboard from "./pages/ParentDashboard";
import ChildDashboard from "./pages/ChildDashboard";
import Login from "./pages/Login";
import RegisterParent from "./pages/RegisterParent";
import RequestAccess from "./pages/RequestAccess";
import AllowanceHistory from "./pages/AllowanceHistory";
import SpendingHistory from "./pages/SpendingHistory";
import NotFound from "./pages/NotFound";
import ManageChild from "./pages/ManageChild";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AuthenticatedApp = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={user?.type === 'parent' ? '/parent' : '/child'} replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route path="/register-parent" element={<RegisterParent />} />
        <Route path="/request-access" element={<RequestAccess />} />
        <Route 
          path="/parent" 
          element={
            <ProtectedRoute>
              <ParentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-child/:childId" 
          element={
            <ProtectedRoute>
              <ManageChild />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/child" 
          element={
            <ProtectedRoute>
              <ChildDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/allowance-history" 
          element={
            <ProtectedRoute>
              <AllowanceHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/spending-history" 
          element={
            <ProtectedRoute>
              <SpendingHistory />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
