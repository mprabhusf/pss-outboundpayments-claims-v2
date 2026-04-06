/**
 * Application step IDs and navigation config.
 * Order defines sequence; required steps cannot be skipped.
 */
export type StepId =
  | 'landing'
  | 'applicant-info'
  | 'household'
  | 'income'
  | 'expenses'
  | 'housing'
  | 'assets'
  | 'eligible-benefits'
  | 'snap-details'
  | 'tanf-details'
  | 'medicaid-details'
  | 'acknowledgement'
  | 'confirmation'

export interface StepConfig {
  id: StepId
  label: string
  path: string
  section: 'qualifier' | 'eligibility' | 'program' | 'submission'
  sectionLabel?: string
  required?: boolean
}

export const STEPS: StepConfig[] = [
  { id: 'landing', label: 'Applications', path: '/', section: 'qualifier' },
  { id: 'applicant-info', label: 'Applicant Information', path: '/applicant-info', section: 'qualifier', required: true },
  { id: 'household', label: 'Household Information', path: '/household', section: 'qualifier', required: true },
  { id: 'income', label: 'Income', path: '/income', section: 'qualifier', required: true },
  { id: 'expenses', label: 'Expenses', path: '/expenses', section: 'qualifier' },
  { id: 'housing', label: 'Housing Situation', path: '/housing', section: 'qualifier' },
  { id: 'assets', label: 'Assets', path: '/assets', section: 'qualifier' },
  { id: 'eligible-benefits', label: 'View & Select Eligible Benefits', path: '/eligible-benefits', section: 'eligibility', sectionLabel: 'ELIGIBILITY EVALUATION' },
  { id: 'snap-details', label: 'SNAP Application Details', path: '/snap-details', section: 'program' },
  { id: 'tanf-details', label: 'TANF Application Details', path: '/tanf-details', section: 'program' },
  { id: 'medicaid-details', label: 'MEDICAID Application Details', path: '/medicaid-details', section: 'program' },
  { id: 'acknowledgement', label: 'Acknowledgement & Submission', path: '/acknowledgement', section: 'submission', sectionLabel: 'APPLICATION SUBMISSION' },
  { id: 'confirmation', label: 'Confirmation', path: '/confirmation', section: 'submission' },
]

export const SECTION_HEADERS: Record<string, string> = {
  qualifier: 'Qualifier section',
  eligibility: 'Eligibility evaluation',
  program: '',
  submission: 'Application submission',
}

export const APPLICATION_ID = 'IA-10001'
export const DATE_CREATED = '1 June 2025'
export const APP_STATUS = 'Draft'
