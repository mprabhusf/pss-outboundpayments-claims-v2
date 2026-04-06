/**
 * PersonInformationForm — value and option types.
 * Dropdown/radio options are passed as props; no hardcoded options.
 */
export interface PersonInformationValues {
  firstName: string
  lastName: string
  middleName: string
  socialSecurityNumber: string
  dateOfBirth: string
  gender: string
  usCitizen: string
  immigrationStatus: string
  raceEthnicity: string
  preferredLanguage: string
  homeAddress: string
  mailingAddress: string
  sameAsHomeAddress: boolean
  primaryPhone: string
  email: string
  preferredContactMethod: string[]
}

export interface SelectOption {
  value: string
  label: string
}

export interface PersonInformationFormOptions {
  genderOptions: SelectOption[]
  usCitizenOptions: SelectOption[]
  immigrationStatusOptions: SelectOption[]
  raceEthnicityOptions: SelectOption[]
  preferredLanguageOptions: SelectOption[]
  preferredContactOptions: SelectOption[]
}

export const defaultPersonInformationValues: PersonInformationValues = {
  firstName: '',
  lastName: '',
  middleName: '',
  socialSecurityNumber: '',
  dateOfBirth: '',
  gender: '',
  usCitizen: '',
  immigrationStatus: '',
  raceEthnicity: '',
  preferredLanguage: '',
  homeAddress: '',
  mailingAddress: '',
  sameAsHomeAddress: false,
  primaryPhone: '',
  email: '',
  preferredContactMethod: [],
}
