import React, { useState } from "react";
import Selection from "./Selection";
import ImageCropFeedback from "./ImageCropFeedback";

interface Props {
  imageUrl: string;
  dataUrl: string;
  selection: Selection;
}

const App = (props: Props) => {
  const { imageUrl } = props;
  // Data and selection coordinates for the cropped image.
  const [dataUrl, setDataUrl] = useState<string | undefined>(props.dataUrl);
  const [selection, setSelection] = useState<Selection>(props.selection);

  // Copies a selection of the original canvas into an image.
  const onAreaSelect = (
    top: number,
    left: number,
    right: number,
    bottom: number,
    canvas: HTMLCanvasElement
  ): void => {
    const copy: HTMLCanvasElement = document.createElement("canvas");
    const context: CanvasRenderingContext2D | null = copy.getContext("2d");
    if (dataUrl || !context) return;
    // Determine the correct cropping coordinates.
    const l: number = left < right ? left : right;
    const r: number = right > left ? right : left;
    const t: number = top < bottom ? top : bottom;
    const b: number = bottom > top ? bottom : top;
    const w: number = r - l;
    const h: number = b - t;
    // Draw the original section into the canvas copy.
    copy.width = w;
    copy.height = h;
    context.drawImage(canvas, l, t, w, h, 0, 0, w, h);
    // Show the image and draw the selection.
    setDataUrl(copy.toDataURL());
    setSelection({
      top: top,
      left: left,
      right: right,
      bottom: bottom,
    });
  };

  return (
    <>
      <ImageCropFeedback
        imageUrl={imageUrl}
        top={selection.top}
        left={selection.left}
        right={selection.right}
        bottom={selection.bottom}
        onAreaSelect={onAreaSelect}
      />
      {dataUrl && <img src={dataUrl} alt="Cropped result" />}
    </>
  );
};

App.defaultProps = {
  imageUrl: "https://placekitten.com/600/600",
  dataUrl: undefined,
  selection: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

export default App;
