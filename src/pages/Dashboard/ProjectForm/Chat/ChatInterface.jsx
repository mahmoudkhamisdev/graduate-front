"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Copy, Presentation } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Textarea } from "src/components/ui/textarea";
import { cn } from "src/lib/utils";
import { askAgiantWithMessages } from "src/lib/ai-agiant";
import MarkdownRenderer from "src/components/Dashboard/Chat/MarkdownRenderer";
import { usePresentation } from "src/context/presentation-context";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { SecondaryButton } from "../../../../components/common/Customs/SecondaryButton";

export default function ChatInterface() {
  const location = useLocation();
  const { id } = useParams();
  const content = location?.state?.content;
  const prompt = location?.state?.prompt;

  const navigate = useNavigate();
  const { project, setProject } = usePresentation();

  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const conversationContextRef = useRef([]);

  const [inputValue, setInputValue] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageSections, setMessageSections] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [completedMessages, setCompletedMessages] = useState(new Set());

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Inject project content once
  useEffect(() => {
    if (project && messages.length === 0) {
      const messageId = Date.now().toString();
      const systemMessage = {
        id: messageId,
        content: content || !project.content,
        type: "system",
        completed: true,
        timestamp: Date.now(),
      };

      setStreamingMessageId(messageId);
      setCompletedMessages((prev) => new Set(prev).add(messageId));
      setStreamingContent(content || !project.content);

      // Add the initial project prompt and content to conversation history
      addToConversationHistory({
        role: "user",
        parts: [{ text: prompt || project.prompt }],
      });

      addToConversationHistory({
        role: "model",
        parts: [{ text: content || !project.content }],
      });

      setMessages([systemMessage]);
      setIsStreaming(false);
      setStreamingContent("");
    }
  }, [project, messages.length]);

  // Organize messages into sections
  useEffect(() => {
    if (messages.length === 0) {
      setMessageSections([]);
      return;
    }

    const sections = [];
    let currentSection = {
      id: `section-${Date.now()}-0`,
      messages: [],
      isNewSection: false,
      sectionIndex: 0,
    };

    messages.forEach((message) => {
      if (message.newSection) {
        if (currentSection.messages.length > 0) {
          sections.push({ ...currentSection, isActive: false });
        }
        const newSectionId = `section-${Date.now()}-${sections.length}`;
        currentSection = {
          id: newSectionId,
          messages: [message],
          isNewSection: true,
          isActive: true,
          sectionIndex: sections.length,
        };
      } else {
        currentSection.messages.push(message);
      }
    });

    if (currentSection.messages.length > 0) {
      sections.push(currentSection);
    }

    setMessageSections(sections);
  }, [messages]);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const addToConversationHistory = (message) => {
    // Add the new message
    conversationContextRef.current = [
      ...conversationContextRef.current,
      message,
    ];
  };

  // Process AI response using askAgiantWithMessages (no streaming)
  const processAIResponse = async (userMessage) => {
    try {
      setIsStreaming(true);

      // Add user message to conversation history (Gemini format for compatibility)
      addToConversationHistory({
        role: "user",
        parts: [{ text: userMessage }],
      });

      const messageId = Date.now().toString();
      setStreamingMessageId(messageId);

      // Show thinking indicator
      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          content: "Thinking...",
          type: "system",
          isThinking: true,
          timestamp: Date.now(),
        },
      ]);

      setTimeout(() => {
        navigator.vibrate(50);
      }, 200);

      // Build OpenAI-format messages from conversation history
      const messages = [
        {
          role: "system",
          content:
            "You are a helpful AI presentation and marketing plan assistant. Provide clear, structured, and professional responses.",
        },
        ...(conversationContextRef.current || []).map((msg) => ({
          role: msg.role === "model" ? "assistant" : msg.role,
          content: msg.parts?.map((p) => p.text).join("") ?? "",
        })),
      ];

      // Single non-streaming call
      const fullResponse = await askAgiantWithMessages(messages);

      // Save assistant response to history
      addToConversationHistory({
        role: "model",
        parts: [{ text: fullResponse }],
      });

      // Update the message with the final response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: fullResponse,
                completed: true,
                isThinking: false,
              }
            : msg,
        ),
      );

      setProject((prev) => ({ ...prev, content: fullResponse }));
      setCompletedMessages((prev) => new Set(prev).add(messageId));
      setStreamingMessageId(null);
      setIsStreaming(false);
      setStreamingContent("");
      navigator.vibrate(50);

      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content:
            "Sorry, I encountered an error while generating a response. Please try again.",
          type: "system",
          completed: true,
          timestamp: Date.now(),
        },
      ]);
      setStreamingMessageId(null);
      setIsStreaming(false);
      setStreamingContent("");
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (!isStreaming) {
      setInputValue(newValue);
      if (newValue.trim() !== "" && !hasTyped) {
        setHasTyped(true);
      } else if (newValue.trim() === "" && hasTyped) {
        setHasTyped(false);
      }
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.max(24, Math.min(textarea.scrollHeight, 160));
        textarea.style.height = `${newHeight}px`;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      navigator.vibrate(50);
      const userMessage = inputValue.trim();
      const shouldAddNewSection = messages.length > 0;
      const newUserMessage = {
        id: `user-${Date.now()}`,
        content: userMessage,
        type: "user",
        newSection: shouldAddNewSection,
        timestamp: Date.now(),
      };
      setInputValue("");
      setHasTyped(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      setMessages((prev) => [...prev, newUserMessage]);
      textareaRef.current?.focus();
      processAIResponse(userMessage);
    }
  };

  const handleKeyDown = (e) => {
    if (!isStreaming && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Update the clearChat function to properly clear the conversation history
  const clearChat = () => {
    setMessages([]);
    setMessageSections([]);
    setCompletedMessages(new Set());
    conversationContextRef.current = [];
  };

  const renderMessage = (message) => {
    const isCompleted = completedMessages.has(message.id);
    const isCurrentlyStreaming = message.id === streamingMessageId;
    const isThinking = message.isThinking;

    return (
      <div
        key={message.id}
        className={cn(
          "flex flex-col",
          message.type === "user" ? "items-end" : "items-start",
        )}
      >
        <div className="flex items-center mb-1">
          <span className="text-xs text-gray-500">
            {formatTimestamp(message.timestamp)}
          </span>
          <span className="text-xs font-medium ml-2 text-gray-500">
            {message.type === "user" ? "You" : "AI Assistant"}
          </span>
          {isThinking && (
            <span className="text-xs font-medium ml-2 text-main">
              Thinking...
            </span>
          )}
        </div>
        <div
          className={cn(
            "max-w-[100%] px-4 rounded-2xl",
            message.type === "user" &&
              "bg-zinc-900 border border-zinc-700 rounded-br-none",
            isThinking && "border border-main/30 bg-main/5",
          )}
        >
          {message.type === "user" && (
            <MarkdownRenderer content={message.content} />
          )}

          {message.type === "system" && isCompleted && (
            <MarkdownRenderer content={message.content} />
          )}

          {message.type === "system" && isCurrentlyStreaming && (
            <div className="streaming-text">
              <MarkdownRenderer content={streamingContent} />
              <span className="inline-block w-4 h-4 rounded-full bg-primary animate-pulse ms-0.5"></span>
            </div>
          )}

          {message.type === "system" && isThinking && !isCurrentlyStreaming && (
            <div className="thinking-text">
              <MarkdownRenderer content={message.content} />
              <span className="inline-block w-4 h-4 rounded-full bg-main animate-pulse ms-0.5"></span>
            </div>
          )}
        </div>

        {message.type === "system" && message.completed && (
          <div className="flex items-center gap-2 px-1 mt-1 mb-2">
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              onClick={() => {
                window.navigator.clipboard.writeText(message.content);
                alert("Copied to clipboard!");
              }}
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!content && !project.content)
    return <Navigate to="/project-form" replace />;

  return (
    <div className="flex flex-col overflow-hidden relative h-[calc(100svh-6rem)]">
      {/* Separate Clear Chat Button */}
      <div className="absolute top-4 right-4 z-10">
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          className="text-gray-500 hover:text-red-500"
        >
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Clear Chat</span>
        </Button> */}
        <SecondaryButton
          onClick={() => {
            navigate(`/presentation/${id}`, {
              state: { content: content || project?.content },
            });
          }}
          variant="outline"
          className="mb-4"
        >
          <Presentation className="me-2 h-4 w-4" />
          Show Presentation
        </SecondaryButton>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-grow pb-32 mb-24 pt-12 px-4 overflow-auto relative"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {messageSections.map((section) => (
            <div key={section.id}>
              <div>
                {section.messages.map((message) => renderMessage(message))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto backdrop-blur-md"
        >
          <div
            className={cn(
              "relative w-full rounded-3xl bg-zinc-900 border border-zinc-700 p-3 cursor-text",
              isStreaming && "opacity-80",
            )}
          >
            <div className="flex items-end justify-between gap-4">
              <Textarea
                ref={textareaRef}
                placeholder={
                  isStreaming ? "Waiting for response..." : "Ask Anything"
                }
                className="w-full rounded-3xl border-0 bg-transparent placeholder:text-gray-400 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-2 pr-4 pt-0 pb-0 resize-none overflow-y-auto leading-tight"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full h-8 w-8 border-0 flex-shrink-0 transition-all duration-200 hover:bg-white/80",
                  hasTyped ? "bg-white scale-110" : "bg-gray-200",
                )}
                disabled={!inputValue.trim() || isStreaming}
              >
                <ArrowUp
                  className={cn(
                    "h-4 w-4 transition-colors",
                    hasTyped ? "text-black" : "text-gray-500",
                  )}
                />
                <span className="sr-only">Submit</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
