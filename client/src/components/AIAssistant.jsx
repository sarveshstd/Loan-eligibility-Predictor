/**
 * AI Assistant Component
 * 
 * Chatbot interface for loan-related queries
 */

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const suggestedQuestions = [
  'What is CIBIL score?',
  'How to improve loan eligibility?',
  'Difference between government and private bank loans?',
  'EMI calculation explanation',
  'Tips to increase approval chances'
];

const AIAssistant = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Hello! I\'m your loan eligibility assistant. Ask me anything about loans, CIBIL scores, EMI calculations, or tips to improve your eligibility!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/ai/chat`, {
        message: inputMessage
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I couldn\'t process your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleQuestionClick = async (question) => {
    setInputMessage(question);
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/ai/chat`, {
        message: question
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I couldn\'t process your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-neon-blue to-primary-600 flex items-center justify-center shadow-lg hover:shadow-neon-blue/50 transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'rotate-90' : ''
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-full max-w-md h-[600px] glass-card flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-dark-600/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-primary-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-dark-400 text-xs">Loan Eligibility Expert</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`chat-bubble ${
                    message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="chat-bubble chat-bubble-ai">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-dark-400 text-xs mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="text-xs px-3 py-1 bg-dark-700/50 border border-dark-600 rounded-full text-dark-300 hover:border-neon-blue hover:text-neon-blue transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-dark-600/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 input-field text-sm py-2"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !inputMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-neon-blue to-primary-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
