import { useEffect, useState } from 'react';
import { AlertCircle, Package } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonCard from '../components/common/loaders/SkeletonCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import CatalogueListToolbar from '../components/common/CatalogueListToolbar.jsx';
import ProductForm from '../components/products/ProductForm.jsx';
import ProductCard from '../components/products/ProductCard.jsx';
import ProductViewModal from '../components/products/ProductViewModal.jsx';
import { useProducts, useDeleteProduct } from '../hooks/useProducts.js';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../context/ToastContext.jsx';
import {
  canCreateProduct,
  canDeleteProduct,
  canUpdateProduct,
} from '../utils/permissions.js';

export default function ProductsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const canAdd = canCreateProduct(user);
  const canEdit = canUpdateProduct(user);
  const canDelete = canDeleteProduct(user);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const { data, isLoading, isError, error, refetch } = useProducts({
    q: debouncedSearch || undefined,
    sort,
  });
  const deleteProduct = useDeleteProduct();

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const products = data?.products ?? [];

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteProduct.mutate(
      { id: pendingDelete._id },
      {
        onSuccess: () => {
          toast.success(`${pendingDelete.name || 'Product'} was deleted`);
          setPendingDelete(null);
        },
        onError: (err) => {
          toast.error(err.message || 'Could not delete product');
          setPendingDelete(null);
        },
      }
    );
  }

  return (
    <AppLayout
      scrollable
      title="Products"
      subtitle={`E-MARINE, B-KOOL, M-CONTROL, B-GUARD · ${products.length} product${products.length === 1 ? '' : 's'}`}
    >
      <div className="relative min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/80">
        <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <CatalogueListToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search products by name, label, or description…"
            sort={sort}
            onSortChange={setSort}
            onAdd={() => setShowAddModal(true)}
            addLabel="Add Product"
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
                {error?.message || 'Failed to load products.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-sm font-semibold text-[#2563EB] underline-offset-2 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : products.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onView={setViewProduct}
                  onEdit={canEdit ? () => setEditProduct(product) : undefined}
                  onDelete={canDelete ? () => setPendingDelete(product) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/80 px-6 py-16">
              <EmptyState
                icon={Package}
                title={debouncedSearch ? 'No products match your search' : 'No products yet'}
                description={
                  debouncedSearch
                    ? 'Try adjusting your search or sort options.'
                    : 'Add your first product using the Add Product button above.'
                }
              />
            </div>
          )}
        </div>
      </div>

      <ProductViewModal
        product={viewProduct}
        onClose={() => setViewProduct(null)}
        onEdit={canEdit ? setEditProduct : undefined}
        onDelete={canDelete ? setPendingDelete : undefined}
      />

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Product"
        description="Create a new marine technology product."
        size="lg"
      >
        <ProductForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            toast.success('Product created successfully');
          }}
        />
      </Modal>

      <Modal
        key={editProduct?._id}
        open={Boolean(editProduct)}
        onClose={() => setEditProduct(null)}
        title="Edit Product"
        description={editProduct?.name ? `Update ${editProduct.name}` : 'Update product details'}
        size="lg"
      >
        <ProductForm
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={() => {
            setEditProduct(null);
            toast.success('Product updated successfully');
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete product?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.name || 'this product'}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteProduct.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AppLayout>
  );
}
