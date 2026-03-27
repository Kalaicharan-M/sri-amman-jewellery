import { Link } from "react-router";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Edit,
} from "lucide-react";

export function AdminDashboard() {
  const stats = [
    {
      label: "Total Products",
      value: "450",
      change: "+12 this month",
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Listings",
      value: "438",
      change: "97% active rate",
      icon: <Eye className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Gold Rate (22K)",
      value: "₹6,450",
      change: "+0.39% today",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Enquiries Today",
      value: "24",
      change: "+8 from yesterday",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const recentActivity = [
    { action: "Product added", item: "Elegant Gold Chain", time: "2 hours ago" },
    { action: "Gold rate updated", item: "Auto-sync from data source", time: "5 hours ago" },
    { action: "Product edited", item: "Wedding Ring Set", time: "1 day ago" },
    { action: "Product added", item: "Traditional Bangles", time: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Overview of your jewellery store management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-gray-600">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/products"
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Manage Products</span>
                </Link>
                <Link
                  to="/admin/gold-rate"
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Override Gold Rate</span>
                </Link>
                <Link
                  to="/products"
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">View Store</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Edit className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 mb-1">{activity.action}</p>
                      <p className="text-sm text-gray-600 break-words">{activity.item}</p>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 sm:text-right">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gold Rate Auto-Update Info Card */}
        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Auto-Updated Gold Rates</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Rates sync automatically from live data source</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Last sync: Today at 10:00 AM</p>
              </div>
            </div>
            <Link
              to="/admin/gold-rate"
              className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors shadow-md whitespace-nowrap"
            >
              Manual Override
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
