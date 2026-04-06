import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import styles from './ClaimsWorkspace.module.css'

type ServiceDelivered = {
  id: string
  serviceType: string
  participantName: string
  date: string
  startTime: string
  endTime: string
  quantity: number
  unitOfMeasure: string
}

type PaymentMethod = 'Wire' | 'Check' | 'ACH'

type ExtractionStatus = 'idle' | 'inProgress' | 'completed'

type ClaimLineItem = ServiceDelivered & {
  lineAmount: string
  paymentMethod: PaymentMethod
  invoiceFileName?: string
  extractionStatus: ExtractionStatus
}

type ClaimRecord = {
  id: string
  participantName: string
  items: ClaimLineItem[]
}

type Toast = {
  id: string
  claimId: string
  message: string
  type: 'info' | 'success'
}

type FiledClaim = {
  id: string
  participantName: string
  itemCount: number
  claimedAmount: string
  paymentMethod: PaymentMethod | 'Mixed'
  invoiceFileName?: string
  submittedAt: string
}

type ActiveTab = 'unclaimed' | 'claims'

const SERVICE_TYPES = ['Job Counseling', 'Case Review', 'Intake Assessment', 'Document Prep']
const PARTICIPANTS = [
  'Rob Marshall',
  'Ava Thompson',
  'Luis Garcia',
]

function buildMockServices(): ServiceDelivered[] {
  const rows: ServiceDelivered[] = []
  for (let i = 1; i <= 12; i += 1) {
    const participantName = PARTICIPANTS[i % PARTICIPANTS.length]
    const serviceType = SERVICE_TYPES[i % SERVICE_TYPES.length]
    const day = (i % 28) + 1
    rows.push({
      id: `svc-${i}`,
      serviceType,
      participantName,
      date: `2026-04-${String(day).padStart(2, '0')}`,
      startTime: i % 2 === 0 ? '09:00' : '13:00',
      endTime: i % 2 === 0 ? '11:00' : '15:00',
      quantity: 2,
      unitOfMeasure: 'Hours',
    })
  }
  return rows
}

const SERVICES = buildMockServices()

/** Default payment instrument per line item (provider preference; user may change on review). */
const PROVIDER_DEFAULT_PAYMENT: PaymentMethod = 'ACH'

