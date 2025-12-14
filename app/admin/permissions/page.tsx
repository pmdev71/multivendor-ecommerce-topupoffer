'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Search,
  Edit,
  Save,
  X,
  UserCheck,
  UserX,
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setTimeout(() => {
        const mockPermissions: Permission[] = [
          { id: '1', name: 'Manage Users', description: 'Create, edit, and delete users', enabled: true },
          { id: '2', name: 'Manage Sellers', description: 'Approve and manage sellers', enabled: true },
          { id: '3', name: 'Manage Products', description: 'Approve and manage products', enabled: true },
          { id: '4', name: 'Manage Orders', description: 'View and cancel orders', enabled: true },
          { id: '5', name: 'Manage Withdrawals', description: 'Process withdrawal requests', enabled: true },
          { id: '6', name: 'View Analytics', description: 'Access analytics dashboard', enabled: true },
          { id: '7', name: 'Generate Reports', description: 'Generate and export reports', enabled: true },
          { id: '8', name: 'Manage Settings', description: 'Modify platform settings', enabled: false },
        ];

        const mockRoles: Role[] = [
          { id: '1', name: 'Super Admin', permissions: ['1', '2', '3', '4', '5', '6', '7', '8'] },
          { id: '2', name: 'Admin', permissions: ['1', '2', '3', '4', '5', '6', '7'] },
          { id: '3', name: 'Moderator', permissions: ['2', '3', '4'] },
          { id: '4', name: 'Support', permissions: ['4', '5'] },
        ];

        setPermissions(mockPermissions);
        setRoles(mockRoles);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEditRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      setSelectedPermissions([...role.permissions]);
      setEditingRole(roleId);
    }
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(
        roles.map((r) =>
          r.id === editingRole ? { ...r, permissions: selectedPermissions } : r
        )
      );
      setEditingRole(null);
      setSelectedPermissions([]);
    }
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setSelectedPermissions([]);
  };

  const togglePermission = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const filteredPermissions = permissions.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Permissions & Roles</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user roles and permissions across the platform
          </p>
        </div>

        {/* Roles Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {role.name}
                  </h3>
                  {editingRole !== role.id && (
                    <button
                      onClick={() => handleEditRole(role.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {role.permissions.length} permissions assigned
                </p>
                {editingRole === role.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveRole}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Permissions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permissions</h2>
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="space-y-3">
              {filteredPermissions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No permissions found matching your search.
                </div>
              ) : (
                filteredPermissions.map((permission) => {
                  const isSelected = editingRole
                    ? selectedPermissions.includes(permission.id)
                    : false;
                  const isEnabled = permission.enabled;

                  return (
                    <motion.div
                      key={permission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                      editingRole
                        ? isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-800'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {editingRole ? (
                        <button
                          onClick={() => togglePermission(permission.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-700'
                          }`}
                        >
                          {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                        </button>
                      ) : (
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center ${
                            isEnabled
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          {isEnabled ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {permission.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                    {!editingRole && (
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isEnabled
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

