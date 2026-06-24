# 🎯 DEFINE: Leadership AI Scenario Simulator

**Phase**: DEFINE (4D Methodology)
**Priority**: P0
**Effort Estimate**: 1 day
**Dependencies**: None (standalone static site)
**Status**: ✅ Specification Complete

## 1. Executive Summary

**Problem**: Leaders in corporate organisations are not effectively managing or leveraging AI-enabled teams. There is no hands-on simulator for practicing leadership decisions in AI contexts.

**Solution**: A standalone HTML/CSS/JS static web application that simulates corporate leadership scenarios with AI context. Users make decisions at branching points, receive rule-based scoring across leadership dimensions (Trust, AI Literacy, Accountability), and get contextual feedback. No external API dependencies — fully mocked.

## 2. Current State Analysis

### What Already Exists
- DISCOVER document with findings, gap analysis, priority matrix
- 4D Methodology template

### What's Missing
- Working simulator prototype
- Scenario content for 2 core scenarios (3 decision points each)
- Scoring engine with rule-based feedback
- Deployment configuration for Railway

## 3. Detailed Specification

### 3.1 Application Structure (Static Site)

**Tech**: HTML5 + CSS3 + Vanilla JavaScript (ES6 modules not required — single-file JS for simplicity)

**File Structure**:
```
leadership-ai-simulator/
├── DISCOVER_LeadershipAI_Simulator.md   # PRD (from DISCOVER phase)
├── DEFINE_Simulator_App.md              # This spec
├── BUILD_STATUS.md                      # Status tracking
├── railway.json                          # Railway deployment config
├── index.html                           # Main HTML (entry point)
├── css/
│   └── style.css                        # Styles
├── js/
│   ├── app.js                           # App entry, routing, event binding
│   ├── data.js                          # Scenario data + decision points + scoring rules
│   ├── simulator.js                     # Scenario engine (routing, state management)
│   └── scoring.js                       # Scoring engine (dimensions, thresholds, feedback)
└── README.md                            # Setup/deploy instructions
```

### 3.2 Scenarios (2 Core Scenarios)

**Scenario 1: "The Performance Review" — AI in Performance Reviews**
- **Context**: You're a team lead at a mid-sized tech company. HR has introduced an AI tool that analyzes employee performance data and generates draft reviews. You're piloting it with your team of 8.
- **Decision 1**: How do you introduce the AI tool to your team?
  - Option A: Send an email explaining the tool and schedule 1:1s
  - Option B: Have the AI generate reviews first, then discuss with each person
  - Option C: Call a team meeting to discuss concerns and co-create usage guidelines
- **Decision 2**: The AI flags that one of your top performers has declining productivity. You disagree.
  - Option A: Accept the AI assessment and adjust the review
  - Option B: Investigate the data, discuss with the employee, then decide
  - Option C: Override the AI — you trust your own judgment more
- **Decision 3**: A team member asks how much weight the AI had in their final review.
  - Option A: Be transparent about AI's role and your overrides
  - Option B: Downplay AI's involvement to avoid discomfort
  - Option C: Explain it's a tool, but you made the final call

**Scenario 2: "The AI Rollout" — Managing Team Resistance to AI**
- **Context**: Your company is adopting an AI coding assistant. Your senior engineer refuses to use it, calling it "unreliable." Junior devs are excited but making errors from blindly trusting AI suggestions.
- **Decision 1**: How do you address the senior engineer's refusal?
  - Option A: Mandate usage — company policy is company policy
  - Option B: Have a 1:1 to understand concerns, agree on a trial with guardrails
  - Option C: Let them opt out — they're experienced enough to choose
- **Decision 2**: Junior devs are shipping AI-generated code with bugs. What do you do?
  - Option A: Ban AI tool usage until proper review processes are in place
  - Option B: Create a code review checklist specifically for AI-generated code
  - Option C: Let them learn through mistakes — it's part of the process
