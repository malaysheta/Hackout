import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProducerPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [credits, setCredits] = useState([]);
  const [requests, setRequests] = useState([]);
  const [certifiers, setCertifiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [requestForm, setRequestForm] = useState({
    batchId: '',
    hydrogenProduced: '',
    energySource: 'Solar',
    startDate: '',
    endDate: '',
    plantLocation: {
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      country: '',
      state: '',
      city: ''
    },
    certifierId: '',
    energySourceDetails: {
      capacity: '',
      efficiency: '',
      renewablePercentage: ''
    },
    notes: ''
  });

  const [transferForm, setTransferForm] = useState({
    creditId: '',
    recipientWallet: '',
    amount: ''
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadCertifiers();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/producer/dashboard', {
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



  const loadCredits = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/producer/credits', {
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
      const response = await axios.get('/api/producer/requests', {
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

  const loadCertifiers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/producer/certifiers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCertifiers(response.data);
      console.log('Certifiers loaded:', response.data);
    } catch (error) {
      setError('Failed to load certifiers');
      console.error('Load certifiers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    
    if (tab === 'credits') {
      loadCredits();
    } else if (tab === 'requests') {
      loadRequests();
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!requestForm.batchId || !requestForm.hydrogenProduced || !requestForm.energySource || 
        !requestForm.startDate || !requestForm.endDate || !requestForm.certifierId) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      
      console.log('Submitting form data:', requestForm);
      
      const formData = new FormData();
      formData.append('batchId', requestForm.batchId);
      formData.append('hydrogenProduced', requestForm.hydrogenProduced);
      formData.append('energySource', requestForm.energySource);
      formData.append('startDate', requestForm.startDate);
      formData.append('endDate', requestForm.endDate);
      formData.append('plantLocation', JSON.stringify(requestForm.plantLocation));
      formData.append('certifierId', requestForm.certifierId);
      formData.append('energySourceDetails', JSON.stringify(requestForm.energySourceDetails));
      formData.append('notes', requestForm.notes);

      // Add file uploads here when implementing file upload UI
      
      const response = await axios.post('/api/producer/requestCredit', formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Credit request submitted successfully!');
                setRequestForm({
          batchId: '',
          hydrogenProduced: '',
          energySource: 'Solar',
          startDate: '',
          endDate: '',
          plantLocation: { name: '', address: '', latitude: '', longitude: '', country: '', state: '', city: '' },
          certifierId: '',
          energySourceDetails: { capacity: '', efficiency: '', renewablePercentage: '' },
          notes: ''
        });
        loadDashboardData();
      } else {
        setError('Failed to submit request');
      }
    } catch (error) {
      console.error('Submit request error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to submit request';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const response = await axios.post('/api/producer/transferCredits', transferForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Credits transferred successfully!');
      setTransferForm({ creditId: '', recipientWallet: '', amount: '' });
      loadCredits();
    } catch (error) {
      setError('Failed to transfer credits');
      console.error('Transfer error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Producer Dashboard</h2>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Credits</h3>
            <p className="text-3xl font-bold text-green-600">{dashboardData.credits.totalCredits}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Active Credits</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboardData.credits.activeCredits}</p>
      </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-600">{dashboardData.requests.pending}</p>
            </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Hydrogen (kg)</h3>
            <p className="text-3xl font-bold text-purple-600">{dashboardData.credits.totalHydrogen}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Requests</h3>
            <div className="space-y-3">
              {dashboardData.recentRequests && dashboardData.recentRequests.length > 0 ? (
                dashboardData.recentRequests.map((request) => (
                  <div key={request._id} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium">{request.requestData.batchId}</p>
                    <p className="text-sm text-gray-600">
                      {request.requestData.hydrogenProduced} kg • {request.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent requests</p>
              )}
            </div>
        </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Credits</h3>
            <div className="space-y-3">
              {dashboardData.recentCredits && dashboardData.recentCredits.length > 0 ? (
                dashboardData.recentCredits.map((credit) => (
                  <div key={credit._id} className="border-l-4 border-green-500 pl-4">
                    <p className="font-medium">Credit #{credit.creditId}</p>
                    <p className="text-sm text-gray-600">
                      {credit.hydrogenAmount} kg • {credit.renewableSourceType}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent credits</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRequestForm = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Credit Issuance</h2>
        
        <form onSubmit={handleRequestSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch ID</label>
              <input
                type="text"
                value={requestForm.batchId}
                onChange={(e) => setRequestForm({...requestForm, batchId: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Hydrogen Produced (kg)</label>
              <input
                type="number"
                value={requestForm.hydrogenProduced}
                onChange={(e) => setRequestForm({...requestForm, hydrogenProduced: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Energy Source</label>
              <select
                value={requestForm.energySource}
                onChange={(e) => setRequestForm({...requestForm, energySource: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="Solar">Solar</option>
                <option value="Wind">Wind</option>
                <option value="Hydro">Hydro</option>
                <option value="Geothermal">Geothermal</option>
                <option value="Biomass">Biomass</option>
                <option value="Nuclear">Nuclear</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Certifier</label>
              <select
                value={requestForm.certifierId}
                onChange={(e) => setRequestForm({...requestForm, certifierId: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select a certifier</option>
                {certifiers && certifiers.length > 0 ? (
                  certifiers.map((certifier) => (
                    <option key={certifier._id} value={certifier._id}>
                      {certifier.organization}
                    </option>
                  ))
                ) : (
                  <option value="">No certifiers available</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={requestForm.startDate}
                onChange={(e) => setRequestForm({...requestForm, startDate: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={requestForm.endDate}
                onChange={(e) => setRequestForm({...requestForm, endDate: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Plant Location</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <input
                type="text"
                placeholder="Plant Name"
                value={requestForm.plantLocation.name}
                onChange={(e) => setRequestForm({
                  ...requestForm, 
                  plantLocation: {...requestForm.plantLocation, name: e.target.value}
                })}
                className="border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={requestForm.plantLocation.address}
                onChange={(e) => setRequestForm({
                  ...requestForm, 
                  plantLocation: {...requestForm.plantLocation, address: e.target.value}
                })}
                className="border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={requestForm.notes}
              onChange={(e) => setRequestForm({...requestForm, notes: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              rows="3"
            />
      </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    );
  };

  const renderCredits = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Credits</h2>
        
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
                        Status: {credit.status} • Balance: {credit.currentBalance}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        View
                      </button>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                        Transfer
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

  const renderTransfer = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfer Credits</h2>
        
        <form onSubmit={handleTransferSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Credit ID</label>
            <input
              type="text"
              value={transferForm.creditId}
              onChange={(e) => setTransferForm({...transferForm, creditId: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient Wallet Address</label>
            <input
              type="text"
              value={transferForm.recipientWallet}
              onChange={(e) => setTransferForm({...transferForm, recipientWallet: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="0x..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={transferForm.amount}
              onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Transferring...' : 'Transfer Credits'}
          </button>
        </form>
      </div>
    );
  };

  const renderRequests = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h2>
        
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
                        Status: {request.status} • Submitted: {new Date(request.createdAt).toLocaleDateString()}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Producer Portal</h1>
          <p className="mt-2 text-gray-600">Manage your hydrogen production and credit requests</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard' },
              { id: 'request', name: 'Request Issuance' },
              { id: 'credits', name: 'My Credits' },
              { id: 'requests', name: 'My Requests' },
              { id: 'transfer', name: 'Transfer' },
              { id: 'history', name: 'History' },
              { id: 'profile', name: 'Profile' }
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
          {activeTab === 'request' && renderRequestForm()}
          {activeTab === 'credits' && renderCredits()}
          {activeTab === 'requests' && renderRequests()}
          {activeTab === 'transfer' && renderTransfer()}
          {activeTab === 'history' && <div>History component will be implemented</div>}
          {activeTab === 'profile' && <div>Profile component will be implemented</div>}
        </div>
      </div>
    </div>
  );
};

export default ProducerPortal;
