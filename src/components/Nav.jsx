import React, { useState, useRef } from 'react'
import { MessageSquare, User, LogOut, Coins, ChevronDown, Camera, Trash2, Check, X, Edit3, Loader2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { setUserdata } from '../redux/userSlice'
import { setSelectedConversation } from '../redux/conversationSlice'
import { setMessages, setArtifacts } from '../redux/messageSlice'
import logOut from '../features/logOut'
import api from '../../utils/axios'

function Nav() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages } = useSelector(state => state.message)
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Profile Edit States
  const [editName, setEditName] = useState('')
  const [previewAvatar, setPreviewAvatar] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const fileInputRef = useRef(null)

  const openProfileModal = () => {
    setEditName(userData?.name || '')
    setPreviewAvatar(userData?.avatar || '')
    setSaveSuccess(false)
    setSaveError('')
    setDropdownOpen(false)
    setProfileModalOpen(true)
  }

  const handleLogout = async () => {
    try {
      await logOut()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      dispatch(setUserdata(null))
      setDropdownOpen(false)
      setProfileModalOpen(false)
    }
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setSaveError('Image size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewAvatar(reader.result)
      setSaveError('')
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPreviewAvatar('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setSaveError('Name cannot be empty')
      return
    }

    setIsSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    try {
      const { data } = await api.put('/api/auth/profile', {
        name: editName.trim(),
        avatar: previewAvatar,
      })
      dispatch(setUserdata(data))
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
      }, 2500)
    } catch (err) {
      console.error('Failed to update profile:', err)
      setSaveError(err.response?.data?.message || err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0d0f14] z-20'>
      {/* Left: Active Conversation Info */}
      <div className='flex items-center gap-2.5'>
        <div
          onClick={() => {
            dispatch(setSelectedConversation(null));
            dispatch(setMessages([]));
            dispatch(setArtifacts([]));
          }}
          className='flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 cursor-pointer hover:bg-indigo-500/20 transition-colors'
          title="New Chat"
        >
          <MessageSquare size={13} className="text-indigo-400" />
        </div>
        <div
          onClick={() => {
            dispatch(setSelectedConversation(null));
            dispatch(setMessages([]));
            dispatch(setArtifacts([]));
          }}
          className='text-[14px] font-semibold text-slate-100 tracking-tight cursor-pointer hover:text-indigo-300 transition-colors'
          title="Click to start New Chat"
        >
          {selectedConversation?.title || "CortexAI Chat"}
        </div>
        {selectedConversation && (
          <div className='text-[10px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full'>
            {messages?.length || 0} Messages
          </div>
        )}
      </div>

      {/* Right: User Profile & Menu on Navbar */}
      {userData && (
        <div className='relative flex items-center gap-3'>

          {/* Profile Dropdown Trigger */}
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='flex items-center gap-2 cursor-pointer py-1 px-2.5 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-150 select-none'
          >
            {userData?.avatar && !imgError ? (
              <img
                src={userData.avatar}
                alt={userData.name || "User"}
                className='w-7 h-7 rounded-lg object-cover border border-indigo-500/40 ring-1 ring-indigo-500/20'
                onError={() => setImgError(true)}
              />
            ) : (
              <div className='w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-xs'>
                {userData?.name ? userData.name.charAt(0).toUpperCase() : <User size={14} />}
              </div>
            )}
            <div className='flex flex-col text-left'>
              <span className='text-xs font-semibold text-slate-200 hidden md:inline-block max-w-[120px] truncate'>
                {userData?.name || "Profile"}
              </span>
            </div>
            <ChevronDown size={14} className='text-slate-400 ml-0.5' />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className='fixed inset-0 z-30'
                onClick={() => setDropdownOpen(false)}
              />
              <div className='absolute right-0 top-11 w-56 bg-[#13151c] border border-white/[0.09] rounded-xl shadow-2xl p-2 z-40 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150'>
                <div className='px-3 py-2 border-b border-white/[0.06]'>
                  <p className='text-xs font-semibold text-slate-100 truncate'>{userData?.name || "User"}</p>
                  <p className='text-[11px] text-slate-400 truncate'>{userData?.email}</p>
                  <span className='inline-block mt-1 text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded'>
                    {userData?.plan || "Free Plan"}
                  </span>
                </div>

                <button
                  onClick={openProfileModal}
                  className='w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/[0.06] transition-colors duration-150 border-none bg-transparent cursor-pointer'
                >
                  <User size={14} className='text-indigo-400' />
                  <span>My Profile & Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className='w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors duration-150 border-none bg-transparent cursor-pointer'
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {profileModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
          <div className='w-full max-w-[420px] bg-[#13151c] border border-white/[0.1] rounded-2xl p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200'>
            {/* Header */}
            <div className='flex items-center justify-between border-b border-white/[0.07] pb-3'>
              <div className='flex items-center gap-2'>
                <User size={18} className='text-indigo-400' />
                <h3 className='text-base font-semibold text-slate-100'>User Profile</h3>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className='text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer bg-transparent border-none'
              >
                <X size={18} />
              </button>
            </div>

            {/* Avatar Section */}
            <div className='flex flex-col items-center gap-3 py-2'>
              <div className='relative group'>
                {previewAvatar ? (
                  <img
                    src={previewAvatar}
                    alt='Avatar Preview'
                    className='w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                  />
                ) : (
                  <div className='w-24 h-24 rounded-2xl bg-indigo-600/20 border-2 border-indigo-500/30 flex items-center justify-center text-indigo-300 text-3xl font-bold'>
                    {editName ? editName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  title='Upload new photo'
                  className='absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg border border-indigo-400/30 cursor-pointer transition-transform active:scale-95'
                >
                  <Camera size={14} />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handlePhotoSelect}
              />

              <div className='flex items-center gap-2 text-xs'>
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors cursor-pointer bg-transparent border-none'
                >
                  Upload Photo
                </button>
                {previewAvatar && (
                  <>
                    <span className='text-slate-600'>•</span>
                    <button
                      type='button'
                      onClick={handleRemovePhoto}
                      className='text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-500/10 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none'
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Feedback Banners */}
            {saveSuccess && (
              <div className='flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium'>
                <Check size={14} />
                <span>Profile updated successfully!</span>
              </div>
            )}
            {saveError && (
              <div className='p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium'>
                {saveError}
              </div>
            )}

            {/* Form Fields */}
            <div className='flex flex-col gap-3.5'>
              <div className='flex flex-col gap-1'>
                <label className='text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5'>
                  <Edit3 size={12} className='text-indigo-400' />
                  Full Name
                </label>
                <input
                  type='text'
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder='Your Name'
                  className='w-full px-3 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/[0.09] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-[11px] font-semibold text-slate-400 uppercase tracking-wider'>
                  Email Address
                </label>
                <input
                  type='email'
                  disabled
                  value={userData?.email || ''}
                  className='w-full px-3 py-2 text-xs rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-400 cursor-not-allowed select-none'
                />
              </div>

              <div className='flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs'>
                <span className='text-slate-400'>Account Plan</span>
                <span className='font-semibold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded'>
                  {userData?.plan || 'Free'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 pt-2 border-t border-white/[0.07]'>
              <button
                type='button'
                onClick={handleSaveProfile}
                disabled={isSaving}
                className='flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50'
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className='animate-spin' />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              <button
                type='button'
                onClick={handleLogout}
                className='py-2.5 px-3 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer bg-transparent'
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Nav
