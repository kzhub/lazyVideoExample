import { Skeleton,Center } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

type movieProps = {
	src: string;
}

const LazyVideo = ({ src }:movieProps) => {
  const videoRef = useRef(null) //video要素へのアクセスのためコンポーネントレンダリング後に実際のDOMを参照する

  const [shouldLoad, setShouldLoad] = useState(false)//動画遅延読み込みuseState
  const [movieLoadState, setMovieLoadState] = useState(false)//動画読み込み状態のuseState

  const movieLoadedFunction = () => {//動画読み込み時に発火
    setMovieLoadState(true)
  }

  useEffect(() => {//レンダリング後に監視
    const observer = new IntersectionObserver((entries) => {//交差APIの設定　viewポートに入ったらsetShouldLoad(true)を動かす
      const entry = entries[0]
      if (entry.isIntersecting) {
				console.log('遅延読み込みされました')
        setShouldLoad(true)
        observer.unobserve(entry.target)
      }
    });
    
		if (videoRef.current) {
			observer.observe(videoRef.current);
		}

    return () => {
      observer.disconnect()//ページ遷移時にobserverを解除
    };
  }, []);
  
  return (
    <>
    <div ref={videoRef} style={{ margin: '200px 0' }}>
      <div>
				<Center>
					<Skeleton width='480px' height='270px' display={movieLoadState ? 'none' : 'block'} />
				</Center>
        {shouldLoad &&
					<Center>
						<video style={{display: movieLoadState ? 'block' : 'none'}} onLoadedData={movieLoadedFunction} width='480' height='270' ref={videoRef} autoPlay muted loop playsInline>
								<source src={src} type="video/mp4" />
						</video>
					</Center>
				}
      </div>
    </div>
    </>
  );
};

export default LazyVideo;
