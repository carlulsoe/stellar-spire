// components/LazyImage.tsx
import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface ImageProps {
  src: string;
  alt: string;
  height: number;
  width: number;
}

const LazyImage: React.FC<{ image: ImageProps, className?: string }> = ({ image, className }) => (
    <div className={className}>
      <LazyLoadImage
        alt={image.alt}
        height={image.height}
        src={image.src} // use normal <img> attributes as props
        width={image.width} />
    </div>
  );

export default LazyImage;
