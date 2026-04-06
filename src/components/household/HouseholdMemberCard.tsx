import { DocumentCenter } from '../ui/DocumentCenter'
import { PersonInformationForm } from '../forms/PersonInformationForm'
import type { PersonInformationValues, PersonInformationFormOptions } from '../forms/PersonInformationForm.types'
import type { SelectOption } from '../forms/PersonInformationForm.types'
import styles from './HouseholdMemberCard.module.css'

export interface HouseholdMemberCardData {
  id: string
  displayName: string
  relationshipToPrimary: string
  personValues: PersonInformationValues
  expanded: boolean
}

interface HouseholdMemberCardProps {
  member: HouseholdMemberCardData
  relationshipOptions: SelectOption[]
  formOptions: PersonInformationFormOptions
  onUpdate: (id: string, patch: Partial<HouseholdMemberCardData>) => void
  onSave: (id: string) => void
  onRemove?: (id: string) => void
}

function getDisplayName(values: PersonInformationValues): string {
  const first = values.firstName?.trim() ?? ''
  const last = values.lastName?.trim() ?? ''
  const name = [first, last].filter(Boolean).join(' ')
  return name || 'Household member'
}

export function HouseholdMemberCard({
  member,
  relationshipOptions,
  formOptions,
  onUpdate,
  onSave,
  onRemove,
}: HouseholdMemberCardProps) {
  const isExpanded = member.expanded
  const headerLabel = member.displayName || 'Household member'

  const handleToggle = () => {
    onUpdate(member.id, { expanded: !member.expanded })
  }

  const handleSave = () => {
    const name = getDisplayName(member.personValues)
    onUpdate(member.id, { displayName: name, expanded: false })
    onSave(member.id)
  }

  const handlePersonChange = (values: PersonInformationValues) => {
    onUpdate(member.id, { personValues: values })
  }

  return (
    <div className={styles.card}>
      <button
        type="button"
        className={styles.header}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls={`member-body-${member.id}`}
      >
        <span className={styles.headerLabel}>{headerLabel}</span>
        <span className={styles.chevron} aria-hidden>
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      <div
        id={`member-body-${member.id}`}
        className={styles.body}
        hidden={!isExpanded}
      >
        <DocumentCenter
          title="Document Center"
          helperText="Upload ID or verification documents for this household member. Uploading documents allows the system to auto-fill parts of the form."
          acceptedFileTypes={['.pdf', '.jpeg', '.png']}
        />

        <div className={styles.relationshipField}>
          <label className="field-label" htmlFor={`${member.id}-relationship`}>
            Relationship to primary applicant
          </label>
          <select
            id={`${member.id}-relationship`}
            className="select"
            value={member.relationshipToPrimary}
            onChange={(e) => onUpdate(member.id, { relationshipToPrimary: e.target.value })}
          >
            <option value="">Select</option>
            {relationshipOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <PersonInformationForm
          idPrefix={`member-${member.id}`}
          initialValues={member.personValues}
          options={formOptions}
          onChange={handlePersonChange}
        />

        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          {onRemove && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onRemove(member.id)}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
