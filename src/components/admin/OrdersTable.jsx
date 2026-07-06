// OrdersTable.jsx
import React from 'react';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { CreditCard, DollarSign } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export const OrdersTable = ({ orders = [], onStatusChange, onCancel }) => {
  return (
    <Card isDarkMode={true} className="border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto scrollbar-none">
        <table className="min-w-full divide-y divide-slate-800/60">
          <thead className="bg-slate-950/20">
            <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th scope="col" className="px-6 py-4">Order ID</th>
              <th scope="col" className="px-6 py-4">Customer</th>
              <th scope="col" className="px-6 py-4">Contact Info</th>
              <th scope="col" className="px-6 py-4">Delivery Address</th>
              <th scope="col" className="px-6 py-4">City</th>
              <th scope="col" className="px-6 py-4 text-right">Total Amount</th>
              <th scope="col" className="px-6 py-4 text-center">Payment</th>
              <th scope="col" className="px-6 py-4 text-center">Current Status</th>
              <th scope="col" className="px-6 py-4 text-center">Manage Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/40 text-xs font-semibold text-slate-350">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-800/10 transition-colors">
                {/* Order ID */}
                <td className="px-6 py-4 whitespace-nowrap font-extrabold text-white">
                  #DF-ORD-{order.id}
                </td>
                
                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-sm font-bold text-white">{order.customer_name}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ref ID: #{order.id}</span>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-0.5 text-slate-350">
                    {order.customer_phone ? (
                      <span className="font-bold">{order.customer_phone}</span>
                    ) : null}
                    <span className="text-[10px] text-slate-500 font-semibold truncate">{order.customer_email}</span>
                  </div>
                </td>
                
                {/* Delivery Address */}
                <td className="px-6 py-4 max-w-[200px] text-slate-350 truncate">
                  {order.delivery_address || '-'}
                </td>

                {/* Delivery City */}
                <td className="px-6 py-4 whitespace-nowrap text-slate-350">
                  {order.delivery_city || '-'}
                </td>

                {/* Total */}
                <td className="px-6 py-4 whitespace-nowrap font-bold text-white text-right">
                  {formatCurrency(order.total_amount)}
                </td>
                
                {/* Payment Method */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-950/40 border border-slate-800/40 rounded-xl text-slate-450">
                    {order.payment_method === 'Card' ? (
                      <CreditCard className="h-3.5 w-3.5" />
                    ) : (
                      <DollarSign className="h-3.5 w-3.5" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{order.payment_method}</span>
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Badge
                    variant={
                      order.status === 'Completed'
                        ? 'success'
                        : order.status === 'Preparing'
                        ? 'info'
                        : order.status === 'Cancelled'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {order.status}
                  </Badge>
                </td>
                
                {/* Action Dropdown / Manage */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex flex-col items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-800 bg-[#0c101c] hover:border-slate-700 text-xs font-bold text-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-950/30 focus:border-orange-500 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {['Pending', 'Preparing'].includes(order.status) && onCancel && (
                      <Button
                        type="button"
                        onClick={() => onCancel(order.id)}
                        variant="outline"
                        size="sm"
                        className="px-2.5 py-1 rounded-full border-red-500/20 text-red-400 hover:bg-red-500/5 text-[9px] uppercase tracking-wider"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OrdersTable;
