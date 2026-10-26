import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_CHANNELS, EMOJI_LIST } from './initialData';
import { playOutgoingSound, playIncomingSound, playRingSound } from './sound';
import './styles/cloudchat.css';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('cloudchat_theme') || 'dark');

  // Active Workspace
  const [activeWorkspace, setActiveWorkspace] = useState('amethyst');

  // Channels state with LocalStorage persistence
  const [channels, setChannels] = useState(() => {
    try {
      const saved = localStorage.getItem('cloudchat_channels');
      return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
    } catch (e) {
      return INITIAL_CHANNELS;
    }
  });

  const [activeChannelId, setActiveChannelId] = useState('engineering-core');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Right Contextual Drawer state & tab (overview, members, files)
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState('overview'); // 'overview' | 'members' | 'files'

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('cloudchat_user');
      return saved ? JSON.parse(saved) : {
        name: "Abdul Moeez Nadeem",
        about: "Principal Systems Architect · Building next-gen Fintech & AI ⚡",
        phone: "+92 301 8492011",
        email: "moeez@amethyst.dev",
        role: "Lead Systems Architect",
        avatar: null
      };
    } catch (e) {
      return {
        name: "Abdul Moeez Nadeem",
        about: "Principal Systems Architect · Building next-gen Fintech & AI ⚡",
        phone: "+92 301 8492011",
        email: "moeez@amethyst.dev",
        role: "Lead Systems Architect",
        avatar: null
      };
    }
  });

  // Profile modal
  const [showProfileModal, setShowProfileModal] = useState(false);

  // New Channel modal
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelTag, setNewChannelTag] = useState('Core');
  const [newChannelDesc, setNewChannelDesc] = useState('');

  // Calling Modal
  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState('voice'); // 'voice' | 'video'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Composer state
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Voice note recording
  const [isRecording, setIsRecording] = useState(false);
  const [recDuration, setRecDuration] = useState(0);

  // Voice note playing state
  const [playingVoiceId, setPlayingVoiceId] = useState(null);

  // Search inside chat
  const [chatSearchText, setChatSearchText] = useState('');
  const [isSearchingChat, setIsSearchingChat] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('cloudchat_channels', JSON.stringify(channels));
    } catch (e) {}
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('cloudchat_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cloudchat_user', JSON.stringify(userProfile));
  }, [userProfile]);

  // Voice recording timer
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => setRecDuration(d => d + 1), 1000);
    } else {
      setRecDuration(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Call timer
  useEffect(() => {
    let timer;
    if (callActive) {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  // Scroll to bottom on channel change
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [activeChannelId]);

  // Active channel reference
  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  // Send message
  const handleSendMessage = (customText = null, imageSrc = null, voiceDuration = null) => {
    const textToSend = customText !== null ? customText : inputText.trim();
    if (!textToSend && !imageSrc && !voiceDuration) return;

    playOutgoingSound();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: "msg-" + Date.now(),
      sender: userProfile.name,
      replyTo: replyingTo ? { sender: replyingTo.sender, text: replyingTo.text } : null,
      text: textToSend,
      image: imageSrc || null,
      isVoiceNote: !!voiceDuration,
      duration: voiceDuration || null,
      time: timeStr,
      out: true,
      status: "read",
      reactions: {}
    };

    setChannels(prev => prev.map(ch => {
      if (ch.id === activeChannelId) {
        return {
          ...ch,
          messages: [...ch.messages, newMsg]
        };
      }
      return ch;
    }));

    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setTimeout(() => scrollToBottom(true), 50);

    // Contextual intelligent reply
    triggerContextualReply(activeChannelId, textToSend);
  };

  // Smart Contextual Auto-Replies
  const triggerContextualReply = (channelId, userQuery) => {
    let replySender = "Sarah Khan";
    let authorClass = "author-sarah";
    let replyText = "Understood. The specs have been updated and forwarded to production.";

    if (channelId === 'sarah-khan') {
      replySender = "Sarah Khan";
      authorClass = "author-sarah";
      if (userQuery && userQuery.toLowerCase().includes('voice')) {
        replyText = "Listening to your audio update now! The voice clarity is exceptional. Let's merge the PR!";
      } else {
        replyText = "Got your message, Moeez! The sub-50ms latency is performing flawlessly in our staging suite. 🚀";
      }
    } else if (channelId === 'ai-assistant') {
      replySender = "Amethyst AI";
      authorClass = "author-ai";
      const q = (userQuery || '').toLowerCase();
      if (q.includes('price') || q.includes('crypto') || q.includes('gold')) {
        replyText = "⚡ [REAL TELEMETRY STREAM]\n• Bitcoin: $68,410.20 (+2.8%)\n• Ethereum: $2,542.80\n• Gold 24K: Rs. 284,500/tola\n• USD/PKR: 278.45 (SBP Interbank)";
      } else if (q.includes('deploy') || q.includes('cluster') || q.includes('status')) {
        replyText = "🟢 Edge Infrastructure Status:\n• Active Pods: 8/8 healthy\n• Handshake Latency: 18ms\n• Firestore Sync: ACTIVE (0 packet loss)";
      } else {
        replyText = `Analysis complete for query: "${userQuery}". Real-time WebSocket connection is maintained with zero memory drift.`;
      }
    } else if (channelId === 'engineering-core') {
      replySender = "Ali Ahmed";
      authorClass = "author-ali";
      replyText = "Confirmed! CI/CD build finished in 42s. Docker image deployed to Google Cloud Run.";
    } else if (channelId === 'crypto-bullion') {
      replySender = "Telemetry Bot";
      authorClass = "author-telemetry";
      replyText = "📊 [BULLION ALERT] Karachi Bullion Exchange opened with heavy spot demand for 24K gold bars.";
    } else {
      return;
    }

    setTimeout(() => {
      playIncomingSound();
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChannels(prev => prev.map(ch => {
        if (ch.id === channelId) {
          return {
            ...ch,
            messages: [
              ...ch.messages,
              {
                id: "reply-" + Date.now(),
                sender: replySender,
                authorClass: authorClass,
                text: replyText,
                time: timeStr,
                out: false,
                status: "read",
                reactions: {}
              }
            ]
          };
        }
        return ch;
      }));
      setTimeout(() => scrollToBottom(true), 50);
    }, 1200);
  };

  // Toggle reaction on message
  const handleToggleReaction = (msgId, emoji) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === activeChannelId) {
        return {
          ...ch,
          messages: ch.messages.map(m => {
            if (m.id === msgId) {
              const current = m.reactions || {};
              const count = current[emoji] || 0;
              return {
                ...m,
                reactions: {
                  ...current,
                  [emoji]: count + 1
                }
              };
            }
            return m;
          })
        };
      }
      return ch;
    }));
  };

  // Send voice note
  const sendVoiceNote = () => {
    const mins = Math.floor(recDuration / 60);
    const secs = recDuration % 60;
    const durStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    setIsRecording(false);
    handleSendMessage('', null, durStr || "0:08");
  };

  // Upload file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleSendMessage(`Shared file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, reader.result, null);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  // Create Channel
  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const formatted = newChannelName.startsWith('#') ? newChannelName : `#${newChannelName.toLowerCase().replace(/\s+/g, '-')}`;
    const newCh = {
      id: "chan-" + Date.now(),
      type: "channel",
      tag: newChannelTag,
      name: formatted,
      subtitle: newChannelDesc || "Production collaboration channel",
      avatar: null,
      icon: "fa-hashtag",
      online: true,
      statusText: "Active channel · 2 members",
      members: [
        { name: userProfile.name, role: "Owner & Lead", online: true },
        { name: "Sarah Khan", role: "Product Principal", online: true },
        { name: "Amethyst AI", role: "Autonomous Bot", online: true }
      ],
      messages: [
        {
          id: "m-init-" + Date.now(),
          sender: "System",
          text: `🚀 Channel ${formatted} provisioned by ${userProfile.name}. WebSocket encryption established.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          out: false,
          status: "read",
          reactions: {}
        }
      ]
    };

    setChannels(prev => [newCh, ...prev]);
    setActiveChannelId(newCh.id);
    setShowNewChannelModal(false);
    setNewChannelName('');
    setNewChannelDesc('');
  };

  // Start Call
  const startCall = (type) => {
    setCallType(type);
    setCallActive(true);
    playRingSound();
  };

  // Filter channels
  const filteredChannels = channels.filter(ch => {
    if (activeFilter === 'channels' && ch.type !== 'channel') return false;
    if (activeFilter === 'direct' && ch.type !== 'direct') return false;
    if (activeFilter === 'unread' && ch.id !== 'sarah-khan') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ch.name.toLowerCase().includes(q);
      const matchSub = ch.subtitle.toLowerCase().includes(q);
      const matchMsg = ch.messages.some(m => (m.text || '').toLowerCase().includes(q));
      return matchName || matchSub || matchMsg;
    }
    return true;
  });

  // Highlight messages in search
  const displayedMessages = activeChannel.messages.map(m => {
    if (chatSearchText.trim()) {
      const match = (m.text || '').toLowerCase().includes(chatSearchText.toLowerCase());
      return { ...m, isHighlighted: match };
    }
    return { ...m, isHighlighted: false };
  });

  return (
    <div className="cloudchat-root" data-theme={theme}>
      {/* 1. LEFT WORKSPACE RAIL */}
      <div className="workspace-rail">
        <button 
          className={`workspace-icon-btn ${activeWorkspace === 'amethyst' ? 'active' : ''}`}
          onClick={() => setActiveWorkspace('amethyst')}
          title="Amethyst Cloud (Active)"
        >
          <div className="workspace-pill"></div>
          <i className="fas fa-cube"></i>
        </button>

        <button 
          className={`workspace-icon-btn ${activeWorkspace === 'raast' ? 'active' : ''}`}
          onClick={() => setActiveWorkspace('raast')}
          title="Fintech Rails (Raast MFS)"
        >
          <div className="workspace-pill"></div>
          <i className="fas fa-bolt"></i>
        </button>

        <button 
          className={`workspace-icon-btn ${activeWorkspace === 'crypto' ? 'active' : ''}`}
          onClick={() => setActiveWorkspace('crypto')}
          title="Crypto & Bullion Telemetry"
        >
          <div className="workspace-pill"></div>
          <i className="fas fa-coins"></i>
        </button>

        <div className="rail-divider"></div>

        <button 
          className="workspace-icon-btn" 
          onClick={() => setShowNewChannelModal(true)}
          title="Add New Channel"
        >
          <i className="fas fa-plus"></i>
        </button>

        <div className="rail-bottom">
          <button 
            className="workspace-icon-btn" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? "Switch to Clean Light Mode" : "Switch to Midnight Dark Mode"}
          >
            <i className={theme === 'dark' ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>

          <button 
            className="workspace-icon-btn" 
            onClick={() => setShowProfileModal(true)}
            title="User Profile & Settings"
          >
            <i className="fas fa-gear"></i>
          </button>
        </div>
      </div>

      {/* 2. CHANNELS & DIRECT MESSAGES SIDEBAR */}
      <div className="channels-sidebar">
        {/* Top Branding Bar */}
        <div className="sidebar-top-bar">
          <div className="workspace-branding">
            <div className="branding-logo">
              <i className="fas fa-comments"></i>
            </div>
            <div className="branding-text">
              <h2>CloudChat</h2>
              <span><i className="fas fa-shield-halved"></i> Enterprise SSO</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              className="header-action-btn" 
              onClick={() => setShowNewChannelModal(true)} 
              title="New Channel"
            >
              <i className="fas fa-pen-to-square"></i>
            </button>
          </div>
        </div>

        {/* Live Telemetry Ticker Strip */}
        <div className="telemetry-strip">
          <div className="telemetry-badge">
            <i className="fas fa-circle" style={{ fontSize: '5px' }}></i> LIVE
          </div>
          <div className="telemetry-marquee">
            BTC: <b>$68,410</b> &bull; Gold 24K: <b>Rs. 284,500</b> &bull; USD/PKR: <b>278.45</b>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="sidebar-search-area">
          <div className="search-input-pill">
            <i className="fas fa-magnifying-glass" style={{ color: 'var(--text-muted)' }}></i>
            <input 
              type="text" 
              placeholder="Search channels, people, files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tags */}
        <div className="filter-tags-row">
          <button 
            className={`filter-tag-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Conversations
          </button>
          <button 
            className={`filter-tag-pill ${activeFilter === 'channels' ? 'active' : ''}`}
            onClick={() => setActiveFilter('channels')}
          >
            Channels
          </button>
          <button 
            className={`filter-tag-pill ${activeFilter === 'direct' ? 'active' : ''}`}
            onClick={() => setActiveFilter('direct')}
          >
            Direct
          </button>
          <button 
            className={`filter-tag-pill ${activeFilter === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveFilter('unread')}
          >
            Unread
          </button>
        </div>

        {/* Channels & Chats List */}
        <div className="sidebar-scroll-area">
          <div className="nav-section-header">
            <span>Collaboration Spaces</span>
            <span style={{ fontSize: '10px' }}>{filteredChannels.length} active</span>
          </div>

          {filteredChannels.map(ch => {
            const isActive = ch.id === activeChannelId;
            const lastMsg = ch.messages[ch.messages.length - 1];

            return (
              <div 
                key={ch.id} 
                className={`nav-item-row ${isActive ? 'active' : ''}`}
                onClick={() => setActiveChannelId(ch.id)}
              >
                <div className="nav-item-icon">
                  {ch.avatar ? (
                    <img src={ch.avatar} alt={ch.name} />
                  ) : ch.icon ? (
                    <i className={`fas ${ch.icon}`}></i>
                  ) : (
                    <span>#</span>
                  )}
                </div>

                <div className="nav-item-body">
                  <div className="nav-item-top">
                    <span className="nav-item-name">{ch.name}</span>
                    <span className="nav-item-time">{lastMsg?.time || 'Now'}</span>
                  </div>
                  <div className="nav-item-preview">
                    {lastMsg?.out && (
                      <i className="fas fa-check-double" style={{ fontSize: '11px', color: 'var(--blue-ticks)' }}></i>
                    )}
                    <span>
                      {lastMsg?.isVoiceNote ? "🎤 Voice Note" : lastMsg?.image ? "📷 Photo" : lastMsg?.text || ch.subtitle}
                    </span>
                  </div>
                </div>

                {ch.id === 'sarah-khan' && !isActive && (
                  <div className="unread-pill">1</div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Account Strip at bottom */}
        <div className="sidebar-user-footer">
          <button className="user-profile-anchor" onClick={() => setShowProfileModal(true)}>
            <div className="avatar-wrapper">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                userProfile.name.split(' ').map(n => n[0]).join('')
              )}
              <div className="avatar-online-dot"></div>
            </div>
            <div className="user-text-info">
              <div className="name">{userProfile.name}</div>
              <div className="status">{userProfile.role}</div>
            </div>
          </button>

          <button 
            className="header-action-btn" 
            onClick={() => setShowProfileModal(true)}
            title="Account Settings"
          >
            <i className="fas fa-sliders"></i>
          </button>
        </div>
      </div>

      {/* 3. MAIN CHAT VIEWPORT */}
      <div className="chat-viewport">
        <div className="chat-wallpaper"></div>

        {/* Chat Main Header */}
        <div className="chat-main-header">
          <div className="chat-header-title-block">
            <div className="channel-avatar-box">
              {activeChannel.avatar ? (
                <img src={activeChannel.avatar} alt={activeChannel.name} />
              ) : activeChannel.icon ? (
                <i className={`fas ${activeChannel.icon}`}></i>
              ) : (
                <span>#</span>
              )}
            </div>
            <div className="header-meta">
              <h1>
                {activeChannel.name}
                <span className="header-status-indicator"></span>
              </h1>
              <p>
                <span>{activeChannel.statusText}</span>
              </p>
            </div>
          </div>

          <div className="header-controls">
            <button 
              className="control-btn" 
              onClick={() => startCall('video')}
              title="Start HD Video Call"
            >
              <i className="fas fa-video"></i>
              <span>Meet</span>
            </button>

            <button 
              className="control-btn" 
              onClick={() => startCall('voice')}
              title="Start Voice Call"
            >
              <i className="fas fa-phone"></i>
              <span>Call</span>
            </button>

            <button 
              className={`control-btn control-btn-icon ${isSearchingChat ? 'active' : ''}`}
              onClick={() => setIsSearchingChat(!isSearchingChat)}
              title="Search Messages in this channel"
            >
              <i className="fas fa-magnifying-glass"></i>
            </button>

            <button 
              className={`control-btn control-btn-icon ${showRightPanel ? 'active' : ''}`}
              onClick={() => setShowRightPanel(!showRightPanel)}
              title="Toggle Channel Details"
            >
              <i className="fas fa-sidebar"></i>
            </button>
          </div>
        </div>

        {/* In-Chat Search Bar if active */}
        {isSearchingChat && (
          <div style={{ background: 'var(--bg-card)', padding: '8px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 15 }}>
            <i className="fas fa-search" style={{ color: 'var(--text-muted)' }}></i>
            <input 
              type="text" 
              placeholder="Type to filter conversation..." 
              value={chatSearchText}
              onChange={(e) => setChatSearchText(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px' }}
              autoFocus
            />
            {chatSearchText && (
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>
                {displayedMessages.filter(m => m.isHighlighted).length} matches
              </span>
            )}
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => { setIsSearchingChat(false); setChatSearchText(''); }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Messages Stream */}
        <div className="messages-stream-panel">
          <div className="encryption-banner">
            <i className="fas fa-lock"></i>
            <span>Messages are end-to-end encrypted with zero-knowledge Firestore WebSocket streaming.</span>
          </div>

          <div className="stream-pill-divider">TODAY &bull; REAL-TIME SYNC</div>

          {displayedMessages.map(msg => (
            <div 
              key={msg.id} 
              className={`message-row-wrapper ${msg.out ? 'outgoing' : 'incoming'}`}
            >
              <div 
                className="message-card-box"
                style={{
                  boxShadow: msg.isHighlighted ? '0 0 0 2px var(--warning)' : undefined
                }}
              >
                {/* Message Hover Toolbar */}
                <div className="message-hover-toolbar">
                  <button className="hover-tool-btn" onClick={() => handleToggleReaction(msg.id, '👍')} title="Thumbs Up">👍</button>
                  <button className="hover-tool-btn" onClick={() => handleToggleReaction(msg.id, '❤️')} title="Heart">❤️</button>
                  <button className="hover-tool-btn" onClick={() => handleToggleReaction(msg.id, '🔥')} title="Fire">🔥</button>
                  <button className="hover-tool-btn" onClick={() => handleToggleReaction(msg.id, '🚀')} title="Rocket">🚀</button>
                  <button className="hover-tool-btn" onClick={() => setReplyingTo(msg)} title="Reply Quote">
                    <i className="fas fa-reply"></i>
                  </button>
                </div>

                {/* Author Name */}
                {!msg.out && activeChannel.type === 'channel' && (
                  <div className={`message-author-tag ${msg.authorClass || ''}`}>
                    <span>{msg.sender}</span>
                    {msg.sender.includes('AI') && <span className="badge-bot">BOT</span>}
                  </div>
                )}

                {/* Quoted Reply if any */}
                {msg.replyTo && (
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--primary)', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px', fontSize: '11.5px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{msg.replyTo.sender}</div>
                    <div style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.replyTo.text}</div>
                  </div>
                )}

                {/* Image Preview */}
                {msg.image && (
                  <div className="bubble-image-preview">
                    <img src={msg.image} alt="Attachment" />
                  </div>
                )}

                {/* Voice Note Bubble */}
                {msg.isVoiceNote ? (
                  <div className="voice-note-player">
                    <button 
                      className="vn-toggle-btn"
                      onClick={() => {
                        playIncomingSound();
                        setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id);
                      }}
                    >
                      <i className={`fas ${playingVoiceId === msg.id ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                    <div className="waveform-canvas">
                      {[14, 26, 12, 28, 20, 16, 24, 10, 26, 18, 14, 22, 28, 16, 20, 14, 24, 18].map((h, i) => (
                        <div 
                          key={i} 
                          className={`wave-bar ${playingVoiceId === msg.id && i < 10 ? 'played' : ''}`}
                          style={{ height: `${h}px` }}
                        ></div>
                      ))}
                    </div>
                    <span className="vn-meta-duration">{msg.duration || '0:18'}</span>
                  </div>
                ) : (
                  <div className="message-content-text">
                    {msg.text}
                  </div>
                )}

                {/* Message Meta (Time & Blue Checks) */}
                <div className="bubble-meta-footer">
                  <span>{msg.time}</span>
                  {msg.out && (
                    <i className="fas fa-check-double tick-double read"></i>
                  )}
                </div>

                {/* Reaction Chips */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="reactions-row">
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <div key={emoji} className="reaction-chip" onClick={() => handleToggleReaction(msg.id, emoji)}>
                        <span>{emoji}</span>
                        <span style={{ fontWeight: '700' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Replying banner */}
        {replyingTo && (
          <div style={{ background: 'var(--bg-card)', padding: '6px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <i className="fas fa-reply" style={{ color: 'var(--primary)' }}></i>
              <span>Replying to <b>{replyingTo.sender}</b>: <i>{replyingTo.text}</i></span>
            </div>
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setReplyingTo(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Emoji Popover */}
        {showEmojiPicker && (
          <div className="emoji-tray-popover">
            <div className="emoji-tray-header">
              <span>Frequent Emojis</span>
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setShowEmojiPicker(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="emoji-tray-grid">
              {EMOJI_LIST.map((em, i) => (
                <div key={i} className="emoji-btn-item" onClick={() => setInputText(prev => prev + em)}>
                  {em}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Composer Bar */}
        <div className="chat-composer-bar">
          <button 
            className={`control-btn control-btn-icon ${showEmojiPicker ? 'active' : ''}`}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji Picker"
          >
            <i className="far fa-face-smile"></i>
          </button>

          {/* Hidden File Picker */}
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }}
            accept="image/*,.pdf,.zip"
            onChange={handleFileChange}
          />

          <button 
            className="control-btn control-btn-icon"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Document or Image"
          >
            <i className="fas fa-paperclip"></i>
          </button>

          {isRecording ? (
            <div className="composer-recording-mode">
              <div className="rec-timer-badge">
                <div className="pulsing-rec-circle"></div>
                <span>Recording Audio... {Math.floor(recDuration / 60)}:{recDuration % 60 < 10 ? '0' : ''}{recDuration % 60}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="control-btn control-btn-icon" onClick={() => setIsRecording(false)} title="Cancel">
                  <i className="fas fa-trash-can" style={{ color: 'var(--danger)' }}></i>
                </button>
                <button className="send-trigger-btn" onClick={sendVoiceNote} title="Send Audio Note">
                  <i className="fas fa-check"></i>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="composer-input-field">
                <input 
                  type="text" 
                  placeholder={`Message ${activeChannel.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
              </div>

              {inputText.trim() ? (
                <button className="send-trigger-btn" onClick={() => handleSendMessage()} title="Send Message">
                  <i className="fas fa-paper-plane"></i>
                </button>
              ) : (
                <button 
                  className="control-btn control-btn-icon" 
                  onClick={() => setIsRecording(true)}
                  title="Record Voice Note"
                >
                  <i className="fas fa-microphone"></i>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 4. RIGHT CONTEXTUAL DRAWER (Overview / Members / Files) */}
      <div className={`contextual-panel ${showRightPanel ? '' : 'collapsed'}`}>
        <div className="contextual-header">
          <h3>Channel Intelligence</h3>
          <button 
            className="header-action-btn" 
            onClick={() => setShowRightPanel(false)}
            title="Close Panel"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="contextual-tabs-row">
          <button 
            className={`contextual-tab ${rightPanelTab === 'overview' ? 'active' : ''}`}
            onClick={() => setRightPanelTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`contextual-tab ${rightPanelTab === 'members' ? 'active' : ''}`}
            onClick={() => setRightPanelTab('members')}
          >
            Members ({activeChannel.members.length})
          </button>
          <button 
            className={`contextual-tab ${rightPanelTab === 'files' ? 'active' : ''}`}
            onClick={() => setRightPanelTab('files')}
          >
            Files
          </button>
        </div>

        <div className="contextual-body">
          {rightPanelTab === 'overview' && (
            <>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: 'var(--bg-input)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--primary)', border: '1px solid var(--border-subtle)' }}>
                  {activeChannel.avatar ? (
                    <img src={activeChannel.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover' }} />
                  ) : activeChannel.icon ? (
                    <i className={`fas ${activeChannel.icon}`}></i>
                  ) : (
                    <span>#</span>
                  )}
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{activeChannel.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{activeChannel.subtitle}</p>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Architecture & Transport
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Bi-directional WebSockets on port 3005 with sub-50ms reactive state fanout and encrypted snapshots.
                </p>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Quick Shortcuts
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button className="control-btn" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => startCall('voice')}>
                    <i className="fas fa-phone"></i> Direct Audio Call
                  </button>
                  <button className="control-btn" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => startCall('video')}>
                    <i className="fas fa-video"></i> Video Conference
                  </button>
                </div>
              </div>
            </>
          )}

          {rightPanelTab === 'members' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeChannel.members.map((mem, i) => (
                <div key={i} className="member-item-row">
                  <div className="member-info">
                    <div className="member-avatar">
                      {mem.name[0]}
                    </div>
                    <div className="member-details">
                      <div className="m-name">{mem.name}</div>
                      <div className="m-role">{mem.role}</div>
                    </div>
                  </div>
                  {mem.online && <div className="header-status-indicator" title="Online"></div>}
                </div>
              ))}
            </div>
          )}

          {rightPanelTab === 'files' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="shared-file-card">
                <div className="file-icon"><i className="fas fa-file-pdf"></i></div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '600' }}>cloudchat-architecture-v2.pdf</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>2.4 MB &bull; Uploaded yesterday</div>
                </div>
              </div>

              <div className="shared-file-card">
                <div className="file-icon"><i className="fas fa-file-code"></i></div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '600' }}>firestore-rules.json</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>14 KB &bull; Uploaded today</div>
                </div>
              </div>

              <div className="shared-file-card">
                <div className="file-icon"><i className="fas fa-file-image"></i></div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '600' }}>etaka-android-verified.png</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>540 KB &bull; Uploaded by Sarah</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. CALL MODAL */}
      {callActive && (
        <div className="app-modal-backdrop">
          <div className="app-modal-card" style={{ textAlign: 'center' }}>
            <div className="call-pulse-avatar">
              {activeChannel.avatar ? (
                <img src={activeChannel.avatar} alt="Call" />
              ) : (
                <i className="fas fa-phone"></i>
              )}
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>{activeChannel.name}</h2>
            <div style={{ fontSize: '13.5px', color: 'var(--primary)', marginTop: '4px', fontWeight: '600' }}>
              {callDuration === 0 ? "Connecting Encrypted Stream..." : `Connected &bull; ${Math.floor(callDuration / 60)}:${callDuration % 60 < 10 ? '0' : ''}${callDuration % 60}`}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {callType === 'video' ? "HD Video Stream &bull; Zero Packet Jitter" : "Sub-50ms Ultra-Low Latency Audio"}
            </div>

            <div className="call-buttons-bar">
              <button 
                className={`call-btn-circle ${isMuted ? 'danger' : ''}`}
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute" : "Mute"}
              >
                <i className={isMuted ? "fas fa-microphone-slash" : "fas fa-microphone"}></i>
              </button>

              {callType === 'video' && (
                <button 
                  className={`call-btn-circle ${isVideoOff ? 'danger' : ''}`}
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  title={isVideoOff ? "Start Video" : "Stop Video"}
                >
                  <i className={isVideoOff ? "fas fa-video-slash" : "fas fa-video"}></i>
                </button>
              )}

              <button 
                className="call-btn-circle danger"
                onClick={() => setCallActive(false)}
                title="End Call"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="fas fa-phone-slash"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CREATE CHANNEL MODAL */}
      {showNewChannelModal && (
        <div className="app-modal-backdrop">
          <div className="app-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Create New Collaboration Space</h3>
              <button 
                className="header-action-btn" 
                onClick={() => setShowNewChannelModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreateChannel} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                  CHANNEL NAME
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. devops-clusters or fintech-qa"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', outline: 'none' }}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                  CATEGORY
                </label>
                <select 
                  value={newChannelTag}
                  onChange={(e) => setNewChannelTag(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', outline: 'none' }}
                >
                  <option value="Core">Engineering Core</option>
                  <option value="Crypto">Crypto & Bullion</option>
                  <option value="Fintech">Fintech Gateway</option>
                  <option value="General">General Team</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                  PURPOSE & TOPIC
                </label>
                <textarea 
                  placeholder="What will this channel be used for?"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  rows="3"
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
                />
              </div>

              <button 
                type="submit"
                style={{ background: 'var(--primary)', color: '#020617', border: 'none', borderRadius: '8px', padding: '11px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' }}
              >
                Provision Channel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. USER PROFILE MODAL */}
      {showProfileModal && (
        <div className="app-modal-backdrop">
          <div className="app-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Profile & Identity</h3>
              <button 
                className="header-action-btn" 
                onClick={() => setShowProfileModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #0284c7)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', color: '#fff', boxShadow: '0 4px 14px var(--primary-glow)' }}>
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>
                <i className="fas fa-shield-halved"></i> Google OAuth 2.0 Authenticated
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                  FULL NAME
                </label>
                <input 
                  type="text" 
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                  ROLE & TITLE
                </label>
                <input 
                  type="text" 
                  value={userProfile.role}
                  onChange={(e) => setUserProfile({ ...userProfile, role: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                  STATUS / ABOUT
                </label>
                <input 
                  type="text" 
                  value={userProfile.about}
                  onChange={(e) => setUserProfile({ ...userProfile, about: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                <div style={{ color: 'var(--text-secondary)' }}>SSO Account: <b style={{ color: 'var(--text-primary)' }}>{userProfile.email}</b></div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Phone: <b style={{ color: 'var(--text-primary)' }}>{userProfile.phone}</b></div>
              </div>

              <button 
                onClick={() => setShowProfileModal(false)}
                style={{ background: 'var(--primary)', color: '#020617', border: 'none', borderRadius: '8px', padding: '11px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
