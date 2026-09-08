/**
 * Service card imagery.
 *
 * Photography sourced from the Maven Clinic reference set — chosen for a
 * consistent warm, low-key golden-hour tone that reads well under the
 * dark scrim used on the service cards.
 *
 * TO SWAP AN IMAGE: drop a replacement into this folder and repoint the
 * import below. A service mapped to `null` falls back to a generated
 * gradient panel, so the section always renders.
 */

import icsi from './icsi.webp';
import ivf from './ivf.webp';
import obstetrics from './obstetrics.webp';
import laparoscopy from './laparoscopy.webp';
import ultrasound from './ultrasound.webp';
import gyn from './gyn.webp';
import bannerFamily from './banner-family.webp';
import aboutFamily from './about-family.webp';

/** Wide cinematic band used as a full-bleed divider on the landing page. */
export { bannerFamily };

/** Background for the About section. */
export { aboutFamily };

export const serviceImages: Record<string, string | null> = {
  icsi,
  ivf,
  obstetrics,
  laparoscopy,
  ultrasound,
  gyn
};
