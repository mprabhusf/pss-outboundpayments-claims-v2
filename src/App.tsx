import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AppStateProvider, useAppState } from './context/AppState'
import { ActionBarProvider } from './context/ActionBarContext'
import { STEPS } from './config/steps'
import { LandingPage } from './pages/LandingPage'
import { ApplicantInfo } from './pages/ApplicantInfo'
import { HouseholdInfo } from './pages/HouseholdInfo'
import { Income } from './pages/Income'
import { Expenses } from './pages/Expenses'
import { Housing } from './pages/Housing'
import { Assets } from './pages/Assets'
import { EligibleBenefits } from './pages/EligibleBenefits'
import { SnapDetails } from './pages/SnapDetails'
import { TanfDetails } from './pages/TanfDetails'
import { MedicaidDetails } from './pages/MedicaidDetails'
import { Acknowledgement } from './pages/Acknowledgement'
import { Confirmation } from './pages/Confirmation'
import { Representing } from './pages/Representing'
import { ClaimsWorkspace } from './pages/ClaimsWorkspace'

function StepSync() {
  const location = useLocation()
  const { setCurrentStepId } = useAppState()
  useEffect(() => {
    const step = STEPS.find((s) => s.path === location.pathname)
    if (step) setCurrentStepId(step.id)
    else if (location.pathname === '/') setCurrentStepId('landing')
    else setCurrentStepId(null)
  }, [location.pathname, setCurrentStepId])
  return null
}

function AppRoutes() {
  return (
    <>
      <StepSync />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="clients" element={<></>} />
          <Route path="schedules" element={<></>} />
          <Route path="attendance" element={<></>} />
          <Route path="claims/*" element={<ClaimsWorkspace />} />
          <Route path="applicant-info" element={<ApplicantInfo />} />
          <Route path="household" element={<HouseholdInfo />} />
          <Route path="income" element={<Income />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="housing" element={<Housing />} />
          <Route path="assets" element={<Assets />} />
          <Route path="eligible-benefits" element={<EligibleBenefits />} />
          <Route path="snap-details" element={<SnapDetails />} />
          <Route path="tanf-details" element={<TanfDetails />} />
          <Route path="medicaid-details" element={<MedicaidDetails />} />
          <Route path="acknowledgement" element={<Acknowledgement />} />
          <Route path="confirmation" element={<Confirmation />} />
          <Route path="representing" element={<Representing />} />
        </Route>
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <ActionBarProvider>
        <AppRoutes />
      </ActionBarProvider>
    </AppStateProvider>
  )
}
