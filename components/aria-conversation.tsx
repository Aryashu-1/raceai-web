"use client";

import { useState, useEffect } from "react";
import ARIALogo from "./aria-logo";
import { cn } from "@/lib/utils";

interface ARIAConversationProps {
  message: string;
  state?: "idle" | "speaking" | "thinking" | "excited";
  showTyping?: boolean;
  className?: string;
}

export default function ARIAConversation({
  message,
  state = "speaking",
  showTyping = true,
  className,
}: ARIAConversationProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!showTyping) {
      setDisplayedMessage(message);
      setIsTyping(false);
      return;
    }

    setDisplayedMessage("");
    setIsTyping(true);

    let index = 0;
    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedMessage(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [message, showTyping]);

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10",
        className
      )}
    >
      <ARIALogo size="md" state={isTyping ? "speaking" : "idle"} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-medium text-blue-400">ARIA</h3>
          <div className="text-xs text-muted-foreground">
            Advanced Research Intelligence Assistant
          </div>
        </div>
        <p className="text-foreground leading-relaxed">
          {displayedMessage}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
      </div>
    </div>
  );
}
