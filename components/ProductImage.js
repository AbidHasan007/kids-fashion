import { useState, useRef, useMemo, memo } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

const ProductImage = memo(function ProductImage({ images }) {
  // Handle case where images might be empty or undefined
  const imageArray = useMemo(() => images || [], [images])
  const [mainImg, setMainImg] = useState(imageArray[0] || '/images/placeholder.jpg')
  const [isLoading, setIsLoading] = useState(true)
  const ref = useRef()

  function scroll(scrollOffset) {
    ref.current.scrollLeft += scrollOffset
  }

  // If no images, show placeholder
  if (imageArray.length === 0) {
    return (
      <div className="w-full md:w-1/2 max-w-md border border-palette-lighter bg-white rounded shadow-lg">
        <div className="relative h-96">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src="/images/placeholder.jpg"
            alt="Product placeholder"
            layout="fill"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className={`transform duration-500 ease-in-out hover:scale-105 object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full md:w-1/2 max-w-md border border-palette-lighter bg-white rounded shadow-lg">
      <div className="relative h-96">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          src={mainImg}
          alt="Product image"
          layout="fill"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className={`transform duration-500 ease-in-out hover:scale-105 object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>
      {imageArray.length > 1 && (
        <div className="relative flex border-t border-palette-lighter">
          <button
            aria-label="left-scroll"
            className="h-32 bg-palette-lighter hover:bg-palette-light  absolute left-0 z-10 opacity-75"
            onClick={() => scroll(-300)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 mx-1 text-palette-primary" />
          </button>
          <div
            ref={ref}
            style={{ scrollBehavior: "smooth" }}
            className="flex space-x-1 w-full overflow-auto border-t border-palette-lighter"
          >
            {
              imageArray.map((imgSrc, index) => (
                <button
                  key={index}
                  className="relative w-40 h-32 flex-shrink-0 rounded-sm "
                  onClick={() => setMainImg(imgSrc)}
                >
                  <Image
                    src={imgSrc}
                    alt={`Product image ${index + 1}`}
                    layout="fill"
                    sizes="160px"
                    loading={index < 3 ? "eager" : "lazy"}
                    className="object-cover"
                  />
                </button>
              ))
            }
          </div>
          <button
            aria-label="right-scroll"
            className="h-32 bg-palette-lighter hover:bg-palette-light  absolute right-0 z-10 opacity-75"
            onClick={() => scroll(300)}
          >
            <FontAwesomeIcon icon={faArrowRight} className="w-3 mx-1 text-palette-primary" />
          </button>
        </div>
      )}
    </div>
  )
})

export default ProductImage
