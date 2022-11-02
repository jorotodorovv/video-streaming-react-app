import { useCallback, useContext } from "react"

import { CircularProgress } from "@mui/material";

import Observer from "../../../hoc/Observer";

import { VideoContext } from "../../../context/video-context";
import { SettingsContext } from "../../../context/settings-context";

import Cache from '../../../helpers/basic/Cache.ts'

import VideoCard from "../../../components/VideoCard/VideoCard";
import styles from './VideoCollection.module.css'

const VideoCollection = (props) => {
    const { videoPlayer, renderVideos } = useContext(VideoContext);
    const { videoSettings } = useContext(SettingsContext);

    let cache = new Cache(props.collectionCacheKey);

    const fetchVideos = useCallback(async () => {
        let token = videoPlayer.token ?? videoSettings.query.initialToken;

        let tokenKey = !props.currentChannel ? token : `${token}_${props.currentChannel}`;

        let response = await cache.receive(tokenKey, getVideos, token);

        renderVideos(response.videos, response.token);
    }, [videoPlayer.token, props.currentChannel]);

    const getVideos = async (token) => {
        let response;

        if (props.currentChannel) {
            response =
                await fetch(`http://localhost:3000/api/videos/${props.currentChannel}/${token}`)
                .then((data) => {
                    return data.json()
                });
        }
        else {
            response =
                await fetch(`http://localhost:3000/api/videos/${token}`)
                    .then((data) => {
                        return data.json()
                    });
        }

        let videos = response.videos.map(v => {
            return { ...v, token }
        });

        return { videos, token: response?.nextToken };
    };

    let data = Object.values(videoPlayer.videos).map(v =>
        <VideoCard
            id={v.video.videoId}
            key={"video_card_" + v.video.videoId}
            frame={props.frame}
            token={v.video.token}
            title={v.video.title}
            seconds={v.seconds}
            playbackID={videoPlayer.playbackVideoID}
            image={v.video.image}
            views={v.video.views}>
        </VideoCard>
    );

    let loadingBar = <CircularProgress key={"loading_bar"} sx={{ mx: "auto", my: 10 }} color="secondary" />;

    return <div className={styles.v_collection}>
        {data}
        <Observer callback={fetchVideos} state={[videoPlayer.videos]} />
        {loadingBar}
    </div>
};

export default VideoCollection;