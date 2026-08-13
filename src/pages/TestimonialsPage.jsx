import { useEffect, useState } from 'react';
import { AlertCircle, MessageSquareQuote, Plus } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import Spinner from '../components/common/Spinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Pagination from '../components/common/Pagination.jsx';
import TestimonialForm from '../components/testimonials/TestimonialForm.jsx';
import TestimonialTable from '../components/testimonials/TestimonialTable.jsx';
import { useTestimonials, useDeleteTestimonial } from '../hooks/useTestimonials.js';
import { useToast } from '../context/ToastContext.jsx';

const PAGE_SIZE = 10;

export default function TestimonialsPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useTestimonials({
    page,
    limit: PAGE_SIZE,
  });
  const deleteTestimonial = useDeleteTestimonial();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const testimonials = data?.testimonials ?? [];
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
    deleteTestimonial.mutate(
      { id: pendingDelete._id },
      {
        onSuccess: () => {
          toast.success(`${pendingDelete.name || 'Testimonial'} was deleted`);
          if (testimonials.length === 1 && page > 1) {
            setPage((current) => current - 1);
          }
          setPendingDelete(null);
        },
        onError: (err) => {
          toast.error(err.message || 'Could not delete testimonial');
          setPendingDelete(null);
        },
      }
    );
  }

  return (
    <AppLayout
      scrollable
      title="Testimonials"
      subtitle={`${pagination.total} testimonial${pagination.total === 1 ? '' : 's'}`}
      actions={
        <Button size="md" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Add testimonial
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
                {error?.message || 'Failed to load testimonials.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-sm font-semibold text-[#2563EB] underline-offset-2 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : testimonials.length ? (
            <>
              <div className={isFetching ? 'opacity-70 transition-opacity' : ''}>
                <TestimonialTable
                  testimonials={testimonials}
                  onEdit={setEditTestimonial}
                  onDelete={setPendingDelete}
                />
              </div>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                itemLabel="testimonials"
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/80 px-6 py-16">
              <EmptyState
                icon={MessageSquareQuote}
                title="No testimonials yet"
                description="Add your first testimonial using the Add testimonial button above."
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add testimonial"
        description="Create a new client testimonial."
        size="lg"
      >
        <TestimonialForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setPage(1);
          }}
        />
      </Modal>

      <Modal
        key={editTestimonial?._id}
        open={Boolean(editTestimonial)}
        onClose={() => setEditTestimonial(null)}
        title="Edit testimonial"
        description={editTestimonial?.name ? `Update ${editTestimonial.name}` : 'Update testimonial'}
        size="lg"
      >
        <TestimonialForm
          testimonial={editTestimonial}
          onClose={() => setEditTestimonial(null)}
          onSuccess={() => setEditTestimonial(null)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete testimonial?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.name || 'this testimonial'}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteTestimonial.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AppLayout>
  );
}
