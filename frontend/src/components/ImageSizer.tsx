import type React from "react";
import { type SetStateAction, useEffect, useRef, useState } from "react";
import {
  type DraggableData,
  Rnd,
  type RndDragEvent,
  type RndResizeCallback,
} from "react-rnd";
import type { BackgroundImageProps } from "../types/backgroundImageProps";

const ImageSizer: React.FC<{
  imageUrl: string;
  setOutputImage: React.Dispatch<SetStateAction<BackgroundImageProps>>;
  style?: React.CSSProperties;
  className?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
}> = ({
  imageUrl,
  setOutputImage,
  style = null,
  className = "",
  backgroundPosition = null,
  backgroundSize = null,
}) => {
    //the polygon that will be used to clip the image
    const [polyPoints, setPolyPoints] = useState<string>("");

    const [backgroundImageProps, setBackgroundImageProps] =
      useState<BackgroundImageProps>({
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `url(${imageUrl})`,
      });
    //the dimensions of the image
    const [dimensions, setDimensions] = useState<{
      width: number;
      height: number;
    } | null>(null);

    const clientRef = useRef<HTMLDivElement>(null);

    //the position and size of the draggable elemen
    const [draggable, setDraggable] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>({ x: 0, y: 0, width: 50, height: 50 });

    //setting up initial position and size of the draggable element
    useEffect(() => {
      if (clientRef.current && dimensions) {
        //for some reason i only know the width
        const width = clientRef.current.clientWidth;
        const height = (width / dimensions.width) * dimensions.height;
        let _width: number | null = null;
        let _height: number | null = null;
        let _x: number | null = null;
        let _y: number | null = null;
        if (backgroundSize && backgroundPosition) {
          const width_percentageValue = Number(
            backgroundSize.split(" ")[0].replace("%", ""),
          );
          _width = (width * 100) / width_percentageValue;

          const height_percentageValue = Number(
            backgroundSize.split(" ")[1].replace("%", ""),
          );
          _height = (height * 100) / height_percentageValue;

          const x_percentageValue = Number(
            backgroundPosition.split(" ")[0].replace("%", ""),
          );
          _x = (x_percentageValue * (width - _width)) / 100;

          const y_percentageValue = Number(
            backgroundPosition.split(" ")[1].replace("%", ""),
          );
          _y = (y_percentageValue * (height - _height)) / 100;
          setDraggable({
            x: _x,
            y: _y,
            width: _width,
            height: _height,
          });
          return;
        }

        if (height / 4 > width / 3) {
          const apparentHeight = (width / 3) * 4;
          setDraggable({
            x: 0,
            y: (height - apparentHeight) / 2,
            width: width,
            height: apparentHeight,
          });
        } else {
          const apparentWidth = (height * 3) / 4;
          setDraggable({
            x: (width - apparentWidth) / 2,
            y: 0,
            width: apparentWidth,
            height: height,
          });
        }
      }
    }, [dimensions, backgroundSize, backgroundPosition]);

    //when the image url changes, get the dimensions of the image
    useEffect(() => {
      if (!imageUrl) return;

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
    }, [imageUrl]);

    //when the draggable element is dragged, update the position and calculate the clip path
    const onDrag = (_: RndDragEvent, data: DraggableData) => {
      setDraggable({ ...draggable, x: data.x, y: data.y });
    };

    //when the draggable element is resized, update the size and calculate the clip path
    const onResize: RndResizeCallback = (
      _e,
      _direction,
      ref,
      _delta,
      position,
    ) => {
      setDraggable({
        x: position.x,
        y: position.y,
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      });
    };

    //calculate the clip path based on the draggable element's position and size
    useEffect(() => {
      const background_size_width =
        ((clientRef?.current?.offsetWidth ?? 1) * 100) / draggable.width;
      const background_size_height =
        ((clientRef?.current?.offsetHeight ?? 1) * 100) / draggable.height;

      const background_position_x =
        (100 * draggable.x) /
        Math.max((clientRef?.current?.offsetWidth ?? 1) - draggable.width, 1);
      const background_position_y =
        (100 * draggable.y) /
        Math.max((clientRef?.current?.offsetHeight ?? 1) - draggable.height, 1);
      setBackgroundImageProps({
        backgroundSize: `${background_size_width}% ${background_size_height}%`,
        backgroundPosition: `${background_position_x}% ${background_position_y}%`,
        backgroundImage: `url(${imageUrl})`,
      });
      setPolyPoints(`polygon(0% 0%, 0% 100%, 
            ${draggable.x}px 100%, 
            ${draggable.x}px ${draggable.y}px,
            ${draggable.x + draggable.width}px ${draggable.y}px,
            ${draggable.x + draggable.width}px ${draggable.y + draggable.height}px,
            ${draggable.x}px ${draggable.y + draggable.height}px,
            ${draggable.x}px 100%,
            100% 100%, 100% 0%)`);
    }, [draggable, imageUrl]);

    useEffect(() => {
      setOutputImage(backgroundImageProps);
    }, [backgroundImageProps, setOutputImage]);

    return (
      <div
        className={`${className} w-full relative bg-contain bg-no-repeat bg-center`}
        style={{
          ...style,
          backgroundImage: `url(${imageUrl})`,
          aspectRatio: `${dimensions?.width}/${dimensions?.height}`,
        }}
        ref={clientRef}
      >
        <div
          className="absolute inset-0 bg-black opacity-60"
          style={{
            clipPath: polyPoints,
          }}
        />
        <Rnd
          bounds={"parent"}
          size={{ width: draggable.width, height: draggable.height }}
          position={{ x: draggable.x, y: draggable.y }}
          onResize={onResize}
          onDrag={onDrag}
          lockAspectRatio={true}
        />
      </div>
    );
  };

export default ImageSizer;
