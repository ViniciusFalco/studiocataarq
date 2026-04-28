import { useEffect, useRef, useState } from 'react';
import { convertToOriginalPath } from '../utils/imagePaths.js';

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const DOUBLE_TAP_DELAY_MS = 280;
const DOUBLE_TAP_SCALE = 2.25;
const WHEEL_ZOOM_RATE = 0.0012;
const MOVE_THRESHOLD_PX = 4;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getViewportCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

function getTouchPoint(touch) {
  return {
    x: touch.clientX,
    y: touch.clientY,
  };
}

function getTouchCenter(touches) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

function getTouchDistance(touches) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY,
  );
}

export default function ImageLightbox({ src, fallbackSrc, alt = '', onClose }) {
  const preferredSrc = src ? convertToOriginalPath(src) : '';
  const imageRef = useRef(null);
  const scaleRef = useRef(MIN_SCALE);
  const offsetRef = useRef({ x: 0, y: 0 });
  const ignoreNextBackdropClickRef = useRef(false);
  const dragRef = useRef({
    hasMoved: false,
    isActive: false,
    originOffset: { x: 0, y: 0 },
    startPoint: { x: 0, y: 0 },
  });
  const touchRef = useRef({
    hasMoved: false,
    lastTapAt: 0,
    mode: null,
    startCenter: { x: 0, y: 0 },
    startDistance: 0,
    startOffset: { x: 0, y: 0 },
    startPoint: { x: 0, y: 0 },
    startScale: MIN_SCALE,
  });
  const wheelHandlerRef = useRef(null);
  const touchCancelHandlerRef = useRef(null);
  const touchEndHandlerRef = useRef(null);
  const touchMoveHandlerRef = useRef(null);
  const touchStartHandlerRef = useRef(null);
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() => preferredSrc);

  function syncScale(nextScale) {
    scaleRef.current = nextScale;
    setScale(nextScale);
  }

  function syncOffset(nextOffset) {
    offsetRef.current = nextOffset;
    setOffset(nextOffset);
  }

  function getConstrainedOffset(nextOffset, nextScale = scaleRef.current) {
    const imageNode = imageRef.current;

    if (!imageNode || nextScale <= MIN_SCALE) {
      return { x: 0, y: 0 };
    }

    const imageWidth = imageNode.offsetWidth;
    const imageHeight = imageNode.offsetHeight;
    const maxX = Math.max(0, (imageWidth * nextScale - imageWidth) / 2);
    const maxY = Math.max(0, (imageHeight * nextScale - imageHeight) / 2);

    return {
      x: clamp(nextOffset.x, -maxX, maxX),
      y: clamp(nextOffset.y, -maxY, maxY),
    };
  }

  function updateTransform(nextScale, nextOffset) {
    const normalizedScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);

    if (normalizedScale <= MIN_SCALE + 0.01) {
      syncScale(MIN_SCALE);
      syncOffset({ x: 0, y: 0 });
      return;
    }

    syncScale(normalizedScale);
    syncOffset(getConstrainedOffset(nextOffset, normalizedScale));
  }

  function zoomAtPoint(point, nextScale) {
    const currentScale = scaleRef.current;
    const currentOffset = offsetRef.current;
    const viewportCenter = getViewportCenter();
    const imagePoint = {
      x: (point.x - viewportCenter.x - currentOffset.x) / currentScale,
      y: (point.y - viewportCenter.y - currentOffset.y) / currentScale,
    };

    updateTransform(nextScale, {
      x: point.x - viewportCenter.x - imagePoint.x * nextScale,
      y: point.y - viewportCenter.y - imagePoint.y * nextScale,
    });
  }

  function panToPoint(point, startPoint, startOffset) {
    syncOffset(
      getConstrainedOffset({
        x: startOffset.x + point.x - startPoint.x,
        y: startOffset.y + point.y - startPoint.y,
      }),
    );
  }

  function handleBackdropClick() {
    if (ignoreNextBackdropClickRef.current) {
      ignoreNextBackdropClickRef.current = false;
      return;
    }

    onClose();
  }

  function handleImageClick(event) {
    event.stopPropagation();
  }

  function handleWheel(event) {
    event.preventDefault();
    event.stopPropagation();

    const zoomFactor = Math.exp(-event.deltaY * WHEEL_ZOOM_RATE);
    zoomAtPoint(
      {
        x: event.clientX,
        y: event.clientY,
      },
      scaleRef.current * zoomFactor,
    );
  }

  function handleDoubleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    zoomAtPoint(
      {
        x: event.clientX,
        y: event.clientY,
      },
      scaleRef.current > MIN_SCALE ? MIN_SCALE : DOUBLE_TAP_SCALE,
    );
  }

  function handlePointerDown(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || scaleRef.current <= MIN_SCALE) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      hasMoved: false,
      isActive: true,
      originOffset: offsetRef.current,
      startPoint: {
        x: event.clientX,
        y: event.clientY,
      },
    };
    setIsDragging(true);
  }

  function handlePointerMove(event) {
    if (!dragRef.current.isActive) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const currentPoint = {
      x: event.clientX,
      y: event.clientY,
    };
    const dragState = dragRef.current;

    if (
      Math.abs(currentPoint.x - dragState.startPoint.x) > MOVE_THRESHOLD_PX
      || Math.abs(currentPoint.y - dragState.startPoint.y) > MOVE_THRESHOLD_PX
    ) {
      dragState.hasMoved = true;
    }

    panToPoint(currentPoint, dragState.startPoint, dragState.originOffset);
  }

  function handlePointerEnd(event) {
    if (!dragRef.current.isActive) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (dragRef.current.hasMoved) {
      ignoreNextBackdropClickRef.current = true;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current.isActive = false;
    setIsDragging(false);
  }

  function handleTouchStart(event) {
    event.stopPropagation();

    if (event.touches.length === 2) {
      event.preventDefault();

      touchRef.current = {
        ...touchRef.current,
        hasMoved: false,
        mode: 'pinch',
        startCenter: getTouchCenter(event.touches),
        startDistance: getTouchDistance(event.touches),
        startOffset: offsetRef.current,
        startScale: scaleRef.current,
      };
      return;
    }

    if (event.touches.length !== 1) {
      return;
    }

    const point = getTouchPoint(event.touches[0]);
    const now = Date.now();
    const isDoubleTap = now - touchRef.current.lastTapAt < DOUBLE_TAP_DELAY_MS;

    if (isDoubleTap) {
      event.preventDefault();
      touchRef.current.lastTapAt = 0;
      touchRef.current.mode = null;
      zoomAtPoint(point, scaleRef.current > MIN_SCALE ? MIN_SCALE : DOUBLE_TAP_SCALE);
      return;
    }

    touchRef.current = {
      ...touchRef.current,
      hasMoved: false,
      lastTapAt: now,
      mode: scaleRef.current > MIN_SCALE ? 'pan' : 'tap',
      startOffset: offsetRef.current,
      startPoint: point,
    };

    if (scaleRef.current > MIN_SCALE) {
      event.preventDefault();
    }
  }

  function handleTouchMove(event) {
    event.stopPropagation();

    if (event.touches.length === 2 && touchRef.current.mode === 'pinch') {
      event.preventDefault();

      const touchState = touchRef.current;
      const distance = getTouchDistance(event.touches);
      const center = getTouchCenter(event.touches);
      const nextScale = clamp(
        touchState.startScale * (distance / touchState.startDistance),
        MIN_SCALE,
        MAX_SCALE,
      );
      const viewportCenter = getViewportCenter();
      const imagePoint = {
        x: (touchState.startCenter.x - viewportCenter.x - touchState.startOffset.x)
          / touchState.startScale,
        y: (touchState.startCenter.y - viewportCenter.y - touchState.startOffset.y)
          / touchState.startScale,
      };

      touchState.hasMoved = true;
      updateTransform(nextScale, {
        x: center.x - viewportCenter.x - imagePoint.x * nextScale,
        y: center.y - viewportCenter.y - imagePoint.y * nextScale,
      });
      return;
    }

    if (event.touches.length !== 1 || touchRef.current.mode !== 'pan') {
      return;
    }

    event.preventDefault();

    const point = getTouchPoint(event.touches[0]);
    const touchState = touchRef.current;

    if (
      Math.abs(point.x - touchState.startPoint.x) > MOVE_THRESHOLD_PX
      || Math.abs(point.y - touchState.startPoint.y) > MOVE_THRESHOLD_PX
    ) {
      touchState.hasMoved = true;
    }

    panToPoint(point, touchState.startPoint, touchState.startOffset);
  }

  function handleTouchEnd(event) {
    event.stopPropagation();

    if (touchRef.current.hasMoved) {
      ignoreNextBackdropClickRef.current = true;
    }

    if (event.touches.length === 1 && scaleRef.current > MIN_SCALE) {
      const point = getTouchPoint(event.touches[0]);

      touchRef.current = {
        ...touchRef.current,
        hasMoved: false,
        mode: 'pan',
        startOffset: offsetRef.current,
        startPoint: point,
      };
      return;
    }

    if (event.touches.length === 0) {
      touchRef.current.mode = null;
      touchRef.current.hasMoved = false;
    }
  }

  wheelHandlerRef.current = handleWheel;
  touchCancelHandlerRef.current = handleTouchEnd;
  touchEndHandlerRef.current = handleTouchEnd;
  touchMoveHandlerRef.current = handleTouchMove;
  touchStartHandlerRef.current = handleTouchStart;

  useEffect(() => {
    setCurrentSrc(preferredSrc);
    syncScale(MIN_SCALE);
    syncOffset({ x: 0, y: 0 });
    setIsDragging(false);
    ignoreNextBackdropClickRef.current = false;
    touchRef.current = {
      ...touchRef.current,
      hasMoved: false,
      lastTapAt: 0,
      mode: null,
      startScale: MIN_SCALE,
    };
  }, [preferredSrc]);

  useEffect(() => {
    if (!src) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [src]);

  useEffect(() => {
    if (!src) {
      return undefined;
    }

    const imageNode = imageRef.current;

    if (!imageNode) {
      return undefined;
    }

    const handleNativeWheel = (event) => wheelHandlerRef.current?.(event);
    const handleNativeTouchCancel = (event) => touchCancelHandlerRef.current?.(event);
    const handleNativeTouchEnd = (event) => touchEndHandlerRef.current?.(event);
    const handleNativeTouchMove = (event) => touchMoveHandlerRef.current?.(event);
    const handleNativeTouchStart = (event) => touchStartHandlerRef.current?.(event);
    const options = { passive: false };

    imageNode.addEventListener('wheel', handleNativeWheel, options);
    imageNode.addEventListener('touchcancel', handleNativeTouchCancel, options);
    imageNode.addEventListener('touchend', handleNativeTouchEnd, options);
    imageNode.addEventListener('touchmove', handleNativeTouchMove, options);
    imageNode.addEventListener('touchstart', handleNativeTouchStart, options);

    return () => {
      imageNode.removeEventListener('wheel', handleNativeWheel, options);
      imageNode.removeEventListener('touchcancel', handleNativeTouchCancel, options);
      imageNode.removeEventListener('touchend', handleNativeTouchEnd, options);
      imageNode.removeEventListener('touchmove', handleNativeTouchMove, options);
      imageNode.removeEventListener('touchstart', handleNativeTouchStart, options);
    };
  }, [src]);

  useEffect(() => {
    if (!src) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, src]);

  useEffect(() => {
    if (!src) {
      return undefined;
    }

    const handleResize = () => {
      syncOffset(getConstrainedOffset(offsetRef.current, scaleRef.current));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [src]);

  if (!src) {
    return null;
  }

  const imageCursorClass =
    scale > MIN_SCALE ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in';
  const displayedSrc = currentSrc || preferredSrc;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[rgba(0,0,0,0.95)]"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <img
        ref={imageRef}
        className={`max-h-[90vh] max-w-[90vw] select-none rounded-[10px] shadow-[0_0_20px_rgba(0,0,0,0.5)] will-change-transform ${imageCursorClass}`}
        src={displayedSrc}
        alt={alt}
        draggable="false"
        style={{
          touchAction: 'none',
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          transformOrigin: 'center center',
        }}
        onClick={handleImageClick}
        onDoubleClick={handleDoubleClick}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onError={() => {
          if (fallbackSrc && displayedSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          }
        }}
      />
      <button
        className="absolute right-2.5 top-2.5 cursor-pointer border-0 bg-transparent text-[80px] leading-none text-white"
        type="button"
        aria-label="Fechar imagem"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>
    </div>
  );
}
