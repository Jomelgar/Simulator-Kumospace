import { Mail, Phone, MapPin, Crown, Calendar, Edit, Save, X, Plus } from 'lucide-react';
import { useState, useEffect, use } from 'react';
import { checkRequest } from '../../api/authApi';
import { getUser, updateUser } from '../../api/userApi';
import type { Hive } from '../../pages/Dashboard';

interface ProfileViewProps {
  hiveData: Hive;
}

export function ProfileView({ hiveData }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [name, setName] = useState('Sarah Chen');
  const [title, setTitle] = useState('Product Designer • Team Lead');
  const [email, setEmail] = useState('sarah.chen@roomshive.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');
  const [about, setAbout] = useState('Product designer with 8+ years of experience creating intuitive user experiences. Passionate about collaboration and building products that make a difference.');
  const [tempAbout, setTempAbout] = useState('');
  const [skills, setSkills] = useState(['UI/UX Design', 'Product Strategy', 'Team Leadership', 'Figma']);
  const [tempSkills, setTempSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const rawUserId = localStorage.getItem("userId");
      const userId = rawUserId && rawUserId !== "null" && rawUserId !== "undefined" ? rawUserId : null;

      let actualUserId = userId;
      if (!actualUserId) {
        try {
          const checkResp = await checkRequest();
          actualUserId = checkResp?.data?.id_user;
          if (actualUserId) {
            localStorage.setItem("userId", String(actualUserId));
          }
        } catch (err) {
          console.error("Error fetching session user:", err);
        }
      }

      if (actualUserId) {
        try {
          const response = await getUser(actualUserId);

          if (response && response.data) {
            const userData = response.data;

            if (userData.first_name || userData.last_name) {
              const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
              setName(fullName);
            } else if (userData.user_name) {
              setName(userData.user_name);
            }

            if (userData.email) setEmail(userData.email);
            if (userData.phone) setPhone(userData.phone);
            if (userData.location) setLocation(userData.location);
            if (userData.title) setTitle(userData.title);
            if (userData.about) setAbout(userData.about);

            if (userData.imageURL) {
              let baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
              if (baseURL.endsWith("/api")) {
                baseURL = baseURL.slice(0, -4);
              }
              const fullUrl = `${baseURL}${userData.imageURL}`;
              setImagePreview(fullUrl);
              setOriginalImagePreview(fullUrl);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const nameParts = name.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      const formData = new FormData();
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('location', location);
      formData.append('title', title);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      console.log ("Saving profile")
      await updateUser(userId, formData);
      setOriginalImagePreview(imagePreview);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(originalImagePreview);
  };

  const handleEditAbout = () => {
    setTempAbout(about);
    setTempSkills([...skills]);
    setIsEditingAbout(true);
  };

  const handleSaveAbout = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const userData = {
        about: tempAbout
      };

      await updateUser(userId, userData);
      setAbout(tempAbout);
      setSkills([...tempSkills]);
      setIsEditingAbout(false);
    } catch (error) {
      console.error("Error saving about:", error);
    }
  };

  const handleCancelAbout = () => {
    setTempAbout(about);
    setTempSkills([...skills]);
    setNewSkill('');
    setIsEditingAbout(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !tempSkills.includes(newSkill.trim())) {
      setTempSkills([...tempSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTempSkills(tempSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-zinc-900 mb-2">Profile</h1>
          <p className="text-zinc-600">Manage your personal information and settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border-2 border-zinc-200 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-yellow-100">
                <img
                  src={imagePreview || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="profile-image-upload"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute bottom-2 right-2 w-10 h-10 bg-yellow-500 text-white rounded-lg flex items-center justify-center hover:bg-yellow-600 transition-all shadow-lg cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </label>
                </>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-zinc-900"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-zinc-700 mb-1">Email</label>
                      <input
                        type="email"
                        disabled
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border bg-zinc-500 border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-zinc-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-zinc-900"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl text-zinc-900">{name}</h2>
                    {hiveData.userRole === 'Hive Queen' && (
                      <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg border border-yellow-200">
                        <Crown className="w-4 h-4" fill="currentColor" />
                        <span className="text-sm">Hive Queen</span>
                      </div>
                    )}
                  </div>
                  <p className="text-zinc-600 mb-4">{title}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Mail className="w-4 h-4 text-yellow-600" />
                      <span>{email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Phone className="w-4 h-4 text-yellow-600" />
                      <span>{phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <MapPin className="w-4 h-4 text-yellow-600" />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                      <span>Joined March 2024</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Edit/Save Buttons */}
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white border-2 border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-zinc-900">About</h3>
            {isEditingAbout ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelAbout}
                  className="px-3 py-1.5 bg-white border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-all flex items-center gap-2 text-sm"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveAbout}
                  className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2 text-sm"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditAbout}
                className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2 text-sm"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>

          {isEditingAbout ? (
            <div className="mb-4">
              <textarea
                value={tempAbout}
                onChange={(e) => setTempAbout(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-zinc-900 resize-none"
              />
            </div>
          ) : (
            <p className="text-zinc-600 mb-4">{about}</p>
          )}

          <div className="mb-3">
            <h4 className="text-sm text-zinc-700 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {(isEditingAbout ? tempSkills : skills).map((skill) => (
                <span
                  key={skill}
                  className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-sm border border-yellow-200 flex items-center gap-2"
                >
                  {skill}
                  {isEditingAbout && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-yellow-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {isEditingAbout && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-zinc-900 text-sm"
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}