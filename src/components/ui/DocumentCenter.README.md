# DocumentCenter — Upload instructions and usage

Reusable document upload and review component for applicant, household member, income, expense, and asset sections.

## Behavior

- **Collapsible panel:** Header shows "Document Center (N)". Click header to expand/collapse. Expanded by default when empty.
- **Dropzone:** "Drop files here or **Upload files**". Clicking "Upload files" opens the system file picker (multiple files supported).
- **Per-file row:** Thumbnail (image preview or "Doc" for PDF), **Document type** dropdown, **Page** dropdown (Front / Back / All), **Replace** (opens picker for that file only), **Remove** (×).
- **Errors:** Unsupported file types show an inline message below the dropzone (no alerts).
- **Keyboard:** Panel header, Upload files link, dropdowns, Replace, and Remove are focusable and keyboard usable.

## Using it on a page

```tsx
import { DocumentCenter } from '../components/ui/DocumentCenter'

<DocumentCenter
  title="Document Center"
  helperText="Upload a copy of your applicant ID. Uploading documents allows the system to auto-fill parts of the form."
  acceptedFileTypes={['.pdf', '.jpeg', '.png']}
  documentTypeOptions={[
    { value: 'drivers-license', label: "Driver's License" },
    { value: 'state-id', label: 'State ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'other', label: 'Other' },
  ]}
  pageOptions={[
    { value: 'front', label: 'Front' },
    { value: 'back', label: 'Back' },
    { value: 'all', label: 'All' },
  ]}
  maxFiles={5}
  onFilesChange={(files) => {
    // Optional: sync to form state or submit later
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | `"Document Center"` | Panel header prefix; count is appended as " (N)". |
| `helperText` | string | Purpose + auto-fill sentence | Shown above dropzone. |
| `acceptedFileTypes` | string[] | `['.pdf', '.jpeg', '.png']` | Allowed extensions. |
| `documentTypeOptions` | `{ value, label }[]` | Driver's License, State ID, etc. | Options for Document type dropdown. |
| `pageOptions` | `{ value, label }[]` | Front, Back, All | Options for Page dropdown. |
| `maxFiles` | number | none | Optional limit on number of files. |
| `onFilesChange` | `(files: UploadedFile[]) => void` | — | Called when files are added, replaced, or removed. |

## Where it’s used

- **Applicant Information:** Applicant ID documents.
- **Income:** Pay stubs / income verification (inside expanded income summary card).
- **Assets:** Bank statements / asset verification (inside expanded asset card).

For **household member** or **expense** sections, add `<DocumentCenter />` with a matching `helperText` and same or custom `documentTypeOptions` / `pageOptions` as needed.
