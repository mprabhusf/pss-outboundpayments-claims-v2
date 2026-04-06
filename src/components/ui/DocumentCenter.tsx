/**
 * DocumentCenter — Reusable document upload and review component.
 *
 * Use on: Applicant info, household member, income, expense, and asset sections.
 *
 * Usage:
 *   <DocumentCenter
 *     title="Document Center"
 *     helperText="Upload a copy of your ID. Uploading documents allows the system to auto-fill parts of the form."
 *     acceptedFileTypes={['.pdf', '.jpeg', '.png']}
 *     documentTypeOptions={[{ value: 'drivers-license', label: "Driver's License" }, ...]}
 *     pageOptions={[{ value: 'front', label: 'Front' }, { value: 'back', label: 'Back' }, { value: 'all', label: 'All' }]}
 *     maxFiles={5}
 *     onFilesChange={(files) => { /* sync to form state *\/ }}
 *   />
 *
 * Features: collapsible panel, drag-and-drop, "Upload files" opens system picker, per-file document type/page dropdowns, Replace and Remove.
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import styles from './DocumentCenter.module.css'

/** Single uploaded file with metadata and preview */
export interface UploadedFile {
  id: string
  file: File
  previewUrl: string | null
  documentType: string
  pageType: string
}

export interface DocumentTypeOption {
  value: string
  label: string
}

export interface PageOption {
  value: string
  label: string
}

const DEFAULT_DOCUMENT_TYPES: DocumentTypeOption[] = [
  { value: 'drivers-license', label: "Driver's License" },
  { value: 'state-id', label: 'State ID' },
  { value: 'passport', label: 'Passport' },
  { value: 'green-card', label: 'Green Card' },
  { value: 'other', label: 'Other' },
]

const DEFAULT_PAGE_OPTIONS: PageOption[] = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'all', label: 'All' },
]

/** Build accept attribute from file extensions e.g. ['.pdf', '.jpg'] */
function buildAccept(acceptedFileTypes: string[]): string {
  const mimeMap: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
  }
  return acceptedFileTypes
    .map((ext) => mimeMap[ext.toLowerCase()] || ext)
    .filter(Boolean)
    .join(',')
}

function isAccepted(file: File, acceptedFileTypes: string[]): boolean {
  const name = file.name.toLowerCase()
  return acceptedFileTypes.some((ext) => name.endsWith(ext.toLowerCase()))
}

interface DocumentCenterProps {
  /** Panel title prefix; count is appended as " (N)" */
  title?: string
  /** Helper text above dropzone (purpose + guidance) */
  helperText?: string
  /** Accepted extensions e.g. ['.pdf', '.jpeg', '.png'] */
  acceptedFileTypes?: string[]
  /** Document type dropdown options */
  documentTypeOptions?: DocumentTypeOption[]
  /** Page dropdown options */
  pageOptions?: PageOption[]
  /** Max files allowed (optional) */
  maxFiles?: number
  /** Called when files list changes (for parent to sync state) */
  onFilesChange?: (files: UploadedFile[]) => void
}

