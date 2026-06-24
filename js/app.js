/**
 * app.js — Application Controller
 * Leadership AI Scenario Simulator
 */

const App = {
  currentScenario: null,
  currentDecisionIndex: 0,
  totalDecisions: 3,
  engine: new ScoringEngine(),

  /** Initialize the app */
  init() {
    this.bindEvents();
    this.updateEvalRecordCount();
    this.showScreen('welcome-screen');
  },

  /** Bind all DOM events */
  bindEvents() {
    // Welcome screen
    document.getElementById('btn-start').addEventListener('click', () => this.showScenarioSelect());

    // Scenario selection
    document.getElementById('btn-back').addEventListener('click', () => this.showScenarioSelect());

    // Decision submission
    document.getElementById('btn-submit').addEventListener('click', () => this.submitDecision());

    // Continue to next decision
    document.getElementById('btn-continue').addEventListener('click', () => this.nextDecision());

    // Results actions
    document.getElementById('btn-retry').addEventListener('click', () => this.startScenario(this.currentScenario.id));
    document.getElementById('btn-back-scenarios').addEventListener('click', () => this.showScenarioSelect());
    document.getElementById('btn-download-csv').addEventListener('click', () => EvaluationManager.exportCSV());

    // Evaluation (delegated — rendered dynamically)
    document.addEventListener('click', (e) => {
      if (e.target.id === 'btn-submit-evaluation') {
        this.submitEvaluation();
      }
      if (e.target.id === 'btn-skip-evaluation') {
        this.skipEvaluation();
      }
    });

    // Evaluator tools
    document.getElementById('btn-eval-csv').addEventListener('click', () => EvaluationManager.exportCSV());
    document.getElementById('btn-eval-json').addEventListener('click', () => EvaluationManager.exportData());
    document.getElementById('btn-eval-clear').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete ALL evaluation data? This cannot be undone.')) {
        EvaluationManager.clearAll();
        this.updateEvalRecordCount();
      }
    });
  },

  /** Show a screen by ID */
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  /** Render and show scenario selection */
  showScenarioSelect() {
    this.showScreen('scenario-select-screen');
    const container = document.getElementById('scenario-cards');
    container.innerHTML = '';

    SCENARIOS.forEach(s => {
      const card = document.createElement('div');
      card.className = 'scenario-card';
      card.innerHTML = `
        <div class="card-icon">${s.icon}</div>
        <h3>${s.title}</h3>
        <p>${s.subtitle}</p>
        <p class="card-context-preview">${s.context.substring(0, 100)}...</p>
      `;
      card.addEventListener('click', () => this.startScenario(s.id));
      container.appendChild(card);
    });

    this.updateEvalRecordCount();
  },

  /** Start a scenario */
  startScenario(scenarioId) {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    this.currentScenario = scenario;
    this.currentDecisionIndex = 0;
    this.totalDecisions = scenario.decisions.length;
    this.engine.reset();

    // Update UI
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('context-text').textContent = scenario.context;

    this.showScreen('scenario-screen');
    this.renderDecision();
  },

  /** Render the current decision point */
  renderDecision() {
    const decision = this.currentScenario.decisions[this.currentDecisionIndex];
    const isComplete = this.currentDecisionIndex >= this.totalDecisions;

    if (isComplete) {
      this.showResults();
      return;
    }

    // Update progress
    const progressPct = ((this.currentDecisionIndex) / this.totalDecisions) * 100;
    document.querySelector('.progress-fill').style.width = progressPct + '%';
    document.getElementById('decision-current').textContent = this.currentDecisionIndex + 1;
    document.getElementById('decision-total').textContent = this.totalDecisions;

    // Reset panels
    document.getElementById('decision-panel').classList.remove('hidden');
    document.getElementById('feedback-panel').classList.add('hidden');

    // Render question and options
    document.getElementById('decision-question').textContent = decision.question;
    const optionsContainer = document.getElementById('decision-options');
    optionsContainer.innerHTML = '';

    decision.options.forEach((opt, idx) => {
      const label = document.createElement('label');
      label.className = 'option-item';
      label.innerHTML = `
        <input type="radio" name="decision-option" value="${idx}">
        <span class="option-text">${opt.text}</span>
      `;
      label.addEventListener('click', () => this.selectOption(label, idx));
      optionsContainer.appendChild(label);
    });

    // Reset submit button
    document.getElementById('btn-submit').disabled = true;
    this.selectedOptionIndex = -1;
  },

  /** Handle option selection */
  selectOption(labelElement, idx) {
    // Deselect all
    document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
    // Select this one
    labelElement.classList.add('selected');
    labelElement.querySelector('input[type="radio"]').checked = true;
    this.selectedOptionIndex = idx;
    document.getElementById('btn-submit').disabled = false;
  },

  /** Submit the current decision */
  submitDecision() {
    if (this.selectedOptionIndex < 0) return;

    const decision = this.currentScenario.decisions[this.currentDecisionIndex];
    const option = decision.options[this.selectedOptionIndex];

    // Record the decision
    this.engine.recordDecision(this.currentDecisionIndex + 1, option, option.text);

    // Brief delay then show feedback
    document.getElementById('decision-panel').classList.add('hidden');
    setTimeout(() => {
      this.showFeedback(option);
    }, 400);
  },

  /** Show feedback after a decision */
  showFeedback(option) {
    document.getElementById('feedback-panel').classList.remove('hidden');
    document.getElementById('feedback-text').textContent = option.feedback;

    // Show score changes
    const changesContainer = document.getElementById('score-changes');
    changesContainer.innerHTML = '<h4>Score Changes</h4>';
    const delta = this.engine.getLastDelta();

    const dims = [
      { key: 'trust', label: 'Trust', icon: '🤝' },
      { key: 'literacy', label: 'AI Literacy', icon: '🧠' },
      { key: 'accountability', label: 'Accountability', icon: '🎯' }
    ];

    dims.forEach(dim => {
      const val = delta[dim.key];
      const sign = val >= 0 ? '+' : '';
      const cls = val >= 0 ? 'positive' : 'negative';
      const pct = this.engine.getPercentages()[dim.key];

      const el = document.createElement('div');
      el.className = 'score-change-row';
      el.innerHTML = `
        <span class="change-label">${dim.icon} ${dim.label}</span>
        <span class="change-value ${cls}">${sign}${val}</span>
        <div class="change-bar-container">
          <div class="change-bar" style="width: ${pct}%; background: ${DIMENSIONS[dim.key].color};"></div>
        </div>
        <span class="change-pct">${pct}%</span>
      `;
      changesContainer.appendChild(el);
    });
  },

  /** Advance to next decision or show results */
  nextDecision() {
    this.currentDecisionIndex++;
    if (this.currentDecisionIndex >= this.totalDecisions) {
      this.showResults();
    } else {
      this.renderDecision();
    }
  },

  /** Show final results */
  showResults() {
    const results = this.engine.getResults();

    // Update progress to full
    document.querySelector('.progress-fill').style.width = '100%';

    // Hide decision and feedback panels
    document.getElementById('decision-panel').classList.add('hidden');
    document.getElementById('feedback-panel').classList.add('hidden');

    this.showScreen('results-screen');

    // Set scenario name
    document.getElementById('results-scenario-name').textContent = this.currentScenario.title;

    // Render dimension scores
    const scoresContainer = document.getElementById('dimension-scores');
    scoresContainer.innerHTML = '';

    const dims = [
      { key: 'trust', label: 'Trust', icon: '🤝' },
      { key: 'literacy', label: 'AI Literacy', icon: '🧠' },
      { key: 'accountability', label: 'Accountability', icon: '🎯' }
    ];

    dims.forEach(dim => {
      const pct = results.percentages[dim.key];
      const raw = this.engine.scores[dim.key];
      const max = this.engine.maxPossible[dim.key];

      const el = document.createElement('div');
      el.className = 'score-dimension';
      el.innerHTML = `
        <div class="score-dim-header">
          <span>${dim.icon} ${dim.label}</span>
          <span class="score-dim-value">${pct}%</span>
        </div>
        <div class="score-dim-bar-container">
          <div class="score-dim-bar" style="width: ${pct}%; background: ${DIMENSIONS[dim.key].color};"></div>
        </div>
        <div class="score-dim-raw">${raw}/${max} points</div>
      `;
      scoresContainer.appendChild(el);
    });

    // Render overall rating
    const rating = results.rating;
    document.getElementById('rating-badge').className = `rating-badge ${rating.badgeClass}`;
    document.getElementById('rating-badge').textContent = rating.badge;
    document.getElementById('rating-description').textContent = rating.description;

    // Render evaluation form
    const evalContainer = document.getElementById('evaluation-container');
    EvaluationManager.renderForm(evalContainer, this.currentScenario.id);
  },

  /** Submit evaluation feedback */
  submitEvaluation() {
    const context = {
      scenarioId: this.currentScenario.id,
      scenarioTitle: this.currentScenario.title,
      scores: {
        trust: this.engine.scores.trust,
        literacy: this.engine.scores.literacy,
        accountability: this.engine.scores.accountability
      },
      overallScore: this.engine.getOverallScore(),
      rating: this.engine.getRating().badge
    };
    EvaluationManager.submit(context);
    this.updateEvalRecordCount();
  },

  /** Skip evaluation */
  skipEvaluation() {
    const panel = document.querySelector('.evaluation-panel');
    if (panel) {
      panel.classList.add('evaluation-complete');
      panel.innerHTML = `
        <div class="evaluation-header">
          <span class="evaluation-icon">⏭️</span>
          <h3>Skipped</h3>
        </div>
        <p class="evaluation-done-msg">No problem! You can always come back and complete another scenario.</p>
      `;
    }
  },

  /** Update evaluator record count display */
  updateEvalRecordCount() {
    const el = document.getElementById('eval-record-count');
    if (!el) return;
    const records = EvaluationManager.getAll();
    const count = records.length;
    el.textContent = count > 0
      ? `${count} scenario${count > 1 ? 's' : ''} completed with evaluation feedback.`
      : 'No evaluation data recorded yet.';
  }
};

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
