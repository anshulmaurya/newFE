import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Notes from "@/pages/notes";

export default function UART() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [location, setLocation] = useLocation();

  // Add scroll listener for header background opacity
  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const navigateToFeatures = () => {
    setLocation("/#features");
  };
  
  const navigateToProblems = () => {
    setLocation("/dashboard");
  };

  // Determine theme classes
  const themeClasses = darkMode 
    ? {
        bg: "bg-[rgb(24,24,26)]",
        text: "text-gray-300",
        textDark: "text-gray-500",
        borderColor: "border-gray-700",
        highlight: "bg-[rgb(214,251,65)]/20",
        codeBlock: "bg-gray-900 text-gray-100",
        card: "bg-[rgb(36,36,38)] border-gray-700 hover:bg-[rgb(45,45,47)]"
      }
    : {
        bg: "bg-white",
        text: "text-gray-700",
        textDark: "text-gray-500",
        borderColor: "border-gray-200",
        highlight: "bg-[rgb(214,251,65)]/20",
        codeBlock: "bg-gray-900 text-gray-100",
        card: "bg-gray-50 border-gray-200 hover:bg-gray-100"
      };

  return (
    <Notes />
  );
}