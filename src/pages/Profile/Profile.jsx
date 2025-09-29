import React, { useState, useEffect, useRef } from 'react'
import defaultInstance from '../../plugins/axios'
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiEdit, FiCheck, FiX, FiCamera, FiLink, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useAuthUser } from '../../redux/useAuthUser'

const Profile = () => {
  const authUser = useAuthUser();
  // Initialize with empty values - don't prefill
  const [user, setUser] = useState({
    name: '',
    email: '',
    user_information: {
      address: '',
      bio: '',
      phone: '',
      profile_image: null,
      social_links: []
    }
  })
  
  // Track which fields have been changed
  const [changedFields, setChangedFields] = useState({})
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)
  
  // For adding new social link
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' })

  const validateForm = () => {
    const newErrors = {}
    
    if (changedFields.name && !user.name?.trim()) newErrors.name = 'Name is required'
    if (changedFields.email) {
      if (!user.email?.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = 'Email is invalid'
    }
    
    // Validate social links if changed
    if (changedFields.user_information?.social_links) {
      user.user_information.social_links.forEach((link, index) => {
        if (!link.platform.trim()) {
          newErrors[`social_platform_${index}`] = 'Platform name is required'
        }
        if (!link.url.trim()) {
          newErrors[`social_url_${index}`] = 'URL is required'
        } else if (!isValidUrl(link.url)) {
          newErrors[`social_url_${index}`] = 'Please enter a valid URL'
        }
      })
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }
  
  const validatePasswords = () => {
    const newErrors = {}
    
    if (!passwords.current) newErrors.currentPassword = 'Current password is required'
    if (!passwords.new) newErrors.newPassword = 'New password is required'
    else if (passwords.new.length < 8) newErrors.newPassword = 'Password must be at least 8 characters'
    
    if (!passwords.confirm) newErrors.confirmPassword = 'Please confirm your password'
    else if (passwords.new !== passwords.confirm) newErrors.confirmPassword = 'Passwords do not match'
    
    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Track that this field was changed
    setChangedFields(prev => ({
      ...prev,
      [name]: true
    }))
    
    setUser(prev => ({ 
      ...prev, 
      [name]: value 
    }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const handleInfoChange = (e) => {
    const { name, value } = e.target
    
    // Track that this field was changed in user_information
    setChangedFields(prev => ({
      ...prev,
      user_information: {
        ...prev.user_information,
        [name]: true
      }
    }))
    
    setUser(prev => ({
      ...prev,
      user_information: {
        ...prev.user_information,
        [name]: value
      }
    }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Track that image was changed
    setChangedFields(prev => ({
      ...prev,
      user_information: {
        ...prev.user_information,
        profile_image: true
      }
    }))
    
    setUser(prev => ({
      ...prev,
      user_information: {
        ...prev.user_information,
        profile_image: file
      }
    }))
    
    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }
  
  // Handle social links
  const handleSocialLinkChange = (e, index) => {
    const { name, value } = e.target
    
    // Track that social links were changed
    setChangedFields(prev => ({
      ...prev,
      user_information: {
        ...prev.user_information,
        social_links: true
      }
    }))
    
    setUser(prev => {
      const updatedLinks = [...prev.user_information.social_links]
      updatedLinks[index] = {
        ...updatedLinks[index],
        [name]: value
      }
      
      return {
        ...prev,
        user_information: {
          ...prev.user_information,
          social_links: updatedLinks
        }
      }
    })
    
    // Clear errors
    if (errors[`social_${name}_${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`social_${name}_${index}`]
        return newErrors
      })
    }
  }
  
  const handleNewSocialLinkChange = (e) => {
    const { name, value } = e.target
    setNewSocialLink(prev => ({ ...prev, [name]: value }))
  }
  
  const addSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.url) return
    
    // Track that social links were changed
    setChangedFields(prev => ({
      ...prev,
      user_information: {
        ...prev.user_information,
        social_links: true
      }
    }))
    
    setUser(prev => ({
      ...prev,
      user_information: {
        ...prev.user_information,
        social_links: [
          ...prev.user_information.social_links,
          { ...newSocialLink }
        ]
      }
    }))
    
    // Reset new social link form
    setNewSocialLink({ platform: '', url: '' })
  }
  
  const removeSocialLink = (indexToRemove) => {
    // Track that social links were changed
    setChangedFields(prev => ({
      ...prev,
      user_information: {
        ...prev.user_information,
        social_links: true
      }
    }))
    
    setUser(prev => ({
      ...prev,
      user_information: {
        ...prev.user_information,
        social_links: prev.user_information.social_links.filter((_, index) => index !== indexToRemove)
      }
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Create FormData to handle file upload
      const formData = new FormData()
      
      // Add basic user fields if they've changed
      if (changedFields.name) {
        formData.append('name', user.name || '')
      }
      
      if (changedFields.email) {
        formData.append('email', user.email || '')
      }
      
      // Handle user_information fields - be careful with nested structure
      const infoFields = ['address', 'bio', 'phone']
      infoFields.forEach(field => {
        if (changedFields.user_information && changedFields.user_information[field]) {
          // Laravel expects user_information fields as top-level in the request
          // or using dot notation: user_information[field]
          formData.append(`user_information[${field}]`, user.user_information[field] || '')
        }
      })
      
      // Handle social links specially - convert to JSON string
      if (changedFields.user_information && changedFields.user_information.social_links) {
        // Laravel needs this as a JSON string
        const socialLinksJson = JSON.stringify(user.user_information.social_links || [])
        formData.append('user_information[social_links]', socialLinksJson)
      }
      
      // Handle profile image separately - already set up correctly
      if (changedFields.user_information && changedFields.user_information.profile_image) {
        const profileImage = user.user_information.profile_image
        if (profileImage instanceof File) {
          formData.append('profile_image', profileImage)
        }
      }
      
      console.log('Sending form data to backend')
      
      // For debugging - log keys being sent
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }
      
      // Send the request
      defaultInstance.post('/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .then(response => {
          console.log('Profile updated successfully', response.data)
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
          
          // Reset changed fields tracking
          setChangedFields({})
        })
        .catch(error => {
          console.error('Error updating profile:', error)
          if (error.response && error.response.data && error.response.data.errors) {
            // Set validation errors from the backend
            setErrors(error.response.data.errors)
          }
        })
      
      setEditMode(false)
    }
  }
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (validatePasswords()) {
      // Send password update request
      defaultInstance.post('/update-password', {
        current_password: passwords.current,
        password: passwords.new,
        password_confirmation: passwords.confirm
      })
        .then(response => {
          console.log('Password updated successfully')
          setPasswords({ current: '', new: '', confirm: '' })
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
        })
        .catch(error => {
          console.error('Error updating password:', error)
          if (error.response && error.response.data && error.response.data.errors) {
            const backendErrors = error.response.data.errors;
            const formattedErrors = {};
            
            // Map backend error fields to our form fields
            if (backendErrors.current_password) {
              formattedErrors.currentPassword = backendErrors.current_password[0];
            }
            if (backendErrors.password) {
              formattedErrors.newPassword = backendErrors.password[0];
            }
            if (backendErrors.password_confirmation) {
              formattedErrors.confirmPassword = backendErrors.password_confirmation[0];
            }
            
            setErrors(prev => ({...prev, ...formattedErrors}))
          }
        })
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Profile</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <FiCheck className="text-green-500 mr-2" />
            <span>Changes saved successfully!</span>
          </div>
          <button onClick={() => setSuccess(false)}>
            <FiX className="text-green-500" />
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Profile Image Section */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mx-auto relative">
                  {authUser?.user_information?.profile_image_url ? (
                    <img 
                      src={authUser.user_information.profile_image_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
                <button 
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FiCamera />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {authUser.name || "User Profile"}
              </h2>
              <p className="text-gray-500 truncate max-w-full">
                {authUser.email || ""}
              </p>
              
              <div className="mt-6">
                <button
                  className={`w-full py-2 px-4 rounded-md ${
                    editMode 
                      ? "bg-gray-300 text-gray-700 hover:bg-gray-400" 
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  } transition flex items-center justify-center gap-2`}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? (
                    <>
                      <FiX /> Cancel Editing
                    </>
                  ) : (
                    <>
                      <FiEdit /> Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="text-blue-500 mr-3 mt-1 flex-shrink-0">
                  <FiPhone />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-sm text-gray-500">Phone</p>
                  {!editMode ? (
                    <p>{authUser.user_information?.phone || "Not provided"}</p>
                  ) : (
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        value={user.user_information.phone}
                        onChange={handleInfoChange}
                        placeholder="Enter phone number"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-blue-500 mr-3 mt-1 flex-shrink-0">
                  <FiMail />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-sm text-gray-500">Email</p>
                  {!editMode ? (
                    <p className="break-words">{authUser.email || "Not provided"}</p>
                  ) : (
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className={`w-full border rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-blue-500 mr-3 mt-1 flex-shrink-0">
                  <FiMapPin />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-sm text-gray-500">Address</p>
                  {!editMode ? (
                    <p className="break-words">{authUser.user_information?.address || "Not provided"}</p>
                  ) : (
                    <div className="mt-1">
                      <textarea
                        name="address"
                        value={user.user_information.address}
                        onChange={handleInfoChange}
                        placeholder="Enter your address"
                        rows="2"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Form and Password Sections */}
        <div className="lg:col-span-3">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      placeholder={authUser.name || "Enter your name"}
                      disabled={!editMode}
                      className={`pl-10 w-full border rounded-md py-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                        !editMode ? 'bg-gray-100' : errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <textarea
                      name="bio"
                      value={authUser.user_information?.bio}
                      onChange={handleInfoChange}
                      placeholder={authUser.user_information?.bio || "Tell us about yourself"}
                      disabled={!editMode}
                      rows="3"
                      className={`pl-10 w-full border rounded-md py-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                        !editMode ? 'bg-gray-100' : errors.bio ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                </div>
              </div>
              
              {/* Social Links Section */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">Social Links</h4>
                
                {/* Display current social links */}
                {authUser?.user_information?.social_links && authUser?.user_information?.social_links.map((link, index) => (
                  <div key={index} className="flex items-center mb-3 gap-2">
                    <div className="flex-grow">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            name="platform"
                            value={link.platform}
                            onChange={(e) => handleSocialLinkChange(e, index)}
                            placeholder="Platform (e.g., Twitter)"
                            disabled={!editMode}
                            className={`w-full border rounded-md py-2 px-3 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                              !editMode ? 'bg-gray-100' : errors[`social_platform_${index}`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`social_platform_${index}`] && 
                            <p className="text-red-500 text-xs mt-1">{errors[`social_platform_${index}`]}</p>
                          }
                        </div>
                        <div>
                          <input
                            type="text"
                            name="url"
                            value={link.url}
                            onChange={(e) => handleSocialLinkChange(e, index)}
                            placeholder="URL"
                            disabled={!editMode}
                            className={`w-full border rounded-md py-2 px-3 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                              !editMode ? 'bg-gray-100' : errors[`social_url_${index}`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`social_url_${index}`] && 
                            <p className="text-red-500 text-xs mt-1">{errors[`social_url_${index}`]}</p>
                          }
                        </div>
                      </div>
                    </div>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="bg-red-100 text-red-500 p-2 rounded-md hover:bg-red-200 transition"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Add new social link form */}
                {editMode && (
                  <div className="mt-3 p-4 border border-dashed border-gray-300 rounded-md">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Add Social Link</h5>
                    <div className="flex items-center gap-2">
                      <div className="flex-grow">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="platform"
                            value={newSocialLink.platform}
                            onChange={handleNewSocialLinkChange}
                            placeholder="Platform (e.g., Twitter)"
                            className="w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                          />
                          <input
                            type="text"
                            name="url"
                            value={newSocialLink.url}
                            onChange={handleNewSocialLinkChange}
                            placeholder="URL"
                            className="w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addSocialLink}
                        className="bg-blue-100 text-blue-500 p-2 rounded-md hover:bg-blue-200 transition"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {editMode && (
                <div className="mt-6">
                  <button 
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
                  >
                    <FiCheck /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
          
          {/* Change Password */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="current"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      className={`pl-10 w-full border rounded-md py-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="new"
                      value={passwords.new}
                      onChange={handlePasswordChange}
                      className={`pl-10 w-full border rounded-md py-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirm"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      className={`pl-10 w-full border rounded-md py-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
                  >
                    <FiCheck /> Update Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile