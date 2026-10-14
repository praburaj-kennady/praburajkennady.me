import type { SVGProps } from "react";

/* The pixel drawings from the Figma file, exported as SVG. They draw in
   currentColor, so they take the colour of the text around them and
   follow light and dark. The character, the two marks, the notes, the
   heart and the sparkles are from Streamline's Pixel set. */

type IconProps = SVGProps<SVGSVGElement>;

/** A figure in headphones, the home page's picture. At rest he is the
    plain drawing. While data-listening is set (HeroPortrait) he listens to a slow song:
    his eyes close (open, half, shut) and stay closed, notes drift up past
    his ear and fade, a heart beats beside him, and sparkles blink. The
    notes, heart and sparkles are from the same Figma frame; they sit
    outside the drawing's 240 × 240 box and take no room. It moves as
    pixel art does, a frame at a time; the steps are in globals.css. */
/** The figure in headphones as the Figma Logo component's Light variant
    draws him, less his eyes: 22 paths on a 240 × 240 grid of 21 pixels a
    side. Figure adds the eyes in their frames. */
const FIGURE = [
  "M222.862 97.1625H234.262V142.838H222.862V97.1625Z",
  "M74.2875 97.1625H85.6875V85.6875H97.1625V74.2875H142.837V85.6875H154.312V74.2875H188.587V85.6875H199.987V177.113H211.462V154.313H222.862V142.838H211.462V97.1625H222.862V85.6875H211.462V40.0125H199.987V51.4125H188.587V40.0125H165.712V28.5375H85.6875V40.0125H74.2875V51.4125H62.8875V74.2875H51.4125V40.0125H40.0125V74.2875H28.6125V85.6875H74.2875V97.1625Z",
  "M188.588 177.112H199.988V188.587H188.588V177.112Z",
  "M188.588 28.5375H199.988V40.0125H188.588V28.5375Z",
  "M177.112 154.312H188.587V165.712H177.112V154.312Z",
  "M177.112 17.1375H188.587V28.5375H177.112V17.1375Z",
  "M85.6875 188.588V211.5H62.8875V222.9H40.0125V234.3H222.863V222.9H199.988V211.5H177.113V200.025H188.588V188.625L85.6875 188.588ZM165.713 222.863H120.038V211.5H97.1625V200.025H165.75L165.713 222.863Z",
  "M142.838 165.713H177.113V177.113H142.838V165.713Z",
  "M131.438 154.312H142.838V165.712H131.438V154.312Z",
  "M120.037 85.6875H142.837V97.1625H120.037V85.6875Z",
  "M85.6875 97.1625H97.1625V142.838H85.6875V97.1625Z",
  "M74.2875 5.7375H177.112V17.1375H74.2875V5.7375Z",
  "M74.2875 177.112H85.6875V188.587H74.2875V177.112Z",
  "M74.2875 142.838H85.6875V154.313H74.2875V142.838Z",
  "M28.6125 154.312V165.712H62.8875V177.112H74.2875V154.312H28.6125Z",
  "M62.8875 17.1375H74.2875V28.5375H62.8875V17.1375Z",
  "M51.4125 28.5375H62.8875V40.0125H51.4125V28.5375Z",
  "M40.0125 97.1625H51.4125V108.563H40.0125V97.1625Z",
  "M28.6125 108.562H40.0125V131.437H28.6125V108.562Z",
  "M17.1375 142.838H28.6125V154.313H17.1375V142.838Z",
  "M17.1375 85.6875H28.6125V97.1625H17.1375V85.6875Z",
  "M5.73749 97.1625H17.1375V142.838H5.73749V97.1625Z",
];
/* His eyes in three frames: open, two pixels tall; half shut, the upper
   pixel; shut, a line two pixels wide at the lid, running in towards the
   nose. */
const EYES_OPEN = [
  "M120.037 119.962H131.437V142.837H120.037V119.962Z",
  "M177.112 119.962H188.587V142.837H177.112V119.962Z",
];
const EYES_HALF = [
  "M120.037 119.962H131.437V131.4H120.037V119.962Z",
  "M177.112 119.962H188.587V131.4H177.112V119.962Z",
];
const EYES_SHUT = [
  "M120.037 119.962H142.837V131.4H120.037V119.962Z",
  "M165.712 119.962H188.587V131.4H165.712V119.962Z",
];

/* The same figure as the Figma Logo component's Dark variant draws him:
   his outline filled, his features cut out of it, on a 44-unit grid of
   about 1.92 a pixel. It is scaled up to the 240 box. */
