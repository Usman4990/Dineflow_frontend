// AdminMenuPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../hooks/useMenu';
import { addMenuItem, updateMenuItem, deleteMenuItem, updateMenuAvailability } from '../../services/menuService';
import AdminLayout from '../../components/layout/AdminLayout';
import MenuItemForm from '../../components/menu/MenuItemForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export const AdminMenuPage = () => {
  const { token } = useAuth();
  const { menuItems, loading, error, refetch } = useMenu(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionError, setActionError] = useState('');

  const handleOpenAddForm = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleSaveItem = async (formData) => {
    setActionError('');
    try {
      if (selectedItem) {
        await updateMenuItem(selectedItem.id, formData, token);
      } else {
        await addMenuItem(formData, token);
      }
      handleCloseForm();
      refetch();
    } catch (err) {
      console.error('Failed to save menu item:', err);
      setActionError(err.response?.data?.message || 'Error occurred while saving item details.');
    }
  };

  const handleDeleteItem = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete '${name}' from the menu?`);
    if (!confirmed) return;

    setActionError('');
    try {
      await deleteMenuItem(id, token);
      refetch();
    } catch (err) {
      console.error('Failed to delete menu item:', err);
      setActionError(err.response?.data?.message || 'Error occurred while deleting item.');
    }
  };

  const handleToggleAvailability = async (id, currentAvailability) => {
    setActionError('');
    try {
      await updateMenuAvailability(id, { is_available: !currentAvailability }, token);
      refetch();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
      setActionError(err.response?.data?.message || 'Error occurred while toggling availability.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-900/60">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Manage Menu Items</h2>
            <p className="text-xs text-slate-400 mt-1">Create, edit, or delete dishes inside your digital catalog and toggle quick availability status.</p>
          </div>
          <Button
            onClick={handleOpenAddForm}
            className="self-start sm:self-auto"
          >
            <Plus className="h-4.5 w-4.5 mr-1.5 stroke-[2.5]" />
            <span>Add Menu Item</span>
          </Button>
        </div>

        {/* Action errors banner */}
        {actionError && (
          <div className="p-4 bg-red-500/5 border border-red-500/20 text-xs font-bold text-red-400 rounded-xl leading-relaxed">
            {actionError}
          </div>
        )}

        {/* Loaders / Errors */}
        {loading && (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {menuItems.length === 0 ? (
              <EmptyState
                message="No menu items exist yet. Click the 'Add Menu Item' button to create your first dish!"
                actionLabel="Create Item"
                onAction={handleOpenAddForm}
              />
            ) : (
              <Card isDarkMode={true} className="border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto scrollbar-none">
                  <table className="min-w-full divide-y divide-slate-800/60">
                    <thead className="bg-slate-950/20">
                      <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Dish Image</th>
                        <th className="px-6 py-4">Name & Info</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Quick Toggle</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40 text-xs font-semibold text-slate-350">
                      {menuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/10 transition-colors">
                          {/* Image */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-12 w-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/30">
                              <img
                                src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>

                          {/* Name & Info */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col max-w-xs space-y-0.5">
                              <span className="text-sm font-bold text-white truncate">{item.name}</span>
                              <span className="text-xs text-slate-450 truncate">{item.description || 'No description provided.'}</span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4 whitespace-nowrap text-slate-350">
                            {item.category}
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-white text-right">
                            {formatCurrency(item.price)}
                          </td>

                          {/* Availability Status Badge */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Badge variant={item.is_available ? 'success' : 'danger'}>
                              {item.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </td>

                          {/* Quick Toggle Button */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Button
                              onClick={() => handleToggleAvailability(item.id, item.is_available)}
                              variant="outline"
                              size="sm"
                              className={
                                item.is_available
                                  ? 'border-red-500/20 hover:bg-red-500/5 text-red-400'
                                  : 'border-emerald-500/20 hover:bg-emerald-500/5 text-emerald-400'
                              }
                            >
                              {item.is_available ? 'Mark Out of Stock' : 'Mark Available'}
                            </Button>
                          </td>

                          {/* Action buttons */}
                          <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                            <Button
                              onClick={() => handleOpenEditForm(item)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit2 className="h-3.5 w-3.5 mr-1" />
                              <span>Edit</span>
                            </Button>
                            
                            <Button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              variant="outline"
                              size="sm"
                              className="border-red-500/20 hover:bg-red-500/5 text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              <span>Delete</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Modal form Add/Edit */}
        {isFormOpen && (
          <MenuItemForm
            item={selectedItem}
            onSave={handleSaveItem}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMenuPage;
