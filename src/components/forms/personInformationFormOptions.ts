/**
 * Default option sets for PersonInformationForm.
 * Pages can override or extend these via props.
 */
import type { PersonInformationFormOptions } from './PersonInformationForm.types'

export const defaultPersonInformationFormOptions: PersonInformationFormOptions = {
  genderOptions: [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ],
  usCitizenOptions: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ],
  immigrationStatusOptions: [
    { value: 'citizen', label: 'U.S. Citizen' },
    { value: 'lpr', label: 'Lawful Permanent Resident' },
    { value: 'non-immigrant', label: 'Non-immigrant visa' },
    { value: 'other', label: 'Other' },
  ],
  raceEthnicityOptions: [
    { value: 'american-indian', label: 'American Indian or Alaska Native' },
    { value: 'asian', label: 'Asian' },
    { value: 'black', label: 'Black or African American' },
    { value: 'hispanic', label: 'Hispanic or Latino' },
    { value: 'white', label: 'White' },
    { value: 'two-or-more', label: 'Two or more races' },
    { value: 'prefer-not-to-answer', label: 'Prefer not to answer' },
  ],
  preferredLanguageOptions: [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'other', label: 'Other' },
  ],
  preferredContactOptions: [
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
  ],
}
