import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const CertifierPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [credits, setCredits] = useState([]);
  const [requests, setRequests] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [reviewForm, setReviewForm] = useState({
    requestId: '',
    reviewNotes: '',
    complianceChecks: {
      renewableEnergyVerified: false,
      electrolyzerEfficiencyVerified: false,
      documentationComplete: false,
      regulatoryCompliance: false
    }
  });

  const [rejectForm, setRejectForm] = useState({
    requestId: '',
    rejectionReason: '',
    reviewNotes: ''
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/certifier/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/certifier/pendingRequests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPendingRequests(response.data.requests);
    } catch (error) {
      setError('Failed to load pending requests');
      console.error('Load pending requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCredits = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/certifier/credits', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCredits(response.data.credits);
    } catch (error) {
      setError('Failed to load credits');
      console.error('Load credits error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/certifier/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(response.data.requests);
    } catch (error) {
      setError('Failed to load requests');
      console.error('Load requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditTrail = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/certifier/auditTrail', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAuditTrail(response.data.auditTrail);
    } catch (error) {
      setError('Failed to load audit trail');
      console.error('Load audit trail error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    
    if (tab === 'pending') {
      loadPendingRequests();
    } else if (tab === 'credits') {
      loadCredits();
    } else if (tab === 'requests') {
      loadRequests();
    } else if (tab === 'audit') {
      loadAuditTrail();
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      setLoading(true);
      
      const response = await axios.post('/api/certifier/approveRequest', {
        requestId,
        reviewNotes: reviewForm.reviewNotes,
        complianceChecks: reviewForm.complianceChecks
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Request approved successfully!');
      setReviewForm({
        requestId: '',
        reviewNotes: '',
        complianceChecks: {
          renewableEnergyVerified: false,
          electrolyzerEfficiencyVerified: false,
          documentationComplete: false,
          regulatoryCompliance: false
        }
      });
      loadDashboardData();
      loadPendingRequests();
    } catch (error) {
      setError('Failed to approve request');
      console.error('Approve request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setLoading(true);
      
      const response = await axios.post('/api/certifier/rejectRequest', {
        requestId,
        rejectionReason: rejectForm.rejectionReason,
        reviewNotes: rejectForm.reviewNotes
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Request rejected successfully!');
      setRejectForm({
        requestId: '',
        rejectionReason: '',
        reviewNotes: ''
      });
      loadDashboardData();
      loadPendingRequests();
    } catch (error) {
      setError('Failed to reject request');
      console.error('Reject request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    if (!dashboardData) return <div>Loading...</div>;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Certifier Dashboard</h2>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-600">{dashboardData.requests.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Approved Credits</h3>
            <p className="text-3xl font-bold text-green-600">{dashboardData.requests.approved}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Credits Issued</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboardData.credits.totalCreditsIssued}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Active Credits</h3>
            <p className="text-3xl font-bold text-purple-600">{dashboardData.credits.activeCredits}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Pending Requests</h3>
            <div className="space-y-3">
              {dashboardData.recentPendingRequests && dashboardData.recentPendingRequests.length > 0 ? (
                dashboardData.recentPendingRequests.map((request) => (
                  <div key={request._id} className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-medium">{request.requestData.batchId}</p>
                    <p className="text-sm text-gray-600">
                      {request.requestData.hydrogenProduced} kg • {request.producer.organization}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No pending requests</p>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Approved Credits</h3>
            <div className="space-y-3">
              {dashboardData.recentApprovedCredits && dashboardData.recentApprovedCredits.length > 0 ? (
                dashboardData.recentApprovedCredits.map((credit) => (
                  <div key={credit._id} className="border-l-4 border-green-500 pl-4">
                    <p className="font-medium">Credit #{credit.creditId}</p>
                    <p className="text-sm text-gray-600">
                      {credit.hydrogenAmount} kg • {credit.producer.organization}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No approved credits</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPendingRequests = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Requests</h2>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {pendingRequests && pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <li key={request._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.requestData.batchId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.requestData.hydrogenProduced} kg • {request.requestData.energySource}
                      </p>
                      <p className="text-sm text-gray-500">
                        Producer: {request.producer.organization} • Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Location: {request.requestData.plantLocation.name}, {request.requestData.plantLocation.city}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveRequest(request.requestId)}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.requestId)}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Reject'}
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-4 text-center text-gray-500">
                No pending requests found
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const renderCredits = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Issued Credits</h2>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {credits && credits.length > 0 ? (
              credits.map((credit) => (
                <li key={credit._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Credit #{credit.creditId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {credit.hydrogenAmount} kg • {credit.renewableSourceType}
                      </p>
                      <p className="text-sm text-gray-500">
                        Producer: {credit.producer.organization} • Status: {credit.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Current Owner: {credit.currentOwner.organization} • Balance: {credit.currentBalance}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-4 text-center text-gray-500">
                No credits found
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const renderRequests = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Requests</h2>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {requests && requests.length > 0 ? (
              requests.map((request) => (
                <li key={request._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.requestData.batchId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.requestData.hydrogenProduced} kg • {request.requestData.energySource}
                      </p>
                      <p className="text-sm text-gray-500">
                        Producer: {request.producer.organization} • Status: {request.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-4 text-center text-gray-500">
                No requests found
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const renderAuditTrail = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Audit Trail</h2>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {auditTrail && auditTrail.length > 0 ? (
              auditTrail.map((audit, index) => (
                <li key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {audit.action} - {audit.requestId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Producer: {audit.producer.organization} • {audit.hydrogenProduced} kg
                      </p>
                      <p className="text-sm text-gray-500">
                        Reviewed by: {audit.reviewedBy.username} • Date: {new Date(audit.reviewDate).toLocaleDateString()}
                      </p>
                      {audit.rejectionReason && (
                        <p className="text-sm text-red-600">
                          Reason: {audit.rejectionReason}
                        </p>
                      )}
                      {audit.transactionHash && (
                        <p className="text-sm text-gray-500">
                          Transaction: {audit.transactionHash}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        audit.action === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {audit.action}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-4 text-center text-gray-500">
                No audit trail found
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Certifier Portal</h1>
          <p className="mt-2 text-gray-600">Review and approve hydrogen credit requests</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard' },
              { id: 'pending', name: 'Pending Requests' },
              { id: 'credits', name: 'Issued Credits' },
              { id: 'requests', name: 'All Requests' },
              { id: 'audit', name: 'Audit Trail' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'pending' && renderPendingRequests()}
          {activeTab === 'credits' && renderCredits()}
          {activeTab === 'requests' && renderRequests()}
          {activeTab === 'audit' && renderAuditTrail()}
        </div>
      </div>
    </div>
  );
};

export default CertifierPortal;
