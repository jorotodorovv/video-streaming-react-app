import styles from './VideoPlayback.module.css'

import VideoContent from '../../components/VideoContent/VideoContent';

import { useContext } from 'react';
import VideoContext from '../../context/VideoContext';
import { Grid } from '@mui/material';
import Wrapper from '../../hoc/Wrapper';

const DEFAULT_LOAD_STATE = true;

const VideoPlayback = () => {
    const [videoPlayer] = useContext(VideoContext);

    let playback = null;

    let id = videoPlayer.playbackVideoID;
    let player = videoPlayer.videos[id];

    if (player) {
        playback = (
            <Grid item md={3} className={styles.v_playback}>
                <VideoContent
                    id={player.video.id}
                    title={player.video.title}
                    description={player.video.description}
                    image={player.video.image}
                    seconds={player.seconds}
                    views={player.video.views}
                    load={DEFAULT_LOAD_STATE}
                />
            </Grid>
        );
    }

    return <Wrapper>{playback}</Wrapper>;

}

export default VideoPlayback;