import React, { useRef, useState, useEffect, MouseEvent } from "react";
import Point from "./Point";

interface Props {
  imageUrl: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
  onAreaSelect: (
    top: number,
    left: number,
    right: number,
    bottom: number,
    canvas: HTMLCanvasElement
  ) => void;
}

const ImageCropFeedback = (props: Props) => {
  const { imageUrl, top, left, right, bottom, onAreaSelect } = props;
  // Canvas canvasRef and external image.
  const canvasRef: any = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  // Selection coordinates.
  const [topLeft, setTopLeft] = useState<Point | undefined>(undefined);
  const [bottomRight, setBottomRight] = useState<Point | undefined>(undefined);
  // Helper to retrieve the 2D context.
  const getContext = (): CanvasRenderingContext2D =>
    canvasRef.current.getContext("2d");

  // 1. Load the external image.
  useEffect(() => {
    (async () => {
      const image: HTMLImageElement = new Image();
      image.crossOrigin = "Anonymous";
      image.src = imageUrl;
      await image.decode();
      setImage(image);
    })();
  }, [imageUrl]);

  // 2. Draw the image after it has been loaded.
  useEffect(() => {
    if (!image) return;
    const { current } = canvasRef;
    const { width, height } = image;
    current.width = width;
    current.height = height;
    getContext().drawImage(image, 0, 0);
  }, [image]);

  // 3. Draw the rectangle given a set of coordinates.
  useEffect(() => {
    if (!top && !left && !right && !bottom) return;
    const width: number = right - left;
    const height: number = bottom - top;
    getContext().strokeRect(left, top, width, height);
  }, [top, left, right, bottom]);

  // 4. Update the selection via the parent component.
  useEffect(() => {
    if (!topLeft || !bottomRight) return;
    const { current } = canvasRef;
    setTopLeft(undefined);
    setBottomRight(undefined);
    onAreaSelect(topLeft.y, topLeft.x, bottomRight.x, bottomRight.y, current);
  }, [topLeft, bottomRight, onAreaSelect]);

  // Set both selection coordinates after clicking twice.
  const onClick = (event: MouseEvent<HTMLCanvasElement>): void => {
    const { offsetX, offsetY } = event.nativeEvent;
    !topLeft
      ? setTopLeft({ x: offsetX, y: offsetY })
      : setBottomRight({ x: offsetX, y: offsetY });
  };

  return <canvas ref={canvasRef} onClick={onClick}></canvas>;
};

export default ImageCropFeedback;
