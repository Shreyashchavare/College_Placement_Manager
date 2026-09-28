import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Building2, Plus, Edit2, Trash2, Globe, Mail, Phone, MapPin, X } from 'lucide-react';

export function CompaniesView() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await api.getCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenAdd = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      industry: '',
      website: '',
      contactEmail: '',
      contactPhone: '',
      location: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (comp) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      industry: comp.industry || '',
      website: comp.website || '',
      contactEmail: comp.contactEmail || '',
      contactPhone: comp.contactPhone || '',
      location: comp.location || '',
      description: comp.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingCompany) {
        await api.updateCompany(editingCompany.id, formData);
      } else {
        await api.createCompany(formData);
      }
      setShowModal(false);
      fetchCompanies();
    } catch (err) {
      setError(err.message || 'Failed to save company record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      await api.deleteCompany(id);
      fetchCompanies();
    } catch (err) {
      alert(err.message || 'Failed to delete company');
    }
  };

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Partner Companies</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage recruiting corporate partners and organizational profiles.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Company</span>
        </button>
      </div>

      {error && (
        <div className="card mb-4" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>Loading partner companies...</div>
        ) : companies.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No companies registered yet.</div>
        ) : (
          companies?.filter(Boolean).map((c) => (
            <div key={c?.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="flex-between mb-2">
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={22} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button onClick={() => handleOpenEdit(c)} className="btn btn-outline btn-sm" title="Edit Company">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(c?.id)} className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} title="Delete Company">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{c?.name}</h3>
                <span className="badge badge-draft" style={{ marginBottom: '0.75rem' }}>{c?.industry || 'Tech'}</span>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '40px' }}>
                  {c?.description || 'No company description provided.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                  {c.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} className="text-muted" /> {c.location}
                    </div>
                  )}
                  {c.contactEmail && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} className="text-muted" /> {c.contactEmail}
                    </div>
                  )}
                  {c.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={14} className="text-muted" /> 
                      <a href={c.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                        {c.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between mb-4">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {editingCompany ? 'Edit Company Profile' : 'Add Corporate Partner'}
              </h3>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Thinqloud Solutions"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Industry Domain</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Cloud Computing / AI"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Headquarters / Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Pune, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="careers@thinqloud.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://thinqloud.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Brief summary of company focus and products..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : editingCompany ? 'Update Company' : 'Register Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