export function ClaimsWorkspace() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const isReviewRoute = location.pathname === '/claims/review' || location.pathname.startsWith('/claims/review/')
  const activeTabParam = searchParams.get('tab')
  const activeTab: ActiveTab = activeTabParam === 'claims' ? 'claims' : 'unclaimed'
  const [filterText, setFilterText] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [claims, setClaims] = useState<ClaimRecord[]>([])
  const [filedClaims, setFiledClaims] = useState<FiledClaim[]>([])
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])

  const filteredServices = useMemo(() => {
    const normalized = filterText.trim().toLowerCase()
    return SERVICES.filter(
      (service) =>
        !normalized
        || service.serviceType.toLowerCase().includes(normalized)
        || service.participantName.toLowerCase().includes(normalized)
        || service.date.includes(normalized),
    )
  }, [filterText])

  const allFilteredSelected = filteredServices.length > 0 && filteredServices.every((row) => selectedIds.has(row.id))

  function toggleRowSelection(serviceId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(serviceId)) next.delete(serviceId)
      else next.add(serviceId)
      return next
    })
  }

  function toggleSelectAllFiltered() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allFilteredSelected) {
        filteredServices.forEach((row) => next.delete(row.id))
      } else {
        filteredServices.forEach((row) => next.add(row.id))
      }
      return next
    })
  }

  function addToast(toast: Omit<Toast, 'id'>) {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  function buildClaimsFromSelection() {
    const selectedServices = SERVICES.filter((service) => selectedIds.has(service.id))
    if (!selectedServices.length) return

    const grouped = selectedServices.reduce<Record<string, ServiceDelivered[]>>((acc, row) => {
      acc[row.participantName] = acc[row.participantName] || []
      acc[row.participantName].push(row)
      return acc
    }, {})

    const nextClaims = Object.entries(grouped).map(([participantName, rows]) => ({
      id: `claim-${participantName.toLowerCase().replace(/\s+/g, '-')}`,
      participantName,
      items: rows.map((row) => ({
        ...row,
        lineAmount: String(row.quantity * 50),
        paymentMethod: PROVIDER_DEFAULT_PAYMENT,
        extractionStatus: 'idle' as const,
      })),
    }))

    setClaims(nextClaims)
    setActiveClaimIndex(0)
    navigate('/claims/review')
  }

  function updateClaim(claimId: string, updater: (claim: ClaimRecord) => ClaimRecord) {
    setClaims((prev) => prev.map((claim) => (claim.id === claimId ? updater(claim) : claim)))
  }

  function toastKeyForLine(claimId: string, itemId: string) {
    return `${claimId}:${itemId}`
  }

  function updateClaimItem(
    claimId: string,
    itemId: string,
    updater: (item: ClaimLineItem) => ClaimLineItem,
  ) {
    updateClaim(claimId, (claim) => ({
      ...claim,
      items: claim.items.map((item) => (item.id === itemId ? updater(item) : item)),
    }))
  }

  function handleLineInvoiceUpload(claimId: string, itemId: string, file?: File) {
    if (!file) return
    const key = toastKeyForLine(claimId, itemId)
    updateClaimItem(claimId, itemId, (item) => ({
      ...item,
      invoiceFileName: file.name,
      extractionStatus: 'inProgress',
    }))
    addToast({ claimId: key, type: 'info', message: 'Invoice data extraction in progress.' })

    window.setTimeout(() => {
      updateClaimItem(claimId, itemId, (item) => ({
        ...item,
        extractionStatus: 'completed',
        lineAmount: item.lineAmount || '0',
      }))
      addToast({
        claimId: key,
        type: 'success',
        message: 'Completed extraction. Refresh this line to load extracted values.',
      })
    }, 1800)
  }

  function refreshClaimLine(toastKey: string) {
    const [claimId, itemId] = toastKey.split(':')
    if (!claimId || !itemId) return
    updateClaimItem(claimId, itemId, (item) => ({
      ...item,
      lineAmount: String(item.quantity * 65),
    }))
  }

  function submitClaims() {
    const submittedAt = new Date().toLocaleString()
    const nextFiledClaims = claims.map((claim) => {
      const total = claim.items.reduce((sum, it) => sum + (Number.parseFloat(it.lineAmount) || 0), 0)
      const methods = [...new Set(claim.items.map((it) => it.paymentMethod))]
      const invoices = claim.items.map((it) => it.invoiceFileName).filter(Boolean) as string[]
      return {
        id: claim.id,
        participantName: claim.participantName,
        itemCount: claim.items.length,
        claimedAmount: String(total),
        paymentMethod: (methods.length === 1 ? methods[0] : 'Mixed') as FiledClaim['paymentMethod'],
        invoiceFileName: invoices.length ? invoices.join('; ') : undefined,
        submittedAt,
      }
    })
    setFiledClaims((prev) => [...nextFiledClaims, ...prev])
    setClaims([])
    setActiveClaimIndex(0)
    setSelectedIds(new Set())
    navigate('/claims?tab=claims')

    addToast({
      claimId: 'all',
      type: 'success',
      message: `Submitted ${nextFiledClaims.length} claim(s) to agency for adjudication and ERP handoff.`,
    })
  }

  function cancelReviewAndReturn() {
    setClaims([])
    setActiveClaimIndex(0)
    navigate('/claims?tab=unclaimed')
  }

  function setActiveTabAndNavigate(tab: ActiveTab) {
    setSearchParams({ tab })
  }

  const activeClaim = claims[activeClaimIndex]
  const isLastClaimStep = activeClaimIndex === claims.length - 1

  const activeClaimLineTotal = activeClaim
    ? activeClaim.items.reduce((sum, it) => sum + (Number.parseFloat(it.lineAmount) || 0), 0)
    : 0

  function goToNextClaim() {
    if (isLastClaimStep) return
    setActiveClaimIndex((prev) => Math.min(prev + 1, claims.length - 1))
  }

  return (
    <section className={styles.workspace}>
      <h1 className="page-title">Claims</h1>
      <p className={styles.intro}>
        Select delivered services, group by participant into claims, review billing details, and submit in bulk.
      </p>

      <div className={styles.breadcrumbs} aria-label="Claims breadcrumbs">
        <button type="button" className={styles.breadcrumbLink} onClick={() => navigate('/claims?tab=unclaimed')}>
          Claims Home
        </button>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>{isReviewRoute ? 'Review & Submit' : activeTab === 'claims' ? 'Filed Claims' : 'Unclaimed Services'}</span>
      </div>

      {!isReviewRoute ? (
        <div className={styles.tabs}>
          <button
            type="button"
            className={activeTab === 'unclaimed' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTabAndNavigate('unclaimed')}
          >
            Unclaimed services
          </button>
          <button
            type="button"
            className={activeTab === 'claims' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTabAndNavigate('claims')}
          >
            Claims
          </button>
        </div>
      ) : null}

      {!isReviewRoute && activeTab === 'unclaimed' ? (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Unclaimed Services</h2>
            <div className={styles.headerActions}>
              <input
                className={`input ${styles.searchInput}`}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter by service, participant, or date"
                aria-label="Filter services"
              />
              <button type="button" className={styles.filterIconBtn} aria-label="Filter options">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M3 5h18" />
                  <path d="M6 12h12" />
                  <path d="M10 19h4" />
                </svg>
              </button>
              <button type="button" className="btn btn-primary" onClick={buildClaimsFromSelection} disabled={selectedIds.size === 0}>
                Create Claims
              </button>
            </div>
          </div>
          <p className={styles.selectionMeta}>
            {selectedIds.size} selected total. {filteredServices.length} services in current filtered list.
            Use the header checkbox to Select All filtered rows, then manually deselect individual rows as needed.
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAllFiltered}
                      aria-label="Select all filtered services"
                    />
                  </th>
                  <th>Service Type</th>
                  <th>Participant Name</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Quantity</th>
                  <th>Unit of Measure</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(service.id)}
                        onChange={() => toggleRowSelection(service.id)}
                        aria-label={`Select ${service.id}`}
                      />
                    </td>
                    <td>{service.serviceType}</td>
                    <td>{service.participantName}</td>
                    <td>{service.date}</td>
                    <td>{service.startTime}</td>
                    <td>{service.endTime}</td>
                    <td>{service.quantity}</td>
                    <td>{service.unitOfMeasure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {!isReviewRoute && activeTab === 'claims' ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Filed Claims</h2>
          {filedClaims.length === 0 ? (
            <p className={styles.placeholder}>No claims have been filed yet.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Claim Items</th>
                    <th>Claimed Amount</th>
                    <th>Payment Method</th>
                    <th>Invoice</th>
                    <th>Submitted At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filedClaims.map((claim) => (
                    <tr key={`${claim.id}-${claim.submittedAt}`}>
                      <td>{claim.participantName}</td>
                      <td>{claim.itemCount}</td>
                      <td>{claim.claimedAmount}</td>
                      <td>{claim.paymentMethod}</td>
                      <td>{claim.invoiceFileName || 'N/A'}</td>
                      <td>{claim.submittedAt}</td>
                      <td>Filed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {isReviewRoute ? (
        claims.length === 0 ? (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Screen 2: Claim Summary &amp; Review Workspace</h2>
            <p className={styles.placeholder}>No draft claims found. Return to Unclaimed Services and create claims first.</p>
            <div className={styles.reviewActions}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/claims?tab=unclaimed')}>
                Back to Unclaimed Services
              </button>
            </div>
          </div>
        ) : (
          <>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Screen 2: Claim Summary &amp; Review Workspace</h2>
            <div className={styles.reviewFlow}>
              <aside className={styles.stepTabs} aria-label="Individual claim steps">
                {claims.map((claim, index) => (
                  <button
                    key={claim.id}
                    type="button"
                    className={index === activeClaimIndex ? styles.stepTabActive : styles.stepTab}
                    onClick={() => setActiveClaimIndex(index)}
                  >
                    <span className={styles.stepTabName}>{claim.participantName}</span>
                    <small>{claim.items.length} claim item{claim.items.length === 1 ? '' : 's'}</small>
                  </button>
                ))}
              </aside>

              {activeClaim ? (
                <article className={styles.claimCard}>
                  <div className={styles.constituentSummary}>
                    <h3 className={styles.constituentName}>{activeClaim.participantName}</h3>
                    <p className={styles.summaryHelper}>
                      One claim per constituent. Each delivered service is a separate claim line below—set amount, payment instrument, and upload per line.
                    </p>
                    <dl className={styles.summaryGrid}>
                      <div className={styles.summaryRow}>
                        <dt>Claim line items</dt>
                        <dd>{activeClaim.items.length}</dd>
                      </div>
                      <div className={styles.summaryRow}>
                        <dt>Claim total (sum of lines)</dt>
                        <dd>{activeClaimLineTotal.toFixed(2)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className={styles.claimLineList}>
                    {activeClaim.items.map((item, lineIndex) => (
                      <div key={item.id} className={styles.claimLineCard}>
                        <div className={styles.claimLineHeader}>
                          <span className={styles.claimLineServiceType}>Service type: {item.serviceType}</span>
                          <span className={styles.claimLineMeta}>
                            Line {lineIndex + 1} of {activeClaim.items.length} · {item.date} · {item.startTime}–{item.endTime} · Qty {item.quantity} {item.unitOfMeasure}
                          </span>
                        </div>
                        <div className={styles.claimLineFields}>
                          <label>
                            Amount
                            <input
                              className="input"
                              value={item.lineAmount}
                              onChange={(e) =>
                                updateClaimItem(activeClaim.id, item.id, (existing) => ({
                                  ...existing,
                                  lineAmount: e.target.value,
                                }))
                              }
                            />
                          </label>
                          <label>
                            Payment instrument
                            <select
                              className="select"
                              value={item.paymentMethod}
                              onChange={(e) =>
                                updateClaimItem(activeClaim.id, item.id, (existing) => ({
                                  ...existing,
                                  paymentMethod: e.target.value as PaymentMethod,
                                }))
                              }
                            >
                              <option value="Wire">Wire</option>
                              <option value="Check">Check</option>
                              <option value="ACH">ACH</option>
                            </select>
                            <span className={styles.fieldHint}>Pre-filled from provider preference; you may change per line.</span>
                          </label>
                          <label className={styles.upload}>
                            Upload supporting document
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => handleLineInvoiceUpload(activeClaim.id, item.id, e.target.files?.[0])}
                            />
                            <span>{item.invoiceFileName || 'No file uploaded'}</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-secondary" onClick={goToNextClaim} disabled={isLastClaimStep}>
                      Next
                    </button>
                  </div>
                </article>
              ) : null}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Screen 3: Asynchronous Extraction &amp; Submission State</h2>
            <div className={styles.toastList} role="status" aria-live="polite">
              {toasts.length === 0 ? (
                <p className={styles.placeholder}>Notifications will appear here as invoice extraction events occur.</p>
              ) : (
                toasts.map((toast) => (
                  <div key={toast.id} className={toast.type === 'success' ? styles.toastSuccess : styles.toastInfo}>
                    <span>{toast.message}</span>
                    {toast.type === 'success' && toast.claimId !== 'all' ? (
                      <button type="button" className="btn btn-secondary" onClick={() => refreshClaimLine(toast.claimId)}>
                        Refresh line
                      </button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
            <div className={styles.submitRow}>
              <button type="button" className="btn btn-secondary" onClick={cancelReviewAndReturn}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={submitClaims} disabled={claims.length === 0}>
                Submit Claims
              </button>
            </div>
          </div>
          </>
        )
      ) : null}
    </section>
  )
}
