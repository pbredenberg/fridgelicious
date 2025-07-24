"use client";

import { useAppSelector } from "../../store/hooks";
import { WastedItem } from "../../store/wasteTrackerSlice";
import Link from "next/link";

export default function WasteReportPage() {
  const wastedItems = useAppSelector(state => state.wasteTracker.wastedItems);

  const calculateWasteStats = () => {
    const totalWasted = wastedItems.length;
    
    if (totalWasted === 0) {
      return {
        totalWasted: 0,
        wasteByMonth: {},
        commonWastedItems: {},
        recentWaste: [],
      };
    }

    // Group by month
    const wasteByMonth: Record<string, number> = {};
    const commonWastedItems: Record<string, number> = {};
    
    wastedItems.forEach(item => {
      const date = new Date(item.dateChucked);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      wasteByMonth[monthKey] = (wasteByMonth[monthKey] || 0) + 1;
      commonWastedItems[item.name] = (commonWastedItems[item.name] || 0) + 1;
    });

    // Get recent waste (last 10 items)
    const recentWaste = [...wastedItems]
      .sort((a, b) => new Date(b.dateChucked).getTime() - new Date(a.dateChucked).getTime())
      .slice(0, 10);

    return {
      totalWasted,
      wasteByMonth,
      commonWastedItems,
      recentWaste,
    };
  };

  const stats = calculateWasteStats();
  const sortedMonths = Object.entries(stats.wasteByMonth).sort(([a], [b]) => b.localeCompare(a));
  const topWastedItems = Object.entries(stats.commonWastedItems)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center">Food Waste Report</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back to Fridge
        </Link>
      </div>

      {stats.totalWasted === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">🎉 Great Job!</h2>
          <p className="text-green-700 text-lg">
            You haven't wasted any food yet. Keep up the excellent work managing your fridge!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overview Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-700">📊 Waste Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <span className="font-medium">Total Items Wasted:</span>
                <span className="text-2xl font-bold text-red-600">{stats.totalWasted}</span>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-700">📅 Monthly Breakdown</h2>
            <div className="space-y-2">
              {sortedMonths.length > 0 ? (
                sortedMonths.map(([month, count]) => (
                  <div key={month} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span>{formatMonth(month)}</span>
                    <span className="font-semibold text-orange-600">{count} items</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No monthly data available</p>
              )}
            </div>
          </div>

          {/* Most Wasted Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">🗑️ Most Wasted Items</h2>
            <div className="space-y-2">
              {topWastedItems.length > 0 ? (
                topWastedItems.map(([item, count]) => (
                  <div key={item} className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span className="font-medium">{item}</span>
                    <span className="text-purple-600">{count} time{count > 1 ? 's' : ''}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No waste data available</p>
              )}
            </div>
          </div>

          {/* Recent Waste */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">🕒 Recent Waste</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.recentWaste.length > 0 ? (
                stats.recentWaste.map((item: WastedItem) => (
                  <div key={`${item.id}-${item.dateChucked}`} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <p className="text-gray-500 text-xs">
                        Expired: {item.expirationDate}
                      </p>
                    </div>
                    <span className="text-gray-600">{formatDate(item.dateChucked)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent waste data</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-3">💡 Tips to Reduce Food Waste</h3>
        <ul className="text-blue-700 text-sm space-y-2">
          <li>• Plan your meals before shopping to buy only what you need</li>
          <li>• Store food properly to extend its shelf life</li>
          <li>• Use the "first in, first out" principle - use older items first</li>
          <li>• Check expiration dates regularly and use items before they expire</li>
          <li>• Consider freezing items that are about to expire</li>
          <li>• Repurpose leftovers into new meals</li>
        </ul>
      </div>
    </div>
  );
}
