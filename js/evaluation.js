/**
 * evaluation.js — Summative Evaluation Module
 * Leadership AI Scenario Simulator
 *
 * Captures Kirkpatrick L1 reaction data after each scenario:
 * - 3 Yes/No questions
 * - 1 optional open-ended reflection
 * - Stored in LocalStorage for facilitator retrieval
 */

const EVALUATION_QUESTIONS = [
  {
    id: 'q1',
    text: 'I can apply what I learned in this scenario to my work.',
    type: 'yesno'
  },
  {
    id: 'q2',
    text: 'The AI coaching feedback helped me reflect on my decision-making.',
    type: 'yesno'
  },
  {
    id: 'q3',
    text: 'I feel more prepared to lead AI-enabled teams after this exercise.',
    type: 'yesno'
  },
  {
    id: 'q4',
    text: 'What was your key takeaway from this scenario? (optional)',
    type: 'text'
  }
];

const STORAGE_KEY = 'leadership-ai-evaluations';

class EvaluationManager {

  /**
   * Get all stored evaluation records
   * @returns {Array}
   */
  static getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to read evaluation storage:', e);
      return [];
    }
  }

  /**
   * Check if a scenario has already been evaluated
   * @param {string} scenarioId
   * @returns {boolean}
   */
  static hasBeenEvaluated(scenarioId) {
    const records = this.getAll();
    return records.some(r => r.scenarioId === scenarioId);
  }

  /**
   * Save an evaluation record to LocalStorage
   * @param {object} record - { scenarioId, scenarioTitle, scores, overallScore, rating, evaluation, timestamp }
   */
  static save(record) {
    const records = this.getAll();
    // Replace existing entry for same scenario or append
    const idx = records.findIndex(r => r.scenarioId === record.scenarioId);
    if (idx >= 0) {
      records[idx] = { ...records[idx], ...record, updatedAt: new Date().toISOString() };
    } else {
      records.push({ ...record, createdAt: new Date().toISOString() });
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (e) {
      console.warn('Failed to save evaluation:', e);
      return false;
    }
  }

  /**
   * Render the evaluation form HTML into a container
   * @param {HTMLElement} container
   * @param {string} scenarioId - to check if already evaluated
   */
  static renderForm(container, scenarioId) {
    const alreadyDone = this.hasBeenEvaluated(scenarioId);

    if (alreadyDone) {
      container.innerHTML = `
        <div class="evaluation-panel evaluation-complete">
          <div class="evaluation-header">
            <span class="evaluation-icon">📋</span>
            <h3>Scenario Evaluation</h3>
          </div>
          <p class="evaluation-done-msg">✅ You have already submitted feedback for this scenario. Thank you!</p>
        </div>
      `;
      return;
    }

    let html = `
      <div class="evaluation-panel">
        <div class="evaluation-header">
          <span class="evaluation-icon">📋</span>
          <h3>Quick Feedback</h3>
          <span class="evaluation-badge">Kirkpatrick L1</span>
        </div>
        <p class="evaluation-desc">Help us improve — this takes 30 seconds.</p>
        <div class="evaluation-questions">
    `;

    EVALUATION_QUESTIONS.forEach((q, idx) => {
      if (q.type === 'yesno') {
        html += `
          <div class="eval-question" data-qid="${q.id}">
            <p class="eval-q-text">${idx + 1}. ${q.text}</p>
            <div class="eval-yesno">
              <label class="eval-btn-label">
                <input type="radio" name="eval-${q.id}" value="Yes">
                <span class="eval-btn-option">Yes</span>
              </label>
              <label class="eval-btn-label">
                <input type="radio" name="eval-${q.id}" value="No">
                <span class="eval-btn-option">No</span>
              </label>
            </div>
          </div>
        `;
      } else if (q.type === 'text') {
        html += `
          <div class="eval-question eval-question-text" data-qid="${q.id}">
            <label for="eval-${q.id}" class="eval-q-text">${idx + 1}. ${q.text}</label>
            <textarea id="eval-${q.id}" class="eval-textarea" rows="3" placeholder="Your key takeaway..."></textarea>
          </div>
        `;
      }
    });

    html += `
        </div>
        <div id="eval-error" class="eval-error hidden">Please answer all questions before submitting.</div>
        <button id="btn-submit-evaluation" class="btn btn-primary">Submit Feedback</button>
        <button id="btn-skip-evaluation" class="btn btn-secondary btn-skip">Skip</button>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Collect form data and submit
   * @param {object} context - { scenarioId, scenarioTitle, scores, overallScore, rating }
   * @returns {object|null} - The saved record, or null if validation fails
   */
  static submit(context) {
    const answers = {};
    let valid = true;

    EVALUATION_QUESTIONS.forEach(q => {
      if (q.type === 'yesno') {
        const selected = document.querySelector(`input[name="eval-${q.id}"]:checked`);
        if (!selected) {
          valid = false;
          answers[q.id] = null;
        } else {
          answers[q.id] = selected.value;
        }
      } else if (q.type === 'text') {
        const textarea = document.getElementById(`eval-${q.id}`);
        answers[q.id] = textarea ? textarea.value.trim() : '';
      }
    });

    if (!valid) {
      document.getElementById('eval-error').classList.remove('hidden');
      return null;
    }

    document.getElementById('eval-error').classList.add('hidden');

    const record = {
      scenarioId: context.scenarioId,
      scenarioTitle: context.scenarioTitle,
      scores: context.scores,
      overallScore: context.overallScore,
      rating: context.rating,
      evaluation: answers
    };

    this.save(record);

    // Show thank-you state
    const panel = document.querySelector('.evaluation-panel');
    if (panel) {
      panel.classList.add('evaluation-complete');
      panel.innerHTML = `
        <div class="evaluation-header">
          <span class="evaluation-icon">✅</span>
          <h3>Feedback Submitted</h3>
        </div>
        <p class="evaluation-done-msg">Thank you! Your responses help us improve the simulation.</p>
        <p class="evaluation-done-sub">Your scores and feedback have been saved locally.</p>
      `;
    }

    return record;
  }

  /**
   * Export all evaluation data as a downloadable JSON file
   */
  static exportData() {
    const records = this.getAll();
    if (records.length === 0) {
      alert('No evaluation data to export.');
      return;
    }
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadership-ai-evaluations-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all stored evaluation data
   */
  static clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear evaluations:', e);
    }
  }
}