- **Decision 3**: The team is now split — seniors vs. juniors on AI usage. You need a path forward.
  - Option A: Set team-wide AI usage norms with input from both sides
  - Option B: Let each team member decide their own AI usage level
  - Option C: Escalate to management for a top-down policy

### 3.3 Scoring Dimensions

Three leadership dimensions, each scored 0–100:

| Dimension | Description | Scoring Criteria |
|-----------|-------------|------------------|
| **Trust** | Building psychological safety and trust around AI use | Transparent communication, respecting concerns, balancing AI + human judgment |
| **AI Literacy** | Understanding AI capabilities and limitations | Critical evaluation of AI outputs, appropriate AI delegation, setting guardrails |
| **Accountability** | Taking ownership of AI-influenced decisions | Transparency about AI's role, owning final decisions, establishing norms |

### 3.4 Scoring Rules

Each option in each decision point has predefined point values for each dimension:

- **Best choice**: +15–20 points across relevant dimensions
- **Decent choice**: +5–10 points
- **Poor choice**: -5 to +5 points (or negative for bad practices)

**Score Thresholds for Final Feedback**:
- **75–100**: "AI-Enabled Leader" — You demonstrate strong leadership in AI contexts
- **50–74**: "Developing Leader" — Good foundation, room to grow in specific areas
- **25–49**: "Emerging Leader" — Need to build awareness and skills
- **0–24**: "Needs Foundation" — Focus on AI literacy basics

### 3.5 UI/UX Requirements

- **Welcome Screen**: Project title, brief intro, "Start" button
- **Scenario Selection**: Card-based layout showing 2 scenarios with descriptions
- **Scenario View**: 
  - Context panel (shows scenario background)
  - Progress indicator (Decision 1/3, 2/3, 3/3)
  - Decision display with 3 options (radio buttons or buttons)
  - Submit button
- **Feedback Panel**: 
  - After each decision: contextual feedback + dimension score changes (animated)
  - "Continue" button to proceed
- **Results Screen**:
  - Final scores for each dimension (visual bars/graphs)
  - Overall rating with description
  - Option to retry or go back to scenario selection
- **Responsive**: Works on desktop and tablet (768px+)
- **Visual Style**: Clean, modern, professional — blue/teal color palette

### 3.6 Scoring Engine Logic

```javascript
// data structure
scenario = {
  id: "performance-review",
  title: "...",
  context: "...",
  decisions: [
    {
      id: 1,
      question: "...",
      options: [
        { text: "...", scores: { trust: 15, literacy: 10, accountability: 5 }, feedback: "..." },
        { text: "...", scores: { trust: 5, literacy: 5, accountability: 15 }, feedback: "..." },
        { text: "...", scores: { trust: 20, literacy: 5, accountability: 10 }, feedback: "..." }
      ]
    }
  ]
}

// scoring calculation
totalScores = { trust: 0, literacy: 0, accountability: 0 }
maxPossible = { trust: 60, literacy: 60, accountability: 60 } // 3 decisions * 20 max per dimension
percentage = (dimensionScore / maxPossible) * 100
overallScore = average of all three percentages
```

## 4. Testing Strategy

### 4.1 Manual Testing Checklist
- [ ] Welcome screen loads correctly
- [ ] Both scenarios selectable and launch correctly
- [ ] All 3 decision points render for each scenario
- [ ] Selection persists (clicking option highlights it)
- [ ] Feedback shows after each decision with score changes
- [ ] Continue button advances to next decision
- [ ] Results screen shows correct accumulated scores
- [ ] Score bars render correctly
- [ ] Overall rating matches score thresholds
- [ ] Dim level/loading state shown during "AI processing" (mocked delay)
- [ ] Responsive layout works on different screen sizes
- [ ] No console errors

## 5. Deployment Strategy

### 5.1 Railway Deployment
- Static site deployment via Railway CLI
- `railway.json` configuration for static site
- Single command: `railway up`

**Total**: Manual testing (13 checkpoints), 0 automated tests (static site MVP)
**Status**: ✅ Specification Complete
**Next Phase**: DEVELOP
**Assignee**: AI Assistant
