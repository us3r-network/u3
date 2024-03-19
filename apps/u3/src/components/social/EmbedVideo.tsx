import VideoRenderer from './VideoRender';

export default function EmbedVideo({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="max-w-96 ">
      <VideoRenderer videoSrc={videoUrl} />;
    </div>
  );
}
