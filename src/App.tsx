import { Route, Routes } from 'react-router-dom'
import Landing from '@/pages/Landing'
import About from '@/pages/About'
import Resources from '@/pages/Resources'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout'
import Today from '@/pages/workspace/Today'
import Turnovers from '@/pages/workspace/Turnovers'
import Portfolio from '@/pages/workspace/Portfolio'
import Schedule from '@/pages/workspace/Schedule'
import Vendors from '@/pages/workspace/Vendors'
import Settings from '@/pages/workspace/Settings'
import TurnoverDetail from '@/pages/workspace/TurnoverDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/resources" element={<Resources />} />
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
        <Route index element={<Today />} />
        <Route path="turnovers" element={<Turnovers />} />
        <Route path="turnovers/:id" element={<TurnoverDetail />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
