"use client";

import { useGameState } from "@contexts/GameState";
import {
  ITapEvent,
  TAP_EFFECTS_THROTTLE,
  TAP_EFFECTS_TIMEOUT,
  useTapEffects,
} from "@contexts/TapEffects";
import useTelegram from "@hooks/useTelegram";
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
import { FrontendGameState } from "@shared/src/interfaces";
import styles from "@src/styles/components/tapArea/tapArea.module.css";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import * as Clouds from "../svg/Clouds";
import Moon from "../svg/Moon";
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
  const tapAreaRef = useRef<HTMLDivElement>(null);
  const classTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handles tap feedback by flashing ring animation for 50ms
   */
  const handleTapFeedback = useCallback(() => {
    WebApp?.HapticFeedback?.impactOccurred("medium");
    setIsClassApplied(true);

    const timeoutId = setTimeout(() => {
      setIsClassApplied(false);
      classTimeoutIdRef.current = null;
    }, TAP_EFFECTS_THROTTLE);

    // Store timeout ID for potential cancellation
    classTimeoutIdRef.current = timeoutId;
  }, [WebApp]);

  /**
   * Executes handleTapFeedback if no timeout has been set. Prevents multiple
   * calls to handleTapFeedback within a short period of time.
   */
  const throttledHandleTapFeedback = useCallback(() => {
    if (!classTimeoutIdRef.current) {
      handleTapFeedback();
    }
  }, [handleTapFeedback]);

  const { taps = [], addTap: addTap } = useTapEffects();
  const { gameState = {} as FrontendGameState, dispatchGameState } =
    useGameState();
  const { energy, pointsPerTap } = gameState;
  const canTap = useRef(true);
  const lastTapHandler = useRef<(e: TouchEvent) => void>(() => {});
  const visualTapRef = useRef<ITapEvent[]>([]);

  // We need this for cleanup, so we keep a mutable copy of the taps to prevent recreating effects when possible
  useEffect(() => {
    visualTapRef.current = taps;
  }, [taps]);

  const hasEnergyToTap = energy >= pointsPerTap;

  // Block tapping if we don't have enough energy for a tap
  useEffect(() => {
    canTap.current = hasEnergyToTap;
  }, [hasEnergyToTap]);

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
        timestamp: performance.now(),
        pointCount: pointsPerTap,
      };

      dispatchGameState({ type: "REGISTER_TAP" });
      throttledHandleTapFeedback();

      addTap(tapEvent);
    },
    [dispatchGameState, pointsPerTap, throttledHandleTapFeedback],
  );

  const cleanup = useCallback(() => {
    if (tapAreaRef.current) {
      tapAreaRef.current.removeEventListener(
        "touchstart",
        lastTapHandler.current,
      );
      clearTimeout(classTimeoutIdRef.current ?? undefined);
      classTimeoutIdRef.current = null;
    }
  }, []);

  // listen for touch events
  useEffect(() => {
    const element = tapAreaRef.current;
    if (element) {
      // remove old tap handler if it's present
      if (lastTapHandler.current) {
        element.removeEventListener("touchstart", lastTapHandler.current);
      }
      lastTapHandler.current = handleTouchStart;
      element.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }
    return cleanup;
  }, [tapAreaRef, handleTouchStart, cleanup]);

  return (
    <div
      className={styles.main + " " + (isClassApplied ? styles.tapped : "")}
      ref={tapAreaRef}
    >
      <Rings />
      <Moon className={styles.moon} id="__moon" />
      <Clouds.Dark1 className={styles.cloud1} id="__cloud1" />
      <Clouds.Dark2 className={styles.cloud2} id="__cloud2" />
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
