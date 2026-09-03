import { useEffect, useState } from 'react';
import { AlertCircle, Layers } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonCard from '../components/common/loaders/SkeletonCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import CatalogueListToolbar from '../components/common/CatalogueListToolbar.jsx';
import SolutionForm from '../components/solutions/SolutionForm.jsx';
import SolutionCard from '../components/solutions/SolutionCard.jsx';
import SolutionViewModal from '../components/solutions/SolutionViewModal.jsx';
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

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const { data, isLoading, isError, error, refetch } = useSolutions({
    q: debouncedSearch || undefined,
    sort,
  });
  const deleteSolution = useDeleteSolution();

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewSolution, setViewSolution] = useState(null);
  const [editSolution, setEditSolution] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const solutions = data?.solutions ?? [];

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

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
          <CatalogueListToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search solutions by name, tagline, or description…"
            sort={sort}
            onSortChange={setSort}
            onAdd={() => setShowAddModal(true)}
            addLabel="Add Solution"
            canAdd={canAdd}
          />

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
                  onView={setViewSolution}
                  onEdit={canEdit ? () => setEditSolution(solution) : undefined}
                  onDelete={canDelete ? () => setPendingDelete(solution) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/80 px-6 py-16">
              <EmptyState
                icon={Layers}
                title={debouncedSearch ? 'No solutions match your search' : 'No solutions yet'}
                description={
                  debouncedSearch
                    ? 'Try adjusting your search or sort options.'
                    : 'Add your first solution using the Add Solution button above.'
                }
              />
            </div>
          )}
        </div>
      </div>

      <SolutionViewModal
        solution={viewSolution}
        onClose={() => setViewSolution(null)}
        onEdit={canEdit ? setEditSolution : undefined}
        onDelete={canDelete ? setPendingDelete : undefined}
      />

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
