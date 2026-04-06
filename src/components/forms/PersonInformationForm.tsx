/**
 * PersonInformationForm — Reusable form for applicant, household member, or authorized representative.
 * Two-column responsive grid, controlled inputs, inline validation, address sync when "Same as home" is checked.
 * Dropdown and radio options are passed via props (no hardcoded options).
 */
import { useState, useCallback } from 'react'
import type { PersonInformationValues, PersonInformationFormOptions } from './PersonInformationForm.types'
import { defaultPersonInformationValues } from './PersonInformationForm.types'
import styles from './PersonInformationForm.module.css'

function maskSSN(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9)
  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SSN_VALID = /^\d{3}-\d{2}-\d{4}$/
const PHONE_VALID = /^\(\d{3}\) \d{3}-\d{4}$/

export interface PersonInformationFormProps {
  initialValues?: Partial<PersonInformationValues>
  options: PersonInformationFormOptions
  onChange?: (values: PersonInformationValues) => void
  onSubmit?: (values: PersonInformationValues) => void
  /** Optional id prefix for form fields (e.g. "applicant", "member-1") for unique labels */
  idPrefix?: string
}

export function PersonInformationForm({
  initialValues,
  options,
  onChange,
  onSubmit,
  idPrefix = 'person',
}: PersonInformationFormProps) {
  const [values, setValues] = useState<PersonInformationValues>({
    ...defaultPersonInformationValues,
    ...initialValues,
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const id = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name)

  const update = useCallback(
    (patch: Partial<PersonInformationValues>) => {
      setValues((prev) => {
        const next = { ...prev, ...patch }
        onChange?.(next)
        return next
      })
    },
    [onChange]
  )

  const setTouchedField = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])


  const validate = useCallback((v: PersonInformationValues): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!v.firstName?.trim()) e.firstName = 'First name is required.'
    if (!v.lastName?.trim()) e.lastName = 'Last name is required.'
    if (v.socialSecurityNumber && !SSN_VALID.test(v.socialSecurityNumber.replace(/\s/g, '')))
      e.socialSecurityNumber = 'Enter a valid SSN (XXX-XX-XXXX).'
    if (v.dateOfBirth && v.dateOfBirth > todayISO())
      e.dateOfBirth = 'Date of birth cannot be in the future.'
    if (v.primaryPhone && !PHONE_VALID.test(v.primaryPhone.replace(/\s/g, '')))
      e.primaryPhone = 'Enter a valid phone number.'
    if (v.email && !EMAIL_PATTERN.test(v.email.trim()))
      e.email = 'Enter a valid email address.'
    return e
  }, [])

  const runValidation = useCallback(() => {
    const e = validate(values)
    setErrors(e)
    return e
  }, [values, validate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    const e2 = runValidation()
    if (Object.keys(e2).length === 0) onSubmit?.(values)
  }

  const showError = (field: string) =>
    (touched[field] || submitAttempted) && errors[field]

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Identity */}
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className="field-label required" htmlFor={id('firstName')}>
            First name
          </label>
          <input
            id={id('firstName')}
            type="text"
            className="input"
            placeholder="Enter first name"
            value={values.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            onBlur={() => setTouchedField('firstName')}
            aria-required="true"
            aria-invalid={!!showError('firstName')}
            aria-describedby={showError('firstName') ? `${id('firstName')}-error` : undefined}
          />
          {showError('firstName') && (
            <span id={`${id('firstName')}-error`} className="error-message" role="alert">
              {errors.firstName}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label className="field-label required" htmlFor={id('lastName')}>
            Last name
          </label>
          <input
            id={id('lastName')}
            type="text"
            className="input"
            placeholder="Enter last name"
            value={values.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            onBlur={() => setTouchedField('lastName')}
            aria-required="true"
            aria-invalid={!!showError('lastName')}
            aria-describedby={showError('lastName') ? `${id('lastName')}-error` : undefined}
          />
          {showError('lastName') && (
            <span id={`${id('lastName')}-error`} className="error-message" role="alert">
              {errors.lastName}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label className="field-label" htmlFor={id('middleName')}>
            Middle name
          </label>
          <input
            id={id('middleName')}
            type="text"
            className="input"
            placeholder="Enter middle name"
            value={values.middleName}
            onChange={(e) => update({ middleName: e.target.value })}
            onBlur={() => setTouchedField('middleName')}
          />
        </div>
        <div className={styles.field}>
          <label className="field-label" htmlFor={id('ssn')}>
            Social Security Number
          </label>
          <input
            id={id('ssn')}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            className="input"
            placeholder="XXX-XX-XXXX"
            value={values.socialSecurityNumber}
            onChange={(e) => update({ socialSecurityNumber: maskSSN(e.target.value) })}
            onBlur={() => setTouchedField('socialSecurityNumber')}
            aria-invalid={!!showError('socialSecurityNumber')}
            aria-describedby={showError('socialSecurityNumber') ? `${id('ssn')}-error` : undefined}
          />
          {showError('socialSecurityNumber') && (
            <span id={`${id('ssn')}-error`} className="error-message" role="alert">
              {errors.socialSecurityNumber}
            </span>
          )}
        </div>
      </div>

      {/* Demographics */}
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className="field-label" htmlFor={id('dob')}>
            Date of birth
          </label>
          <span className={styles.dateWrapper}>
            <input
              id={id('dob')}
              type="date"
              className="input"
              placeholder="Select a date"
              max={todayISO()}
              value={values.dateOfBirth}
              onChange={(e) => update({ dateOfBirth: e.target.value })}
              onBlur={() => setTouchedField('dateOfBirth')}
              aria-invalid={!!showError('dateOfBirth')}
              aria-describedby={showError('dateOfBirth') ? `${id('dob')}-error` : undefined}
            />
            <span className={styles.dateIcon} aria-hidden>
              📅
            </span>
          </span>
          {showError('dateOfBirth') && (
            <span id={`${id('dob')}-error`} className="error-message" role="alert">
              {errors.dateOfBirth}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label className="field-label" htmlFor={id('gender')}>
            Sex / Gender
          </label>
          <select
            id={id('gender')}
            className="select"
            value={values.gender}
            onChange={(e) => update({ gender: e.target.value })}
            onBlur={() => setTouchedField('gender')}
          >
            <option value="">Select</option>
            {options.genderOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <fieldset className={styles.radioGroup}>
            <legend className={styles.radioLegend}>US Citizen?</legend>
            <div className={styles.radioOptions}>
              {options.usCitizenOptions.map((o) => (
                <label key={o.value} className={styles.radioOption}>
                  <input
                    type="radio"
                    name={id('usCitizen')}
                    value={o.value}
                    checked={values.usCitizen === o.value}
                    onChange={() => update({ usCitizen: o.value })}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className={styles.field}>
          <label className="field-label" htmlFor={id('immigrationStatus')}>
            Immigration status
          </label>
          <select
            id={id('immigrationStatus')}
            className="select"
            value={values.immigrationStatus}
            onChange={(e) => update({ immigrationStatus: e.target.value })}
            onBlur={() => setTouchedField('immigrationStatus')}
          >
            <option value="">Select</option>
            {options.immigrationStatusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className="field-label" htmlFor={id('raceEthnicity')}>
            Race / Ethnicity
          </label>
          <select
            id={id('raceEthnicity')}
            className="select"
            value={values.raceEthnicity}
            onChange={(e) => update({ raceEthnicity: e.target.value })}
          >
            <option value="">Select</option>
            {options.raceEthnicityOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className="field-label" htmlFor={id('preferredLanguage')}>
            Preferred spoken and written language
          </label>
          <select
            id={id('preferredLanguage')}
            className="select"
            value={values.preferredLanguage}
            onChange={(e) => update({ preferredLanguage: e.target.value })}
          >
            <option value="">Select</option>
            {options.preferredLanguageOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Address */}
      <div className={styles.grid}>
        <div className={`${styles.field} ${styles.fieldFullWidth}`}>
          <label className="field-label" htmlFor={id('homeAddress')}>
            Home address
          </label>
          <textarea
            id={id('homeAddress')}
            className="textarea"
            placeholder="Street, city, state, ZIP"
            rows={3}
            value={values.homeAddress}
            onChange={(e) =>
              update({
                homeAddress: e.target.value,
                ...(values.sameAsHomeAddress && { mailingAddress: e.target.value }),
              })
            }
            onBlur={() => setTouchedField('homeAddress')}
          />
        </div>
        <div className={`${styles.field} ${styles.fieldFullWidth}`}>
          <label className="field-label" htmlFor={id('mailingAddress')}>
            Mailing address
          </label>
          <textarea
            id={id('mailingAddress')}
            className="textarea"
            placeholder="Street, city, state, ZIP"
            rows={3}
            value={values.mailingAddress}
            onChange={(e) => update({ mailingAddress: e.target.value })}
            disabled={values.sameAsHomeAddress}
            aria-disabled={values.sameAsHomeAddress}
          />
        </div>
        <div className={`${styles.field} ${styles.fieldFullWidth}`}>
          <label className="checkbox-group">
            <input
              type="checkbox"
              checked={values.sameAsHomeAddress}
              onChange={(e) => {
                const checked = e.target.checked
                update({
                  sameAsHomeAddress: checked,
                  mailingAddress: checked ? values.homeAddress : values.mailingAddress,
                })
              }}
              aria-describedby={id('sameAsHome-desc')}
            />
            <span id={id('sameAsHome-desc')}>Same as home address</span>
          </label>
        </div>
      </div>

      {/* Contact */}
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className="field-label" htmlFor={id('primaryPhone')}>
            Primary phone number
          </label>
          <input
            id={id('primaryPhone')}
            type="tel"
            inputMode="tel"
            className="input"
            placeholder="(XXX) XXX-XXXX"
            value={values.primaryPhone}
            onChange={(e) => update({ primaryPhone: maskPhone(e.target.value) })}
            onBlur={() => setTouchedField('primaryPhone')}
            aria-invalid={!!showError('primaryPhone')}
            aria-describedby={showError('primaryPhone') ? `${id('primaryPhone')}-error` : undefined}
          />
          {showError('primaryPhone') && (
            <span id={`${id('primaryPhone')}-error`} className="error-message" role="alert">
              {errors.primaryPhone}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label className="field-label" htmlFor={id('email')}>
            Email address
          </label>
          <input
            id={id('email')}
            type="email"
            className="input"
            placeholder="email@example.com"
            value={values.email}
            onChange={(e) => update({ email: e.target.value })}
            onBlur={() => setTouchedField('email')}
            aria-invalid={!!showError('email')}
            aria-describedby={showError('email') ? `${id('email')}-error` : undefined}
          />
          {showError('email') && (
            <span id={`${id('email')}-error`} className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <span className={styles.radioLegend}>Preferred method of contact</span>
          <div className={styles.checkboxOptions}>
            {options.preferredContactOptions.map((o) => (
              <label key={o.value} className={styles.radioOption}>
                <input
                  type="checkbox"
                  value={o.value}
                  checked={values.preferredContactMethod.includes(o.value)}
                  onChange={() => {
                    const next = values.preferredContactMethod.includes(o.value)
                      ? values.preferredContactMethod.filter((v) => v !== o.value)
                      : [...values.preferredContactMethod, o.value]
                    update({ preferredContactMethod: next })
                  }}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {onSubmit && (
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      )}
    </form>
  )
}
