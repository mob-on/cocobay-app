"use client";

import cloud1 from "@media/cloud1.svg";
import cloud2 from "@media/cloud2.svg";
import lvl1 from "@media/hero/hero-level1.svg";
import lvl2 from "@media/hero/hero-level2.svg";
import lvl3 from "@media/hero/hero-level3.svg";
import lvl4 from "@media/hero/hero-level4.svg";
import lvl5 from "@media/hero/hero-level5.svg";
import lvl6 from "@media/hero/hero-level6.svg";
import lvl7 from "@media/hero/hero-level7.svg";
import lvl8 from "@media/hero/hero-level8.svg";
import lvl9 from "@media/hero/hero-level9.svg";
import lvl10 from "@media/hero/hero-level10.svg";
import moon from "@media/moon.svg";
import { useGameState } from "@src/shared/context/GameStateContext";
import {
  TAP_EFFECTS_THROTTLE,
  TAP_EFFECTS_TIMEOUT,
  useTaps,
} from "@src/shared/context/TapEffectsContext";
import useTelegram from "@src/shared/hooks/useTelegram";
import styles from "@src/styles/components/tapArea/tapArea.module.css";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Rings from "./Rings";

const heroAvatars = [
  lvl1,
  lvl2,
  lvl3,
  lvl4,
  lvl5,
  lvl6,
  lvl7,
  lvl8,
  lvl9,
  lvl10,
];

export interface ITapEvent {
  id: string;
  x: number;
  y: number;
  time: DOMHighResTimeStamp; // Timestamp with high precision
  timeoutId?: NodeJS.Timeout; // Timeout ID for cancellation (timeout removes the event from the list of taps)
  pointCount: number;
}

/**
 * Component that displays a Coco image and triggers tap feedback when clicked.
 * Tap feedback includes a tap animation and a tap count. The tap count is
 * stored in a context and can be displayed elsewhere on the page.
 *
 * @return {JSX.Element} Component that displays a Coco image and triggers tap feedback.
 */
const TapArea: React.FC = () => {
  const [WebApp] = useTelegram();
  const [isClassApplied, setIsClassApplied] = useState(false);
  const [classTimeoutId, setClassTimeoutId] = useState<NodeJS.Timeout | null>(
    null,
  );
  const tapAreaRef = useRef<HTMLDivElement>(null);

  /**
   * Handles tap feedback by flashing ring animation for 50ms
   */
  const handleTapFeedback = () => {
    WebApp?.HapticFeedback?.impactOccurred("medium");
    setIsClassApplied(true);

    const timeoutId = setTimeout(() => {
      setIsClassApplied(false);
      setClassTimeoutId(null);
    }, TAP_EFFECTS_THROTTLE);

    // Store timeout ID for potential cancellation
    setClassTimeoutId(timeoutId);
  };

  /**
   * Executes handleTapFeedback if no timeout has been set. Prevents multiple
   * calls to handleTapFeedback within a short period of time.
   */
  const throttledHandleTapFeedback = () => {
    if (!classTimeoutId) {
      handleTapFeedback();
    }
  };
  const { taps: visualTaps = [], setTaps: setVisualTaps } = useTaps();
  const { gameState, dispatchGameState } = useGameState();
  const { energy, pointsPerTap } = gameState;
  const canTap = useRef(true);

  const hasEnergyToTap = energy >= pointsPerTap;

  // Block tapping if we don't have enough energy for a tap
  useEffect(() => {
    canTap.current = hasEnergyToTap;
  }, [hasEnergyToTap]);

  // listen for touch events
  useEffect(() => {
    const element = tapAreaRef.current;
    if (element) {
      element.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }

    // cleanup
    return () => {
      if (element) {
        element.removeEventListener("touchstart", handleTouchStart);
        visualTaps.forEach((tap) => clearTimeout(tap.timeoutId));
        setVisualTaps([]);
        clearTimeout(classTimeoutId ?? undefined);
        setClassTimeoutId(null);
      }
    };
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      // this makes us able to prevent taps from any unwanted actions
      // however, it also prevents us from using mouse events.
      // If we want mouse events, we should preventDefault() in the first touchmove event instead.
      e.cancelable && e.preventDefault();
      const touches = e.changedTouches;
      if (!canTap.current) return;
      // since it's the touchstart event, we only expect one touch to be changed.
      const touch = touches[0];
      const { clientX, clientY } = touch;

      const tapId = uuidv4();
      const tapEvent: ITapEvent = {
        id: tapId,
        x: clientX,
        y: clientY,
        time: performance.now(),
        pointCount: pointsPerTap,
      };

      dispatchGameState({ type: "TAPS_REGISTER_TAP" });
      throttledHandleTapFeedback();

      setVisualTaps((oldTaps) => [...oldTaps, tapEvent]);

      // TODO: Check performance implications of this method. I would assume running Array.filter() on every click is inefficient.
      // Possible solution would be to group all completed taps into a single array and then filter the completed taps from the list.
      const timeoutId = setTimeout(() => {
        setVisualTaps((oldTaps) => oldTaps.filter((tap) => tap.id !== tapId));
      }, TAP_EFFECTS_TIMEOUT);

      // Store timeout ID for potential cancellation
      tapEvent.timeoutId = timeoutId;
    },
    [dispatchGameState, throttledHandleTapFeedback, setVisualTaps],
  );

  return (
    <div
      className={styles.main + " " + (isClassApplied ? styles.tapped : "")}
      ref={tapAreaRef}
    >
      <Rings />
      <Image
        src={moon}
        width={96}
        height={96}
        alt="Decoration"
        className={styles.moon}
        id="__moon"
        priority
      />
      <Image
        src={cloud1}
        width={96}
        height={96}
        alt="Decoration"
        className={styles.cloud1}
        id="__cloud1"
        priority
      />
      <Image
        src={cloud2}
        width={96}
        height={96}
        alt="Decoration"
        className={styles.cloud2}
        id="_cloud2"
        priority
      />
      <Image
        src={heroAvatars[gameState.level - 1 || 0]}
        alt="Hero"
        width={100}
        height={100}
        className={styles.hero}
      />
    </div>
  );
};

export default TapArea;
