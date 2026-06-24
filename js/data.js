/**
 * data.js — Scenario Definitions and Scoring Rules
 * Leadership AI Scenario Simulator
 */

const SCENARIOS = [
  {
    id: "performance-review",
    title: "The Performance Review",
    subtitle: "AI in Performance Reviews",
    icon: "📋",
    context: "You're a team lead at a mid-sized tech company. HR has introduced an AI tool that analyzes employee performance data and generates draft reviews. You're piloting it with your team of 8. Some team members are anxious about being evaluated by AI, while others see it as an opportunity for more objective feedback.",
    decisions: [
      {
        id: 1,
        question: "How do you introduce the AI tool to your team?",
        options: [
          {
            text: "Send a detailed email explaining the tool's purpose and schedule individual 1:1s to discuss concerns.",
            scores: { trust: 10, literacy: 10, accountability: 5 },
            feedback: "Good start — email + 1:1s inform the team and create space for individual concerns. However, this approach misses the opportunity for collective discussion and co-creation of norms, which builds stronger team trust."
          },
          {
            text: "Generate AI reviews first, then present them in 1:1s without prior discussion about the tool.",
            scores: { trust: -5, literacy: 5, accountability: -5 },
            feedback: "This approach risks eroding trust. Team members may feel blindsided and perceive the AI as making judgments about them without their input or awareness. Transparency about AI's role should come before, not during, performance discussions."
          },
          {
            text: "Call an all-hands meeting to discuss the tool, address concerns openly, and co-create usage guidelines together.",
            scores: { trust: 20, literacy: 15, accountability: 10 },
            feedback: "Excellent! By involving the team early, being transparent about the tool, and co-creating guidelines, you build psychological safety and shared ownership. This approach balances AI adoption with human-centered leadership."
          }
        ]
      },
      {
        id: 2,
        question: "The AI flags that one of your top performers has declining productivity metrics. Your own observations disagree with this assessment. What do you do?",
        options: [
          {
            text: "Accept the AI assessment and adjust your performance review accordingly — the AI has more data.",
            scores: { trust: -5, literacy: -5, accountability: -10 },
            feedback: "Deferring entirely to AI without critical evaluation undermines your leadership judgment. AI tools are aids, not replacements for managerial insight. You risk demotivating a strong performer if the AI's metrics are incomplete or misleading."
          },
          {
            text: "Investigate further — review the data the AI used, discuss with the employee, and make a balanced decision incorporating both sources.",
            scores: { trust: 15, literacy: 20, accountability: 15 },
            feedback: "Strong approach! You're demonstrating AI literacy by critically evaluating the tool's output, maintaining trust by involving the employee, and taking accountability for the final decision. This is the hallmark of an AI-enabled leader."
          },
          {
            text: "Override the AI completely — you trust your own judgment and don't need an algorithm second-guessing you.",
            scores: { trust: 5, literacy: -5, accountability: 5 },
            feedback: "While you're taking accountability, completely dismissing AI insights may mean missing valuable data patterns. AI tools can surface trends humans miss. A balanced approach — use AI as input, not dictator — is more effective."
          }
        ]
      },
      {
        id: 3,
        question: "A team member asks directly: 'How much weight did the AI have in my final review?' How do you respond?",
        options: [
          {
            text: "Be fully transparent — explain exactly how the AI was used, what you overrode, and why.",
            scores: { trust: 20, literacy: 15, accountability: 20 },
            feedback: "Outstanding! Full transparency builds lasting trust. By clearly delineating AI's role vs. your judgment, you demonstrate accountability and help the team understand AI's appropriate place in people processes."
          },
          {
            text: "Downplay AI's involvement — say it was a minor factor to avoid making them uncomfortable.",
            scores: { trust: -10, literacy: 5, accountability: -10 },
            feedback: "Downplaying AI involvement may seem kind, but it undermines trust if they later discover AI played a larger role. Transparency, even when uncomfortable, builds long-term credibility."
          },
          {
            text: "Explain that AI was a tool that provided data points, but you made the final call based on your own assessment.",
            scores: { trust: 10, literacy: 15, accountability: 15 },
            feedback: "Good balanced response! You acknowledge AI's role while taking ownership of the final decision. This is honest and builds understanding of AI as a tool, not a replacement for human judgment."
          }
        ]
      }
    ]
  },
  {
    id: "ai-rollout",
    title: "The AI Rollout",
    subtitle: "Managing Team Resistance to AI",
    icon: "🔄",
    context: "Your company is adopting an AI coding assistant. Your senior engineer refuses to use it, calling it 'unreliable and a crutch for bad developers.' Meanwhile, junior devs are excited but have started shipping code with subtle bugs from blindly trusting AI suggestions. You need to navigate this divide.",
    decisions: [
      {
        id: 1,
        question: "How do you address the senior engineer's refusal to use the AI tool?",
        options: [
          {
            text: "Mandate usage — make it clear that using the AI assistant is company policy and not optional.",
            scores: { trust: -10, literacy: 5, accountability: 5 },
            feedback: "Mandating tool usage without addressing concerns can backfire. Senior engineers may resist more, and you risk losing valuable team members. Policy enforcement without buy-in creates compliance without commitment."
          },
          {
            text: "Schedule a 1:1 to understand their specific concerns, agree on a trial period with guardrails, and evaluate together.",
            scores: { trust: 20, literacy: 15, accountability: 10 },
            feedback: "Excellent leadership! By listening to concerns, setting up a structured trial, and evaluating collaboratively, you respect their expertise while creating space for evidence-based adoption. This is how you turn resisters into allies."
          },
          {
            text: "Let them opt out entirely — they're experienced enough to make their own choices about tools.",
            scores: { trust: 10, literacy: -5, accountability: -5 },
            feedback: "While respecting autonomy is good, completely opting out creates a two-tier system where the team uses different tools. This can lead to knowledge silos and inconsistent practices. A middle ground is usually better."
          }
        ]
      },
      {
        id: 2,
        question: "Junior devs are shipping AI-generated code with subtle bugs. What action do you take?",
        options: [
          {
            text: "Immediately ban AI tool usage until proper review processes and training are established.",
            scores: { trust: -5, literacy: 5, accountability: 10 },
            feedback: "Banning the tool outright may stop the bugs, but it also stops learning. Junior devs need guidance, not prohibition. A more nuanced approach creates structure while allowing continued skill development."
          },
          {
            text: "Create a mandatory code review checklist specifically for reviewing AI-generated code, paired with senior mentorship.",
            scores: { trust: 15, literacy: 20, accountability: 15 },
            feedback: "Perfect! You're addressing the root cause (lack of review discipline) rather than the symptom (bugs). Pairing juniors with seniors on AI code review builds both skills and bridges the team divide."
          },
          {
            text: "Let them learn through mistakes — trial and error is part of the learning process.",
            scores: { trust: 10, literacy: -5, accountability: -10 },
            feedback: "While learning through mistakes has merit, shipping buggy code to production affects quality and team morale. Structured guidance, not放任 (laissez-faire), is the right approach for AI-assisted development."
          }
        ]
      },
      {
        id: 3,
        question: "The team is now divided — seniors skeptical, juniors over-reliant on AI. How do you create a unified path forward?",
        options: [
          {
            text: "Facilitate a team discussion to co-create AI usage norms, with input from both seniors and juniors, then document agreed practices.",
            scores: { trust: 20, literacy: 20, accountability: 20 },
            feedback: "Outstanding! By facilitating co-creation of norms, you're building a shared framework that everyone owns. This approach bridges the senior-junior divide, leverages diverse perspectives, and creates sustainable AI practices."
          },
          {
            text: "Let each team member decide their own comfort level with AI usage — autonomy over consistency.",
            scores: { trust: 10, literacy: -5, accountability: -10 },
            feedback: "Individual autonomy sounds good, but without team-level norms, you risk inconsistency, knowledge gaps, and unresolved tension. A team discussion to align on shared practices is more effective."
          },
          {
            text: "Escalate to senior management for a company-wide policy on AI tool usage.",
            scores: { trust: -5, literacy: 5, accountability: -5 },
            feedback: "Escalating abdicates your leadership role in this situation. Your team needs you to facilitate alignment, not pass the decision upward. Top-down policies often miss team-specific nuances and reduce buy-in."
          }
        ]
      }
    ]
  }
];
