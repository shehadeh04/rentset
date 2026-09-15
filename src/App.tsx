import { Route, Routes } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout'
import Overview from '@/pages/workspace/Overview'
import Vendors from '@/pages/workspace/Vendors'
import Settings from '@/pages/workspace/Settings'
import TurnoverDetail from '@/pages/workspace/TurnoverDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="settings" element={<Settings />} />
        <Route path="turnovers/:id" element={<TurnoverDetail />} />
      </Route>
    </Routes>
  )
}
