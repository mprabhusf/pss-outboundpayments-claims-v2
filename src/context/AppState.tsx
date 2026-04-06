import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import type { StepId } from '../config/steps'

interface AppStateContextValue {
  currentStepId: StepId | null
  setCurrentStepId: (id: StepId | null) => void
  completedSteps: Set<StepId>
  markStepComplete: (id: StepId) => void
  isStepUnlocked: (id: StepId) => boolean
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

const ORDER: StepId[] = [
  'landing', 'applicant-info', 'household', 'income', 'expenses', 'housing', 'assets',
  'eligible-benefits', 'snap-details', 'tanf-details', 'medicaid-details', 'acknowledgement', 'confirmation'
]

function indexOf(id: StepId): number {
  const i = ORDER.indexOf(id)
  return i === -1 ? 999 : i
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentStepId, setCurrentStepId] = useState<StepId | null>('landing')
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set())

  const markStepComplete = (id: StepId) => {
    setCompletedSteps((prev) => new Set([...prev, id]))
  }

  const isStepUnlocked = (id: StepId) => {
    if (id === 'landing') return true
    const currentIdx = currentStepId ? indexOf(currentStepId) : -1
    const stepIdx = indexOf(id)
    return stepIdx <= currentIdx + 1 || completedSteps.has(id)
  }

  const value = useMemo(
    () => ({
      currentStepId,
      setCurrentStepId,
      completedSteps,
      markStepComplete,
      isStepUnlocked,
    }),
    [currentStepId, completedSteps]
  )

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
