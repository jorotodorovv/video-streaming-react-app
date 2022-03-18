import { forwardRef, useContext, useMemo, useState } from 'react';
import YouTube from 'react-youtube';
import { VideoContext } from '../../context/video-context';

import Wrapper from '../../hoc/Wrapper';

const MAX_WIDTH = "100%";
const MAX_HEIGHT = "100%";

const VideoPlayer = forwardRef((props, ref) => {
    const { changeSeconds } = useContext(VideoContext)

    const opts = useMemo(() => {
        return {
            height: props.height ?? MAX_HEIGHT,
            width: props.width ?? MAX_WIDTH,
            playerVars: {
                start: props.seconds,
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
                fs: 0,
            }
        };
    }, []);

    const stateChangeHandler = (e) => {
        let seconds = ~~e.target.getCurrentTime();

        changeSeconds(props.id, seconds);

        if (props.onNavigateTime) {
            props.onNavigateTime(seconds);
        }
    };

    const onStateChange = (e) => {
        if (e.data === window.YT.PlayerState.PLAYING) {
            stateChangeHandler(e);
        }
    };

    const onEnd = (e) => {
        if (props.onEndVideo) {
            props.onEndVideo();
        }
    };

    return (
        <Wrapper ref={ref}>
            <YouTube
                videoId={props.id}
                opts={opts}
                onStateChange={onStateChange}
                onEnd={onEnd}
            />
        </Wrapper>
    );
});

export default VideoPlayer;