import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  Star, 
  ChevronDown, 
  Filter,
  X,
  Save,
  Building2,
  MapPin,
  Upload,
  Image
} from 'lucide-react';
import defaultInstance from '../../../plugins/axios';

const BuildingCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Dummy initial data - in a real app, you'd load this from an API
  useEffect(() => {
    // Simulating API call
    setCompanies([
      {
        id: 1,
        name: "არქი",
        nameEng: "Arqi",
        logo: "/images/next.svg",
        priceFrom: 2162,
        projectCount: 15,
        projects: ["Archi Universi", "Archi Kikvidze Garden", "Archi Isani", "Archi Varketili"],
        rating: 4.8,
        completedProjects: 12,
        location: "თბილისი",
        established: 2010,
        specialization: ["Residential", "Commercial"],
        featured: true,
      },
    //   {
    //     id: 2,
    //     name: "Next Group",
    //     nameEng: "Next Group",
    //     logo: "/images/next.svg",
    //     priceFrom: 4717,
    //     projectCount: 8,
    //     projects: ["Tbilisi Downtown", "Next Saburtalo", "Next Dighomi"],
    //     rating: 4.6,
    //     completedProjects: 6,
    //     location: "თბილისი",
    //     established: 2015,
    //     specialization: ["Luxury", "Commercial"],
    //     featured: true,
    //   },
    //   // More companies would be loaded from the API
    ]);

    // In a real implementation, use axios:
    // defaultInstance.get('/admin/building-companies')
    //   .then(response => setCompanies(response.data.data))
    //   .catch(error => console.error('Error fetching companies:', error));
  }, []);

  const specializations = ["all", "Residential", "Commercial", "Luxury", "Eco-friendly", "Premium", "Modern"];

  // Filter companies based on search term and specialization
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.nameEng.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.projects.some((project) => project.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialization =
      selectedSpecialization === "all" || company.specialization.includes(selectedSpecialization);

    return matchesSearch && matchesSpecialization;
  });

  // Sort companies based on selected sorting criteria
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return b.featured ? 1 : -1;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Add file input reference
  const fileInputRef = useRef(null);
  // Add state for logo preview
  const [logoPreview, setLogoPreview] = useState(null);

  // Handle editing a company
  const handleEditCompany = (company) => {
    setEditingCompany({
      id: company.id,
      name: company.name,
      description: company.description || '', // Make sure description exists
      logo: company.logo,
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || ''
    });
    setLogoPreview(company.logo); // Set logo preview from existing logo
    setIsEditing(true);
    setIsAddingNew(false);
  };

  // Handle adding a new company
  const handleAddNewCompany = () => {
    setEditingCompany({
      name: "",
      description: "",
      logo: null,
      address: "",
      phone: "",
      email: "",
      website: ""
    });
    setLogoPreview(null); // Clear logo preview
    setIsEditing(true);
    setIsAddingNew(true);
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Store the file in editingCompany state
    setEditingCompany({
      ...editingCompany,
      logo: file
    });
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle saving company changes
  const handleSaveCompany = () => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', editingCompany.name);
    formData.append('description', editingCompany.description);
    formData.append('address', editingCompany.address);
    formData.append('phone', editingCompany.phone);
    formData.append('email', editingCompany.email);
    formData.append('website', editingCompany.website);

    // Only append logo if it's a File object (not a string URL)
    if (editingCompany.logo instanceof File) {
      formData.append('logo', editingCompany.logo);
    }

    if (isAddingNew) {
      // Only add to local state if backend returns 201 and data
      defaultInstance.post('/admin/building-companies', formData)
        .then(response => {
          if (response.status === 201 && response.data) {
            setCompanies([...companies, response.data]);
          }
          setIsEditing(false);
          setEditingCompany(null);
          setLogoPreview(null);
        })
        .catch(() => {
          // Optionally handle error, e.g. show notification
        });
    } else {
      // For demo, update the company with simplified data
      setCompanies(
        companies.map(company => 
          company.id === editingCompany.id ? {
            ...company,
            name: editingCompany.name,
            description: editingCompany.description,
            logo: logoPreview // Use preview URL for demo
          } : company
        )
      );
      defaultInstance.put(`/admin/building-companies/${editingCompany.id}`, formData)
        .then(response => {
          setCompanies(companies.map(company => 
            company.id === editingCompany.id ? response.data : company
          ));
        });
      setIsEditing(false);
      setEditingCompany(null);
      setLogoPreview(null);
    }
  };

  // Handle deleting a company
  const handleDeleteCompany = (companyId) => {
    if (confirm("Are you sure you want to delete this company?")) {
      setCompanies(companies.filter(company => company.id !== companyId));
      // In real app, use API call:
      defaultInstance.delete(`/admin/building-companies/${companyId}`)
        .then(() => {
          setCompanies(companies.filter(company => company.id !== companyId));
        });
    }
  };

  // Handle adding a new project to the company
  const handleAddProject = () => {
    if (editingCompany) {
      setEditingCompany({
        ...editingCompany,
        projects: [...editingCompany.projects, "New Project"]
      });
    }
  };

  // Handle removing a project from the company
  const handleRemoveProject = (index) => {
    if (editingCompany) {
      const updatedProjects = [...editingCompany.projects];
      updatedProjects.splice(index, 1);
      setEditingCompany({
        ...editingCompany,
        projects: updatedProjects
      });
    }
  };

  // Handle adding specialization to the company
  const handleAddSpecialization = (spec) => {
    if (editingCompany && !editingCompany.specialization.includes(spec)) {
      setEditingCompany({
        ...editingCompany,
        specialization: [...editingCompany.specialization, spec]
      });
    }
  };

  // Handle removing specialization from the company
  const handleRemoveSpecialization = (spec) => {
    if (editingCompany) {
      setEditingCompany({
        ...editingCompany,
        specialization: editingCompany.specialization.filter(s => s !== spec)
      });
    }
  };

  // Handle input change for editing company
  const handleInputChange = (field, value) => {
    setEditingCompany({
      ...editingCompany,
      [field]: value
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">სამშენებლო კომპანიების მართვა</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </div>
          <button 
            onClick={handleAddNewCompany}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            დამატება
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ძებნა კომპანიის სახელით"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4 mr-1" />
                ფილტრი
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">რეკომენდებული</option>
                  <option value="rating">რეიტინგით</option>
                  <option value="name">სახელით</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">ყველა სპეციალიზაცია</option>
                  {specializations.slice(1).map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Company List */}
        {!isEditing ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">კომპანია</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">რეიტინგი</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">პროექტები</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">მდებარეობა</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">ფასი მ²-ზე</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">მოქმედება</th>
                </tr>
              </thead>
              <tbody>
                {sortedCompanies.map((company) => (
                  <tr key={company.id} className="border-t border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          {company.logo_url ? (
                            <img src={company.logo_url} alt={company.name} className="w-8 h-8 object-contain" />
                          ) : (
                            <Building2 className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{company.name}</div>
                          <div className="text-xs text-gray-500">{company.nameEng}</div>
                        </div>
                        {company.featured && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            VIP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{company.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div>
                        <div className="text-sm">{company.projectCount} პროექტი</div>
                        <div className="text-xs text-gray-500">{company.completedProjects} დასრულებული</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {company.location}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="font-medium">{company.priceFrom} ₾-დან</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditCompany(company)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCompany(company.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Simplified Edit Form */
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isAddingNew ? "ახალი კომპანიის დამატება" : "კომპანიის რედაქტირება"}
              </h2>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setLogoPreview(null);
                }}
                className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ძირითადი ინფორმაცია</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">კომპანიის სახელი</label>
                    <input 
                      type="text" 
                      value={editingCompany?.name || ''} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">აღწერა</label>
                    <textarea 
                      value={editingCompany?.description || ''} 
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">მისამართი</label>
                    <input 
                      type="text" 
                      value={editingCompany?.address || ''} 
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ტელეფონი</label>
                    <input 
                      type="tel" 
                      value={editingCompany?.phone || ''} 
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+995 xxx xxx xxx"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ელ-ფოსტა</label>
                    <input 
                      type="email" 
                      value={editingCompany?.email || ''} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="info@company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ვებსაიტი</label>
                    <input 
                      type="url" 
                      value={editingCompany?.website || ''} 
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
              
              {/* Logo Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ლოგოს ატვირთვა</h3>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  {logoPreview ? (
                    <div className="mb-4 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-lg border border-gray-200 p-2 bg-white flex items-center justify-center overflow-hidden mb-2">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setEditingCompany({...editingCompany, logo: null});
                        }}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center"
                      >
                        <X className="w-4 h-4 mr-1" />
                        წაშლა
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <Image className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">აირჩიეთ ლოგოს ფაილი ან გადაათრიეთ</p>
                      <p className="text-xs text-gray-500 mb-4">SVG, PNG, JPG (მაქს. 2MB)</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {logoPreview ? 'შეცვლა' : 'ატვირთვა'}
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <button 
                onClick={handleSaveCompany}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isAddingNew ? "დამატება" : "შენახვა"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingCompanies;