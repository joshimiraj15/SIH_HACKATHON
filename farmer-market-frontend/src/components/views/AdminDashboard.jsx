// src/components/views/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Store, 
  Search,
  Lock,
  Unlock
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/AdminDashboard.css';

const AdminDashboard = ({ showToast }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        api.admin.getStats().catch(() => ({ data: null })),
        api.admin.getUsers({ role: userRoleFilter, search: searchQuery }).catch(() => ({ data: [] })),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (usersRes?.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin portal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userRoleFilter]);

  const handleToggleVerification = async (userId) => {
    try {
      const res = await api.admin.toggleVerification(userId);
      if (res.success) {
        if (showToast) showToast(res.message);
        fetchAdminData();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Verification update failed');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      const res = await api.admin.toggleActive(userId);
      if (res.success) {
        if (showToast) showToast(res.message);
        fetchAdminData();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Status update failed');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="view-header-strip">
        <div>
          <h2>Platform Administration & Governance Center</h2>
          <p>Oversee users, verify farmer/buyer KYC, monitor transactions, and ensure platform health</p>
        </div>
        <button className="btn-refresh" onClick={fetchAdminData}>
          <RefreshCw size={15} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap bg-emerald">
            <DollarSign size={22} />
          </div>
          <div className="kpi-info">
            <span className="label">Total Trade Volume</span>
            <strong className="num">₹ {stats?.totalTradeVolume ? stats.totalTradeVolume.toLocaleString('en-IN') : '3,18,000'}</strong>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap bg-blue">
            <Users size={22} />
          </div>
          <div className="kpi-info">
            <span className="label">Registered Farmers</span>
            <strong className="num">{stats?.totalFarmers || 1} Verified</strong>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap bg-purple">
            <ShoppingBag size={22} />
          </div>
          <div className="kpi-info">
            <span className="label">Procurement Buyers</span>
            <strong className="num">{stats?.totalBuyers || 2} Corporate</strong>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap bg-orange">
            <Store size={22} />
          </div>
          <div className="kpi-info">
            <span className="label">Mandis Integrated</span>
            <strong className="num">{stats?.totalMandis || 18} Mandis</strong>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="admin-section-card">
        <div className="section-header-bar">
          <h3>User Management & KYC Verification</h3>
          <div className="filter-controls">
            <div className="filter-role-pills">
              {['All', 'farmer', 'buyer', 'admin'].map((r) => (
                <button
                  key={r}
                  className={`role-pill ${userRoleFilter === r ? 'active' : ''}`}
                  onClick={() => setUserRoleFilter(r)}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User / Organization</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Location</th>
                <th>KYC Badge</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-name-cell">
                      <strong>{u.name}</strong>
                      <span className="biz-sub">{u.businessName || u.role}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span>{u.email}</span>
                      <small>{u.phone || '+91 98765 00000'}</small>
                    </div>
                  </td>
                  <td>
                    {u.location?.district ? `${u.location.district}, ${u.location.state}` : 'Gujarat'}
                  </td>
                  <td>
                    <span className={`kyc-badge ${u.isVerified ? 'kyc-verified' : 'kyc-pending'}`}>
                      {u.isVerified ? <CheckCircle size={13} /> : <XCircle size={13} />}
                      {u.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-tag ${u.isActive !== false ? 'status-green' : 'status-red'}`}>
                      {u.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <button 
                        className={`btn-verify-toggle ${u.isVerified ? 'btn-unverify' : 'btn-verify'}`}
                        onClick={() => handleToggleVerification(u._id)}
                      >
                        {u.isVerified ? 'Revoke KYC' : 'Verify KYC'}
                      </button>
                      <button 
                        className="btn-suspend-toggle"
                        onClick={() => handleToggleActive(u._id)}
                        title={u.isActive !== false ? 'Suspend user' : 'Activate user'}
                      >
                        {u.isActive !== false ? <Lock size={15} /> : <Unlock size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
