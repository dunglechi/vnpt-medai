const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(process.env.DB_PATH || './database.sqlite');
    this.init();
  }

  init() {
    // Create tables for token usage tracking
    this.db.serialize(() => {
      // API Usage tracking table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS api_usage (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          provider TEXT NOT NULL,
          model TEXT NOT NULL,
          tokens_used INTEGER NOT NULL,
          cost REAL NOT NULL,
          request_type TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          month TEXT NOT NULL,
          year INTEGER NOT NULL
        )
      `);

      // Monthly budget tracking table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS monthly_budgets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          provider TEXT NOT NULL,
          month TEXT NOT NULL,
          year INTEGER NOT NULL,
          budget_limit REAL NOT NULL,
          current_spend REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(provider, month, year)
        )
      `);

      // Alert notifications table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS alert_notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          provider TEXT NOT NULL,
          alert_type TEXT NOT NULL,
          threshold_percent REAL NOT NULL,
          current_spend REAL NOT NULL,
          budget_limit REAL NOT NULL,
          message TEXT NOT NULL,
          sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          month TEXT NOT NULL,
          year INTEGER NOT NULL
        )
      `);
    });
  }

  // Record API usage
  recordUsage(provider, model, tokens, cost, requestType) {
    const now = new Date();
    const month = now.toISOString().slice(0, 7); // YYYY-MM format
    const year = now.getFullYear();

    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO api_usage (provider, model, tokens_used, cost, request_type, month, year)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([provider, model, tokens, cost, requestType, month, year], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
      stmt.finalize();
    });
  }

  // Get monthly usage for a provider
  getMonthlyUsage(provider, month, year) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          SUM(tokens_used) as total_tokens,
          SUM(cost) as total_cost,
          COUNT(*) as total_requests,
          request_type,
          model
        FROM api_usage 
        WHERE provider = ? AND month = ? AND year = ?
        GROUP BY request_type, model
      `, [provider, month, year], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get current month total spending for a provider
  getCurrentMonthSpending(provider) {
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    const year = now.getFullYear();

    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT SUM(cost) as total_spending
        FROM api_usage 
        WHERE provider = ? AND month = ? AND year = ?
      `, [provider, month, year], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row?.total_spending || 0);
        }
      });
    });
  }

  // Update monthly budget
  updateMonthlyBudget(provider, month, year, budgetLimit) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO monthly_budgets (provider, month, year, budget_limit)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run([provider, month, year, budgetLimit], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
      stmt.finalize();
    });
  }

  // Record alert notification
  recordAlert(provider, alertType, thresholdPercent, currentSpend, budgetLimit, message) {
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    const year = now.getFullYear();

    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO alert_notifications 
        (provider, alert_type, threshold_percent, current_spend, budget_limit, message, month, year)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([provider, alertType, thresholdPercent, currentSpend, budgetLimit, message, month, year], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
      stmt.finalize();
    });
  }

  // Get dashboard data
  getDashboardData() {
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    const year = now.getFullYear();

    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          provider,
          SUM(tokens_used) as total_tokens,
          SUM(cost) as total_cost,
          COUNT(*) as total_requests
        FROM api_usage 
        WHERE month = ? AND year = ?
        GROUP BY provider
      `, [month, year], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = Database;