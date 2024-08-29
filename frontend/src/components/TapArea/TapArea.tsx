import React, { MouseEvent, useCallback, useEffect, useState } from "react";
import styles from 'src/styles/components/tapArea/tapArea.module.scss';
import Hero from 'public/media/coco/coco-pink-swag.svg';
import Rings from "./Rings";
import { v4 as uuidv4 } from 'uuid';
import { TAP_EFFECTS_THROTTLE, TAP_EFFECTS_TIMEOUT, useTaps } from "src/shared/context/tapEffectsContext";
import Image from "next/image";

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
  const [ isClassApplied, setIsClassApplied ] = useState(false);
  const [ classTimeoutId, setClassTimeoutId ] = useState<NodeJS.Timeout>(null);

  /**
   * Handles tap feedback by flashing ring animation for 50ms
   */
  const handleTapFeedback = () => {
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

  /**
   * Handles a click event by adding the event information to the tap list,
   * setting a timeout to remove the tap from the list after 5 seconds,
   * and triggering a tap animation.
   */
  const handleClick = (event: MouseEvent) => {
    throttledHandleTapFeedback();
    const tapId = uuidv4();
    const tapEvent: ITapEvent = {
      id: tapId,
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    };

    setTaps(oldTaps => [...oldTaps, tapEvent]);

    // TODO: Check performance implications of this method. I would assume running Array.filter() on every click is inefficient.
    // Possible solution would be to group all completed taps into a single array and then filter the completed taps from the list.
    const timeoutId = setTimeout(() => {
      setTaps(oldTaps => oldTaps.filter((tap) => tap.id !== tapId));
    }, TAP_EFFECTS_TIMEOUT);

    // Store timeout ID for potential cancellation
    tapEvent.timeoutId = timeoutId;
  };

  useEffect(() => {
    // Cleanup function to cancel timeouts when component unmounts
    return () => {
      if(!taps.length) return;
      taps.forEach((tap) => clearTimeout(tap.timeoutId));
      setTaps([]);
      clearTimeout(classTimeoutId);
      setClassTimeoutId(null);
    };
  }, []);
  
  const touchEvent = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  return <div className={styles.main + ' ' + ( isClassApplied ? styles.tapped : '')} onClick={useCallback(handleClick, [])}>
    <Rings />
    <Image src={Hero} alt="Hero" width="100" height="100" className={styles.hero} />
  </div>;
};

export default TapArea;