const DARK_SCALE = 240 / 44;
const DARK_FIGURE = [
  "M29.7053 35.4757L29.6991 39.322H22.0063V37.4079H18.1541V35.4757H29.7053Z",
  "M34.3748 1.92297H36.3072V3.84253H38.2271V5.77554H40.1594V13.4663H42.0802V15.3993H44V28.6012H42.0802V30.5342H40.1594V34.3733H38.2271V36.5728H42.0802V44.0034H5.77295V36.5728H9.62517V32.4538H3.85222V30.5333H1.91983V28.6012H0V15.3993H1.91983V13.4663H3.85222V11.5468H5.77295V5.77554H7.69278V3.84343L9.62517 3.84253V1.92297H11.545V0.00341797H34.3748V1.92297ZM16.2208 37.4079H12.3811V39.3283H8.52889V41.2479H39.3242V39.3283H35.4711V37.4079H31.6189V35.4757H33.5513V33.5562L16.2208 33.5499V37.4079ZM14.3009 31.6178V33.5499H16.2208V31.6178H14.3009ZM33.5513 31.6178V33.5499H35.4711V31.6178H33.5513ZM6.60816 27.7787V29.6982H12.3811V31.6178H14.3009V27.7778L6.60816 27.7787ZM25.8459 29.6982V31.6178H31.6189V29.6982H25.8459ZM16.2208 6.59808V8.53109H14.3009V10.4506H12.3811V14.3023H10.4487V8.53109H8.52889V14.3023H6.60816V16.2219H14.3009V18.1549H16.2208V16.2219H18.1541V14.3023H25.8459V16.2219H27.7783V14.3023H33.5513V16.2219H35.4711V31.6178H37.4035V27.7787H39.3242V25.8457H37.4035V18.1549H39.3242V16.2219H37.4035V8.53109H35.4711V10.4506H33.5513V8.53109H29.6991V6.59808H16.2208ZM23.9261 27.7787V29.6982H25.8459V27.7787H23.9261ZM31.6189 27.7787V29.6982H33.5513V27.7787H31.6189ZM4.67577 25.8457V27.7778L6.60816 27.7787V25.8457H4.67577ZM14.3009 25.8457V27.7778H16.2208V25.8457H14.3009ZM2.75594 18.1549V25.8457H4.67577V18.154L2.75594 18.1549ZM16.2208 18.1549V25.8457H18.1541V18.1549H16.2208ZM22.0063 21.994V25.8457H23.9261V21.994H22.0063ZM31.6189 21.994V25.8457H33.5513V21.994H31.6189ZM39.3242 18.1549V25.8457H41.2441V18.1549H39.3242ZM6.60816 20.0744V23.9261H8.52889V20.0744H6.60816ZM8.52889 18.1549V20.0744H10.4487V18.1549H8.52889ZM4.67577 16.2219V18.154H6.60816V16.2219H4.67577ZM22.0063 16.2219V18.154H25.8459V16.2219H22.0063ZM10.4487 6.59808V8.53109H12.3811V6.59808H10.4487ZM33.5513 6.59808V8.53109H35.4711V6.59808H33.5513ZM12.3811 4.67852V6.59808H14.3009V4.67852H12.3811ZM31.6189 4.67852V6.59808H33.5513V4.67852H31.6189ZM14.3009 2.75897V4.67852H31.6189V2.75897H14.3009Z",
];
/* In the dark drawing his eyes are two holes, two pixels tall, at
   x 22.0–23.9 and 31.6–33.6, y 22.0–25.8. The frames cover them: half
   shut fills the lower pixel of each; shut fills both and cuts the lid's
   line, in the ground colour, running in towards the nose. The covers
   overlap the holes' edges by a tenth of a unit, so no seam shows
   between their edge and the hole's. */
const DARK_EYE_HOLES = [
  "M21.9063 21.894H24.0261V25.9457H21.9063V21.894Z",
  "M31.5189 21.894H33.6513V25.9457H31.5189V21.894Z",
];
const DARK_EYES_LOWER = [
  "M21.9063 23.8261H24.0261V25.9457H21.9063V23.8261Z",
  "M31.5189 23.8261H33.6513V25.9457H31.5189V23.8261Z",
];
const DARK_EYES_LID = [
  "M22.0063 21.994H25.8459V23.9261H22.0063V21.994Z",
  "M29.6991 21.994H33.5513V23.9261H29.6991V21.994Z",
];

const Paths = ({ paths }: { paths: string[] }) => (
  <>
    {paths.map((d) => (
      <path key={d} d={d} />
    ))}
  </>
);

