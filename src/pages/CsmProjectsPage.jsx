import { useEffect, useState } from 'react';
import { AlertCircle, FolderKanban, Plus } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import Spinner from '../components/common/Spinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Pagination from '../components/common/Pagination.jsx';
import ProjectForm from '../components/projects/ProjectForm.jsx';
import ProjectCardGrid from '../components/projects/ProjectCardGrid.jsx';
import { useProjects, useDeleteProject } from '../hooks/useProjects.js';
import { useToast } from '../context/ToastContext.jsx';

const PAGE_SIZE = 9;

export default function CsmProjectsPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useProjects({
    page,
    limit: PAGE_SIZE,
  });
  const deleteProject = useDeleteProject();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const projects = data?.projects ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination.totalPages]);

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteProject.mutate(
      { id: pendingDelete._id },
      {
        onSuccess: () => {
          toast.success(`${pendingDelete.name || 'Project'} was deleted`);
          if (projects.length === 1 && page > 1) {
            setPage((current) => current - 1);
          }
          setPendingDelete(null);
        },
        onError: (err) => {
          toast.error(err.message || 'Could not delete project');
          setPendingDelete(null);
        },
      }
    );
  }

  return (
    <AppLayout
      scrollable
      title="Projects"
      subtitle={`CSM · ${pagination.total} project${pagination.total === 1 ? '' : 's'}`}
      actions={
        <Button size="md" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Add project
        </Button>
      }
    >
      <div className="relative min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/80">
        <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
              <Spinner size={24} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-500">
                <AlertCircle size={22} />
              </div>
              <p className="text-sm font-medium text-red-700">
                {error?.message || 'Failed to load projects.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-sm font-semibold text-[#2563EB] underline-offset-2 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : projects.length ? (
            <>
              <div className={isFetching ? 'opacity-70 transition-opacity' : ''}>
                <ProjectCardGrid
                  projects={projects}
                  onEdit={setEditProject}
                  onDelete={setPendingDelete}
                />
              </div>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                itemLabel="projects"
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/80 px-6 py-16">
              <EmptyState
                icon={FolderKanban}
                title="No projects yet"
                description="Add your first project using the Add project button above."
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add project"
        description="Create a new customer success project."
        size="lg"
      >
        <ProjectForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setPage(1);
          }}
        />
      </Modal>

      <Modal
        key={editProject?._id}
        open={Boolean(editProject)}
        onClose={() => setEditProject(null)}
        title="Edit project"
        description={editProject?.name ? `Update ${editProject.name}` : 'Update project details'}
        size="lg"
      >
        <ProjectForm
          project={editProject}
          onClose={() => setEditProject(null)}
          onSuccess={() => setEditProject(null)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete project?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.name || 'this project'}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteProject.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AppLayout>
  );
}
