export default function HeroBook() {
  return (
    <svg
      width="300"
      height="220"
      viewBox="0 0 300 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-10 dark:opacity-5"
    >
      <path
        d="M280 180H40C28.9543 180 20 171.046 20 160V40C20 28.9543 28.9543 20 40 20H280"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M20 160C20 171.046 28.9543 180 40 180H280V190C280 195.523 275.523 200 270 200H50C33.4315 200 20 186.569 20 170V160Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M280 20V180"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M20 160L280 180"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      {/* Pages hint */}
      <path d="M270 30V170" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <path d="M260 30V170" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}
