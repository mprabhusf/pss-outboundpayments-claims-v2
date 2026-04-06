import { useEffect, useState, useCallback } from 'react'
import { HouseholdMemberCard } from '../components/household/HouseholdMemberCard'
import type { HouseholdMemberCardData } from '../components/household/HouseholdMemberCard'
import { relationshipToPrimaryOptions } from '../components/household/relationshipOptions'
import { defaultPersonInformationFormOptions } from '../components/forms/personInformationFormOptions'
import { defaultPersonInformationValues } from '../components/forms/PersonInformationForm.types'
import { useActionBar } from '../context/ActionBarContext'

function createNewMember(id: string, expanded = true): HouseholdMemberCardData {
  return {
    id,
    displayName: '',
    relationshipToPrimary: '',
    personValues: { ...defaultPersonInformationValues },
    expanded,
  }
}

export function HouseholdInfo() {
  const { setActionBar } = useActionBar()
  const [members, setMembers] = useState<HouseholdMemberCardData[]>(() => [
    createNewMember('member-1', true),
  ])

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Next',
      primaryTo: '/income',
      previousTo: '/applicant-info',
      showSave: true,
    })
  }, [setActionBar])

  const handleUpdate = useCallback((id: string, patch: Partial<HouseholdMemberCardData>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    )
  }, [])

  const handleSave = useCallback((_id: string) => {
    // Card already collapses via onUpdate in HouseholdMemberCard; optionally persist here
  }, [])

  const handleRemove = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const handleAddAnother = () => {
    setMembers((prev) => [...prev, createNewMember(`member-${Date.now()}`, true)])
  }

  return (
    <div>
      <p className="helper-text" style={{ marginBottom: 'var(--space-4)' }}>
        List everyone who lives with you and will be included on this application.
      </p>

      {members.map((member) => (
        <HouseholdMemberCard
          key={member.id}
          member={member}
          relationshipOptions={relationshipToPrimaryOptions}
          formOptions={defaultPersonInformationFormOptions}
          onUpdate={handleUpdate}
          onSave={handleSave}
          onRemove={members.length > 1 ? handleRemove : undefined}
        />
      ))}

      <button type="button" className="btn btn-secondary" onClick={handleAddAnother}>
        Add another
      </button>
    </div>
  )
}
