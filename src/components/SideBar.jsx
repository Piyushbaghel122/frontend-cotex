import React, { useState, useEffect, useRef } from 'react';
import {
  Archive,
  Check,
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  PanelLeftIcon,
  PanelRight,
  PenSquare,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Share2,
  Trash2,
  User,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addConversation,
  removeConversation,
  setConvTitle,
  setConversations,
  setSelectedConversation,
  togglePinAction
} from '../redux/conversationSlice';
import { setArtifacts, setMessages } from '../redux/messageSlice';
import { getConversations } from '../features/getConversations';
import { updateConversation } from '../features/updateConversation';
import { togglePinConversation } from '../features/togglePinConversation';
import { deleteConversation } from '../features/deleteConversation';
import logOut from '../features/logOut';
import { setUserdata } from '../redux/userSlice';
import BillingDrawer from './BillingDrawer';

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const { conversations = [], selectedConversation } = useSelector(state => state.conversation);
  const { userData } = useSelector(state => state.user);
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Menu state for ... dropdown
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const menuRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchConvs = async () => {
      const data = await getConversations();
      if (Array.isArray(data)) {
        dispatch(setConversations(data));
        if (data.length > 0 && !selectedConversation) {
          dispatch(setSelectedConversation(data[0]));
        }
      }
    };
    fetchConvs();
  }, [userData?._id, dispatch]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus rename input
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleStartNewChat = () => {
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
    dispatch(setArtifacts([]));
    if (mobileOpen) setMobileOpen(false);
  };

  const handleOpenMenu = (e, convId) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 4,
      left: Math.min(rect.left, window.innerWidth - 180)
    });
    setActiveMenuId(activeMenuId === convId ? null : convId);
  };

  const handleTogglePin = async (conv) => {
    setActiveMenuId(null);
    dispatch(togglePinAction(conv._id));
    await togglePinConversation(conv._id);
    showToast(conv.isPinned ? "Conversation unpinned" : "Conversation pinned to top");
  };

  const handleDelete = async (conv) => {
    setActiveMenuId(null);
    dispatch(removeConversation(conv._id));
    if (selectedConversation?._id === conv._id) {
      dispatch(setMessages([]));
      dispatch(setArtifacts([]));
    }
    await deleteConversation(conv._id);
    showToast("Conversation deleted");
  };

  const handleStartRename = (conv) => {
    setActiveMenuId(null);
    setEditingId(conv._id);
    setEditTitle(conv.title || "New Chat");
  };

  const handleSaveRename = async (convId) => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    dispatch(setConvTitle({ conversationId: convId, title: trimmed }));
    setEditingId(null);
    await updateConversation({ id: convId, title: trimmed });
    showToast("Renamed successfully");
  };

  const handleShare = (conv) => {
    setActiveMenuId(null);
    navigator.clipboard.writeText(window.location.origin);
    showToast("Chat link copied to clipboard");
  };

  const handleArchive = (conv) => {
    setActiveMenuId(null);
    showToast("Conversation archived");
  };

  const pinnedConversations = conversations.filter(c => c?.isPinned);
  const recentConversations = conversations.filter(c => !c?.isPinned);

  const renderConversationItem = (conv) => {
    const isActive = selectedConversation?._id === conv?._id;
    const isEditing = editingId === conv?._id;

    return (
      <div
        key={conv._id}
        onClick={() => {
          if (!isEditing) {
            dispatch(setSelectedConversation(conv));
            if (mobileOpen) setMobileOpen(false);
          }
        }}
        className={`group relative flex items-center justify-between gap-2 cursor-pointer mb-1 px-3 py-2 rounded-[10px] border transition-all duration-150 ${
          isActive
            ? "bg-indigo-500/10 border-indigo-500/[0.22] text-slate-100"
            : "bg-transparent border-transparent hover:bg-white/[0.04] text-slate-300 hover:text-slate-100"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`flex items-center justify-center shrink-0 w-[24px] h-[24px] rounded-lg transition-colors ${
              isActive ? "bg-indigo-500/20 text-indigo-400" : "bg-white/[0.04] text-slate-500 group-hover:text-slate-300"
            }`}
          >
            <MessageSquare size={13} />
          </div>

          {isEditing ? (
            <div className="flex items-center gap-1.5 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                ref={editInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveRename(conv._id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="w-full bg-[#161922] border border-indigo-500/50 rounded px-2 py-0.5 text-xs text-white outline-none focus:border-indigo-400"
              />
              <button
                onClick={() => handleSaveRename(conv._id)}
                className="p-1 rounded hover:bg-white/10 text-emerald-400 border-none bg-transparent cursor-pointer"
              >
                <Check size={13} />
              </button>
            </div>
          ) : (
            <span className="text-[13px] font-medium truncate flex-1 select-none">
              {conv?.title || "New Chat"}
            </span>
          )}
        </div>

        {/* Right action indicators */}
        <div className="flex items-center gap-1 shrink-0">
          {conv.isPinned && (
            <Pin size={12} className="text-indigo-400/80 fill-indigo-400/20 shrink-0" />
          )}

          <button
            onClick={(e) => handleOpenMenu(e, conv._id)}
            className={`flex items-center justify-center w-6 h-6 rounded-md hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-colors border-none bg-transparent cursor-pointer ${
              activeMenuId === conv._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            title="Options"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    );
  };

  // Collapsed Sidebar View
  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-[58px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
          onClick={() => setCollapsed(false)}
          title="Expand Sidebar"
        >
          <PanelRight size={18} />
        </button>

        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-indigo-600 transition-colors duration-150 border-none cursor-pointer mb-2"
          onClick={handleStartNewChat}
          title="New Chat"
        >
          <Plus size={16} />
        </button>

        <div className="flex-1 w-full overflow-y-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col items-center gap-1">
          {conversations.map((conv) => {
            const isActive = selectedConversation?._id === conv?._id;
            return (
              <div
                key={conv._id}
                onClick={() => dispatch(setSelectedConversation(conv))}
                title={conv.title || "Chat"}
                className={`relative flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer transition-colors ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    : "bg-transparent text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
                }`}
              >
                <MessageSquare size={14} />
                {conv.isPinned && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-white/[0.06] w-full flex justify-center">
          {userData?.avatar && !imageError ? (
            <img
              className="w-8 h-8 rounded-lg object-cover border border-indigo-500/30"
              src={userData.avatar}
              alt="Avatar"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <User size={14} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={14} />
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Main Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[270px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06] transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full select-none">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/[0.06]">
            <div
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={() => setCollapsed(true)}
              title="Collapse"
            >
              <PanelLeftIcon size={16} />
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              <X size={16} />
            </button>

            <span
              onClick={handleStartNewChat}
              className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1 cursor-pointer hover:text-indigo-300 transition-colors"
              title="Start New Chat"
            >
              CortexAI
            </span>

            <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
              {userData?.plan || "free"}
            </span>

            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={handleStartNewChat}
              title="New Chat"
            >
              <PenSquare size={14} />
            </button>
          </div>

          {/* New Chat Primary Button */}
          <div className="px-3.5 pt-3.5 pb-2">
            <button
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-2.5 border-none cursor-pointer hover:opacity-95 shadow-lg shadow-indigo-500/15 transition-all duration-150"
              onClick={handleStartNewChat}
            >
              <Plus size={16} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat List with Pinned and Recents */}
          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Pinned Section */}
            {pinnedConversations.length > 0 && (
              <div className="mb-3">
                <div className="px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 tracking-wider">
                  <Pin size={11} className="text-indigo-400" />
                  <span>Pinned</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    ({pinnedConversations.length})
                  </span>
                </div>
                {pinnedConversations.map(renderConversationItem)}
              </div>
            )}

            {/* Recents Section */}
            <div>
              <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <span>Recents</span>
              </div>

              {recentConversations.length === 0 && pinnedConversations.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-slate-600">
                  No conversations yet. Start a new chat!
                </div>
              ) : (
                recentConversations.map(renderConversationItem)
              )}
            </div>
          </div>

          {/* User profile & Billing footer */}
          <div className="mx-2.5 h-px bg-white/[0.06]" />
          <div className="px-3.5 py-3">
            {userData ? (
              <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 hover:bg-white/[0.05] transition-colors duration-150">
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      className="w-8 h-8 rounded-lg object-cover border border-indigo-500/30"
                      src={userData.avatar}
                      alt="Avatar"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                      <User size={14} className="text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-200 truncate leading-tight">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {userData?.email || `${userData?.plan || 'free'} plan`}
                  </p>
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setShowBilling(true)}
                    className="flex items-center justify-center w-7 h-7 rounded-lg border-none bg-transparent text-amber-400 cursor-pointer hover:bg-white/[0.08] transition-colors"
                    title="Billing"
                  >
                    <Coins size={15} />
                  </button>

                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-lg border-none bg-transparent text-slate-500 cursor-pointer hover:bg-white/[0.08] hover:text-slate-300 transition-colors"
                    onClick={() => {
                      logOut();
                      dispatch(setUserdata(null));
                    }}
                    title="Logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-2 cursor-pointer hover:bg-white/[0.08] transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Three-dots Context Menu (ChatGPT Style) */}
      {activeMenuId && (
        <div
          ref={menuRef}
          style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
          className="fixed z-50 w-44 rounded-xl bg-[#161822] border border-white/[0.1] shadow-2xl p-1.5 flex flex-col gap-0.5 text-xs text-slate-200 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
        >
          {(() => {
            const currentConv = conversations.find(c => c._id === activeMenuId);
            if (!currentConv) return null;

            return (
              <>
                <button
                  onClick={() => handleStartRename(currentConv)}
                  className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors border-none bg-transparent cursor-pointer text-left text-xs"
                >
                  <Pencil size={13} className="text-slate-400" />
                  <span>Rename</span>
                </button>

                <button
                  onClick={() => handleTogglePin(currentConv)}
                  className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors border-none bg-transparent cursor-pointer text-left text-xs"
                >
                  {currentConv.isPinned ? (
                    <>
                      <PinOff size={13} className="text-indigo-400" />
                      <span>Unpin</span>
                    </>
                  ) : (
                    <>
                      <Pin size={13} className="text-slate-400" />
                      <span>Pin</span>
                    </>
                  )}
                </button>

                <div className="h-px bg-white/[0.08] my-1" />

                <button
                  onClick={() => handleShare(currentConv)}
                  className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors border-none bg-transparent cursor-pointer text-left text-xs"
                >
                  <Share2 size={13} className="text-slate-400" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => handleArchive(currentConv)}
                  className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors border-none bg-transparent cursor-pointer text-left text-xs"
                >
                  <Archive size={13} className="text-slate-400" />
                  <span>Archive</span>
                </button>

                <div className="h-px bg-white/[0.08] my-1" />

                <button
                  onClick={() => handleDelete(currentConv)}
                  className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors border-none bg-transparent cursor-pointer text-left text-xs"
                >
                  <Trash2 size={13} className="text-red-400" />
                  <span>Delete</span>
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#1c1f2e] border border-white/[0.12] text-xs font-medium text-slate-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}

      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
    </>
  );
}

export default SideBar;
