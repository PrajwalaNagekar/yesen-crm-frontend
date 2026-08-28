import { useState } from 'react';
import { AlertCircle, Package, Plus } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonCard from '../components/common/loaders/SkeletonCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import ProductForm from '../components/products/ProductForm.jsx';
import ProductCard from '../components/products/ProductCard.jsx';
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

  const { data, isLoading, isError, error, refetch } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const products = data?.products ?? [];

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
          {/* Header with Add Button */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm">
            <div>
              <h2 className="text-base font-semibold text-slate-900">All Products</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Manage your marine technology products
              </p>
            </div>
            {canAdd && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8]"
              >
                <Plus size={18} />
                Add Product
              </button>
            )}
          </div>

          {/* Products List */}
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
                  onEdit={canEdit ? () => setEditProduct(product) : undefined}
                  onDelete={canDelete ? () => setPendingDelete(product) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/80 px-6 py-16">
              <EmptyState
                icon={Package}
                title="No products yet"
                description="Add your first product using the Add Product button above."
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
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

      {/* Edit Product Modal */}
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

      {/* Delete Confirmation */}
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
