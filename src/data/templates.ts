import { NoteBlock } from "@/contexts/NotesContext";

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  blocks: Omit<NoteBlock, "id">[];
}

const generateBlockId = () => crypto.randomUUID();

export const templates: Template[] = [
  {
    id: "blog-post",
    name: "Blog Post",
    description: "Perfect for writing engaging blog articles with rich formatting",
    icon: "📝",
    color: "from-blue-500/20 to-cyan-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Your Amazing Blog Title",
      },
      {
        type: "callout",
        content: "📌 Hook your readers here - Start with a bold statement or intriguing question",
      },
      {
        type: "text",
        content: "Write a compelling introduction (100-150 words) that sets up the topic and tells readers why they should care about what you're about to share.",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🎯 Main Point 1 - The Core Idea",
      },
      {
        type: "text",
        content: "Develop your first argument with supporting evidence and real-world examples.",
      },
      {
        type: "bullet",
        content: "Key insight or evidence",
      },
      {
        type: "bullet",
        content: "Supporting data or example",
      },
      {
        type: "bullet",
        content: "Relevant statistic or fact",
      },
      {
        type: "quote",
        content: "💭 Add a powerful quote that reinforces your point and resonates with readers",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "💡 Main Point 2 - The Game Changer",
      },
      {
        type: "text",
        content: "Build on your first point with a complementary or contrasting perspective.",
      },
      {
        type: "numbered",
        content: "First reason why this matters",
      },
      {
        type: "numbered",
        content: "Second reason backed by logic",
      },
      {
        type: "numbered",
        content: "Third reason with impact",
      },
      {
        type: "code",
        content: "// Example or code snippet that illustrates your point\nconst example = {\n  concept: \"Practical application\",\n  impact: \"Real-world benefit\"\n}",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "✨ Key Takeaways",
      },
      {
        type: "callout",
        content: "📚 Remember: The main value your readers should get from this article",
      },
      {
        type: "bullet",
        content: "Takeaway 1 - The big idea",
      },
      {
        type: "bullet",
        content: "Takeaway 2 - The practical benefit",
      },
      {
        type: "bullet",
        content: "Takeaway 3 - Next steps",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🚀 Conclusion & Call to Action",
      },
      {
        type: "text",
        content: "Summarize your main points and inspire your readers to take action or think differently.",
      },
      {
        type: "quote",
        content: "💪 End with an empowering statement that motivates action",
      },
    ],
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    description: "Professional meeting capture with agenda, decisions, and tracking",
    icon: "📅",
    color: "from-purple-500/20 to-pink-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Meeting Notes",
      },
      {
        type: "table",
        tableData: [
          ["📅 Date", "🕐 Time", "📍 Location"],
          ["MM/DD/YYYY", "HH:MM - HH:MM", "Zoom / Conference Room"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "👥 Attendees",
      },
      {
        type: "bullet",
        content: "Lead: [Primary organizer]",
      },
      {
        type: "bullet",
        content: "Team: [Other participants]",
      },
      {
        type: "bullet",
        content: "Guest: [External attendees]",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📋 Agenda",
      },
      {
        type: "numbered",
        content: "Welcome & Agenda Review (5 min)",
      },
      {
        type: "numbered",
        content: "Main Topic Discussion (20 min)",
      },
      {
        type: "numbered",
        content: "Key Decisions & Next Steps (10 min)",
      },
      {
        type: "numbered",
        content: "Q&A and Closing (5 min)",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "💬 Key Discussion Points",
      },
      {
        type: "heading3",
        content: "Topic 1",
      },
      {
        type: "text",
        content: "Summary of discussion and main points covered",
      },
      {
        type: "bullet",
        content: "Supporting detail or insight",
      },
      {
        type: "heading3",
        content: "Topic 2",
      },
      {
        type: "text",
        content: "Additional discussion summary",
      },
      {
        type: "bullet",
        content: "Key point from conversation",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "✅ Decisions Made",
      },
      {
        type: "callout",
        content: "🎯 Decision 1: Clear action or outcome decided",
      },
      {
        type: "callout",
        content: "🎯 Decision 2: Another important decision",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📌 Action Items",
      },
      {
        type: "table",
        tableData: [
          ["Action", "Owner", "Due Date", "Priority"],
          ["Action item 1", "Name", "MM/DD/YYYY", "High"],
          ["Action item 2", "Name", "MM/DD/YYYY", "Medium"],
          ["Action item 3", "Name", "MM/DD/YYYY", "Low"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📅 Next Meeting",
      },
      {
        type: "text",
        content: "Scheduled: [Date & Time] | Location: [Details] | Attendees: [Confirm participants]",
      },
    ],
  },
  {
    id: "project-plan",
    name: "Project Plan",
    description: "Track project progress with goals, timeline, and team responsibilities",
    icon: "🚀",
    color: "from-green-500/20 to-emerald-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Project Plan: [Project Name]",
      },
      {
        type: "callout",
        content: "🎯 Project Goal: What we're building and why it matters",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📊 Project Overview",
      },
      {
        type: "text",
        content: "Clear description of objectives, expected outcomes, and business impact.",
      },
      {
        type: "progress",
        progressValue: 0,
        progressColor: "bg-blue-500",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🎯 Goals & Success Metrics",
      },
      {
        type: "numbered",
        content: "Primary goal - Measurable outcome",
      },
      {
        type: "numbered",
        content: "Secondary objective - Additional value delivery",
      },
      {
        type: "numbered",
        content: "Success metric - How we measure achievement",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📋 Scope & Deliverables",
      },
      {
        type: "heading3",
        content: "✅ In Scope",
      },
      {
        type: "bullet",
        content: "Core feature/deliverable",
      },
      {
        type: "bullet",
        content: "Essential component",
      },
      {
        type: "heading3",
        content: "❌ Out of Scope",
      },
      {
        type: "bullet",
        content: "Future enhancement (Phase 2)",
      },
      {
        type: "bullet",
        content: "Potential nice-to-have",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "⏰ Timeline & Milestones",
      },
      {
        type: "table",
        tableData: [
          ["🏁 Milestone", "⏱️ Timeline", "📦 Deliverables", "👤 Owner"],
          ["Planning & Design", "Week 1-2", "Requirements, Wireframes", "PM"],
          ["Development Phase 1", "Week 3-5", "Core features", "Dev Lead"],
          ["Testing & QA", "Week 6-7", "Bug fixes, Optimization", "QA Lead"],
          ["Launch & Deploy", "Week 8", "Release, Docs, Training", "DevOps"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "👥 Team & Roles",
      },
      {
        type: "table",
        tableData: [
          ["Role", "Owner", "Key Responsibilities"],
          ["Project Manager", "[Name]", "Timeline, Communication, Risk"],
          ["Development Lead", "[Name]", "Architecture, Code Quality"],
          ["Designer", "[Name]", "UX/UI, Visual Design"],
          ["QA Lead", "[Name]", "Testing, Quality Assurance"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "⚠️ Risks & Mitigation",
      },
      {
        type: "heading3",
        content: "High Priority Risks",
      },
      {
        type: "bullet",
        content: "Risk: [Issue] → Mitigation: [Solution]",
      },
      {
        type: "bullet",
        content: "Risk: [Issue] → Mitigation: [Solution]",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "✨ Key Assumptions",
      },
      {
        type: "bullet",
        content: "Assumption 1 - Resource availability",
      },
      {
        type: "bullet",
        content: "Assumption 2 - Technology stack",
      },
      {
        type: "bullet",
        content: "Assumption 3 - Stakeholder availability",
      },
    ],
  },
  {
    id: "book-summary",
    name: "Book Summary",
    description: "Comprehensive book notes with quotes, takeaways, and ratings",
    icon: "📚",
    color: "from-orange-500/20 to-red-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Book Summary",
      },
      {
        type: "table",
        tableData: [
          ["📖 Book Title", "✍️ Author", "📅 Year", "📊 Pages"],
          ["Title here", "Author name", "2024", "300"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "⭐ Book Rating",
      },
      {
        type: "rating",
        ratingValue: 5,
        ratingMax: 5,
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📝 Overview",
      },
      {
        type: "text",
        content: "Write a 2-3 sentence summary of the book's main themes and what it's fundamentally about.",
      },
      {
        type: "callout",
        content: "🎯 Main Theme: What is the core message or central argument?",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "💡 Key Concepts & Ideas",
      },
      {
        type: "numbered",
        content: "Core idea 1 - Why it matters",
      },
      {
        type: "numbered",
        content: "Core idea 2 - How it applies",
      },
      {
        type: "numbered",
        content: "Core idea 3 - Real-world impact",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "✍️ Memorable Quotes",
      },
      {
        type: "quote",
        content: "Insert a powerful quote that resonated with you",
      },
      {
        type: "text",
        content: "Why this quote matters and how it connects to the book's message.",
      },
      {
        type: "quote",
        content: "Another impactful passage or revelation from the book",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🚀 Main Takeaways",
      },
      {
        type: "bullet",
        content: "Lesson 1 - What I learned",
      },
      {
        type: "bullet",
        content: "Lesson 2 - How I'll apply it",
      },
      {
        type: "bullet",
        content: "Lesson 3 - Long-term impact",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🤔 Personal Reflection",
      },
      {
        type: "text",
        content: "How did this book resonate with you? What connections can you make to your life? Any contradictions or points of disagreement?",
      },
      {
        type: "callout",
        content: "💭 Personal Insight: Your biggest realization or perspective shift from reading this book",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📚 Recommendations",
      },
      {
        type: "todo",
        content: "Apply key insight #1 to my life",
        checked: false,
      },
      {
        type: "todo",
        content: "Read related book: [Title]",
        checked: false,
      },
      {
        type: "todo",
        content: "Share key takeaway with [Person]",
        checked: false,
      },
    ],
  },
  {
    id: "daily-journal",
    name: "Daily Journal",
    description: "Mindful daily reflection with gratitude, wins, and growth",
    icon: "📔",
    color: "from-pink-500/20 to-rose-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Daily Journal Entry",
      },
      {
        type: "text",
        content: "📅 Date: [MM/DD/YYYY] | 😊 Mood: [Select] | ⚡ Energy: [1-10] | 🌤️ Weather: [Sunny/Rainy]",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🙏 Gratitude Check-in",
      },
      {
        type: "text",
        content: "Start your reflection by acknowledging three things you're grateful for today.",
      },
      {
        type: "bullet",
        content: "Something small but meaningful",
      },
      {
        type: "bullet",
        content: "Someone who made a positive impact",
      },
      {
        type: "bullet",
        content: "An opportunity or experience",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🌟 Today's Wins & Highlights",
      },
      {
        type: "text",
        content: "Celebrate your achievements and positive moments, no matter how small.",
      },
      {
        type: "numbered",
        content: "Achievement or accomplishment",
      },
      {
        type: "numbered",
        content: "Moment of genuine joy or laughter",
      },
      {
        type: "numbered",
        content: "Unexpected blessing or kindness received",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "⚡ Energy & Wellness",
      },
      {
        type: "text",
        content: "How did you feel physically and mentally today?",
      },
      {
        type: "bullet",
        content: "Sleep quality: [Good/Fair/Poor]",
      },
      {
        type: "bullet",
        content: "Exercise/movement: [Activity done]",
      },
      {
        type: "bullet",
        content: "Mental state: [Peaceful/Stressed/Neutral]",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🤔 Challenges & Growth",
      },
      {
        type: "text",
        content: "Reflect on difficulties and what you learned from them.",
      },
      {
        type: "heading3",
        content: "Challenge Encountered",
      },
      {
        type: "text",
        content: "Describe the situation and your emotional response.",
      },
      {
        type: "heading3",
        content: "My Response & Learning",
      },
      {
        type: "bullet",
        content: "How I handled it",
      },
      {
        type: "bullet",
        content: "What I learned",
      },
      {
        type: "bullet",
        content: "How I'll do better next time",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "💭 Personal Reflection",
      },
      {
        type: "text",
        content: "Free-form thoughts about today. What patterns do you notice? Any insights or realizations?",
      },
      {
        type: "callout",
        content: "✨ One key insight from today: [Your realization]",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🚀 Tomorrow's Focus",
      },
      {
        type: "text",
        content: "Set clear intentions for tomorrow.",
      },
      {
        type: "todo",
        content: "🎯 Priority 1 - Most important action",
        checked: false,
      },
      {
        type: "todo",
        content: "💪 Priority 2 - Personal growth goal",
        checked: false,
      },
      {
        type: "todo",
        content: "😊 Priority 3 - Something to look forward to",
        checked: false,
      },
    ],
  },
  {
    id: "research-notes",
    name: "Research Notes",
    description: "Organize research with sources, data analysis, and conclusions",
    icon: "🔬",
    color: "from-indigo-500/20 to-violet-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Research Notes: [Topic]",
      },
      {
        type: "callout",
        content: "🔍 Research Focus: What are you trying to understand or discover?",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "❓ Research Questions",
      },
      {
        type: "numbered",
        content: "Primary question being investigated",
      },
      {
        type: "numbered",
        content: "Secondary questions or sub-topics",
      },
      {
        type: "numbered",
        content: "Related areas to explore",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "💡 Key Findings",
      },
      {
        type: "heading3",
        content: "Finding 1",
      },
      {
        type: "text",
        content: "Description with supporting evidence and data",
      },
      {
        type: "heading3",
        content: "Finding 2",
      },
      {
        type: "text",
        content: "Detailed explanation with source references",
      },
      {
        type: "heading3",
        content: "Finding 3",
      },
      {
        type: "text",
        content: "Research outcome with implications",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📚 Sources & References",
      },
      {
        type: "table",
        tableData: [
          ["📖 Source Title", "📑 Type", "🔗 Link/Citation", "✅ Credibility"],
          ["Source 1", "Journal Article", "URL or DOI", "High"],
          ["Source 2", "Research Paper", "Citation format", "High"],
          ["Source 3", "Book/Report", "ISBN or link", "Medium"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📊 Data & Statistics",
      },
      {
        type: "text",
        content: "Key data points and statistics from your research.",
      },
      {
        type: "code",
        content: "// Research data summary\nresearch_data = {\n  sample_size: 1000,\n  accuracy: 0.95,\n  confidence_interval: 0.99,\n  time_period: \"2023-2024\",\n  methodology: \"Quantitative analysis\"\n}",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🔬 Analysis & Interpretation",
      },
      {
        type: "text",
        content: "Your detailed analysis of what the findings mean and implications.",
      },
      {
        type: "heading3",
        content: "Pattern 1",
      },
      {
        type: "bullet",
        content: "What pattern emerged from the data",
      },
      {
        type: "bullet",
        content: "Why this pattern is significant",
      },
      {
        type: "heading3",
        content: "Pattern 2",
      },
      {
        type: "bullet",
        content: "Additional insight or trend",
      },
      {
        type: "bullet",
        content: "Real-world applications",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🎯 Conclusions & Implications",
      },
      {
        type: "text",
        content: "Summary of main findings and their broader significance.",
      },
      {
        type: "callout",
        content: "🔑 Primary Insight: The most important takeaway from your research",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📌 Next Steps",
      },
      {
        type: "todo",
        content: "Conduct additional research on [Topic]",
        checked: false,
      },
      {
        type: "todo",
        content: "Verify findings with peer review",
        checked: false,
      },
      {
        type: "todo",
        content: "Prepare presentation/paper",
        checked: false,
      },
    ],
  },
  {
    id: "product-spec",
    name: "Product Spec",
    description: "Complete product specification with requirements and success metrics",
    icon: "🎯",
    color: "from-yellow-500/20 to-amber-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Product Specification: [Product Name]",
      },
      {
        type: "callout",
        content: "🚀 Vision: What is this product and why does it matter?",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🎯 Problem Statement",
      },
      {
        type: "text",
        content: "Detailed description of the problem being solved.",
      },
      {
        type: "heading3",
        content: "Target Users",
      },
      {
        type: "bullet",
        content: "User type 1 and their pain point",
      },
      {
        type: "bullet",
        content: "User type 2 and their challenge",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "💡 Proposed Solution",
      },
      {
        type: "text",
        content: "How our product solves the problem and delivers value.",
      },
      {
        type: "heading3",
        content: "Key Value Propositions",
      },
      {
        type: "numbered",
        content: "Primary benefit to users",
      },
      {
        type: "numbered",
        content: "Business advantage or differentiation",
      },
      {
        type: "numbered",
        content: "Long-term impact",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "✨ Features & Requirements",
      },
      {
        type: "heading3",
        content: "🔴 Must-Have Features (MVP)",
      },
      {
        type: "bullet",
        content: "Core Feature 1 - User benefit and usage",
      },
      {
        type: "bullet",
        content: "Core Feature 2 - Key functionality",
      },
      {
        type: "bullet",
        content: "Core Feature 3 - Essential capability",
      },
      {
        type: "heading3",
        content: "🟡 Should-Have Features",
      },
      {
        type: "bullet",
        content: "Enhancement 1 - Improves experience",
      },
      {
        type: "bullet",
        content: "Enhancement 2 - Increases value",
      },
      {
        type: "heading3",
        content: "🟢 Nice-to-Have Features",
      },
      {
        type: "bullet",
        content: "Future feature - Phase 2 or later",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "👥 User Scenarios & Use Cases",
      },
      {
        type: "heading3",
        content: "Primary Use Case",
      },
      {
        type: "numbered",
        content: "User initiates action",
      },
      {
        type: "numbered",
        content: "System processes request",
      },
      {
        type: "numbered",
        content: "User receives result",
      },
      {
        type: "heading3",
        content: "Secondary Use Case",
      },
      {
        type: "text",
        content: "Additional user workflow or scenario",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📊 Success Metrics & KPIs",
      },
      {
        type: "table",
        tableData: [
          ["📈 Metric", "🎯 Target", "⏱️ Timeline", "📊 Current"],
          ["User Adoption", "1,000 users", "3 months", "TBD"],
          ["Monthly Active Users", "60%", "Ongoing", "TBD"],
          ["User Satisfaction", ">4.0/5.0", "Ongoing", "TBD"],
          ["System Performance", "<2s load", "Launch", "TBD"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "🔧 Technical Architecture",
      },
      {
        type: "heading3",
        content: "Tech Stack",
      },
      {
        type: "bullet",
        content: "Frontend: [Framework/Library]",
      },
      {
        type: "bullet",
        content: "Backend: [Language/Framework]",
      },
      {
        type: "bullet",
        content: "Database: [Type and system]",
      },
      {
        type: "heading3",
        content: "API Endpoints",
      },
      {
        type: "code",
        content: "// Core API Endpoints\nPOST   /api/v1/resource       // Create\nGET    /api/v1/resource/:id   // Read\nPUT    /api/v1/resource/:id   // Update\nDELETE /api/v1/resource/:id   // Delete\nGET    /api/v1/resource       // List",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "📅 Timeline & Milestones",
      },
      {
        type: "todo",
        content: "Phase 1: Design & Planning (Week 1-2)",
        checked: false,
      },
      {
        type: "todo",
        content: "Phase 2: Core Development (Week 3-6)",
        checked: false,
      },
      {
        type: "todo",
        content: "Phase 3: Testing & QA (Week 7)",
        checked: false,
      },
      {
        type: "todo",
        content: "Phase 4: Launch & Monitoring (Week 8)",
        checked: false,
      },
    ],
  },
  {
    id: "marketing-plan",
    name: "Marketing Plan",
    description: "Strategic marketing plan with campaigns, channels, and metrics",
    icon: "📢",
    color: "from-red-500/20 to-orange-500/20",
    blocks: [
      { type: "heading1", content: "Marketing Plan: [Year/Quarter]" },
      { type: "callout", content: "🎯 Marketing Goal: Define the overall marketing objective" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📊 Market Analysis" },
      { type: "text", content: "Overview of target market, competition, and opportunities." },
      { type: "heading3", content: "Target Audience" },
      { type: "bullet", content: "Demographic: [Age, location, income]" },
      { type: "bullet", content: "Psychographic: [Values, interests, behaviors]" },
      { type: "heading3", content: "Competitive Landscape" },
      { type: "table", tableData: [["Competitor", "Strengths", "Weaknesses"], ["Comp 1", "[Strength]", "[Weakness]"], ["Comp 2", "[Strength]", "[Weakness]"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💡 Marketing Strategies" },
      { type: "heading3", content: "Strategy 1: Content Marketing" },
      { type: "bullet", content: "Blog posts and articles" },
      { type: "bullet", content: "Social media content" },
      { type: "heading3", content: "Strategy 2: Paid Advertising" },
      { type: "bullet", content: "Google Ads campaigns" },
      { type: "bullet", content: "Social media ads" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📅 Campaign Calendar" },
      { type: "table", tableData: [["Campaign", "Channel", "Timeline", "Budget"], ["Campaign 1", "Social/Email", "Jan-Mar", "$5000"], ["Campaign 2", "Paid/Organic", "Apr-Jun", "$7500"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📈 KPIs & Success Metrics" },
      { type: "table", tableData: [["Metric", "Target", "Current", "Status"], ["Website Traffic", "50% increase", "TBD", "—"], ["Lead Generation", "500 leads", "TBD", "—"], ["Conversion Rate", "3%", "TBD", "—"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💰 Budget Allocation" },
      { type: "table", tableData: [["Channel", "% of Budget", "Amount", "ROI Target"], ["Content", "30%", "$3000", "200%"], ["Paid Ads", "50%", "$5000", "300%"], ["Tools/Tech", "20%", "$2000", "150%"]] },
    ],
  },
  {
    id: "sales-pipeline",
    name: "Sales Pipeline",
    description: "Track deals and sales opportunities through stages",
    icon: "💰",
    color: "from-green-500/20 to-teal-500/20",
    blocks: [
      { type: "heading1", content: "Sales Pipeline - [Month/Quarter]" },
      { type: "text", content: "Track all active opportunities and their progression through sales stages." },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📊 Pipeline Overview" },
      { type: "table", tableData: [["Stage", "Opportunities", "Total Value", "Avg Deal Size"], ["Prospect", "15", "$75,000", "$5,000"], ["Qualified", "10", "$85,000", "$8,500"], ["Proposal", "5", "$55,000", "$11,000"], ["Negotiation", "3", "$45,000", "$15,000"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🎯 Active Deals" },
      { type: "heading3", content: "High Priority Deals" },
      { type: "table", tableData: [["Deal Name", "Client", "Value", "Stage", "Close Date"], ["Deal A", "Company X", "$25,000", "Proposal", "MM/DD/YYYY"], ["Deal B", "Company Y", "$18,000", "Negotiation", "MM/DD/YYYY"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💡 Sales Strategy" },
      { type: "numbered", content: "Follow up with prospects in last 30 days" },
      { type: "numbered", content: "Close 3 major deals this quarter" },
      { type: "numbered", content: "Expand existing customer accounts by 20%" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🔍 Next Actions" },
      { type: "todo", content: "Follow up with [Client Name] - Quote sent", checked: false },
      { type: "todo", content: "Prepare proposal for [Client Name]", checked: false },
      { type: "todo", content: "Schedule product demo for [Client Name]", checked: false },
    ],
  },
  {
    id: "client-proposal",
    name: "Client Proposal",
    description: "Professional proposal template for new business opportunities",
    icon: "📄",
    color: "from-blue-500/20 to-indigo-500/20",
    blocks: [
      { type: "heading1", content: "Proposal: [Project Name]" },
      { type: "heading2", content: "📋 Executive Summary" },
      { type: "text", content: "Brief overview of the proposal and key value proposition for the client." },
      { type: "callout", content: "🎯 Opportunity: What problem we're solving for the client" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🏢 About Our Company" },
      { type: "text", content: "Brief company background and relevant experience." },
      { type: "bullet", content: "Established [Year]" },
      { type: "bullet", content: "X+ years of industry experience" },
      { type: "bullet", content: "[X] successful projects" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💼 Proposed Solution" },
      { type: "text", content: "Detailed description of our solution and approach." },
      { type: "heading3", content: "Phase 1: [Name]" },
      { type: "bullet", content: "Deliverable 1" },
      { type: "bullet", content: "Timeline: [Duration]" },
      { type: "heading3", content: "Phase 2: [Name]" },
      { type: "bullet", content: "Deliverable 2" },
      { type: "bullet", content: "Timeline: [Duration]" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💰 Investment & Pricing" },
      { type: "table", tableData: [["Service", "Quantity", "Unit Price", "Total"], ["Service 1", "1", "$10,000", "$10,000"], ["Service 2", "1", "$5,000", "$5,000"], ["", "", "Subtotal", "$15,000"], ["", "", "Tax (10%)", "$1,500"], ["", "", "TOTAL", "$16,500"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📅 Timeline & Milestones" },
      { type: "text", content: "Project schedule and key deliverable dates." },
      { type: "bullet", content: "Start date: [MM/DD/YYYY]" },
      { type: "bullet", content: "Milestone 1: [MM/DD/YYYY]" },
      { type: "bullet", content: "Completion: [MM/DD/YYYY]" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📞 Next Steps" },
      { type: "numbered", content: "Review proposal and provide feedback" },
      { type: "numbered", content: "Schedule kick-off meeting" },
      { type: "numbered", content: "Sign agreement and commence work" },
    ],
  },
  {
    id: "quarterly-review",
    name: "Quarterly Review",
    description: "Assess performance and plan for next quarter",
    icon: "📈",
    color: "from-violet-500/20 to-purple-500/20",
    blocks: [
      { type: "heading1", content: "Q[X] 20XX Review & Q[X+1] Planning" },
      { type: "callout", content: "📊 Review Period: [Date] to [Date]" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "✅ Achievements This Quarter" },
      { type: "numbered", content: "Major win or milestone achieved" },
      { type: "numbered", content: "Team growth or capacity increase" },
      { type: "numbered", content: "Revenue or metric improvement" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "⚠️ Challenges & Lessons Learned" },
      { type: "heading3", content: "Challenge 1" },
      { type: "text", content: "What went wrong and what we learned" },
      { type: "heading3", content: "Challenge 2" },
      { type: "text", content: "How we'll avoid this in the future" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📊 Key Metrics" },
      { type: "table", tableData: [["Metric", "Target", "Actual", "Status"], ["Revenue", "$50K", "$52.5K", "✅"], ["Customer Acquisition", "50", "45", "⚠️"], ["Retention Rate", "90%", "88%", "⚠️"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🎯 Q[X+1] Goals & Priorities" },
      { type: "numbered", content: "Primary goal for next quarter" },
      { type: "numbered", content: "Secondary objective" },
      { type: "numbered", content: "Stretch goal" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💡 Action Items" },
      { type: "todo", content: "[Team/Person] - Action item with deadline", checked: false },
      { type: "todo", content: "[Team/Person] - Strategic initiative", checked: false },
      { type: "todo", content: "[Team/Person] - Process improvement", checked: false },
    ],
  },
  {
    id: "content-calendar",
    name: "Content Calendar",
    description: "Plan and track content distribution across channels",
    icon: "📅",
    color: "from-pink-500/20 to-rose-500/20",
    blocks: [
      { type: "heading1", content: "Content Calendar - [Month/Quarter]" },
      { type: "text", content: "Plan and schedule all content across marketing channels." },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📋 Content Schedule" },
      { type: "table", tableData: [["Date", "Content Type", "Title", "Channel", "Status"], ["MM/DD", "Blog", "[Title]", "Website", "Planned"], ["MM/DD", "Video", "[Title]", "YouTube", "Planned"], ["MM/DD", "Social", "[Post]", "Instagram", "Scheduled"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🎯 Content Themes" },
      { type: "heading3", content: "Week 1" },
      { type: "text", content: "Theme: [Content theme]" },
      { type: "bullet", content: "Blog post about [topic]" },
      { type: "bullet", content: "Social media series" },
      { type: "heading3", content: "Week 2" },
      { type: "text", content: "Theme: [Content theme]" },
      { type: "bullet", content: "Video tutorial" },
      { type: "bullet", content: "Email newsletter" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "👥 Team Assignments" },
      { type: "table", tableData: [["Owner", "Content Type", "Topic", "Due Date"], ["[Writer]", "Blog", "[Title]", "MM/DD"], ["[Designer]", "Graphic", "[Topic]", "MM/DD"], ["[Video]", "Video", "[Title]", "MM/DD"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📊 Performance Tracking" },
      { type: "text", content: "Monitor performance of published content." },
    ],
  },
  {
    id: "interview-notes",
    name: "Customer Interview",
    description: "Capture insights from customer interviews and feedback",
    icon: "🎤",
    color: "from-cyan-500/20 to-blue-500/20",
    blocks: [
      { type: "heading1", content: "Customer Interview Notes" },
      { type: "table", tableData: [["Date", "Customer", "Contact", "Role"], ["MM/DD/YYYY", "[Company]", "[Name]", "[Title]"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🎯 Interview Objectives" },
      { type: "bullet", content: "Objective 1" },
      { type: "bullet", content: "Objective 2" },
      { type: "bullet", content: "Objective 3" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💬 Key Insights" },
      { type: "heading3", content: "Pain Point 1" },
      { type: "text", content: "Customer's challenge and context" },
      { type: "heading3", content: "Pain Point 2" },
      { type: "text", content: "Another significant challenge identified" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💡 Feedback & Suggestions" },
      { type: "quote", content: "Customer quote or direct feedback" },
      { type: "bullet", content: "Feature suggestion 1" },
      { type: "bullet", content: "Improvement idea 2" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📌 Action Items" },
      { type: "todo", content: "Share findings with team", checked: false },
      { type: "todo", content: "Implement suggested feature", checked: false },
      { type: "todo", content: "Schedule follow-up meeting", checked: false },
    ],
  },
  {
    id: "business-plan",
    name: "Business Plan",
    description: "Comprehensive business plan for startups or ventures",
    icon: "🏢",
    color: "from-amber-500/20 to-yellow-500/20",
    blocks: [
      { type: "heading1", content: "Business Plan: [Company Name]" },
      { type: "callout", content: "🚀 Vision: [Long-term vision statement]" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📝 Executive Summary" },
      { type: "text", content: "One-page overview of the entire business plan." },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🎯 Mission & Values" },
      { type: "heading3", content: "Mission" },
      { type: "text", content: "What we do and why we do it" },
      { type: "heading3", content: "Core Values" },
      { type: "bullet", content: "Value 1" },
      { type: "bullet", content: "Value 2" },
      { type: "bullet", content: "Value 3" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💼 Products & Services" },
      { type: "heading3", content: "Product 1" },
      { type: "text", content: "Description and key features" },
      { type: "heading3", content: "Product 2" },
      { type: "text", content: "Description and benefits" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🎯 Market Opportunity" },
      { type: "text", content: "Market size, growth potential, target audience" },
      { type: "bullet", content: "Market size: $[Amount]" },
      { type: "bullet", content: "Growth rate: [X]% annually" },
      { type: "bullet", content: "Target market share: [X]%" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💰 Financial Projections" },
      { type: "table", tableData: [["Year", "Revenue", "Expenses", "Profit"], ["Year 1", "$[Amount]", "$[Amount]", "$[Amount]"], ["Year 2", "$[Amount]", "$[Amount]", "$[Amount]"], ["Year 3", "$[Amount]", "$[Amount]", "$[Amount]"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "👥 Team & Organization" },
      { type: "table", tableData: [["Role", "Name", "Experience", "Responsibility"], ["CEO", "[Name]", "[Years]", "[Role]"], ["COO", "[Name]", "[Years]", "[Role]"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📊 Funding Requirements" },
      { type: "text", content: "Amount needed and use of funds" },
      { type: "table", tableData: [["Use of Funds", "Amount", "Timeline"], ["Product Development", "$50,000", "Months 1-6"], ["Marketing", "$30,000", "Months 3-12"]] },
    ],
  },
  {
    id: "okr-planning",
    name: "OKR Planning",
    description: "Set quarterly objectives and key results",
    icon: "🎯",
    color: "from-lime-500/20 to-green-500/20",
    blocks: [
      { type: "heading1", content: "OKR Planning - Q[X] 20XX" },
      { type: "text", content: "Define Objectives and Key Results for the quarter." },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🎯 Company Objectives" },
      { type: "heading3", content: "Objective 1: [Title]" },
      { type: "text", content: "Strategic goal for the quarter" },
      { type: "bullet", content: "KR 1: Specific, measurable outcome" },
      { type: "bullet", content: "KR 2: Quantifiable target" },
      { type: "bullet", content: "KR 3: Ambitious goal" },
      { type: "heading3", content: "Objective 2: [Title]" },
      { type: "text", content: "Another strategic focus area" },
      { type: "bullet", content: "KR 1: Measurable result" },
      { type: "bullet", content: "KR 2: Trackable metric" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🔄 Department OKRs" },
      { type: "heading3", content: "Engineering" },
      { type: "bullet", content: "Objective: [Goal]" },
      { type: "bullet", content: "KR: Deploy [feature] by [date]" },
      { type: "heading3", content: "Marketing" },
      { type: "bullet", content: "Objective: [Goal]" },
      { type: "bullet", content: "KR: Achieve [metric] of [target]" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📊 Success Metrics" },
      { type: "table", tableData: [["OKR", "Target", "Current", "Status"], ["Obj 1 - KR 1", "[Target]", "TBD", "—"], ["Obj 1 - KR 2", "[Target]", "TBD", "—"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🔄 Weekly Check-ins" },
      { type: "bullet", content: "Monday: Team syncs and alignment" },
      { type: "bullet", content: "Thursday: Progress updates" },
      { type: "bullet", content: "Friday: Weekly review" },
    ],
  },
  {
    id: "competitor-analysis",
    name: "Competitor Analysis",
    description: "Analyze competitors and market positioning",
    icon: "🔍",
    color: "from-slate-500/20 to-gray-500/20",
    blocks: [
      { type: "heading1", content: "Competitor Analysis" },
      { type: "text", content: "Comprehensive analysis of key competitors." },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🎯 Competitors Tracked" },
      { type: "table", tableData: [["Company", "Founded", "Funding", "Employees"], ["Competitor 1", "2015", "$10M", "50"], ["Competitor 2", "2018", "$25M", "150"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "💪 Strengths & Weaknesses" },
      { type: "heading3", content: "Competitor 1" },
      { type: "heading4", content: "Strengths" },
      { type: "bullet", content: "Strong brand recognition" },
      { type: "bullet", content: "Large customer base" },
      { type: "heading4", content: "Weaknesses" },
      { type: "bullet", content: "High pricing" },
      { type: "bullet", content: "Limited features" },
      { type: "divider", content: "---" },
      { type: "heading2", content: "📊 Competitive Positioning" },
      { type: "table", tableData: [["Feature", "Our Product", "Competitor 1", "Competitor 2"], ["Price", "$$", "$$$", "$$"], ["Speed", "Fast", "Slow", "Fast"], ["Features", "Complete", "Limited", "Moderate"]] },
      { type: "divider", content: "---" },
      { type: "heading2", content: "🎯 Differentiation Strategy" },
      { type: "bullet", content: "Unique feature or capability" },
      { type: "bullet", content: "Superior customer service" },
      { type: "bullet", content: "Better pricing model" },
      { type: "callout", content: "💡 Key Insight: Our competitive advantage is..." },
    ],
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((t) => t.id === id);
};
