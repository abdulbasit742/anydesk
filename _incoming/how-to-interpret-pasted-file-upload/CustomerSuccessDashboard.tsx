import React from 'react';
import { HealthScore } from '@remotedesk/shared/customer-success/health-score-dtos';
import { UsageSummary } from '@remotedesk/shared/customer-success/usage-summary-dtos';
import { RenewalRiskSignal } from '@remotedesk/shared/customer-success/renewal-risk-signals';

interface CustomerSuccessDashboardProps {
  organizationId: string;
  healthScores: HealthScore[];
  usageSummaries: UsageSummary[];
  renewalRiskSignals: RenewalRiskSignal[];
}

const CustomerSuccessDashboard: React.FC<CustomerSuccessDashboardProps> = ({
  organizationId,
  healthScores,
  usageSummaries,
  renewalRiskSignals,
}) => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Customer Success Dashboard for Organization: {organizationId}</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Health Score Card */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Overall Health Score</h2>
          {healthScores.length > 0 ? (
            <div className="text-center">
              <p className="text-5xl font-extrabold text-indigo-600">{healthScores[0].score}</p>
              <p className={`text-lg font-medium ${healthScores[0].status === 'good' ? 'text-green-600' : healthScores[0].status === 'at_risk' ? 'text-yellow-600' : 'text-red-600'}`}>
                Status: {healthScores[0].status.replace(/_/g, ' ')}
              </p>
              <p className="text-sm text-gray-500">Last updated: {new Date(healthScores[0].calculatedAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-gray-500">No health score data available.</p>
          )}
        </div>

        {/* Usage Summary Card */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent Usage Summary</h2>
          {usageSummaries.length > 0 ? (
            <div>
              <p className="text-gray-700">Total Sessions: <span className="font-medium">{usageSummaries[0].totalSessions}</span></p>
              <p className="text-gray-700">Total Session Minutes: <span className="font-medium">{usageSummaries[0].totalSessionMinutes}</span></p>
              <p className="text-gray-700">Unique Hosts: <span className="font-medium">{usageSummaries[0].uniqueHosts}</span></p>
              <p className="text-gray-700">Data Transferred: <span className="font-medium">{usageSummaries[0].dataTransferredGb.toFixed(2)} GB</span></p>
              <p className="text-sm text-gray-500">Period: {new Date(usageSummaries[0].periodStart).toLocaleDateString()} - {new Date(usageSummaries[0].periodEnd).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-gray-500">No usage summary data available.</p>
          )}
        </div>

        {/* Renewal Risk Card */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Renewal Risk Signals</h2>
          {renewalRiskSignals.length > 0 ? (
            <div>
              <p className={`text-lg font-medium ${renewalRiskSignals[0].riskLevel === 'high' || renewalRiskSignals[0].riskLevel === 'critical' ? 'text-red-600' : 'text-green-600'}`}>
                Risk Level: {renewalRiskSignals[0].riskLevel}
              </p>
              <p className="text-gray-700">Risk Score: <span className="font-medium">{renewalRiskSignals[0].riskScore}</span></p>
              <p className="text-gray-700">Factors: {renewalRiskSignals[0].factors.map(f => f.factorName).join(', ')}</p>
              <p className="text-sm text-gray-500">Detected: {new Date(renewalRiskSignals[0].signalDate).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-gray-500">No renewal risk signals detected.</p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Detailed Health Scores</h2>
        {healthScores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factors</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthScores.map((score) => (
                  <tr key={score.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(score.calculatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.status.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.trend || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.factors.map(f => `${f.factorName}: ${f.value}`).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No detailed health score history available.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Detailed Usage Summaries</h2>
        {usageSummaries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutes</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hosts</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data (GB)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usageSummaries.map((summary) => (
                  <tr key={summary.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(summary.periodStart).toLocaleDateString()} - {new Date(summary.periodEnd).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{summary.totalSessions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{summary.totalSessionMinutes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{summary.uniqueHosts}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{summary.dataTransferredGb.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No detailed usage summary history available.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">All Renewal Risk Signals</h2>
        {renewalRiskSignals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factors</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renewalRiskSignals.map((signal) => (
                  <tr key={signal.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(signal.signalDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{signal.riskLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{signal.riskScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{signal.factors.map(f => f.factorName).join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{signal.recommendedAction || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No detailed renewal risk signal history available.</p>
        )}
      </section>
    </div>
  );
};

export default CustomerSuccessDashboard;
