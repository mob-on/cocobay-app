import Image from "next/image";
import Hero from "public/media/coco/coco-pink-swag.svg";
import React, { useEffect, useRef, useState } from "react";
import { useTapCounter } from "frontend/src/shared/context/TapCounterContext";
import {
  TAP_EFFECTS_THROTTLE,
  TAP_EFFECTS_TIMEOUT,
  useTaps,
} from "frontend/src/shared/context/TapEffectsContext";
import styles from "frontend/src/styles/components/tapArea/tapArea.module.scss";
import { v4 as uuidv4 } from "uuid";
import Rings from "./Rings";

import cloud1 from "public/media/cloud1.svg";
import cloud2 from "public/media/cloud2.svg";
import moon from "public/media/moon.svg";
import useTelegram from "frontend/src/shared/hooks/useTelegram";

export interface ITapEvent {
  id: string;
  x: number;
  y: number;
  time: DOMHighResTimeStamp; // Timestamp with high precision
  timeoutId?: NodeJS.Timeout; // Timeout ID for cancellation (timeout removes the event from the list of taps)
}

/**
 * Component that displays a Coco image and triggers tap feedback when clicked.
 * Tap feedback includes a tap animation and a tap count. The tap count is
 * stored in a context and can be displayed elsewhere on the page.
 *
 * @return {JSX.Element} Component that displays a Coco image and triggers tap feedback.
 */
const TapArea: React.FC = () => {
  const [isClassApplied, setIsClassApplied] = useState(false);
  const [classTimeoutId, setClassTimeoutId] = useState<NodeJS.Timeout>(null);
  const tapAreaRef = useRef<HTMLDivElement>(null);

  /**
   * Handles tap feedback by flashing ring animation for 50ms
   */
  const handleTapFeedback = () => {
    const [WebApp] = useTelegram();
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
  const { taps = [], setTaps } = useTaps();
  const { incrementData } = useTapCounter();

  /**
   * Handles a click event by adding the event information to the tap list,
   * setting a timeout to remove the tap from the list after 5 seconds,
   * and triggering a tap animation.
   */
  // const handleClick = (event: MouseEvent) => {};

  useEffect(() => {
    const element = tapAreaRef.current;
    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    // cleanup
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      taps.forEach((tap) => clearTimeout(tap.timeoutId));
      setTaps([]);
      clearTimeout(classTimeoutId);
      setClassTimeoutId(null);
    };
  }, []);

  const handleTouchStart = (e: TouchEvent) => {
    // this makes us able to prevent taps from any unwanted actions
    // however, it also prevents us from using mouse events.
    // If we want mouse events, we should preventDefault() in the first touchmove event instead.
    e.cancelable && e.preventDefault();
    const touches = e.changedTouches;

    // since it's the touchstart event, we only expect one touch to be changed.
    const touch = touches[0];
    const { clientX, clientY } = touch;

    const tapId = uuidv4();
    const tapEvent: ITapEvent = {
      id: tapId,
      x: clientX,
      y: clientY,
      time: performance.now(),
    };

    incrementData();
    throttledHandleTapFeedback();

    setTaps((oldTaps) => [...oldTaps, tapEvent]);

    // TODO: Check performance implications of this method. I would assume running Array.filter() on every click is inefficient.
    // Possible solution would be to group all completed taps into a single array and then filter the completed taps from the list.
    const timeoutId = setTimeout(() => {
      setTaps((oldTaps) => oldTaps.filter((tap) => tap.id !== tapId));
    }, TAP_EFFECTS_TIMEOUT);

    // Store timeout ID for potential cancellation
    tapEvent.timeoutId = timeoutId;
  };

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
        src={Hero}
        alt="Hero"
        width={100}
        height={100}
        className={styles.hero}
        priority
      />
    </div>
  );
};

export default TapArea;
