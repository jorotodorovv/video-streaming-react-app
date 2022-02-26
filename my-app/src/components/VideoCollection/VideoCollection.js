import { useState, useCallback, useMemo } from "react"

import { CircularProgress } from "@mui/material";
import Grid from '@mui/material/Grid';

import Observer from "../../hoc/Observer";
import VideoCard from "../VideoCard/VideoCard";

import YoutubeVideosApi from "../../api/youtube.ts";
import { INITIAL_TOKEN_VALUE } from "../../api/youtube.ts";

const VideoCollection = () => {
    const [videoData, setVideoData] = useState({ videos: [], token: INITIAL_TOKEN_VALUE });

    const api = useMemo(() => {
        return new YoutubeVideosApi({
            videosPerRequest: 18,
            maxTitleLength: 30,
            maxDescriptionLength: 100
        });
    }, []);

    const fetchVideos = useCallback(async () => {
        let response = await api.getVideos(videoData.token);

        let videos = [...videoData.videos];

        for (let vid of response.videos) {
            videos.push(vid);
        }

        setVideoData({ videos, token: response.token });
    }, [videoData]);

    let data = videoData.videos.map(v =>
        <VideoCard id={v.id} title={v.title} description={v.description} image={v.image}>
        </VideoCard>
    );

    return (
        <Grid container spacing={4}>
            {data}
            <Observer callback={fetchVideos} state={[videoData]} />
            <CircularProgress sx={{ mx: "auto", my: 10 }} color="secondary" />
        </Grid>
    );
}

export default VideoCollection;