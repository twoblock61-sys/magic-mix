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
    description: "Organize research findings with sources, analysis, and conclusions",
    icon: "🔬",
    color: "from-indigo-500/20 to-violet-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Research Notes",
      },
      {
        type: "heading2",
        content: "Research Question",
      },
      {
        type: "text",
        content: "What are you trying to understand or discover?",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Key Findings",
      },
      {
        type: "bullet",
        content: "Finding 1 with supporting evidence",
      },
      {
        type: "bullet",
        content: "Finding 2 with data or reference",
      },
      {
        type: "bullet",
        content: "Finding 3 with source attribution",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Sources & References",
      },
      {
        type: "table",
        tableData: [
          ["Source", "Type", "Link/Citation"],
          ["Source Title", "Article/Book/Study", "URL or citation"],
          ["Another Source", "Report/Paper", "Details"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Data & Statistics",
      },
      {
        type: "text",
        content: "Relevant statistics, numbers, and data points from your research.",
      },
      {
        type: "code",
        content: "// Example data or code snippet\ndata = {\n  sample_size: 1000,\n  success_rate: 0.85,\n  confidence: 0.95\n}",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Analysis & Interpretation",
      },
      {
        type: "text",
        content: "Your analysis of the findings and what they mean.",
      },
      {
        type: "bullet",
        content: "Interpretation 1",
      },
      {
        type: "bullet",
        content: "Interpretation 2",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Conclusions",
      },
      {
        type: "text",
        content: "Final conclusions and implications of your research.",
      },
      {
        type: "callout",
        content: "Key insight: Your main takeaway from this research",
      },
    ],
  },
  {
    id: "product-spec",
    name: "Product Spec",
    description: "Define product requirements and specifications with examples",
    icon: "🎯",
    color: "from-yellow-500/20 to-amber-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Product Specification",
      },
      {
        type: "heading2",
        content: "Problem Statement",
      },
      {
        type: "text",
        content: "What problem are we solving? Who has this problem?",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Proposed Solution",
      },
      {
        type: "text",
        content: "Overview of the solution and how it addresses the problem.",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Features & Requirements",
      },
      {
        type: "heading3",
        content: "Core Features",
      },
      {
        type: "bullet",
        content: "Feature 1 - User benefit",
      },
      {
        type: "bullet",
        content: "Feature 2 - User benefit",
      },
      {
        type: "heading3",
        content: "Nice-to-Have Features",
      },
      {
        type: "bullet",
        content: "Enhancement 1",
      },
      {
        type: "bullet",
        content: "Enhancement 2",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "User Scenarios",
      },
      {
        type: "heading3",
        content: "Scenario 1: Primary Use Case",
      },
      {
        type: "numbered",
        content: "User opens the product",
      },
      {
        type: "numbered",
        content: "User takes action X",
      },
      {
        type: "numbered",
        content: "System responds with Y",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Success Metrics",
      },
      {
        type: "table",
        tableData: [
          ["Metric", "Target", "Unit"],
          ["User Adoption", "1000 users", "in 3 months"],
          ["Retention", "60%", "monthly"],
          ["Performance", "<2s", "load time"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Technical Notes",
      },
      {
        type: "code",
        content: "// Technical implementation notes\napi_endpoints: [\n  POST /api/feature,\n  GET /api/feature/:id,\n  PUT /api/feature/:id\n]",
      },
    ],
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((t) => t.id === id);
};
