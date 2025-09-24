"use client"

import { useState, useEffect } from "react"
import { FaUser, FaEdit, FaTrash, FaPlus, FaSearch, FaUserShield, FaPhone, FaMapMarkerAlt } from "react-icons/fa"
import defaultInstance from "../../../plugins/axios"

const UsersManager = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("view") // 'view', 'edit', 'create'

  // Fetch users and roles on component mount
  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await defaultInstance.get("/admin/users")
      setUsers(response.data.users)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await defaultInstance.get("/admin/roles")
      setRoles(response.data.roles)
    } catch (error) {
      console.error("Error fetching roles:", error)
    }
  }

  const handleCreateUser = () => {
    setSelectedUser({
      name: "",
      email: "",
      password: "",
      roles: [],
      userInformation: {
        address: "",
        phone: "",
      },
    })
    setModalType("create")
    setShowModal(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setModalType("edit")
    setShowModal(true)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setModalType("view")
    setShowModal(true)
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await defaultInstance.delete(`/admin/users/${userId}`)
        fetchUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Error deleting user")
      }
    }
  }

  const handleSaveUser = async (userData) => {
    try {
      if (modalType === "create") {
        await defaultInstance.post("/admin/users", userData)
      } else {
        await defaultInstance.put(`/admin/users/${selectedUser.id}`, userData)
      }
      fetchUsers()
      setShowModal(false)
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Error saving user")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleNames = (userRoles) => {
    if (!userRoles || userRoles.length === 0) return "No roles"
    return userRoles.map((ur) => ur.role?.name || "Unknown").join(", ")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaUser className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        </div>
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.user_information?.phone && (
                        <div className="flex items-center gap-1 mb-1">
                          <FaPhone className="text-xs text-gray-400" />
                          <span>{user.user_information.phone}</span>
                        </div>
                      )}
                      {user.user_information?.address && (
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs text-gray-400" />
                          <span className="text-xs">{user.user_information.address}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0
                        ? user.roles.map((userRole) => {
                            // Find the role name from the roles array using role_id
                            const roleObj = roles.find((r) => r.id === (userRole.role_id || userRole.id))
                            return (
                              <span
                                key={userRole.role_id || userRole.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                <FaUserShield className="mr-1" />
                                {roleObj ? roleObj.name : "Unknown"}
                              </span>
                            )
                          })
                        : <span className="text-gray-400 text-sm">No roles</span>
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View User"
                      >
                        <FaUser />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit User"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showModal && (
        <UserModal
          user={selectedUser}
          roles={roles}
          type={modalType}
          onSave={handleSaveUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

// User Modal Component
const UserModal = ({ user, roles, type, onSave, onClose }) => {
  // Extract role IDs from user.roles for selection
  const initialSelectedRoles = user?.roles?.map((role) => role.id) || []

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    selectedRoles: initialSelectedRoles,
    address: user?.user_information?.address || "",
    phone: user?.user_information?.phone || "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRoleToggle = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter((id) => id !== roleId)
        : [...prev.selectedRoles, roleId],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userData = {
      name: formData.name,
      email: formData.email,
      roles: formData.selectedRoles, // send array of role IDs
      user_information: {
        address: formData.address,
        phone: formData.phone,
      },
    }

    if (type === "create" || formData.password) {
      userData.password = formData.password
    }

    onSave(userData)
  }

  const isReadOnly = type === "view"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {type === "create" ? "Create User" : type === "edit" ? "Edit User" : "User Details"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  required
                />
              </div>
            </div>
            {!isReadOnly && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {type === "edit" && "(leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  required={type === "create"}
                />
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Roles</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    disabled={isReadOnly}
                    className="rounded"
                  />
                  <span className="text-sm">{role.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {isReadOnly ? "Close" : "Cancel"}
            </button>
            {!isReadOnly && (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {type === "create" ? "Create User" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default UsersManager
