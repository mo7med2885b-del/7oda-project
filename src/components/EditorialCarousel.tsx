import React from 'react';
import { CharacterCarousel } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

/**
 * Decorative-only visual break using ThreeUI's real CharacterCarousel
 * (variant "filmstrip"), wired exactly per its documented usage.
 *
 * This is NOT the video section — the component's portraits, names and
 * roles are baked into the package itself with no prop to swap in our own
 * content, and its sandboxed iframe can't open external links on click.
 * It's included purely as an ambient editorial visual, unrelated to the
 * doctor's actual videos (see VideoShowcase.tsx for those).
 */
export const EditorialCarousel: React.FC = () => (
  <div className="shader-frame h-[420px] w-full overflow-hidden rounded-2xl sm:h-[480px]">
    <CharacterCarousel
      variant="filmstrip"
      speed={1.0}
      scale={1.0}
      opacity={1.0}
      hue={0}
      saturation={1.0}
      brightness={1.0}
    />
  </div>
);
