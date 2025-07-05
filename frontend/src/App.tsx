import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContextSelector } from 'use-context-selector';
import { Toaster } from 'react-hot-toast';

import Auth from './pages/Auth';
import Unauthorized from './pages/Unauthorized';
import { Layout } from "./components/Layout";

import Usuarios from './pages/Usuarios';
import Kits from './pages/Kits';
import Aniversariantes from './pages/Aniversariantes';
import Envios from './pages/Envios';
import Departamentos from './pages/Departamentos';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useContextSelector(AuthContext, (ctx) => ctx.isAuthenticated);
  const isLoading = useContextSelector(AuthContext, (ctx) => ctx.isLoading);

  if (isLoading) {
    return <div className="p-10 text-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: '#4CAF50', color: 'white' } },
          error: { style: { background: '#F44336', color: 'white' } },
        }}
      />

      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/usuarios" />} />

          <Route
            path="usuarios"
            element={
              <PrivateRoute>
                <Usuarios />
              </PrivateRoute>
            }
          />

          <Route
            path="departamentos"
            element={
              <PrivateRoute>
                <Departamentos />
              </PrivateRoute>
            }
          />

          <Route
            path="kits"
            element={
              <PrivateRoute>
                <Kits />
              </PrivateRoute>
            }
          />

          <Route
            path="aniversariantes"
            element={
              <PrivateRoute>
                <Aniversariantes />
              </PrivateRoute>
            }
          />

          <Route
            path="envios"
            element={
              <PrivateRoute>
                <Envios />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}