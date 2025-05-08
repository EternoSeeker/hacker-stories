import { useEffect, useRef } from "react";
import { RefObject } from "react";

const useInfiniteScroll = (
  callback: () => void,
  isLoading: boolean
): RefObject<HTMLDivElement | null> => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    });

    const current = bottomRef.current;
    if (current) observerRef.current.observe(current);

    return () => {
      if (observerRef.current && current) {
        observerRef.current.unobserve(current);
      }
    };
  }, [callback, isLoading]);

  return bottomRef;
};

export default useInfiniteScroll;
