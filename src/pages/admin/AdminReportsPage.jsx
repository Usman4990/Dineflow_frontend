// AdminReportsPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReportSummary } from '../../services/reportService';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatCurrency } from '../../utils/formatCurrency';
import { Clock3, BarChart3, ListChecks, Award, Users, CheckCircle2, XCircle, ShoppingBag, FolderHeart, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export const AdminReportsPage = () => {
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReportSummary(token);
      setReport(data);
    } catch (err) {
      console.error('Error fetching report summary:', err);
      setError(err.response?.data?.message || 'Unable to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReport();
    }
  }, [token]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-900/60">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Reports Overview</h2>
            <p className="text-xs text-slate-400 mt-1">Detailed audits, category performance, item popularity logs, and total revenue tracking.</p>
          </div>
          <Button
            onClick={fetchReport}
            loading={loading}
            variant="outline"
            className="self-start sm:self-auto"
          >
            <BarChart3 className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Audit Logs</span>
          </Button>
        </div>

        {loading && (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        {!loading && report && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stat Cards - Grid with 6 items */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
              <StatCard label="Total Orders" value={report.totalOrders} icon={ListChecks} color="blue" />
              <StatCard label="Total Revenue" value={formatCurrency(report.totalRevenue)} icon={Award} color="emerald" />
              <StatCard label="Customers" value={report.totalCustomers} icon={Users} color="violet" />
              <StatCard label="Completed" value={report.completedOrders} icon={CheckCircle2} color="emerald" />
              <StatCard label="Pending" value={report.pendingOrders} icon={Clock3} color="amber" />
              <StatCard label="Cancelled" value={report.cancelledOrders} icon={XCircle} color="red" />
            </div>

            {/* Grid 1: Top Selling Items and Top Categories */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Top Selling Menu Items */}
              <Card isDarkMode={true} className="p-6 border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-lg flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-orange-400" />
                    <span>Top Selling Menu Items</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">By volume</span>
                </div>
                {report.topSellingItems.length === 0 ? (
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center py-10 flex-grow flex items-center justify-center">No sales data available yet.</p>
                ) : (
                  <div className="overflow-x-auto scrollbar-none">
                    <table className="min-w-full divide-y divide-slate-850/40 text-xs">
                      <thead>
                        <tr className="text-left text-slate-500 font-bold uppercase tracking-widest">
                          <th className="pb-3 px-2">Dish Name</th>
                          <th className="pb-3 px-2">Category</th>
                          <th className="pb-3 px-2 text-center">Qty Sold</th>
                          <th className="pb-3 px-2 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/40 font-semibold text-slate-350">
                        {report.topSellingItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-800/10 transition-colors">
                            <td className="py-3 px-2 font-bold text-white">{item.name}</td>
                            <td className="py-3 px-2 text-slate-450">{item.category}</td>
                            <td className="py-3 px-2 text-center font-bold text-slate-300">{item.quantity_sold}</td>
                            <td className="py-3 px-2 text-right font-black text-orange-400">{formatCurrency(item.revenue_generated)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              {/* Most Ordered Categories */}
              <Card isDarkMode={true} className="p-6 border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-lg flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <FolderHeart className="h-4 w-4 text-violet-400" />
                    <span>Most Ordered Categories</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">By portion count</span>
                </div>
                {report.topCategories.length === 0 ? (
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center py-10 flex-grow flex items-center justify-center">No category data available yet.</p>
                ) : (
                  <div className="space-y-5 flex-grow flex flex-col justify-center">
                    {report.topCategories.map((cat, idx) => {
                      const maxQty = report.topCategories[0]?.quantity_sold || 1;
                      const percentage = Math.round((cat.quantity_sold / maxQty) * 100);
                      return (
                        <div key={cat.category || idx} className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-white">{cat.category}</span>
                            <span className="text-slate-500 text-[10px] uppercase font-bold">{cat.quantity_sold} portions ({formatCurrency(cat.revenue)})</span>
                          </div>
                          <div className="w-full bg-slate-950/60 h-2.5 rounded-full overflow-hidden border border-slate-800/50">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500 shadow-md shadow-orange-500/20"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>

            {/* Grid 2: Daily Sales and Monthly Revenue */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Daily Sales (Last 7 Days) */}
              <Card isDarkMode={true} className="p-6 border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>Daily Revenue (Last 7 Days)</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Weekly trend</span>
                </div>
                {report.dailyRevenue.length === 0 ? (
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center py-10">No daily sales logs published.</p>
                ) : (
                  <div className="space-y-3">
                    {report.dailyRevenue.map((row) => (
                      <div key={row.date} className="flex items-center justify-between text-xs py-3.5 px-4 bg-slate-950/20 hover:bg-slate-950/40 rounded-2xl border border-slate-850/50 hover:border-slate-800 transition-all font-semibold text-slate-300">
                        <span className="font-bold text-white">{row.date}</span>
                        <div className="flex items-center gap-6">
                          <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">{row.order_count} orders</span>
                          <span className="font-black text-white min-w-[80px] text-right">{formatCurrency(row.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Monthly Revenue */}
              <Card isDarkMode={true} className="p-6 border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-400" />
                    <span>Monthly Revenue Statistics</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Yearly trend</span>
                </div>
                {report.monthlyRevenue.length === 0 ? (
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center py-10">No monthly revenue logs available.</p>
                ) : (
                  <div className="space-y-3">
                    {report.monthlyRevenue.map((row) => (
                      <div key={row.month} className="flex items-center justify-between text-xs py-3.5 px-4 bg-slate-950/20 hover:bg-slate-950/40 rounded-2xl border border-slate-850/50 hover:border-slate-800 transition-all font-semibold text-slate-300">
                        <span className="font-bold text-white">{row.month}</span>
                        <div className="flex items-center gap-6">
                          <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 px-2 py-0.5 rounded font-black uppercase tracking-wider">{row.order_count} orders</span>
                          <span className="font-black text-white min-w-[80px] text-right">{formatCurrency(row.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
