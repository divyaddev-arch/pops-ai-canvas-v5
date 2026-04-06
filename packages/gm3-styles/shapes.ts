export const CIRCLE = 'm -6.5 0 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0';
export const SQUARE =
'm 5.835 5.835 h -11.67 v -11.67 h 11.67 v 11.67 z m -5.835 -5.835';
export const DIAMOND =
'm 0 -7.82 l 7.82 7.82 l -7.82 7.82 l -7.82 -7.82 l 7.82 -7.82 z m 0 7.82';
export const DOWN_TRIANGLE =
'm -8.25 -5.28 h 16.5 l -8.25 12.17 l -8.25 -12.17 z m 8.25 5.28';
export const UP_TRIANGLE =
'm -8.25 5.28 h 16.5 l -8.25 -12.17 l -8.25 12.17 z m 8.25 -5.28';
export const HILL =
'm 6.54 -0.19 a 6.54 6.54 0 1 0 -13.08 0 v 6.54 h 13.08 z m -6.54 0.19';
export const PLUS =
'm 2.94 -2.94 h 5.36 v 5.88 h -5.36 v 5.36 h -5.88 v -5.36 h -5.36 v -5.88 h 5.36 v -5.36 h 5.88 v 5.36 z m -2.94 2.94';
export const CROSS =
'm 0 -4.158 l 3.79 -3.79 l 4.158 4.158 l -3.79 3.79 l 3.79 3.79 l -4.158 4.158 l -3.79 -3.79 l -3.79 3.79 l -4.158 -4.158 l 3.79 -3.79 l -3.79 -3.79 l 4.158 -4.158 l 3.79 3.79 z m 0 4.158';
export const VALLEY =
'm -6.54 0.19 a 6.54 6.54 0 1 0 13.08 0 v -6.54 h -13.08 z m 6.54 -0.19';
export const STAR =
'm 2.85 -3.7 l 6.24 1.04 l -4.62 4.33 l 0.94 6.26 l -5.55 -3.07 l -5.66 2.83 l 1.2 -6.22 l -4.44 -4.51 l 6.28 -0.78 l 2.92 -5.62 l 2.69 5.74 z m -2.85 3.7';
/** Path for pentagon shape. */
export const PENTAGON =
'm 0 -8.464 l -8.05 5.85 l 3.08 9.46 l 9.95 0 l 3.08 -9.46 l -8.06 -5.85 z m 0 8.464';
export const MARKER =
'm 5.72 -2.36 c 0 3.17 -5.72 11.65 -5.72 11.65 s -5.72 -8.47 -5.72 -11.64 a 5.73 5.73 0 0 1 11.45 0 z m -5.72 2.36';

/** shapes */
export const ACCESSIBILITY_SHAPES = [
CIRCLE,
SQUARE,
DIAMOND,
DOWN_TRIANGLE,
UP_TRIANGLE,
HILL,
PLUS,
CROSS,
VALLEY,
STAR,
PENTAGON,
MARKER,
];

/** Map of readable names to shape paths. */
export const ACCESSIBILITY_SHAPE_MAP = new Map<string, string>([
['circle', CIRCLE],
['square', SQUARE],
['diamond', DIAMOND],
['down_triangle', DOWN_TRIANGLE],
['up_triangle', UP_TRIANGLE],
['hill', HILL],
['plus', PLUS],
['cross', CROSS],
['valley', VALLEY],
['star', STAR],
['pentagon', PENTAGON],
['marker', MARKER],
]);

/** Map of shape paths to readable names. */
export const REVERSE_ACCESSIBILITY_SHAPE_MAP = new Map<string, string>(
Array.from(ACCESSIBILITY_SHAPE_MAP.entries()).map(([name, path]) => [
path,
name,
]),
);

/** Canonical dimensions of canvas for these shapes. Used for scaling. */
export const ACCESSIBILITY_SHAPES_BOUNDING_BOX = {
height: 28,
width: 28,
};