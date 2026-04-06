import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ActionBarState {
  primaryLabel: string
  primaryTo?: string
  onPrimaryClick?: () => void
  previousTo?: string
  showSave: boolean
  primaryDisabled?: boolean
}

const defaultState: ActionBarState = {
  primaryLabel: '',
  showSave: true,
}

const ActionBarContext = createContext<{
  state: ActionBarState
  setActionBar: (s: Partial<ActionBarState>) => void
} | null>(null)

export function ActionBarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ActionBarState>(defaultState)
  const setActionBar = useCallback((patch: Partial<ActionBarState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }, [])
  return (
    <ActionBarContext.Provider value={{ state, setActionBar }}>
      {children}
    </ActionBarContext.Provider>
  )
}

export function useActionBar() {
  const ctx = useContext(ActionBarContext)
  if (!ctx) throw new Error('useActionBar must be used within ActionBarProvider')
  return ctx
}