/** The figure in both drawings, each with his eyes in their three
    frames (prefix + eyes-open, eyes-half, eyes-shut). The light drawing
    shows by day and the dark one by night (globals.css, --figure-light
    and --figure-dark), so both carry the same frame classes and the one
    on show takes whatever the frames do. */
const Figure = ({ prefix }: { prefix: string }) => (
  <>
    <g className="figure-light">
      <Paths paths={FIGURE} />
      <g className={`${prefix}eyes-open`}>
        <Paths paths={EYES_OPEN} />
      </g>
      <g className={`${prefix}eyes-half`}>
        <Paths paths={EYES_HALF} />
      </g>
      <g className={`${prefix}eyes-shut`}>
        <Paths paths={EYES_SHUT} />
      </g>
    </g>
    <g className="figure-dark" transform={`scale(${DARK_SCALE})`}>
      <Paths paths={DARK_FIGURE} />
      <g className={`${prefix}eyes-half`}>
        <Paths paths={DARK_EYES_LOWER} />
      </g>
      <g className={`${prefix}eyes-shut`}>
        <Paths paths={DARK_EYE_HOLES} />
        <g className="figure-ground">
          <Paths paths={DARK_EYES_LID} />
        </g>
      </g>
    </g>
  </>
);

/** The figure for the header's mark: still, eyes open, and he blinks
    under the pointer (globals.css, .logo). */
export function PortraitMark(props: IconProps) {
  return (
    <svg viewBox="0 0 240 240" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <Figure prefix="mark-" />
    </svg>
  );
}

export function PixelPortrait(props: IconProps) {
  return (
    <svg viewBox="0 0 240 240" fill="currentColor" aria-hidden="true" focusable="false" overflow="visible" {...props}>
      {/* The figure, his eyes in their three frames (globals.css, .hero-art). */}
      <Figure prefix="" />

      {/* Two notes over his right ear and a third beside it; shown under the pointer. */}
      <g className="deco deco-note-a" transform="translate(178 -83.5)">
        <g className="note note-a">
          <path d="M29.8027 0H37.2594V3.70722H29.8027V0Z" />
          <path d="M29.8026 22.1706V25.8536H26.0864V33.2438H29.8026V36.9268H37.2594V33.2438H41V3.70721H37.2594V22.1706H29.8026Z" />
          <path d="M22.3704 3.70721H29.8027V7.3902H22.3704V3.70721Z" />
          <path d="M14.9135 7.39021H22.3703V11.0732H14.9135V7.39021Z" />
          <path d="M3.74061 48H11.1974V44.317H14.9135V11.0732H11.1974V33.2438H3.74061V36.9268H0V44.317H3.74061V48Z" />
        </g>
      </g>
      <g className="deco deco-note-b" transform="translate(249 -69.5)">
        <g className="note note-b">
          <path d="M21.4352 10.9069H25V18.1861H21.4352V10.9069Z" />
          <path d="M17.8706 7.27924H21.4353V10.9069H17.8706V7.27924Z" />
          <path d="M14.2824 3.62769V0H10.7177V25.4654H3.56474V29.0931H0V36.3723H3.56474V40H10.7177V36.3723H14.2824V7.27924H17.8706V3.62769H14.2824Z" />
        </g>
      </g>
      <g className="deco deco-note-c" transform="translate(214 -19.5)">
        <g className="note note-c">
          <path d="M17.1482 8.72552H20V14.5489H17.1482V8.72552Z" />
          <path d="M14.2965 5.82339H17.1483V8.72554H14.2965V5.82339Z" />
          <path d="M11.4259 2.90215V0H8.57415V20.3723H2.8518V23.2745H0V29.0979H2.8518V32H8.57415V29.0979H11.4259V5.82339H14.2965V2.90215H11.4259Z" />
        </g>
      </g>

      {/* A heart and two sparkles on his left. */}
      <g className="deco deco-heart" transform="translate(10 -29.5)">
        <g className="heart">
          <path d="M31.7292 5.35081H37V15.9825H31.7292V5.35081Z" />
          <path d="M26.4235 15.9825H31.729V21.3334H26.4235V15.9825Z" />
          <path d="M21.1526 0H31.729V5.35082H21.1526V0Z" />
          <path d="M21.1526 21.3334H26.4235V26.6492H21.1526V21.3334Z" />
          <path d="M15.8472 26.6492H21.1527V32H15.8472V26.6492Z" />
          <path d="M15.8472 5.35081H21.1527V10.6667H15.8472V5.35081Z" />
          <path d="M10.5763 21.3334H15.8471V26.6492H10.5763V21.3334Z" />
          <path d="M5.3056 0H15.8473V5.35082H5.3056V0Z" />
          <path d="M5.3056 15.9825H10.5764V21.3334H5.3056V15.9825Z" />
          <path d="M0 5.35081H5.30552V15.9825H0V5.35081Z" />
        </g>
      </g>
      <g className="deco deco-sparkle-a" transform="translate(-56 -37.5)">
        <g className="blink blink-a">
          <path d="M13.3479 6.6521H20V13.3479H13.3479V6.6521Z" />
          <path d="M6.69598 13.3479H13.3481V20H6.69598V13.3479Z" />
          <path d="M6.69598 0H13.3481V6.65207H6.69598V0Z" />
          <path d="M0 6.6521H6.69587V13.3479H0V6.6521Z" />
        </g>
      </g>
      <g className="deco deco-sparkle-b" transform="translate(-29 26.5)">
        <g className="blink blink-b">
          <path d="M15.0082 4.99176H20V15.0082H15.0082V4.99176Z" />
          <path d="M4.99164 15.0082H15.008V20H4.99164V15.0082Z" />
          <path d="M4.99164 0H15.008V4.99179H4.99164V0Z" />
          <path d="M0 4.99176H4.99179V15.0082H0V4.99176Z" />
        </g>
      </g>
    </svg>
  );
}

