import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  getCrops, 
  createCrop, 
  updateCrop, 
  deleteCrop,
  getDiseases,
  createDisease,
  updateDisease,
  deleteDisease,
  getCostTemplates,
  createCostTemplate,
  updateCostTemplate,
  deleteCostTemplate,
  getUserAnalytics
} from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({
    crops: [],
    diseases: [],
    costTemplates: [],
    analytics: null
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'crops', name: 'Crops', icon: DocumentTextIcon },
    { id: 'diseases', name: 'Diseases', icon: DocumentTextIcon },
    { id: 'cost-templates', name: 'Cost Templates', icon: DocumentTextIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'dashboard':
          const analytics = await getUserAnalytics();
          setData(prev => ({ ...prev, analytics: analytics.data }));
          break;
        case 'crops':
          const crops = await getCrops();
          setData(prev => ({ ...prev, crops: crops.data }));
          break;
        case 'diseases':
          const diseases = await getDiseases();
          setData(prev => ({ ...prev, diseases: diseases.data }));
          break;
        case 'cost-templates':
          const templates = await getCostTemplates();
          setData(prev => ({ ...prev, costTemplates: templates.data }));
          break;
                  default:
          break;
      }
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (type) => {
    setModalType('create');
    setSelectedItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalType('edit');
    setSelectedItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (type) {
        case 'crop':
          await deleteCrop(id);
          setData(prev => ({
            ...prev,
            crops: prev.crops.filter(item => item._id !== id)
          }));
          break;
        case 'disease':
          await deleteDisease(id);
          setData(prev => ({
            ...prev,
            diseases: prev.diseases.filter(item => item._id !== id)
          }));
          break;
        case 'template':
          await deleteCostTemplate(id);
          setData(prev => ({
            ...prev,
            costTemplates: prev.costTemplates.filter(item => item._id !== id)
          }));
          break;
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      switch (activeTab) {
        case 'crops':
          response = modalType === 'create' 
            ? await createCrop(formData)
            : await updateCrop(selectedItem._id, formData);
          
          if (modalType === 'create') {
            setData(prev => ({ ...prev, crops: [...prev.crops, response.data] }));
          } else {
            setData(prev => ({
              ...prev,
              crops: prev.crops.map(item => 
                item._id === selectedItem._id ? response.data : item
              )
            }));
          }
          break;

        case 'diseases':
          response = modalType === 'create' 
            ? await createDisease(formData)
            : await updateDisease(selectedItem._id, formData);
          
          if (modalType === 'create') {
            setData(prev => ({ ...prev, diseases: [...prev.diseases, response.data] }));
          } else {
            setData(prev => ({
              ...prev,
              diseases: prev.diseases.map(item => 
                item._id === selectedItem._id ? response.data : item
              )
            }));
          }
          break;

        case 'cost-templates':
          response = modalType === 'create' 
            ? await createCostTemplate(formData)
            : await updateCostTemplate(selectedItem._id, formData);
          
          if (modalType === 'create') {
            setData(prev => ({ ...prev, costTemplates: [...prev.costTemplates, response.data] }));
          } else {
            setData(prev => ({
              ...prev,
              costTemplates: prev.costTemplates.map(item => 
                item._id === selectedItem._id ? response.data : item
              )
            }));
          }
          break;
      }

      setShowModal(false);
      setFormData({});
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = () => {
    const currentData = data[activeTab] || [];
    if (!searchQuery) return currentData;
    
    return currentData.filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const renderDashboard = () => {
    if (!data.analytics) return <div>Loading analytics...</div>;

    const { userStats, activityStats, popularCrops } = data.analytics;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{userStats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{userStats.activeUsers}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{activityStats.totalQueries}</div>
                <div className="text-sm text-gray-600">Total Queries</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <CogIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{activityStats.diseaseDetections}</div>
                <div className="text-sm text-gray-600">Disease Detections</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityStats.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Crops</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={popularCrops}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {popularCrops.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderDataTable = (type) => {
    const currentData = filteredData();
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">{type} Management</h2>
            <button
              onClick={() => handleCreate(type)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {item.scientificName && (
                      <div className="text-sm text-gray-500 italic">{item.scientificName}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {item.category || item.type || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, type)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    const getFields = () => {
      switch (activeTab) {
        case 'crops':
          return [
            { name: 'name', label: 'Crop Name', type: 'text', required: true },
            { name: 'scientificName', label: 'Scientific Name', type: 'text' },
            { name: 'category', label: 'Category', type: 'select', options: ['Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Cash Crops'] },
            { name: 'season', label: 'Growing Season', type: 'select', options: ['Kharif', 'Rabi', 'Zaid', 'Year Round'] },
            { name: 'duration', label: 'Duration (days)', type: 'number' },
            { name: 'soilType', label: 'Soil Type', type: 'text' },
            { name: 'temperature', label: 'Temperature Range', type: 'text' },
            { name: 'rainfall', label: 'Rainfall Requirement', type: 'text' }
          ];
        case 'diseases':
          return [
            { name: 'name', label: 'Disease Name', type: 'text', required: true },
            { name: 'crop', label: 'Affected Crop', type: 'text', required: true },
            { name: 'symptoms', label: 'Symptoms', type: 'textarea' },
            { name: 'treatment', label: 'Treatment', type: 'textarea' },
            { name: 'severity', label: 'Severity', type: 'select', options: ['Low', 'Medium', 'High'] }
          ];
        case 'cost-templates':
          return [
            { name: 'crop', label: 'Crop', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text', required: true },
            { name: 'totalCost', label: 'Total Cost (₹)', type: 'number', required: true },
            { name: 'expectedYield', label: 'Expected Yield (quintals)', type: 'number' },
            { name: 'profitMargin', label: 'Profit Margin (%)', type: 'number' }
          ];
        default:
          return [];
      }
    };

    return (
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {modalType === 'create' ? 'Add New' : 'Edit'} {activeTab.slice(0, -1)}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {getFields().map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label} {field.required && '*'}
                      </label>
                      
                      {field.type === 'select' ? (
                        <select
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                          required={field.required}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                          required={field.required}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                          required={field.required}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : modalType === 'create' ? 'Create' : 'Update'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Panel 👨‍💼
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage crops, diseases, cost templates, and monitor platform analytics
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {activeTab === 'dashboard' && renderDashboard()}
          {['crops', 'diseases', 'cost-templates'].includes(activeTab) && renderDataTable(activeTab)}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <UsersIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">User management features coming soon...</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <CogIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h3>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </motion.div>

        {renderModal()}
      </div>
    </div>
  );
};

export default AdminPanel;

