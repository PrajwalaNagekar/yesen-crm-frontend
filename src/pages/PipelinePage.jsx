import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/layout/AppLayout.jsx';
import PipelineToolbar from '../components/pipeline/PipelineToolbar.jsx';
import KanbanBoard from '../components/pipeline/KanbanBoard.jsx';
import ListView from '../components/pipeline/ListView.jsx';
import CompactView from '../components/pipeline/CompactView.jsx';
import InquiryDrawer from '../components/pipeline/InquiryDrawer.jsx';
import LostReasonDialog from '../components/pipeline/LostReasonDialog.jsx';
import AddInquiryMenu from '../components/pipeline/AddInquiryMenu.jsx';
import IntakeFormModal from '../components/pipeline/IntakeFormModal.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useBoard, useMoveStage, useUpdateInquiry, useMarkInquiryViewed } from '../hooks/useInquiries.js';
import { useTeam } from '../hooks/useTeam.js';
import { usePipeline } from '../hooks/usePipeline.js';
import { useToast } from '../context/ToastContext.jsx';
import { canControlPipeline } from '../utils/permissions.js';

const VIEW_STORAGE_KEY = 'yesen-pipeline-view';

function loadView() {
  try {
    const v = localStorage.getItem(VIEW_STORAGE_KEY);
    if (v === 'board' || v === 'list' || v === 'compact') return v;
  } catch {
    /* ignore */
  }
  return 'board';
}

export default function PipelinePage() {
  const { user } = useAuth();
  const canControl = canControlPipeline(user);
  const toast = useToast();
  const { data: team = [] } = useTeam();
  const { data: pipeline } = usePipeline();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [source, setSource] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [view, setView] = useState(loadView);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [pendingLost, setPendingLost] = useState(null);
  const [intakeType, setIntakeType] = useState(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      /* ignore */
    }
  }, [view]);

  const filters = useMemo(
    () => ({
      q: debouncedSearch || undefined,
      source: source || undefined,
      assignedTo: assigneeFilter || undefined,
    }),
    [debouncedSearch, source, assigneeFilter]
  );

  const { data: columns, isLoading, error } = useBoard(filters);
  const moveStage = useMoveStage();
  const updateInquiry = useUpdateInquiry();
  const markInquiryViewed = useMarkInquiryViewed();

  const totalCount = columns?.reduce((sum, col) => sum + col.cards.length, 0) ?? 0;
  const unviewedCount =
    columns?.reduce(
      (sum, col) => sum + col.cards.filter((card) => !card.isViewed).length,
      0
    ) ?? 0;

  function handleOpenInquiry(inquiry) {
    setSelectedInquiryId(inquiry._id);
    if (!inquiry.isViewed) {
      markInquiryViewed.mutate(inquiry._id);
    }
  }

  function requestMove(inquiryId, stage) {
    if (stage === 'Lost') {
      setPendingLost({ inquiryId, stage });
      return;
    }
    moveStage.mutate(
      { id: inquiryId, stage },
      { onError: (err) => toast.error(err.message || 'Could not move card') }
    );
  }

  function confirmLost(lostReason) {
    if (!pendingLost) return;
    moveStage.mutate(
      { id: pendingLost.inquiryId, stage: 'Lost', lostReason },
      {
        onError: (err) => toast.error(err.message || 'Could not move card'),
        onSettled: () => setPendingLost(null),
      }
    );
  }

  function handleAssign(inquiryId, assignedTo) {
    updateInquiry.mutate(
      { id: inquiryId, updates: { assignedTo } },
      {
        onSuccess: () => toast.success(assignedTo ? 'Owner updated' : 'Marked unassigned'),
        onError: (err) => toast.error(err.message || 'Could not update owner'),
      }
    );
  }

  return (
    <AppLayout
      title="Inquiry Pipeline"
      subtitle={`${totalCount} ${totalCount === 1 ? 'inquiry' : 'inquiries'}${
        unviewedCount > 0 ? ` · ${unviewedCount} new` : ''
      }`}
      actions={
        canControl ? <AddInquiryMenu onSelect={setIntakeType} /> : null
      }
    >
      <div className="flex h-full min-h-0 flex-col">
        <PipelineToolbar
          search={search}
          onSearchChange={setSearch}
          source={source}
          onSourceChange={setSource}
          assigneeFilter={assigneeFilter}
          onAssigneeChange={setAssigneeFilter}
          team={team}
          currentUserId={user?._id || user?.id}
          view={view}
          onViewChange={setView}
        />

        <div className="min-h-0 flex-1">
          {view === 'board' && (
            <KanbanBoard
              columns={columns || []}
              isLoading={isLoading}
              error={error}
              canControl={canControl}
              onOpenInquiry={handleOpenInquiry}
              onDropCard={requestMove}
            />
          )}
          {view === 'list' && (
            <ListView
              columns={columns || []}
              isLoading={isLoading}
              error={error}
              canControl={canControl}
              stages={pipeline?.stages || []}
              team={team}
              onOpenInquiry={handleOpenInquiry}
              onStageChange={requestMove}
              onAssign={handleAssign}
            />
          )}
          {view === 'compact' && (
            <CompactView
              columns={columns || []}
              isLoading={isLoading}
              error={error}
              onOpenInquiry={handleOpenInquiry}
            />
          )}
        </div>
      </div>

      <InquiryDrawer
        inquiryId={selectedInquiryId}
        onClose={() => setSelectedInquiryId(null)}
        onRequestStageMove={requestMove}
        team={team}
        readOnly={!canControl}
      />

      <LostReasonDialog
        open={Boolean(pendingLost)}
        loading={moveStage.isPending}
        onConfirm={confirmLost}
        onCancel={() => setPendingLost(null)}
      />

      <IntakeFormModal
        type={intakeType}
        open={Boolean(intakeType)}
        onClose={() => setIntakeType(null)}
        onSuccess={(inquiry) => {
          if (inquiry?._id) handleOpenInquiry(inquiry);
        }}
      />
    </AppLayout>
  );
}