/** The X mark. */
export function XMark(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M0.95 14.2875H1.9V16.1875H2.85625V17.1437H3.80625V18.0938H5.7125V19.05H7.61875V20H12.3812V19.05H14.2812V18.0938H16.1875V17.1437H17.1375V16.1875H18.0938V14.2875H19.0437V12.3812H20V7.61875H19.0437V5.7125H18.0938V3.80625H17.1375V2.85625H16.1875V1.90625H14.2812V0.95H12.3812V0H7.61875V0.95H5.7125V1.90625H3.80625V2.85625H2.85625V3.80625H1.9V5.7125H0.95V7.61875H0V12.3812H0.95V14.2875ZM4.75625 5.7125H5.7125V6.66875H6.6625V7.61875H7.61875V8.56875H9.51875V5.7125H10.475V4.7625H14.2812V5.7125H15.2375V7.61875H17.1375V8.56875H16.1875V9.525H15.2375V12.3812H14.2812V14.2875H13.3313V15.2375H12.3812V16.1875H5.7125V15.2375H6.6625V14.2875H7.61875V13.3313H8.56875V12.3812H6.6625V11.4313H5.7125V10.475H4.75625V5.7125Z" />
      <path d="M12.3812 6.66876H14.2812V8.56876H12.3812V6.66876Z" />
    </svg>
  );
}

/** The LinkedIn mark. */
export function LinkedInMark(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M19.0437 1.90625H20V18.0938H19.0437V1.90625Z" />
      <path d="M18.0938 18.0938H19.0437V19.05H18.0938V18.0938Z" />
      <path d="M18.0938 0.950012H19.0437V1.90626H18.0938V0.950012Z" />
      <path d="M17.1375 2.85626H18.0937V17.1438H17.1375V2.85626Z" />
      <path d="M1.90002 19.05H18.0938V20H1.90002V19.05Z" />
      <path d="M2.85626 17.1437H17.1375V18.0937H2.85626V17.1437Z" />
      <path d="M14.2812 9.52498H13.3312V8.56873H11.425V9.52498H10.475V8.56873H8.56873V14.2875H10.475V11.4312H11.425V10.475H12.3812V11.4312H13.3312V14.2875H15.2375V10.475H14.2812V9.52498Z" />
      <path d="M4.75623 8.56873H6.66248V14.2875H4.75623V8.56873Z" />
      <path d="M4.75623 5.71252H6.66248V7.61877H4.75623V5.71252Z" />
      <path d="M2.85626 1.90625H17.1375V2.85625H2.85626V1.90625Z" />
      <path d="M1.90002 0H18.0938V0.95H1.90002V0Z" />
      <path d="M1.90002 2.85626H2.85627V17.1438H1.90002V2.85626Z" />
      <path d="M0.950012 18.0938H1.90001V19.05H0.950012V18.0938Z" />
      <path d="M0.950012 0.950012H1.90001V1.90626H0.950012V0.950012Z" />
      <path d="M0 1.90625H0.95V18.0938H0V1.90625Z" />
    </svg>
  );
}
