# PersonInformationForm

Reusable form for **applicant**, **household member**, or **authorized representative**. Two-column responsive grid, controlled inputs, inline validation, and address sync when “Same as home address” is checked.

## Features

- **Layout:** Two-column grid on desktop, single column stacked on mobile. Labels above inputs. Required fields marked with `*`.
- **Identity:** First name, Last name, Middle name (optional), SSN (masked `XXX-XX-XXXX`).
- **Demographics:** Date of birth (no future dates, calendar icon), Sex/Gender, US Citizen? (radio), Immigration status, Race/Ethnicity (optional), Preferred language — all dropdown/radio options from **props** (no hardcoding).
- **Address:** Home address (textarea), Mailing address (textarea). “Same as home address” checkbox: when checked, mailing is filled from home and disabled; when unchecked, mailing is editable. Syncing is instant when typing in home address with checkbox checked.
- **Contact:** Primary phone (masked `(XXX) XXX-XXXX`), Email, Preferred method of contact (Phone/Email radio).
- **Validation:** Inline messages below fields. No errors on initial render. Validation on **blur** or **submit**.
- **Accessibility:** Labels with `htmlFor`, `fieldset`/`legend` for radio groups, `aria-invalid`, `aria-describedby`, `role="alert"` on error messages, visible focus states.

## Usage

```tsx
import { PersonInformationForm } from '../components/forms/PersonInformationForm'
import { defaultPersonInformationFormOptions } from '../components/forms/personInformationFormOptions'

<PersonInformationForm
  idPrefix="applicant"
  initialValues={{ firstName: 'Jane', preferredLanguage: 'en' }}
  options={defaultPersonInformationFormOptions}
  onChange={(values) => { /* sync to state */ }}
  onSubmit={(values) => { /* save */ }}
/>
```

- **`options`** (required): All dropdown and radio choices (`genderOptions`, `usCitizenOptions`, `immigrationStatusOptions`, `raceEthnicityOptions`, `preferredLanguageOptions`, `preferredContactOptions`). Use `defaultPersonInformationFormOptions` or pass your own.
- **`onSubmit`** optional: If provided, a “Save” button is rendered and submit is handled; if omitted, no button (e.g. when using a page-level “Next”).
- **`idPrefix`**: Prefix for field ids (e.g. `applicant`, `member-1`) for unique labels and accessibility.

## Files

- `PersonInformationForm.tsx` — Form component
- `PersonInformationForm.types.ts` — `PersonInformationValues`, `PersonInformationFormOptions`, defaults
- `PersonInformationForm.module.css` — Grid and field layout
- `personInformationFormOptions.ts` — Default option sets for dropdowns/radios
