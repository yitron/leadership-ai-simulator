/**
 * simulator.js — Scenario State Management
 * Leadership AI Scenario Simulator
 */

class Simulator {
  constructor(scoringEngine) {
    this.scoring = scoringEngine;
    this.currentScenario = null;
    this.currentDecisionIndex = 0;
    this.selectedOptionIndex = -1;
    this.isProcessing = false;
  }

  /**
   * Load a scenario and reset state
   * @param {string} scenarioId 
   */
  loadScenario(scenarioId) {
    this.currentScenario = SCENARIOS.find(s => s.id === scenarioId);
    this.currentDecisionIndex = 0;
    this.selectedOptionIndex = -1;
    this.isProcessing = false;
    this.scoring.reset();
    return this.currentScenario;
  }

  /**
   * Get the current decision object
   * @returns {object|null}
   */
  getCurrentDecision() {
    if (!this.currentScenario) return null;
    return this.currentScenario.decisions[this.currentDecisionIndex] || null;
  }

  /**
   * Get total number of decisions in current scenario
   * @returns {number}
   */
  getTotalDecisions() {
    if (!this.currentScenario) return 0;
    return this.currentScenario.decisions.length;
  }

  /**
   * Get progress info
   * @returns {object} - { current, total, percent }
   */
  getProgress() {
    const total = this.getTotalDecisions();
    return {
      current: this.currentDecisionIndex + 1,
      total: total,
      percent: total > 0 ? ((this.currentDecisionIndex) / total) * 100 : 0
    };
  }

  /**
   * Select an option for the current decision
   * @param {number} optionIndex 
   */
  selectOption(optionIndex) {
    this.selectedOptionIndex = optionIndex;
  }

  /**
   * Submit the current decision (records scores, returns feedback)
   * @returns {object} - { feedback, deltas }
   */
  submitDecision() {
    if (this.selectedOptionIndex < 0 || !this.getCurrentDecision()) return null;

    const decision = this.getCurrentDecision();
    const option = decision.options[this.selectedOptionIndex];

    this.scoring.recordDecision(
      this.currentDecisionIndex + 1,
      option,
      option.text
    );

    this.isProcessing = true;
    return {
      feedback: option.feedback,
      deltas: {
        trust: option.scores.trust,
        literacy: option.scores.literacy,
        accountability: option.scores.accountability
      }
    };
  }

  /**
   * Advance