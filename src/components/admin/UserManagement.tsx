import React, { useState } from 'react';
import { UserCheck, Shield, Plus, Lock, KeyRound, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role, User } from '../../types';
import { DeleteVerificationModal } from './DeleteVerificationModal';

export const UserManagement: React.FC = () => {
  const { users, currentUser, updateUserRole, toggleUserActive, addUser, resetUserPassword, updateUser, deleteUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<User | null>(null);
  const [editTargetUser, setEditTargetUser] = useState<User | null>(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState<User | null>(null);

  // Add User State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<Role>('Sales');

  // Edit User State
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editRole, setEditRole] = useState<Role>('Sales');
  const [editActive, setEditActive] = useState(true);
  const [editSuccess, setEditSuccess] = useState('');

  // Password Reset State
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const isSuperAdmin = currentUser.role === 'Super Admin';

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password) return;

    addUser({
      name,
      username: username.trim().toLowerCase(),
      password,
      email: email || `${username}@watchstorenepal.com`,
      mobile,
      role,
      active: true
    });

    setShowAddModal(false);
    setName('');
    setUsername('');
    setPassword('');
    setEmail('');
    setMobile('');
  };

  const handleOpenEdit = (u: User) => {
    setEditTargetUser(u);
    setEditName(u.name);
    setEditUsername(u.username);
    setEditPassword('');
    setEditEmail(u.email);
    setEditMobile(u.mobile);
    setEditRole(u.role);
    setEditActive(u.active);
    setEditSuccess('');
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTargetUser || !editName || !editUsername) return;

    const updatedUser: User = {
      ...editTargetUser,
      name: editName.trim(),
      username: editUsername.trim().toLowerCase(),
      password: editPassword ? editPassword : (editTargetUser.password || 'admin123'),
      email: editEmail.trim(),
      mobile: editMobile.trim(),
      role: editRole,
      active: editActive
    };

    updateUser(updatedUser);
    setEditSuccess(`Staff details for ${updatedUser.name} (@${updatedUser.username}) saved successfully.`);
    setTimeout(() => {
      setEditSuccess('');
      setEditTargetUser(null);
    }, 1200);
  };

  const handleDeleteUserClick = (u: User) => {
    setDeleteTargetUser(u);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetUser) return;
    deleteUser(deleteTargetUser.id);
    if (editTargetUser?.id === deleteTargetUser.id) {
      setEditTargetUser(null);
    }
    setDeleteTargetUser(null);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser || !newPassword) return;

    resetUserPassword(resetTargetUser.id, newPassword);
    setResetSuccess(`Password for ${resetTargetUser.name} (${resetTargetUser.username}) successfully updated.`);
    setTimeout(() => {
      setResetSuccess('');
      setResetTargetUser(null);
      setNewPassword('');
    }, 1500);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <span>Staff Roles & User Management (RBAC)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Super Admin can create staff accounts, edit all user details (Name, Username, Email, Mobile, Password, Role), and manage access.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff User</span>
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="bg-amber-950/60 border border-amber-500/40 p-4 rounded-xl text-xs text-amber-200 flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-400 shrink-0" />
          <span>You are logged in as <strong>{currentUser.role}</strong>. Only <strong>Super Admin</strong> can create, edit, or manage user details.</span>
        </div>
      )}

      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">Staff Name</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email & Mobile</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Status</th>
                {isSuperAdmin && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-zinc-800/40">
                  <td className="p-3 font-sans font-bold text-zinc-100">{u.name}</td>
                  <td className="p-3 font-mono text-amber-300 font-bold">@{u.username}</td>
                  <td className="p-3">
                    <div>{u.email}</div>
                    <div className="text-zinc-400">{u.mobile}</div>
                  </td>
                  <td className="p-3">
                    {isSuperAdmin ? (
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as Role)}
                        className="bg-zinc-950 border border-amber-500/40 text-amber-300 rounded px-2 py-1 text-xs font-bold cursor-pointer"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                        <option value="Inventory">Inventory</option>
                        <option value="Account">Account</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    ) : (
                      <span className="font-bold text-amber-300">{u.role}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {u.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  {isSuperAdmin && (
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-1 font-sans font-bold"
                        title="Edit All User Details"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        onClick={() => {
                          setResetTargetUser(u);
                          setNewPassword('');
                        }}
                        className="px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 text-amber-200 hover:bg-zinc-800 transition-all cursor-pointer inline-flex items-center gap-1 font-sans"
                        title="Reset User Password"
                      >
                        <KeyRound className="w-3 h-3 text-amber-400" />
                        <span>Reset Pass</span>
                      </button>

                      <button
                        onClick={() => toggleUserActive(u.id)}
                        className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer font-sans"
                      >
                        {u.active ? 'Disable' : 'Enable'}
                      </button>

                      {users.length > 1 && (
                        <button
                          onClick={() => handleDeleteUserClick(u)}
                          className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer inline-flex items-center gap-1 font-sans"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT USER DETAILS MODAL (SUPER ADMIN) */}
      {editTargetUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-lg w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Edit User Details: {editTargetUser.name}</span>
              </h3>
              <button
                onClick={() => setEditTargetUser(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {editSuccess ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{editSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSaveUserEdit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1 font-mono">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-sans"
                      placeholder="e.g., Staff Name"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-mono">Username * (Used for Login)</label>
                    <input
                      type="text"
                      required
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-amber-300 font-mono"
                      placeholder="e.g., username"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1 font-mono">Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                      placeholder="email@watchstorenepal.com"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-mono">Mobile Number</label>
                    <input
                      type="text"
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">
                    Password (Leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password to update..."
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1 font-mono">Assigned Role</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as Role)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono cursor-pointer"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Sales">Sales</option>
                      <option value="Inventory">Inventory</option>
                      <option value="Account">Account</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-mono">Account Status</label>
                    <select
                      value={editActive ? 'active' : 'disabled'}
                      onChange={(e) => setEditActive(e.target.value === 'active')}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  {users.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteUserClick(editTargetUser)}
                      className="px-3 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-all text-xs font-mono cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete User</span>
                    </button>
                  ) : <div />}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditTargetUser(null)}
                      className="px-4 py-2 bg-zinc-900 rounded-lg text-zinc-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 font-bold text-zinc-950 rounded-lg uppercase cursor-pointer hover:bg-amber-400 transition-colors"
                    >
                      Save All Changes
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADD STAFF USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Create Staff User (Username & Password)</span>
            </h3>
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Staff Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-sans"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Username * (Used for login)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-amber-300 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Set initial password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Email Address</label>
                <input
                  type="email"
                  placeholder="staff@watchstorenepal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Mobile Number</label>
                <input
                  type="text"
                  placeholder="98XXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono cursor-pointer"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Account">Account</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-900 rounded-lg text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 font-bold text-zinc-950 rounded-lg uppercase cursor-pointer hover:bg-amber-400 transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>Reset Password for {resetTargetUser.name}</span>
            </h3>

            <p className="text-xs text-zinc-400">
              Username: <strong className="text-amber-300 font-mono">@{resetTargetUser.username}</strong> ({resetTargetUser.role})
            </p>

            {resetSuccess ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{resetSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono font-bold">Enter New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setResetTargetUser(null)}
                    className="px-4 py-2 bg-zinc-900 rounded-lg text-zinc-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 font-bold text-zinc-950 rounded-lg uppercase cursor-pointer hover:bg-amber-400 transition-colors"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* 2-STEP DELETE VERIFICATION MODAL (SUPER ADMIN ONLY) */}
      <DeleteVerificationModal
        isOpen={!!deleteTargetUser}
        title="Delete Staff Account"
        itemName={deleteTargetUser ? `${deleteTargetUser.name} (@${deleteTargetUser.username})` : ''}
        detailsText="This action will revoke login access immediately. Audit history will be retained."
        onClose={() => setDeleteTargetUser(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
