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
    description: "Comprehensive project planning with timeline, goals, and milestones",
    icon: "🚀",
    color: "from-green-500/20 to-emerald-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Project Plan",
      },
      {
        type: "heading2",
        content: "Project Overview",
      },
      {
        type: "text",
        content: "Provide a clear description of the project, its objectives, and expected outcomes.",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Goals & Objectives",
      },
      {
        type: "bullet",
        content: "Primary goal - What success looks like",
      },
      {
        type: "bullet",
        content: "Secondary objective - Additional value",
      },
      {
        type: "bullet",
        content: "Key metrics - How we measure success",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Scope",
      },
      {
        type: "heading3",
        content: "In Scope",
      },
      {
        type: "bullet",
        content: "Feature/deliverable 1",
      },
      {
        type: "bullet",
        content: "Feature/deliverable 2",
      },
      {
        type: "heading3",
        content: "Out of Scope",
      },
      {
        type: "bullet",
        content: "Item that won't be included",
      },
      {
        type: "bullet",
        content: "Future enhancement idea",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Timeline & Milestones",
      },
      {
        type: "table",
        tableData: [
          ["Phase", "Duration", "Deliverables"],
          ["Phase 1: Planning", "Week 1-2", "Requirements, Design"],
          ["Phase 2: Development", "Week 3-6", "Core features"],
          ["Phase 3: Testing", "Week 7", "QA, Bug fixes"],
          ["Phase 4: Launch", "Week 8", "Release, Documentation"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Team & Resources",
      },
      {
        type: "bullet",
        content: "Project Manager: [Name]",
      },
      {
        type: "bullet",
        content: "Development Lead: [Name]",
      },
      {
        type: "bullet",
        content: "Designer: [Name]",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Risks & Mitigation",
      },
      {
        type: "text",
        content: "Identify potential risks and how they will be addressed.",
      },
      {
        type: "bullet",
        content: "Risk: Technical complexity - Mitigation: Spike analysis",
      },
      {
        type: "bullet",
        content: "Risk: Resource availability - Mitigation: Cross-training",
      },
    ],
  },
  {
    id: "book-summary",
    name: "Book Summary",
    description: "Capture key insights and takeaways from books you read",
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
          ["Book Title", "Author", "Year"],
          ["Book name", "Author name", "2024"],
        ],
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Overview",
      },
      {
        type: "text",
        content: "Brief summary of what the book is about and its main themes.",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Key Concepts",
      },
      {
        type: "bullet",
        content: "Core idea 1",
      },
      {
        type: "bullet",
        content: "Core idea 2",
      },
      {
        type: "bullet",
        content: "Core idea 3",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Memorable Quotes",
      },
      {
        type: "quote",
        content: "Add an impactful quote from the book",
      },
      {
        type: "quote",
        content: "Another important passage",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Main Takeaways",
      },
      {
        type: "numbered",
        content: "What you learned",
      },
      {
        type: "numbered",
        content: "How you'll apply it",
      },
      {
        type: "numbered",
        content: "Future reading recommendations",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Personal Reflection",
      },
      {
        type: "text",
        content: "Your thoughts on the book, how it resonated with you, and any connections to your life.",
      },
    ],
  },
  {
    id: "daily-journal",
    name: "Daily Journal",
    description: "Reflect on your day with gratitude, mood, and insights",
    icon: "📔",
    color: "from-pink-500/20 to-rose-500/20",
    blocks: [
      {
        type: "heading1",
        content: "Daily Journal Entry",
      },
      {
        type: "text",
        content: "Date: [MM/DD/YYYY] | Mood: 😊 | Energy Level: ⚡⚡⚡",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "What I'm Grateful For",
      },
      {
        type: "bullet",
        content: "Something small",
      },
      {
        type: "bullet",
        content: "Something meaningful",
      },
      {
        type: "bullet",
        content: "Someone I appreciate",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Highlights of Today",
      },
      {
        type: "bullet",
        content: "Achievement or positive moment",
      },
      {
        type: "bullet",
        content: "Moment of joy",
      },
      {
        type: "bullet",
        content: "Unexpected blessing",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Challenges I Faced",
      },
      {
        type: "text",
        content: "Describe any difficulties and how you handled them.",
      },
      {
        type: "bullet",
        content: "Challenge and how I'll overcome it",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Personal Reflections",
      },
      {
        type: "text",
        content: "Free-form thoughts about today, learnings, and insights.",
      },
      {
        type: "divider",
        content: "---",
      },
      {
        type: "heading2",
        content: "Tomorrow's Focus",
      },
      {
        type: "todo",
        content: "Priority 1 - Important task",
        checked: false,
      },
      {
        type: "todo",
        content: "Priority 2 - Goal to work towards",
        checked: false,
      },
      {
        type: "todo",
        content: "Priority 3 - Something to look forward to",
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