export function DocumentCenter({
  title = 'Document Center',
  helperText = 'Uploading documents allows the system to auto-fill parts of the form.',
  acceptedFileTypes = ['.pdf', '.jpeg', '.png'],
  documentTypeOptions = DEFAULT_DOCUMENT_TYPES,
  pageOptions = DEFAULT_PAGE_OPTIONS,
  maxFiles,
  onFilesChange,
}: DocumentCenterProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [collapsed, setCollapsed] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const replaceTargetRef = useRef<string | null>(null)

  const accept = buildAccept(acceptedFileTypes)
  const fileTypeHint = acceptedFileTypes.map((e) => e.replace('.', '')).join(', ')

  const revokePreview = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url)
  }, [])

  const createPreview = useCallback((file: File): string | null => {
    if (file.type.startsWith('image/')) return URL.createObjectURL(file)
    return null
  }, [])

  const addFiles = useCallback(
    (newFiles: File[]) => {
      setUploadError(null)
      const allowed = maxFiles != null ? Math.max(0, maxFiles - files.length) : newFiles.length
      const toAdd = newFiles.slice(0, allowed)
      const rejected = newFiles.filter((f) => !isAccepted(f, acceptedFileTypes))
      if (rejected.length > 0) {
        setUploadError(`Unsupported file type. Accepted: ${fileTypeHint}.`)
      }
      const next: UploadedFile[] = [
        ...files,
        ...toAdd
          .filter((f) => isAccepted(f, acceptedFileTypes))
          .map((f) => ({
            id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file: f,
            previewUrl: createPreview(f),
            documentType: documentTypeOptions[0]?.value ?? 'other',
            pageType: pageOptions[0]?.value ?? 'all',
          })),
      ]
      setFiles(next)
      onFilesChange?.(next)
    },
    [
      files,
      maxFiles,
      acceptedFileTypes,
      fileTypeHint,
      documentTypeOptions,
      pageOptions,
      createPreview,
      onFilesChange,
    ]
  )

  const removeFile = useCallback(
    (id: string) => {
      const item = files.find((f) => f.id === id)
      if (item) revokePreview(item.previewUrl)
      const next = files.filter((f) => f.id !== id)
      setFiles(next)
      setUploadError(null)
      onFilesChange?.(next)
    },
    [files, revokePreview, onFilesChange]
  )

  const replaceFile = useCallback(
    (id: string, newFile: File) => {
      if (!isAccepted(newFile, acceptedFileTypes)) {
        setUploadError(`Unsupported file type. Accepted: ${fileTypeHint}.`)
        return
      }
      setUploadError(null)
      setFiles((prev) => {
        const next = prev.map((f) => {
          if (f.id !== id) return f
          revokePreview(f.previewUrl)
          return {
            ...f,
            file: newFile,
            previewUrl: createPreview(newFile),
          }
        })
        onFilesChange?.(next)
        return next
      })
      replaceTargetRef.current = null
    },
    [acceptedFileTypes, fileTypeHint, revokePreview, createPreview, onFilesChange]
  )

  const updateMetadata = useCallback(
    (id: string, field: 'documentType' | 'pageType', value: string) => {
      const next = files.map((f) => (f.id === id ? { ...f, [field]: value } : f))
      setFiles(next)
      onFilesChange?.(next)
    },
    [files, onFilesChange]
  )

  useEffect(() => {
    return () => files.forEach((f) => revokePreview(f.previewUrl))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const items = Array.from(e.dataTransfer.files)
    if (items.length) addFiles(items)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleUploadClick = () => {
    setUploadError(null)
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : []
    if (selected.length) addFiles(selected)
    e.target.value = ''
  }

  const handleReplaceClick = (id: string) => {
    replaceTargetRef.current = id
    setUploadError(null)
    replaceInputRef.current?.click()
  }

  const handleReplaceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const targetId = replaceTargetRef.current
    if (file && targetId) replaceFile(targetId, file)
    e.target.value = ''
    replaceTargetRef.current = null
  }

  const count = files.length
  const isExpanded = !collapsed

  return (
    <div className={styles.wrapper}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        className={styles.hiddenInput}
        aria-hidden
        onChange={handleFileInputChange}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept={accept}
        className={styles.hiddenInput}
        aria-hidden
        onChange={handleReplaceInputChange}
      />

      <button
        type="button"
        className={styles.header}
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={isExpanded}
        aria-controls="document-center-body"
      >
        <span className={styles.headerTitle}>
          {title} ({count})
        </span>
        <span className={styles.chevron} aria-hidden>
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      <div id="document-center-body" className={styles.body} hidden={!isExpanded}>
        <p className={styles.helperText}>{helperText}</p>
        <p className="helper-text">File type: {fileTypeHint}</p>

        <div
          className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <p className={styles.dropText}>
            Drop files here or{' '}
            <button
              type="button"
              className={styles.uploadLink}
              onClick={handleUploadClick}
              onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
            >
              Upload files
            </button>
          </p>
          <p className="helper-text" style={{ marginTop: 'var(--space-1)' }}>
            {fileTypeHint}
          </p>
        </div>

        {uploadError && (
          <p className={styles.errorMessage} role="alert">
            {uploadError}
          </p>
        )}

        {files.length > 0 && (
          <ul className={styles.fileList} aria-label="Uploaded documents">
            {files.map((file) => (
              <li key={file.id} className={styles.fileRow}>
                <div className={styles.thumbnail}>
                  {file.previewUrl ? (
                    <img src={file.previewUrl} alt="" className={styles.thumbnailImg} />
                  ) : (
                    <span className={styles.thumbnailPlaceholder} aria-hidden>
                      Doc
                    </span>
                  )}
                </div>
                <div className={styles.metadata}>
                  <label className={styles.metaLabel}>
                    Document type
                    <select
                      className="select"
                      value={file.documentType}
                      onChange={(e) => updateMetadata(file.id, 'documentType', e.target.value)}
                      aria-label={`Document type for ${file.file.name}`}
                    >
                      {documentTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.metaLabel}>
                    Page
                    <select
                      className="select"
                      value={file.pageType}
                      onChange={(e) => updateMetadata(file.id, 'pageType', e.target.value)}
                      aria-label={`Page for ${file.file.name}`}
                    >
                      {pageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => handleReplaceClick(file.id)}
                    aria-label={`Replace ${file.file.name}`}
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    className={styles.actionBtnIcon}
                    onClick={() => removeFile(file.id)}
                    aria-label={`Remove ${file.file.name}`}
                  >
                    <span aria-hidden>×</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
