import { useState } from 'react';
import { AlertCircle, Layers, Plus } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonCard from '../components/common/loaders/SkeletonCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import SolutionForm from '../components/solutions/SolutionForm.jsx';
import SolutionCard from '../components/solutions/SolutionCard.jsx';
import { useSolutions, useDeleteSolution } from '../hooks/useSolutions.js';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../context/ToastContext.jsx';
import {
  canCreateSolution,
  canDeleteSolution,
  canUpdateSolution,
} from '../utils/permissions.js';

export default function SolutionsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const canAdd = canCreateSolution(user);
  const canEdit = canUpdateSolution(user);
  const canDelete = canDeleteSolution(user);

  const { data, isLoading, isError, error, refetch } = useSolutions();
  const deleteSolution = useDeleteSolution();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editSolution, setEditSolution] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const solutions = data?.solutions ?? [];

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteSolution.mutate(
      { id: pendingDelete._id },
      {
        onSuccess: () => {
          toast.success(`${pendingDelete.name || 'Solution'} was deleted`);
          setPendingDelete(null);
        },
        onError: (err) => {
          toast.error(err.message || 'Could not delete solution');
          setPendingDelete(null);
        },
      }
    );
  }

  return (
    <AppLayout
      scrollable
      title="Solutions"
      subtitle={`Marine & shore solutions · ${solutions.length} solution${solutions.length === 1 ? '' : 's'}`}
    >
      <div className="relative min-h-full bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100/80">
        <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm">
            <div>
              <h2 className="text-base font-semibold text-slate-900">All Solutions</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Manage solutions shown on the public website
              </p>
            </div>
            {canAdd ? (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8]"
              >
                <Plus size={18} />
                Add Solution
              </button>
            ) : null}
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <SkeletonCard count={6} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-500">
                <AlertCircle size={22} />
              </div>
              <p className="text-sm font-medium text-red-700">
                {error?.message || 'Failed to load solutions.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-sm font-semibold text-[#2563EB] underline-offset-2 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : solutions.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {solutions.map((solution) => (
                <SolutionCard
                  key={solution._id}
                  solution={solution}
                  onEdit={canEdit ? () => setEditSolution(solution) : undefined}
                  onDelete={canDelete ? () => setPendingDelete(solution) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/80 px-6 py-16">
              <EmptyState
                icon={Layers}
                title="No solutions yet"
                description="Add your first solution using the Add Solution button above."
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Solution"
        description="Create a new solution for the public website."
        size="lg"
      >
        <SolutionForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            toast.success('Solution created successfully');
          }}
        />
      </Modal>

      <Modal
        key={editSolution?._id}
        open={Boolean(editSolution)}
        onClose={() => setEditSolution(null)}
        title="Edit Solution"
        description={editSolution?.name ? `Update ${editSolution.name}` : 'Update solution details'}
        size="lg"
      >
        <SolutionForm
          solution={editSolution}
          onClose={() => setEditSolution(null)}
          onSuccess={() => {
            setEditSolution(null);
            toast.success('Solution updated successfully');
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete solution?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.name || 'this solution'}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteSolution.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AppLayout>
  );
}
