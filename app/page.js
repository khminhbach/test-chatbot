'use client'
// Importing necessary modules
import React, { useState } from "react";
import openAI from "openai";
import "../style/chatbox.css"; // Importing the CSS file

// Create an instance of openAI class with provided API key
const openai = new openAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Define the Home component
export default function Home() {
  // State variables
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle user input
  const handleUserInput = async () => {
    setIsLoading(true);
    setChatHistory((prevChat) => [
      ...prevChat,
      {role: 'user', content: userInput},
    ]);

    const chatCompletion = await openai.chat.completions.create({
      messages: [...chatHistory, {role: 'assistant', content: userInput}],
      model: 'gpt-3.5-turbo',
    });

    setChatHistory((prevChat) => [
      ...prevChat,
      {role: 'assistant', content: chatCompletion.choices[0].message.content},
    ]);

    setUserInput('');
    setIsLoading(false);
  }

  // Return JSX
  return ( 
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-heading">Course Companion AI</div>
        <p className="chat-subheading">Ask me anything!</p>
        <div className="chat-history">
          {/* Render chat history */}
          {chatHistory.map((message, index) => (
            <div key={index} className={`${message.role === 'user' ? 'user-message-container' : 'assistant-message-container'}`}>
              <div className={`message-bubble ${message.role === 'user' ? 'user-message-bubble' : 'assistant-message-bubble'}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="input-button-container">
          <input
            type="text"
            placeholder="Ask me something..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="input-field"
          />
          {isLoading ? (
            <div className="loading">
              Loading...
            </div>
          ) : (
            <button
              onClick={handleUserInput}
              className="button"
            >
              Ask
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
