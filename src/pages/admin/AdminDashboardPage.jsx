// AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardSummary } from '../../services/dashboardService';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';
import { ClipboardList, RefreshCw, Eye, TrendingUp, DollarSign } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardSummary(token);
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard summary stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-900/60">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Dashboard Overview</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time metrics on DineFlow's revenue, order queue, and daily operations.</p>
          </div>
          <Button
            onClick={fetchStats}
            loading={loading}
            variant="outline"
            className="self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </Button>
        </div>

        {/* Loaders & Errors */}
        {loading && (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && stats && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                label="Total Orders Placed"
                value={stats.totalOrders}
                icon={ClipboardList}
                color="blue"
              />
              <StatCard
                label="Total Revenue Generated"
                value={formatCurrency(stats.totalRevenue)}
                icon={DollarSign}
                color="emerald"
              />
              <StatCard
                label="Current Operations"
                value="Active"
                icon={TrendingUp}
                color="orange"
              />
            </div>

            {/* Recent Orders Section */}
            <Card isDarkMode={true} className="p-6 border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Recent Customer Requests</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Updated live</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 inline-flex items-center space-x-1 transition-colors"
                >
                  <span>View All Queue</span>
                  <Eye className="h-3.5 w-3.5" />
                </Link>
              </div>

              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="overflow-x-auto scrollbar-none">
                  <table className="min-w-full divide-y divide-slate-800/60">
                    <thead>
                      <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-4 py-3">Order Reference</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Date/Time</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-center">Payment</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40">
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id} className="text-xs hover:bg-slate-800/20 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap font-extrabold text-white">
                            #DF-ORD-{order.id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-slate-350 font-semibold">
                            {order.customer_name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-[10px] text-slate-500 font-semibold">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right font-bold text-white">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-slate-400 font-bold">
                            {order.payment_method}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <Badge
                              variant={
                                order.status === 'Completed'
                                  ? 'success'
                                  : order.status === 'Preparing'
                                  ? 'info'
                                  : 'warning'
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center py-10">No recent orders found.</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
