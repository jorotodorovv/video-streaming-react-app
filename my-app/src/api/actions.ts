import { PrismaClient } from "@prisma/client";
import YoutubeApi from "./youtube/youtube";

import config from '../../public/configs/youtube.json';

const prisma = new PrismaClient();
const youtubeApi = new YoutubeApi(config);

async function video(req, res): Promise<void> {
    const response = await prisma.videoEntity.findFirst({
        where: {
            videoId: req.params.id,
        }
    });

    res.send(response);
}

async function videos(req, res): Promise<void> {
    const response = await prisma.tokenEntity.findFirst({
        where: {
            currentToken: req.params.token,
        },
        include: {
            videos: true
        }
    });

    res.send(response);
}

async function subscriptions(req, res): Promise<void> {
    const response = await youtubeApi.getSubscriptions(req.params.token);

    res.send(response);
}

async function channelVideos(req, res): Promise<void> {
    let playlists = await youtubeApi.getPlaylists(req.params.channel);

    if (playlists) {
        let playlistVideos = await youtubeApi.getPlaylistVideos(playlists[0].id, req.params.token);

        let response = { videos: [], nextToken: playlistVideos?.token };

        for (let playlistVideo of playlistVideos.items) {
            let videoId = playlistVideo.contentDetails.videoId;
            let video = await youtubeApi.getVideo(videoId);

            if (video) {
                response.videos.push(video);
            }
        }

        res.send(response);
    }
}

export default {
    video,
    videos,
    channelVideos,
    subscriptions,
};