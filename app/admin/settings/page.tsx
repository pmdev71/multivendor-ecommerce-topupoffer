'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  DollarSign,
  Percent,
  Mail,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Database,
} from 'lucide-react';

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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Commission Settings
    globalCommission: 5,
    productCommission: {},
    
    // Payment Settings
    walletEnabled: true,
    sslcommerzEnabled: true,
    bkashEnabled: true,
    
    // Email Settings
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUser: 'noreply@example.com',
    smtpPassword: '',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    
    // Platform Settings
    platformName: 'Multi-Vendor Marketplace',
    platformEmail: 'admin@example.com',
    platformPhone: '+8801712345678',
    
    // Security Settings
    jwtSecret: '••••••••••••••••',
    sessionTimeout: 30,
    twoFactorAuth: false,
  });

  const [activeTab, setActiveTab] = useState<'commission' | 'payment' | 'email' | 'notification' | 'platform' | 'security'>('commission');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'commission', label: 'Commission', icon: Percent },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notification', label: 'Notifications', icon: Bell },
    { id: 'platform', label: 'Platform', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Configure platform-wide settings and preferences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            variants={itemVariants}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-2 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            variants={itemVariants}
            className="flex-1"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              {/* Commission Settings */}
              {activeTab === 'commission' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Commission Settings
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Global Commission Rate (%)
                        </label>
                        <input
                          type="number"
                          value={settings.globalCommission}
                          onChange={(e) =>
                            setSettings({ ...settings, globalCommission: parseFloat(e.target.value) })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Default commission rate applied to all products
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Payment Methods
                    </h2>
                    <div className="space-y-4">
                      {[
                        { key: 'walletEnabled', label: 'Wallet Payment' },
                        { key: 'sslcommerzEnabled', label: 'SSLCommerz' },
                        { key: 'bkashEnabled', label: 'bKash' },
                      ].map((method) => (
                        <div
                          key={method.key}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {method.label}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[method.key as keyof typeof settings] as boolean}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  [method.key]: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      SMTP Configuration
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={settings.smtpHost}
                          onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          value={settings.smtpPort}
                          onChange={(e) =>
                            setSettings({ ...settings, smtpPort: parseInt(e.target.value) })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP User
                        </label>
                        <input
                          type="email"
                          value={settings.smtpUser}
                          onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SMTP Password
                        </label>
                        <input
                          type="password"
                          value={settings.smtpPassword}
                          onChange={(e) =>
                            setSettings({ ...settings, smtpPassword: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notification' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Notification Preferences
                    </h2>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications' },
                        { key: 'pushNotifications', label: 'Push Notifications' },
                      ].map((notif) => (
                        <div
                          key={notif.key}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {notif.label}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[notif.key as keyof typeof settings] as boolean}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  [notif.key]: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Platform Settings */}
              {activeTab === 'platform' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Platform Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          value={settings.platformName}
                          onChange={(e) =>
                            setSettings({ ...settings, platformName: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Platform Email
                        </label>
                        <input
                          type="email"
                          value={settings.platformEmail}
                          onChange={(e) =>
                            setSettings({ ...settings, platformEmail: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Platform Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.platformPhone}
                          onChange={(e) =>
                            setSettings({ ...settings, platformPhone: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Security Configuration
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          JWT Secret Key
                        </label>
                        <input
                          type="password"
                          value={settings.jwtSecret}
                          onChange={(e) => setSettings({ ...settings, jwtSecret: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) =>
                            setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          min="5"
                          max="1440"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Two-Factor Authentication
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={(e) =>
                              setSettings({ ...settings, twoFactorAuth: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

