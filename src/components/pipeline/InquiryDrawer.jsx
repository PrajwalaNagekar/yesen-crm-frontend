import { useEffect, useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Building2,
  Tag as TagIcon,
  FileText,
  Trash2,
  Upload,
  Download,
  Send,
  Package,
  Globe,
  Plus,
} from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import Select from '../common/Select.jsx';
import Textarea from '../common/Textarea.jsx';
import Spinner from '../common/Spinner.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import TagBadge from './TagBadge.jsx';
import { usePipeline } from '../../hooks/usePipeline.js';
import {
  useInquiry,
  useUpdateInquiry,
  useAddTag,
  useRemoveTag,
  useSetQuotationStatus,
  useAddLog,
  useUploadDocument,
  useDeleteDocumentMutation,
  useDeleteInquiry,
} from '../../hooks/useInquiries.js';
import { downloadDocument } from '../../api/inquiries.js';
import { formatCurrency, formatRelativeTime, SOURCE_LABELS, STAGE_META, getAssigneeName } from '../../utils/format.js';
import { useToast } from '../../context/ToastContext.jsx';

function Section({ title, action, children }) {
  return (
    <section className="px-5 py-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Divider() {
  return <div className="mx-5 border-t border-slate-100 sm:mx-6" />;
}

function mutateOpts(toast, extras = {}) {
  return {
    onError: (err) => toast.error(err.message || 'Something went wrong'),
    ...extras,
  };
}

function InquiryDrawerContent({
  inquiry,
  documents,
  logs,
  onClose,
  onRequestStageMove,
  team = [],
  readOnly = false,
}) {
  const toast = useToast();
  const { data: pipeline } = usePipeline();

  const updateInquiry = useUpdateInquiry();
  const addTag = useAddTag();
  const removeTag = useRemoveTag();
  const setQuotationStatus = useSetQuotationStatus();
  const addLog = useAddLog();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocumentMutation();
  const deleteInquiry = useDeleteInquiry();

  const [tagInput, setTagInput] = useState('');
  const [valueInput, setValueInput] = useState(inquiry.value == null ? '' : String(inquiry.value));
  const [logType, setLogType] = useState('note');
  const [logMessage, setLogMessage] = useState('');
  const [docType, setDocType] = useState('quotation');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Vessel detail local states (committed on blur/change)
  const [vesselLength, setVesselLength] = useState(inquiry.vesselLength ?? '');
  const [operatingArea, setOperatingArea] = useState(inquiry.operatingArea ?? '');
  const [dailyOperatingHours, setDailyOperatingHours] = useState(inquiry.dailyOperatingHours ?? '');
  const [timeLine, setTimeLine] = useState(inquiry.timeLine ?? '');

  function patchInquiry(updates) {
    updateInquiry.mutate({ id: inquiry._id, updates }, mutateOpts(toast));
  }

  const assigneeId =
    typeof inquiry.assignedTo === 'object' && inquiry.assignedTo
      ? inquiry.assignedTo._id
      : inquiry.assignedTo || '';

  const stageMeta = STAGE_META[inquiry.stage] || STAGE_META.Inquired;
  const dealDisplay = formatCurrency(inquiry.value);
  const ownerName = getAssigneeName(inquiry.assignedTo);

  function handleValueBlur() {
    const trimmed = valueInput.trim();
    const parsed = trimmed === '' ? null : Number(trimmed);
    if (Number.isNaN(parsed)) return;
    if (parsed !== inquiry.value) {
      updateInquiry.mutate({ id: inquiry._id, updates: { value: parsed } }, mutateOpts(toast));
    }
  }

  function handleAddTag(e) {
    e.preventDefault();
    if (!tagInput.trim()) return;
    addTag.mutate({ id: inquiry._id, tag: tagInput.trim() }, mutateOpts(toast));
    setTagInput('');
  }

  function handleAddLog(e) {
    e.preventDefault();
    if (!logMessage.trim()) return;
    addLog.mutate(
      { id: inquiry._id, type: logType, message: logMessage.trim() },
      mutateOpts(toast, { onSuccess: () => setLogMessage('') })
    );
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadDocument.mutate(
      { id: inquiry._id, file, type: docType },
      mutateOpts(toast, { onSuccess: () => toast.success('Document uploaded') })
    );
    e.target.value = '';
  }

  function handleConfirmDelete() {
    deleteInquiry.mutate(
      { id: inquiry._id },
      mutateOpts(toast, {
        onSuccess: () => {
          setConfirmDelete(false);
          onClose();
        },
      })
    );
  }

  return (
    <>
      {/* Header */}
      <header className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <Avatar name={inquiry.clientName} size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate font-display text-lg font-bold tracking-tight text-brand-900">
                  {inquiry.clientName}
                </h2>
                {inquiry.company ? (
                  <p className="mt-0.5 truncate text-sm text-slate-500">{inquiry.company}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg border border-slate-200 p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${stageMeta.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${stageMeta.dot}`} />
                {inquiry.stage}
              </span>
              {dealDisplay ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-brand-800">
                  {dealDisplay}
                </span>
              ) : null}
              {inquiry.quotation?.sent ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  Quote sent
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Stage + Owner side by side */}
        <Section title="Pipeline">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600" htmlFor="stage-select">
                Stage
              </label>
              {readOnly ? (
                <p
                  className={`inline-flex rounded-lg px-3 py-2 text-sm font-semibold ring-1 ${stageMeta.badge}`}
                >
                  {inquiry.stage}
                </p>
              ) : (
                <Select
                  id="stage-select"
                  value={inquiry.stage}
                  onChange={(e) => onRequestStageMove(inquiry._id, e.target.value)}
                  aria-label="Pipeline stage"
                >
                  {(pipeline?.stages || []).map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </Select>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600" htmlFor="owner-select">
                Owner
              </label>
              {readOnly ? (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {ownerName || 'Unassigned'}
                </p>
              ) : (
                <Select
                  id="owner-select"
                  value={assigneeId || ''}
                  onChange={(e) => {
                    const next = e.target.value === '' ? null : e.target.value;
                    updateInquiry.mutate(
                      { id: inquiry._id, updates: { assignedTo: next } },
                      mutateOpts(toast, {
                        onSuccess: () => toast.success(next ? 'Owner updated' : 'Unassigned'),
                      })
                    );
                  }}
                  aria-label="Assigned owner"
                >
                  <option value="">Unassigned</option>
                  {team.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name || member.username}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </div>
          {inquiry.stage === 'Lost' && inquiry.lost?.reason ? (
            <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Lost reason:</span> {inquiry.lost.reason}
            </p>
          ) : null}
        </Section>

        <Divider />

        {/* Client */}
        <Section title="Client">
          <div className="space-y-1">
            {inquiry.email ? (
              <a
                href={`mailto:${inquiry.email}`}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-700"
              >
                <Mail size={16} className="shrink-0 text-slate-400" />
                <span className="truncate">{inquiry.email}</span>
              </a>
            ) : null}
            {inquiry.phone ? (
              <a
                href={`tel:${inquiry.phone}`}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-700"
              >
                <Phone size={16} className="shrink-0 text-slate-400" />
                {inquiry.phone}
              </a>
            ) : null}
            {inquiry.company ? (
              <p className="flex items-center gap-3 px-2.5 py-2 text-sm text-slate-700">
                <Building2 size={16} className="shrink-0 text-slate-400" />
                {inquiry.company}
              </p>
            ) : null}
            {inquiry.productOrServiceName ? (
              <p className="flex items-center gap-3 px-2.5 py-2 text-sm text-slate-700">
                <Package size={16} className="shrink-0 text-slate-400" />
                <span>
                  <span className="text-slate-400">Requested · </span>
                  <span className="font-medium text-brand-900">{inquiry.productOrServiceName}</span>
                </span>
              </p>
            ) : null}
            <p className="flex items-start gap-3 px-2.5 py-2 text-sm text-slate-700">
              <Globe size={16} className="mt-0.5 shrink-0 text-slate-400" />
              <span>
                <span className="font-medium text-brand-900">
                  {SOURCE_LABELS[inquiry.source] || inquiry.source}
                </span>
                {inquiry.sourcePage ? (
                  <span className="block text-xs text-slate-400">{inquiry.sourcePage}</span>
                ) : null}
              </span>
            </p>
          </div>

          {inquiry.message ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Message</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{inquiry.message}</p>
            </div>
          ) : null}

          <div className="mt-4">
            <label htmlFor="dealValue" className="mb-1.5 block text-sm font-medium text-slate-600">
              Deal value {dealDisplay ? <span className="text-slate-400">({dealDisplay})</span> : null}
            </label>
            <input
              id="dealValue"
              type="number"
              min="0"
              placeholder="Enter amount"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onBlur={handleValueBlur}
              readOnly={readOnly}
              disabled={readOnly}
              className="field-control disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>
        </Section>

        <Divider />

        {/* Vessel Details */}
        <Section title="Vessel Details">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Vessel Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Vessel Type</label>
              <Select
                value={inquiry.vesselType ?? ''}
                onChange={(e) => patchInquiry({ vesselType: e.target.value || null })}
                disabled={readOnly}
              >
                <option value="">— Select —</option>
                {['Ferry', 'Tour boat', 'House boat', 'Trawler', 'Yatch', 'Workboat', 'Patrol boat', 'other'].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </Select>
            </div>

            {/* Retrofit Status */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Retrofit Status</label>
              <Select
                value={inquiry.retrofitStatus ?? ''}
                onChange={(e) => patchInquiry({ retrofitStatus: e.target.value || null })}
                disabled={readOnly}
              >
                <option value="">— Select —</option>
                {['retrofit existing', 'new build', 'not decided yet'].map((v) => (
                  <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </Select>
            </div>

            {/* Vessel Length */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Vessel Length</label>
              <input
                type="text"
                placeholder="e.g. 30m"
                value={vesselLength}
                onChange={(e) => setVesselLength(e.target.value)}
                onBlur={() => {
                  if (!readOnly && vesselLength !== (inquiry.vesselLength ?? ''))
                    patchInquiry({ vesselLength: vesselLength || null });
                }}
                readOnly={readOnly}
                disabled={readOnly}
                className="field-control disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>

            {/* Operating Area */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Operating Area</label>
              <input
                type="text"
                placeholder="e.g. Gulf of Oman"
                value={operatingArea}
                onChange={(e) => setOperatingArea(e.target.value)}
                onBlur={() => {
                  if (!readOnly && operatingArea !== (inquiry.operatingArea ?? ''))
                    patchInquiry({ operatingArea: operatingArea || null });
                }}
                readOnly={readOnly}
                disabled={readOnly}
                className="field-control disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>

            {/* Daily Operating Hours */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Daily Operating Hours</label>
              <input
                type="text"
                placeholder="e.g. 16 hrs"
                value={dailyOperatingHours}
                onChange={(e) => setDailyOperatingHours(e.target.value)}
                onBlur={() => {
                  if (!readOnly && dailyOperatingHours !== (inquiry.dailyOperatingHours ?? ''))
                    patchInquiry({ dailyOperatingHours: dailyOperatingHours || null });
                }}
                readOnly={readOnly}
                disabled={readOnly}
                className="field-control disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>

            {/* Timeline */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Timeline</label>
              <input
                type="text"
                placeholder="e.g. Q3 2026"
                value={timeLine}
                onChange={(e) => setTimeLine(e.target.value)}
                onBlur={() => {
                  if (!readOnly && timeLine !== (inquiry.timeLine ?? ''))
                    patchInquiry({ timeLine: timeLine || null });
                }}
                readOnly={readOnly}
                disabled={readOnly}
                className="field-control disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
          </div>
        </Section>

        <Divider />

        {/* Tags */}
        <Section title="Tags">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {inquiry.tags?.length ? (
              inquiry.tags.map((t) => (
                <TagBadge
                  key={t}
                  onRemove={
                    readOnly
                      ? undefined
                      : () => removeTag.mutate({ id: inquiry._id, tag: t }, mutateOpts(toast))
                  }
                >
                  {t}
                </TagBadge>
              ))
            ) : (
              <p className="text-sm text-slate-400">No tags</p>
            )}
          </div>
          {!readOnly ? (
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="New tag"
                className="field-control flex-1"
              />
              <Button type="submit" variant="secondary" className="shrink-0 !rounded-xl px-3" aria-label="Add tag">
                <Plus size={16} />
              </Button>
            </form>
          ) : null}
        </Section>

        <Divider />

        {/* Quotation */}
        <Section title="Quotation">
          <label
            className={`flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 ${
              readOnly ? '' : 'cursor-pointer transition-colors hover:border-brand-200 hover:bg-brand-50/30'
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-900">
                {inquiry.quotation?.sent ? 'Marked as sent' : 'Not sent yet'}
              </p>
              {inquiry.quotation?.sent && inquiry.quotation?.sentAt ? (
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatRelativeTime(inquiry.quotation.sentAt)}
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-slate-400">Toggle when the quote is sent</p>
              )}
            </div>
            <input
              type="checkbox"
              checked={Boolean(inquiry.quotation?.sent)}
              disabled={readOnly}
              onChange={(e) =>
                setQuotationStatus.mutate(
                  { id: inquiry._id, sent: e.target.checked },
                  mutateOpts(toast)
                )
              }
              className="h-5 w-5 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-400 disabled:cursor-default"
            />
          </label>
        </Section>

        <Divider />

        {/* Documents */}
        <Section title="Documents">
          {documents?.length ? (
            <ul className="mb-3 space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc._id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <FileText size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-brand-900">
                        {doc.originalName}
                      </span>
                      <span className="text-xs capitalize text-slate-400">{doc.type}</span>
                    </span>
                  </span>
                  <span className="flex shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        downloadDocument(doc._id, doc.originalName).catch((err) =>
                          toast.error(err.message || 'Download failed')
                        )
                      }
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-brand-700"
                      aria-label="Download"
                    >
                      <Download size={15} />
                    </button>
                    {!readOnly ? (
                      <button
                        type="button"
                        onClick={() =>
                          deleteDocument.mutate(
                            { docId: doc._id, inquiryId: inquiry._id },
                            mutateOpts(toast)
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-3 text-sm text-slate-400">No documents yet</p>
          )}

          {!readOnly ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="sm:w-36">
                <Select
                  label="Type"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="quotation">Quotation</option>
                  <option value="invoice">Invoice</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700">
                <Upload size={16} />
                {uploadDocument.isPending ? 'Uploading…' : 'Upload file'}
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          ) : null}
        </Section>

        <Divider />

        {/* Activity */}
        <Section title="Activity">
          {!readOnly ? (
            <form onSubmit={handleAddLog} className="mb-4 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <Select
                    value={logType}
                    onChange={(e) => setLogType(e.target.value)}
                    aria-label="Log type"
                  >
                    <option value="note">Note</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="meeting">Meeting</option>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Textarea
                    value={logMessage}
                    onChange={(e) => setLogMessage(e.target.value)}
                    placeholder="What happened?"
                    rows={2}
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="secondary"
                className="w-full"
                disabled={!logMessage.trim() || addLog.isPending}
              >
                <Send size={14} />
                Add entry
              </Button>
            </form>
          ) : null}

          {logs?.length ? (
            <ol className="relative space-y-0 border-l-2 border-slate-200 pl-4">
              {logs.map((log) => {
                const isSystem = log.type === 'system' || log.type === 'stage_change';
                return (
                  <li key={log._id} className="relative pb-4 last:pb-0">
                    <span
                      className={`absolute -left-[1.3rem] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${isSystem ? 'bg-slate-300' : 'bg-brand-500'
                        }`}
                    />
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`rounded-md px-1.5 py-0.5 font-semibold capitalize ${isSystem
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-brand-50 text-brand-700'
                          }`}
                      >
                        {log.type.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400">{formatRelativeTime(log.createdAt)}</span>
                      {log.createdBy?.name ? (
                        <span className="text-slate-400">· {log.createdBy.name}</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{log.message}</p>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm text-slate-400">No activity yet</p>
          )}
        </Section>

        {!readOnly ? (
          <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
            <Button
              variant="danger"
              className="w-full"
              onClick={() => setConfirmDelete(true)}
              disabled={deleteInquiry.isPending}
            >
              <Trash2 size={15} />
              Delete inquiry
            </Button>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete inquiry?"
        description={`Delete the inquiry from ${inquiry.clientName}? This can't be undone.`}
        confirmLabel="Delete"
        loading={deleteInquiry.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}

export default function InquiryDrawer({
  inquiryId,
  onClose,
  onRequestStageMove,
  team = [],
  readOnly = false,
}) {
  const { data, isLoading } = useInquiry(inquiryId);
  const open = Boolean(inquiryId);
  const inquiry = data?.inquiry;

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:border-l sm:border-slate-200 ${open ? 'translate-x-0' : 'translate-x-full'
          }`}
      

        role="dialog"
        aria-modal="true"
        aria-label="Inquiry details"
      >
        {isLoading || !inquiry ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            {open && (
              <>
                <Spinner size={28} />
                <p className="text-sm text-slate-400">Loading…</p>
              </>
            )}
          </div>
        ) : (
          <InquiryDrawerContent
            key={inquiry._id}
            inquiry={inquiry}
            documents={data.documents}
            logs={data.logs}
            onClose={onClose}
            onRequestStageMove={onRequestStageMove}
            team={team}
            readOnly={readOnly}
          />
        )}
      </div>
    </>
  );
}
