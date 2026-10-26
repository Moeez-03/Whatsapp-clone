// Pre-populated Enterprise Collaboration Channels & Direct Chats

export const INITIAL_CHANNELS = [
  {
    id: "engineering-core",
    type: "channel",
    tag: "Core",
    tagClass: "tag-core",
    name: "#engineering-core",
    subtitle: "Architecture, CI/CD, React 19 & telemetry",
    avatar: null,
    icon: "fa-code",
    online: true,
    statusText: "6 engineers online · sub-50ms latency",
    members: [
      { name: "Abdul Moeez Nadeem", role: "Lead Systems Architect", online: true },
      { name: "Sarah Khan", role: "Product Principal", online: true },
      { name: "Ali Ahmed", role: "DevOps & Cloud", online: true },
      { name: "Hamza QA", role: "Fintech Test Lead", online: false },
      { name: "Amethyst AI", role: "Autonomous Bot", online: true }
    ],
    messages: [
      {
        id: "m-eng-1",
        sender: "Sarah Khan",
        authorClass: "author-sarah",
        text: "Team, the new eTaka native Android build is verified on API 34. P2P latency is clocked at 84ms! 🚀",
        time: "10:14 AM",
        out: false,
        status: "read"
      },
      {
        id: "m-eng-2",
        sender: "Ali Ahmed",
        authorClass: "author-dev",
        text: "Cloud Kubernetes clusters are scaled horizontally to 8 pods across EU and Asia regions. Zero packet drops.",
        time: "10:18 AM",
        out: false,
        status: "read"
      },
      {
        id: "m-eng-3",
        sender: "You",
        text: "Brilliant work. Deploying the CloudChat real-time messaging pipeline with WebSocket sub-second snapshot streaming now.",
        time: "10:22 AM",
        out: true,
        status: "read"
      },
      {
        id: "m-eng-4",
        sender: "Sarah Khan",
        authorClass: "author-sarah",
        text: "Confirmed! WebSockets connection verified on port 3005. Ready for enterprise stress test.",
        time: "10:25 AM",
        out: false,
        status: "read"
      }
    ]
  },
  {
    id: "crypto-bullion",
    type: "channel",
    tag: "Crypto",
    tagClass: "tag-crypto",
    name: "#crypto-bullion-feed",
    subtitle: "Real-time BTC, ETH & Gold bullion scrapers",
    avatar: null,
    icon: "fa-coins",
    online: true,
    statusText: "Streaming live telemetry feeds",
    members: [
      { name: "Telemetry Engine", role: "Scraper Bot", online: true },
      { name: "Abdul Moeez", role: "Subscriber", online: true }
    ],
    messages: [
      {
        id: "m-cry-1",
        sender: "Telemetry Engine",
        authorClass: "author-dev",
        text: "⚡ [MARKET PULSE]\n• Gold 24K (Tola): Rs. 284,500/tola (+0.8%)\n• Bitcoin (BTC): $68,410.20 (+2.8%)\n• Ethereum (ETH): $2,542.80 (+1.9%)\n• USD / PKR Interbank: 278.45 PKR",
        time: "10:45 AM",
        out: false,
        status: "read"
      },
      {
        id: "m-cry-2",
        sender: "You",
        text: "Can you confirm the K-Electric and LESCO tariff rates?",
        time: "10:48 AM",
        out: true,
        status: "read"
      },
      {
        id: "m-cry-3",
        sender: "Telemetry Engine",
        authorClass: "author-dev",
        text: "📊 Commercial Tariffs: K-Electric peak tariff Rs. 32.40/kWh · LESCO base commercial Rs. 29.80/kWh. All scrapers healthy.",
        time: "10:49 AM",
        out: false,
        status: "read"
      }
    ]
  },
  {
    id: "sarah-khan",
    type: "direct",
    tag: "Direct",
    tagClass: "tag-fintech",
    name: "Sarah Khan (Product Lead)",
    subtitle: "Product specifications & UI signoff",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    icon: null,
    online: true,
    statusText: "Online · Typing...",
    members: [
      { name: "Sarah Khan", role: "Product Principal", online: true },
      { name: "Abdul Moeez", role: "Engineering Lead", online: true }
    ],
    messages: [
      {
        id: "m-sarah-1",
        sender: "Sarah Khan",
        authorClass: "author-sarah",
        text: "Moeez, did you review the new dark luxury theme for CloudChat? The obsidian background with emerald accents looks super high-end!",
        time: "09:30 AM",
        out: false,
        status: "read"
      },
      {
        id: "m-sarah-2",
        sender: "Sarah Khan",
        authorClass: "author-sarah",
        isVoiceNote: true,
        duration: "0:24",
        time: "09:32 AM",
        out: false,
        status: "read"
      },
      {
        id: "m-sarah-3",
        sender: "You",
        text: "Listened to your audio note. Yes, we implemented the exact WhatsApp Web 2026 layout with instant room creation, search drawers, and call simulation.",
        time: "09:35 AM",
        out: true,
        status: "read"
      },
      {
        id: "m-sarah-4",
        sender: "Sarah Khan",
        authorClass: "author-sarah",
        text: "Perfect! Send me a screenshot once you have the local port running smoothly.",
        time: "09:36 AM",
        out: false,
        status: "read"
      }
    ]
  },
  {
    id: "ai-assistant",
    type: "direct",
    tag: "AI",
    tagClass: "tag-ai",
    name: "Amethyst AI Assistant",
    subtitle: "Autonomous Cloud & DevOps AI Agent",
    avatar: null,
    icon: "fa-robot",
    online: true,
    statusText: "Autonomous AI Agent · Active 24/7",
    members: [
      { name: "Amethyst AI", role: "System Intelligence", online: true }
    ],
    messages: [
      {
        id: "m-ai-1",
        sender: "Amethyst AI",
        authorClass: "author-ai",
        text: "Hello Abdul Moeez! I am your autonomous CloudChat AI Agent. You can ask me for code optimization, real-time rate checks, system health summaries, or query explanations.",
        time: "08:00 AM",
        out: false,
        status: "read"
      },
      {
        id: "m-ai-2",
        sender: "You",
        text: "What is the status of our serverless WebSocket event bus?",
        time: "08:02 AM",
        out: true,
        status: "read"
      },
      {
        id: "m-ai-3",
        sender: "Amethyst AI",
        authorClass: "author-ai",
        text: "🟢 All 4 edge nodes reporting <28ms handshake latency. Firestore bi-directional snapshot streaming active. Zero memory leaks detected.",
        time: "08:02 AM",
        out: false,
        status: "read"
      }
    ]
  },
  {
    id: "raast-fintech",
    type: "channel",
    tag: "Fintech",
    tagClass: "tag-fintech",
    name: "#raast-fintech-ops",
    subtitle: "State Bank IBFT & MFS gateway logs",
    avatar: null,
    icon: "fa-bolt",
    online: true,
    statusText: "Real-time payment gateway streaming",
    members: [
      { name: "Raast Gateway", role: "Clearing Engine", online: true },
      { name: "Hamza QA", role: "Test Lead", online: false }
    ],
    messages: [
      {
        id: "m-rst-1",
        sender: "Raast Gateway",
        authorClass: "author-dev",
        text: "✅ Settlement Batch #89201 processed: 14,200 transactions cleared in 420ms. Interbank Raast status: NORMAL.",
        time: "09:05 AM",
        out: false,
        status: "read"
      },
      {
        id: "m-rst-2",
        sender: "Hamza QA",
        text: "Validated automated receipts generation for transaction TXN-46650-ETAKA. Zero reconciliation mismatch.",
        time: "09:12 AM",
        out: false,
        status: "read"
      }
    ]
  },
  {
    id: "ali-ahmed",
    type: "direct",
    tag: "DevOps",
    tagClass: "tag-core",
    name: "Ali Ahmed (DevOps Lead)",
    subtitle: "Cloud infrastructure & Docker clusters",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    icon: null,
    online: true,
    statusText: "Online · Last active just now",
    members: [
      { name: "Ali Ahmed", role: "DevOps Specialist", online: true }
    ],
    messages: [
      {
        id: "m-ali-1",
        sender: "Ali Ahmed",
        text: "Moeez, SSL certificates auto-renewed on all Cloudflare edge proxies. Everything is 100% green.",
        time: "Yesterday",
        out: false,
        status: "read"
      }
    ]
  }
];

export const EMOJI_LIST = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
  "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
  "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮",
  "👍", "👎", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✌️", "🤞",
  "🤟", "🤘", "👌", "🤌", "🤏", "👈", "👉", "👆", "👇", "☝️",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
  "🔥", "✨", "🎉", "🎊", "🚀", "⚡", "💡", "💰", "💵", "💳"
];
