import { useEffect, useState } from 'react';
import { AlertCircle, FolderKanban } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonCard from '../components/common/loaders/SkeletonCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Pagination from '../components/common/Pagination.jsx';
import ProjectForm from '../components/projects/ProjectForm.jsx';
import ProjectCardGrid from '../components/projects/ProjectCardGrid.jsx';
import ProjectStatusFilters from '../components/projects/ProjectStatusFilters.jsx';
import ProjectViewModal from '../components/projects/ProjectViewModal.jsx';
import { useProjects, useDeleteProject } from '../hooks/useProjects.js';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../context/ToastContext.jsx';
import {
  canCreateProject,
  canDeleteProject,
  canUpdateProject,
} from '../utils/permissions.js';
import { getProjectFilterLabel } from '../utils/projectStatus.js';

const PAGE_SIZE = 9;

export default function CsmProjectsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const canAdd = canCreateProject(user);
  const canEdit = canUpdateProject(user);
  const canDelete = canDeleteProject(user);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const apiStatus = statusFilter === 'all' ? undefined : statusFilter;
  const { data, isLoading, isError, error, refetch, isFetching } = useProjects({
    page,
    limit: PAGE_SIZE,
    status: apiStatus,
  });
  const deleteProject = useDeleteProject();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);
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
    setPage(1);
  }, [statusFilter]);

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
      subtitle={
        statusFilter === 'all'
          ? `CSM · ${pagination.total} project${pagination.total === 1 ? '' : 's'}`
          : `CSM · ${pagination.total} ${getProjectFilterLabel(statusFilter).toLowerCase()} project${pagination.total === 1 ? '' : 's'}`
      }
    >
      <div className="relative min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/80">
        <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <ProjectStatusFilters
            value={statusFilter}
            onChange={setStatusFilter}
            onAdd={() => setShowAddModal(true)}
            canAdd={canAdd}
          />

          {isLoading ? (
            <SkeletonCard count={9} />
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
                  onView={setViewProject}
                  onEdit={canEdit ? setEditProject : undefined}
                  onDelete={canDelete ? setPendingDelete : undefined}
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
                title={
                  statusFilter === 'all'
                    ? 'No projects yet'
                    : `No ${getProjectFilterLabel(statusFilter).toLowerCase()} projects`
                }
                description="Add a project using the Add project button above."
              />
            </div>
          )}
        </div>
      </div>

      <ProjectViewModal
        project={viewProject}
        onClose={() => setViewProject(null)}
        onEdit={canEdit ? setEditProject : undefined}
        onDelete={canDelete ? setPendingDelete : undefined}
      />

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add project"
        description="Create a new customer success project."
        size="lg"
      >
        <ProjectForm
          defaultStatus={statusFilter === 'all' ? 'ongoing' : statusFilter}
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
