/**
 * scoring.js — Scoring Engine
 * Leadership AI Scenario Simulator
 * 
 * Rule-based scoring across three dimensions:
 * - Trust: Building psychological safety and trust around AI use
 * - AI Literacy: Understanding AI capabilities and limitations
 * - Accountability: Taking ownership of AI-influenced decisions
 */

const DIMENSIONS = {
  trust: { label: 'Trust', icon: '🤝', color: '#0ea5e9', description: 'Building psychological safety and trust around AI use' },
  literacy: { label: 'AI Literacy', icon: '🧠', color: '#8b5cf6', description: 'Understanding AI capabilities and limitations' },
  accountability: { label: 'Accountability', icon: '🎯', color: '#f59e0b', description: 'Taking ownership of AI-influenced decisions' }
};

const RATING_THRESHOLDS = [
  { min: 75, max: 100, badge: 'AI-Enabled Leader', badgeClass: 'rating-excellent',
    description: 'You demonstrate strong leadership in AI contexts. You balance human judgment with AI insights, build trust through transparency, and take accountability for AI-influenced decisions.' },
  { min: 50, max: 74, badge: 'Developing Leader', badgeClass: 'rating-good',
    description: 'Good foundation! You have solid instincts in AI-enabled leadership. Focus on deepening your AI literacy and practicing transparency to reach the next level.' },
  { min: 25, max: 49, badge: 'Emerging Leader', badgeClass: 'rating-fair',
    description: 'You\'re building awareness, but there\'s room to grow. Focus on understanding AI capabilities and limitations, and practice more transparent communication with your team.' },
  { min: 0, max: 24, badge: 'Needs Foundation', badgeClass: 'rating-basic',
    description: 'Start with the basics. Build your AI literacy first — understand what AI can and cannot do. Then practice leading with transparency and accountability.' }
];

class ScoringEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.scores = { trust: 0, literacy: 0, accountability: 0 };
    this.maxPossible = { trust: 0, literacy: 0, accountability: 0 };
    this.history = [];
  }

  /**
   * Record a decision choice and accumulate scores
   * @param {number} decisionId - Decision point number
   * @param {object} option - The selected option with scores
   * @param {string} optionText - The text of the selected option
   */
  recordDecision(decisionId, option, optionText) {
    // Accumulate scores
    this.scores.trust += option.scores.trust;
    this.scores.literacy += option.scores.literacy;
    this.scores.accountability += option.scores.accountability;

    // Track max possible per dimension (20 max per decision per dimension)
    this.maxPossible.trust += 20;
    this.maxPossible.literacy += 20;
    this.maxPossible.accountability += 20;

    // Record history
    this.history.push({
      decisionId,
      optionText,
      trustDelta: option.scores.trust,
      literacyDelta: option.scores.literacy,
      accountabilityDelta: option.scores.accountability,
      feedback: option.feedback
    });
  }

  /**
   * Get percentage scores for each dimension
   * @returns {object} - { trust: 0-100, literacy: 0-100, accountability: 0-100 }
   */
  getPercentages() {
    const pct = {};
    for (const dim of ['trust', 'literacy', 'accountability']) {
      const max = this.maxPossible[dim];
      pct[dim] = max > 0 ? Math.round((this.scores[dim] / max) * 100) : 0;
      // Clamp to 0-100
      pct[dim] = Math.max(0, Math.min(100, pct[dim]));
    }
    return pct;
  }

  /**
   * Get overall score (average of all dimension percentages)
   * @returns {number} - 0-100
   */
  getOverallScore() {
    const pcts = this.getPercentages();
    return Math.round((pcts.trust + pcts.literacy + pcts.accountability) / 3);
  }

  /**
   * Get rating based on overall score
   * @returns {object} - { badge, badgeClass, description }
   */
  getRating() {
    const score = this.getOverallScore();
    return RATING_THRESHOLDS.find(r => score >= r.min && score <= r.max) || RATING_THRESHOLDS[RATING_THRESHOLDS.length - 1];
  }

  /**
   * Get the last recorded decision's score deltas
   * @returns {object|null}
   */
  getLastDelta() {
    if (this.history.length === 0) return null;
    const last = this.history[this.history.length - 1];
    return {
      trust: last.trustDelta,
      literacy: last.literacyDelta,
      accountability: last.accountabilityDelta
    };
  }

  /**
   * Get all results for the results screen
   * @returns {object}
   */
  getResults() {
    return {
      scores: this.scores,
      maxPossible: this.maxPossible,
      percentages: this.getPercentages(),
      overallScore: this.getOverallScore(),
      rating: this.getRating(),
      history: this.history
    };
  }
}
