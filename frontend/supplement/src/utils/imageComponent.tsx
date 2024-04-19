import { useEffect, useState } from 'react'
import {Blurhash} from 'react-blurhash'

export const ImageComponent = ({src, alt, blurhashImg} : {src : string, alt : string, blurhashImg: string}) => {

    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageLoaded(true);
        }
        img.src = src;
    }, [src]);  

  return (
    <>
    {imageLoaded ? 
        <img onLoad={() => setImageLoaded(true)}
        src={src} 
        alt={alt}
        />
        :
        <Blurhash 
        hash={blurhashImg}
        className='blurLoadingImg'
        resolutionX={16}
        resolutionY={9}
        punch={0.5}
        />
    }
    </>
  )
}
