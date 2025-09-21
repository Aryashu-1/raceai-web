"use client";

const EllipticalResearchBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0F] via-[#111827] to-[#1E293B]" />

      {/* Main ellipse with subtle glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[80vw] h-[60vh] max-w-6xl">
          {/* Ellipse border with flowing light */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
            <defs>
              <linearGradient
                id="ellipseGlow"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#246CD8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#0052CC" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#246CD8" stopOpacity="0.1" />
                <animateTransform
                  attributeName="gradientTransform"
                  type="rotate"
                  values="0 400 300;360 400 300"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            </defs>

            {/* Main ellipse */}
            <ellipse
              cx="400"
              cy="300"
              rx="350"
              ry="250"
              fill="none"
              stroke="url(#ellipseGlow)"
              strokeWidth="2"
              opacity="0.6"
            />

            {/* Inner ellipse */}
            <ellipse
              cx="400"
              cy="300"
              rx="280"
              ry="200"
              fill="none"
              stroke="#246CD8"
              strokeWidth="1"
              opacity="0.2"
            />
          </svg>

          {/* Research objects floating inside ellipse */}

          {/* DNA Helix */}
          <div
            className="absolute top-[20%] left-[15%] animate-float"
            style={{ animationDelay: "0s", animationDuration: "8s" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
                stroke="#246CD8"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M8 8L16 16M16 8L8 16"
                stroke="#0052CC"
                strokeWidth="1.5"
                opacity="0.8"
              />
              <circle cx="8" cy="8" r="1.5" fill="#246CD8" opacity="0.7" />
              <circle cx="16" cy="16" r="1.5" fill="#0052CC" opacity="0.7" />
            </svg>
          </div>

          {/* Molecule */}
          <div
            className="absolute top-[60%] right-[20%] animate-float"
            style={{ animationDelay: "2s", animationDuration: "10s" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="6" r="2" fill="#246CD8" opacity="0.7" />
              <circle cx="6" cy="18" r="2" fill="#0052CC" opacity="0.7" />
              <circle cx="18" cy="18" r="2" fill="#246CD8" opacity="0.7" />
              <path
                d="M12 8L6 16M12 8L18 16"
                stroke="#0052CC"
                strokeWidth="1.5"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Brain/Neural Network */}
          <div
            className="absolute top-[35%] right-[10%] animate-float"
            style={{ animationDelay: "4s", animationDuration: "12s" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"
                fill="#246CD8"
                opacity="0.6"
              />
              <path
                d="M21 9C21 7.9 20.1 7 19 7C17.9 7 17 7.9 17 9C17 10.1 17.9 11 19 11C20.1 11 21 10.1 21 9Z"
                fill="#0052CC"
                opacity="0.6"
              />
              <path
                d="M7 9C7 7.9 6.1 7 5 7C3.9 7 3 7.9 3 9C3 10.1 3.9 11 5 11C6.1 11 7 10.1 7 9Z"
                fill="#246CD8"
                opacity="0.6"
              />
              <path
                d="M12 22C13.1 22 14 21.1 14 20C14 18.9 13.1 18 12 18C10.9 18 10 18.9 10 20C10 21.1 10.9 22 12 22Z"
                fill="#0052CC"
                opacity="0.6"
              />
              <path
                d="M12 6L5 9M12 6L19 9M5 9L12 18M19 9L12 18"
                stroke="#246CD8"
                strokeWidth="1"
                opacity="0.4"
              />
            </svg>
          </div>

          {/* Microscope */}
          <div
            className="absolute top-[15%] right-[35%] animate-float"
            style={{ animationDelay: "1s", animationDuration: "9s" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 2V6H16V2"
                stroke="#0052CC"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M12 6V10"
                stroke="#246CD8"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="#0052CC"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M6 20H18"
                stroke="#246CD8"
                strokeWidth="1.5"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Chart/Graph */}
          <div
            className="absolute top-[50%] left-[25%] animate-float"
            style={{ animationDelay: "3s", animationDuration: "11s" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 20L9 14L13 18L21 10"
                stroke="#246CD8"
                strokeWidth="2"
                opacity="0.7"
              />
              <circle cx="9" cy="14" r="2" fill="#0052CC" opacity="0.6" />
              <circle cx="13" cy="18" r="2" fill="#246CD8" opacity="0.6" />
              <circle cx="21" cy="10" r="2" fill="#0052CC" opacity="0.6" />
            </svg>
          </div>

          {/* Atom */}
          <div
            className="absolute top-[70%] left-[40%] animate-float"
            style={{ animationDelay: "5s", animationDuration: "7s" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2" fill="#246CD8" opacity="0.8" />
              <ellipse
                cx="12"
                cy="12"
                rx="8"
                ry="3"
                stroke="#0052CC"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
                transform="rotate(45 12 12)"
              />
              <ellipse
                cx="12"
                cy="12"
                rx="8"
                ry="3"
                stroke="#246CD8"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
                transform="rotate(-45 12 12)"
              />
            </svg>
          </div>

          {/* Book/Research */}
          <div
            className="absolute top-[25%] left-[60%] animate-float"
            style={{ animationDelay: "6s", animationDuration: "13s" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
                stroke="#0052CC"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M8 8H16M8 12H16M8 16H12"
                stroke="#246CD8"
                strokeWidth="1"
                opacity="0.7"
              />
            </svg>
          </div>

          {/* Floating particles */}
          <div
            className="absolute top-[10%] left-[50%] w-1 h-1 bg-[#246CD8] rounded-full animate-pulse opacity-60"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute top-[80%] right-[15%] w-1.5 h-1.5 bg-[#0052CC] rounded-full animate-pulse opacity-40"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          />
          <div
            className="absolute top-[45%] left-[10%] w-0.5 h-0.5 bg-[#246CD8] rounded-full animate-pulse opacity-50"
            style={{ animationDuration: "5s", animationDelay: "2s" }}
          />
        </div>
      </div>

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[#246CD8]/5 via-transparent to-transparent" />
    </div>
  );
};

export default EllipticalResearchBackground;
