import React, { useState, useEffect } from 'react';
import { TrackUsageRequest } from '../types';
import apiService from '../services/api';

interface TestPanelProps {
  onUsageTracked: () => void;
}

const TestPanel: React.FC<TestPanelProps> = ({ onUsageTracked }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<TrackUsageRequest>({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    tokens: 100,
    requestType: 'input',
  });

  const providers = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'gemini', label: 'Gemini' },
  ];

  const models = {
    openai: ['gpt-3.5-turbo', 'gpt-4'],
    gemini: ['gemini-pro', 'gemini-pro-vision'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await apiService.trackUsage(formData);
      setMessage(`✅ Successfully tracked ${formData.tokens} tokens for ${formData.provider}`);
      onUsageTracked();
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTest = async (tokens: number) => {
    setIsLoading(true);
    setMessage('');

    try {
      await apiService.trackUsage({
        ...formData,
        tokens,
      });
      setMessage(`✅ Quick test: tracked ${tokens} tokens for ${formData.provider}`);
      onUsageTracked();
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="test-panel">
      <h3>🧪 Test API Usage Tracking</h3>
      
      <form onSubmit={handleSubmit} className="test-form">
        <div className="form-row">
          <div className="form-group">
            <label>Provider:</label>
            <select
              value={formData.provider}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  provider: e.target.value,
                  model: models[e.target.value as keyof typeof models][0],
                })
              }
            >
              {providers.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Model:</label>
            <select
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            >
              {models[formData.provider as keyof typeof models].map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tokens:</label>
            <input
              type="number"
              value={formData.tokens}
              onChange={(e) =>
                setFormData({ ...formData, tokens: parseInt(e.target.value) })
              }
              min="1"
              max="10000"
            />
          </div>

          <div className="form-group">
            <label>Type:</label>
            <select
              value={formData.requestType}
              onChange={(e) =>
                setFormData({ ...formData, requestType: e.target.value })
              }
            >
              <option value="input">Input</option>
              <option value="output">Output</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Tracking...' : 'Track Usage'}
          </button>
          
          <div className="quick-tests">
            <span>Quick Tests:</span>
            <button
              type="button"
              onClick={() => handleQuickTest(1000)}
              disabled={isLoading}
            >
              1K Tokens
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest(5000)}
              disabled={isLoading}
            >
              5K Tokens
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest(10000)}
              disabled={isLoading}
            >
              10K Tokens
            </button>
          </div>
        </div>
      </form>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default TestPanel;