import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import withAuth from '@/components/withAuth'
import toast from 'react-hot-toast'

function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Lead status updated successfully')
        fetchLeads() // Refresh the leads list
      } else {
        toast.error('Failed to update lead status')
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
      toast.error('Failed to update lead status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800'
      case 'CONTACTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'QUALIFIED':
        return 'bg-purple-100 text-purple-800'
      case 'CONVERTED':
        return 'bg-green-100 text-green-800'
      case 'LOST':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredLeads = selectedStatus === 'ALL' 
    ? leads 
    : leads.filter(lead => lead.status === selectedStatus)

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
            <p className="text-gray-600">Track and manage customer leads</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Leads</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="CONVERTED">Converted</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.name}
                        </div>
                        {lead.message && (
                          <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                            {lead.message}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="text-sm text-gray-500">
                            {lead.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.source || 'Contact Form'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString('en-BD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="CONVERTED">Converted</option>
                          <option value="LOST">Lost</option>
                        </select>
                        <button
                          onClick={() => {
                            // View lead details - you can implement a modal
                            console.log('View lead details:', lead.id)
                          }}
                          className="text-blue-600 hover:text-blue-900 text-xs"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Leads</h3>
            <p className="text-3xl font-bold text-blue-600">{leads.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">New</h3>
            <p className="text-3xl font-bold text-blue-600">
              {leads.filter(lead => lead.status === 'NEW').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contacted</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {leads.filter(lead => lead.status === 'CONTACTED').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Converted</h3>
            <p className="text-3xl font-bold text-green-600">
              {leads.filter(lead => lead.status === 'CONVERTED').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lost</h3>
            <p className="text-3xl font-bold text-red-600">
              {leads.filter(lead => lead.status === 'LOST').length}
            </p>
          </div>
        </div>

        {/* Lead Conversion Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Conversion Rate</h3>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${leads.length > 0 ? (leads.filter(lead => lead.status === 'CONVERTED').length / leads.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="ml-4 text-sm text-gray-600">
              {leads.length > 0 ? Math.round((leads.filter(lead => lead.status === 'CONVERTED').length / leads.length) * 100) : 0}%
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {leads.filter(lead => lead.status === 'CONVERTED').length} out of {leads.length} leads converted
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}

export default withAuth(AdminLeads) 