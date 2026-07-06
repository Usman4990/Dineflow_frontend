// MenuItemForm.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const CATEGORIES = [
  'Burgers',
  'Pizza',
  'BBQ',
  'Pakistani',
  'Chinese',
  'Fast Food',
  'Drinks',
  'Desserts',
];

export const MenuItemForm = ({ item, onSave, onClose }) => {
  const isEditMode = !!item;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    is_available: true,
    image_url: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || CATEGORIES[0],
        is_available: item.is_available ?? true,
        image_url: item.image_url || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Item name is required.';
    
    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = 'Please enter a valid non-negative price.';
    }
    
    if (!formData.category) newErrors.category = 'Category is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSave({
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}
      isDarkMode={true}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5 text-slate-100 bg-[#0c101c]/95">
        {/* Name */}
        <Input
          label="Item Name *"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Garlic Naan, Zinger Burger"
          error={errors.name}
        />

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Brief ingredients, serving size..."
            className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-slate-950/40 border-slate-850 focus:ring-orange-950/30 focus:border-orange-500 text-slate-100"
          />
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (Rs.) *"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="450"
            error={errors.price}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-slate-950/40 border-slate-850 focus:ring-orange-950/30 focus:border-orange-500 text-slate-100 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image URL */}
        <Input
          label="Image URL"
          type="text"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/food-image.jpg"
        />

        {/* Availability */}
        <div className="flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            name="is_available"
            id="is_available"
            checked={formData.is_available}
            onChange={handleChange}
            className="h-4.5 w-4.5 text-orange-600 border-slate-800 bg-slate-905 rounded focus:ring-orange-505 focus:outline-none cursor-pointer"
          />
          <label htmlFor="is_available" className="text-xs font-bold text-slate-400 cursor-pointer select-none uppercase tracking-wide">
            Mark as Available (Show in Menu)
          </label>
        </div>

        {/* Submit Actions */}
        <div className="mt-6 pt-4 border-t border-slate-900/80 flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
          >
            {isEditMode ? 'Save Changes' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MenuItemForm;
