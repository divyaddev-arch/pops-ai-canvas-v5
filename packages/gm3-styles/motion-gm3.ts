/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Material Design 3 Motion System Tokens.
 *
 * This file provides duration and easing curve tokens based on the Material 3
 * motion specification. These tokens are intended to be used for creating
 * consistent and natural-feeling animations throughout the application.
 *
 * @see https://m3.material../motion/overview
 */

// --- Duration Tokens ---
// Durations are expressed in milliseconds.
export const duration = {
    short1: 50,
    short2: 100,
    short3: 150,
    short4: 200,
    medium1: 250,
    medium2: 300,
    medium3: 350,
    medium4: 400,
    long1: 450,
    long2: 500,
    long3: 550,
    long4: 600,
    extraLong1: 700,
    extraLong2: 800,
    extraLong3: 900,
    extraLong4: 1000,
};

// --- Easing Tokens ---
// Easing curves are expressed as CSS cubic-bezier functions.
export const easing = {
    /**
     * The standard curve is used for elements that are already on screen and moving within the layout.
     * This is the most common easing curve.
     */
    standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    /**
     * The standard accelerate curve is for elements that are exiting the screen.
     * The element gains speed and disappears.
     */
    standardAccelerate: 'cubic-bezier(0.3, 0.0, 1, 1)',
    /**
     * The standard decelerate curve is for elements that are entering the screen.
     * The element starts fast and slows down to a resting position.
     */
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    /**
     * The emphasized curve is for large-scale and important transitions.
     * Use for elements that are entering or exiting the screen, or for container transforms.
     * While it shares the same bezier curve as `standard`, it's intended to be used
     * with longer durations for a more expressive effect.
     */
    emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    /**
     * The emphasized accelerate curve is for elements exiting the screen with emphasis.
     * Use for high-priority exits like dismissing a dialog.
     */
    emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
    /**
     * The emphasized decelerate curve is for elements entering the screen with emphasis.
     * Use for high-priority entries like a hero element transition.
     */
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
    /**
     * An expressive spring curve that overshoots, creating a bouncy decelerating motion.
     */
    emphasizedSpringDecelerate: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    /**
     * An expressive spring curve that pulls back before accelerating and then overshoots, creating an anticipatory and bouncy effect.
     */
    emphasizedSpringAccelerate: 'cubic-bezier(0.68, -0.55, 0.26, 1.55)',
    /**
     * A standard spring curve that slightly overshoots for a subtle bouncy decelerating motion.
     */
    standardSpringDecelerate: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    /**
     * A standard spring curve that pulls back slightly before accelerating.
     */
    standardSpringAccelerate: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
};