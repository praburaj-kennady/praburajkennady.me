import { BlinkingSquares } from "@/components/blinking-squares";

/* A holding page while the site is being built. The squares rise from the
   foot of the window and thin out well before the message, so it always
   reads on the plain page colour. */
export default function Home() {
  return (
    <main className="holding">
      <BlinkingSquares
        className="holding-squares"
        direction="bottom"
        cellSize={10}
        squareSize={0.6}
        fadeStart={0.6}
        twinkleSpeed={0.4}
        opacity={0.55}
      />
      <h1>Building. Breaking. Rebuilding.</h1>
    </main>
  );
}
