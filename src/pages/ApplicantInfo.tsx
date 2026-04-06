import { useEffect } from 'react'
import { DocumentCenter } from '../components/ui/DocumentCenter'
import { PersonInformationForm } from '../components/forms/PersonInformationForm'
import { defaultPersonInformationFormOptions } from '../components/forms/personInformationFormOptions'
import { useActionBar } from '../context/ActionBarContext'

export function ApplicantInfo() {
  const { setActionBar } = useActionBar()

  useEffect(() => {
    setActionBar({
      primaryLabel: 'Next',
      primaryTo: '/household',
      previousTo: undefined,
      showSave: true,
    })
  }, [setActionBar])

  return (
    <div>
      <h3 className="section-title">Applicant Information</h3>
      <DocumentCenter
        title="Document Center"
        helperText="Upload a copy of your applicant ID (e.g. driver's license, state ID). Uploading documents allows the system to auto-fill parts of the form."
        acceptedFileTypes={['.pdf', '.jpeg', '.png']}
      />
      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <PersonInformationForm
          idPrefix="applicant"
          options={defaultPersonInformationFormOptions}
          onChange={() => {
            // Optional: sync to app state or persist
          }}
        />
      </div>
    </div>
  )
}
