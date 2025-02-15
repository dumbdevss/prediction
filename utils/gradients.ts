const gradients = [
  "linear-gradient(to right, #86efac, #3b82f6, #9333ea)", // green to blue to purple
  "linear-gradient(to right, #f9a8d4, #d8b4fe, #818cf8)", // pink to purple to indigo
  "linear-gradient(to right, #fef9c3, #fde047, #eab308)", // light yellow to yellow
  "linear-gradient(to right, #bbf7d0, #4ade80, #22c55e)", // light green to green
  "linear-gradient(to right, #93c5fd, #60a5fa, #3b82f6)", // light blue to blue
  "linear-gradient(to right, #c7d2fe, #fecaca, #fef9c3)", // indigo to red to yellow
  "linear-gradient(to right, #fecaca, #fca5a5, #fef08a)", // red to light yellow
  "linear-gradient(to right, #bbf7d0, #86efac, #3b82f6)", // green to blue
  "linear-gradient(to right, #c084fc, #ec4899, #ef4444)", // purple to pink to red
  "linear-gradient(to right, #fef08a, #bbf7d0, #22c55e)", // yellow to green
];

export function getRandomGradient() {
  return gradients[Math.floor(Math.random() * gradients.length)]
}

