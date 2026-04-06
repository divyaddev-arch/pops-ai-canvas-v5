import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Icon } from './Icons';
import { IconButton } from './IconButton';
import { Tooltip } from './Tooltip';
import { Slider } from './Slider';
import { Button } from './Button';
import { Menu, MenuItem } from './Menu';
import { ToggleButton } from './ToggleButton';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface VideoPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  poster?: string;
  variant?: 'gemini' | 'drive';
}

const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`;
};

// --- Gemini Variant Controls ---
const GeminiControls = ({ isVisible, hasMounted, isPlaying, isInteractingWithSlider, togglePlay, src, isMuted, toggleMute, currentTime, duration, progressContainerRef, handleProgressInteraction, progress }: any) => {
    const bottomControlsClasses = useMemo(() => {
        const base = "absolute bottom-[0px] left-0 right-0 h-16 bg-gradient-to-t from-[rgba(0,0,0,0.33)] to-transparent transform flex flex-col justify-end pointer-events-auto";
        const visible = isVisible || isInteractingWithSlider;
        return cn(base, 'opacity-0 translate-y-full', hasMounted && 'transition-all duration-300 ease-in-out', visible && '!translate-y-0 !opacity-100');
    }, [hasMounted, isVisible, isInteractingWithSlider]);
    
    return (
        <>
            <div className={cn("absolute inset-0 duration-300 pointer-events-none", hasMounted && "transition-opacity", isVisible ? "opacity-100" : "opacity-0")}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <IconButton onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="bg-black/40 text-white hover:bg-black/60 !rounded-full !w-[48px] !h-[48px] pointer-events-auto" aria-label={isPlaying ? "Pause video (k)" : "Play video (k)"}>
                        <Icon className="filled-icon text-3xl">{isPlaying ? 'pause' : 'play_arrow'}</Icon>
                    </IconButton>
                </div>
            </div>
            <div className={bottomControlsClasses} onClick={(e) => e.stopPropagation()}>
                <div className="pl-[16px] pr-[12px] pb-1">
                    <div className="flex items-center justify-between">
                        <span className="body-medium text-white text-shadow-elevation-1 tabular-nums pl-[0px] translate-y-[9px]">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                        <Tooltip content={isMuted ? 'Unmute' : 'Mute video'}>
                            <IconButton onClick={(e) => { e.stopPropagation(); toggleMute(); }} size="xsmall" className="bg-black/40 !text-white hover:bg-black/60">
                                <Icon>{isMuted ? 'volume_off' : 'volume_up'}</Icon>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div ref={progressContainerRef} onMouseDown={(e) => { e.stopPropagation(); handleProgressInteraction(e, true); }} onMouseMove={(e) => { handleProgressInteraction(e, false); }} className="w-full h-[25px] pr-[4px] flex items-center cursor-pointer group/slider px-[0px]">
                        <div className="relative w-full h-[4px] group-hover/slider:h-[4px] transition-all duration-150 bg-white/30 rounded-full">
                            <div className="absolute h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
                            <div className={cn("absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[12px] h-[12px] bg-white rounded-full transition-opacity duration-150 shadow-elevation-1", "opacity-0 group-hover/slider:opacity-100", isInteractingWithSlider && "!opacity-100")} style={{ left: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// --- Drive Variant Controls ---
const DriveControls = ({ isVisible, hasMounted, isPlaying, togglePlay, rewind, forward, isMuted, toggleMute, currentTime, duration, progress, handleSliderChange, handleSliderChangeFinished, playbackRate, setPlaybackRate, handleFullscreen }: any) => {
    const [speedMenuAnchor, setSpeedMenuAnchor] = useState<HTMLElement | null>(null);
    const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    
    const controlBarClasses = useMemo(() => {
        const base = "absolute bottom-[24px] left-[19px] right-[19px] flex flex-col gap-1 pointer-events-auto";
        const shouldBeVisible = isVisible || !isPlaying;
        return cn(base, 'opacity-0', hasMounted && 'transition-opacity duration-300 ease-in-out', shouldBeVisible && 'opacity-100');
    }, [hasMounted, isVisible, isPlaying]);
    
    const controlPodStyle: React.CSSProperties = {
        backgroundColor: 'rgba(71, 71, 71, 0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
    };
    
    return (
        <div className={controlBarClasses} onClick={(e) => e.stopPropagation()}>
            <div
                className="w-full"
                style={{
                    '--color-primary': '#FFFFFF',
                    '--color-secondary-container': 'rgba(255, 255, 255, 0.38)',
                    '--color-on-surface-38': 'rgba(255, 255, 255, 0.38)',
                } as React.CSSProperties}
            >
                <Slider
                    size="xxsmall"
                    value={progress}
                    onValueChange={(p) => handleSliderChange(p / 100)}
                    onValueChangeFinished={handleSliderChangeFinished}
                    valueRange={[0, 100]}
                    hideValueLabel={true}
                />
            </div>
            <div className="flex items-center gap-[6px] h-[44px]">
                <ToggleButton
                    size="small"
                    variant="standard"
                    checked={isPlaying}
                    onCheckedChange={togglePlay}
                    className={cn(
                        'w-[100px] h-full !transition-[border-radius,background-color,color]',
                        isPlaying
                            ? '!rounded-full !bg-white !text-black'
                            : '!rounded-xl !text-white'
                    )}
                    style={!isPlaying ? controlPodStyle : {}}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    icon={<Icon className="filled-icon">{isPlaying ? 'pause' : 'play_arrow'}</Icon>}
                />

                {/* Left Group Pod */}
                <div
                    className="h-full rounded-xl flex items-center pl-[13px] pr-[19px]"
                    style={controlPodStyle}
                >
                    <IconButton size="xsmall" onClick={rewind} className="!text-white" aria-label="Rewind 10 seconds">
                        <Icon>replay_10</Icon>
                    </IconButton>
                    <IconButton size="xsmall" onClick={forward} className="!text-white" aria-label="Forward 10 seconds">
                        <Icon>forward_10</Icon>
                    </IconButton>
                    <span className="label-small text-white/90 tabular-nums ml-2">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>
                
                <div className="flex-grow" />

                {/* Right Group Pod */}
                <div
                    className="h-full rounded-xl flex items-center px-[16px] gap-[13px]"
                    style={controlPodStyle}
                >
                    <IconButton size="xsmall" onClick={toggleMute} className="!text-white" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        <Icon>{isMuted ? 'volume_off' : 'volume_up'}</Icon>
                    </IconButton>
                    <IconButton size="xsmall" className="!text-white" aria-label="Closed captions">
                        <Icon>closed_caption</Icon>
                    </IconButton>
                    <Button
                        variant="text"
                        size="xsmall"
                        onClick={(e) => setSpeedMenuAnchor(e.currentTarget)}
                        className="!text-white/90"
                    >
                        {playbackRate}x
                    </Button>
                    <Menu
                        anchorEl={speedMenuAnchor}
                        open={Boolean(speedMenuAnchor)}
                        onClose={() => setSpeedMenuAnchor(null)}
                    >
                        {playbackRates.map(rate => (
                            <MenuItem key={rate} headline={`${rate}x`} onClick={() => setPlaybackRate(rate)} />
                        ))}
                    </Menu>
                    <IconButton size="xsmall" className="!text-white" aria-label="Settings">
                        <Icon>settings</Icon>
                    </IconButton>
                    <IconButton size="xsmall" onClick={handleFullscreen} className="!text-white" aria-label="Fullscreen">
                        <Icon>fullscreen</Icon>
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(({ src, poster, variant = 'gemini', className, ...props }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressContainerRef = useRef<HTMLDivElement>(null);
    const internalContainerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isControlsVisible, setIsControlsVisible] = useState(false);
    const [isInteractingWithSlider, setIsInteractingWithSlider] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [hasMounted, setHasMounted] = useState(false);
    const controlsTimeoutRef = useRef<number | null>(null);
    
    const [feedbackIcon, setFeedbackIcon] = useState<{key: number, icon: 'play_arrow' | 'pause'} | null>(null);
    const hasInteractedRef = useRef(false);

    const containerRef = useCallback((node: HTMLDivElement | null) => {
        internalContainerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    }, [ref]);

    useEffect(() => { setHasMounted(true); }, []);

    const showControls = useCallback(() => {
        if (!hasMounted) return;
        setIsControlsVisible(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = window.setTimeout(() => {
            if (isPlaying && !isInteractingWithSlider) setIsControlsVisible(false);
        }, 3000);
    }, [isPlaying, isInteractingWithSlider, hasMounted]);

    const hideControls = useCallback(() => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (!isInteractingWithSlider) setIsControlsVisible(false);
    }, [isInteractingWithSlider]);
    
    useEffect(() => { if (isPlaying) showControls(); }, [isPlaying, showControls]);

    const togglePlay = useCallback(async () => {
        const video = videoRef.current;
        if (!video) return;
        video.paused ? await video.play().catch(() => {}) : video.pause();
    }, []);
    
    useEffect(() => {
        if (!hasInteractedRef.current) {
            hasInteractedRef.current = true;
            return;
        }

        setFeedbackIcon({
            key: Date.now(),
            icon: isPlaying ? 'play_arrow' : 'pause',
        });
    }, [isPlaying]);

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (video) video.muted = !video.muted;
    }, []);

    const handleFullscreen = () => {
        const container = internalContainerRef.current;
        if (!container) return;
        if (document.fullscreenElement) document.exitFullscreen();
        else container.requestFullscreen();
    };

    const handleProgressInteraction = useCallback((e: React.MouseEvent<HTMLDivElement>, shouldSetInteracting: boolean) => {
        const video = videoRef.current;
        const progressContainer = progressContainerRef.current;
        if (!video || !progressContainer || (shouldSetInteracting ? false : !isInteractingWithSlider)) return;

        if (shouldSetInteracting) setIsInteractingWithSlider(true);
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
        video.currentTime = percentage * duration;
        setCurrentTime(percentage * duration);
        setProgress(percentage * 100);
    }, [duration, isInteractingWithSlider]);
    
    const handleSliderChange = useCallback((value: number) => {
        const video = videoRef.current;
        if (!video) return;
        const newTime = value * duration;
        video.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(value * 100);
    }, [duration]);

    useEffect(() => {
        const video = videoRef.current;
        if (video) video.playbackRate = playbackRate;
    }, [playbackRate]);

    useEffect(() => {
        const handleMouseUp = () => {
            setIsInteractingWithSlider(false);
            if (internalContainerRef.current?.matches(':hover')) showControls();
        };
        if (isInteractingWithSlider) window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [isInteractingWithSlider, showControls]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const updateProgress = () => {
            if (!video.duration || isNaN(video.duration) || isInteractingWithSlider) return;
            setProgress((video.currentTime / video.duration) * 100);
            setCurrentTime(video.currentTime);
        };
        const setVideoData = () => {
            if (video.duration && !isNaN(video.duration)) setDuration(video.duration);
            setCurrentTime(video.currentTime);
        };
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleVolumeChange = () => setIsMuted(video.muted);

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', setVideoData);
        video.addEventListener('durationchange', setVideoData);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('volumechange', handleVolumeChange);
        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('loadedmetadata', setVideoData);
            video.removeEventListener('durationchange', setVideoData);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('volumechange', handleVolumeChange);
        };
    }, [isInteractingWithSlider]);
    
    const seek = useCallback((amount: number) => {
        const video = videoRef.current;
        if (video) video.currentTime += amount;
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const container = internalContainerRef.current;
            if (!container || (e.target !== container && !container.contains(e.target as Node))) return;
            showControls();
            switch(e.key) {
                case ' ': case 'k': e.preventDefault(); togglePlay(); break;
                case 'ArrowLeft': case 'j': e.preventDefault(); seek(-5); break;
                case 'ArrowRight': case 'l': e.preventDefault(); seek(5); break;
                case 'f': e.preventDefault(); handleFullscreen(); break;
            }
        };
        const container = internalContainerRef.current;
        if (container) container.addEventListener('keydown', handleKeyDown);
        return () => { if (container) container.removeEventListener('keydown', handleKeyDown); };
    }, [showControls, togglePlay, seek]);
    
    const Controls = variant === 'drive' ? DriveControls : GeminiControls;

    return (
        <div ref={containerRef} className={cn("relative w-full aspect-video bg-black rounded-large overflow-hidden select-none group focus:outline-none", className)} onMouseEnter={showControls} onMouseLeave={hideControls} onFocus={showControls} onBlur={hideControls} tabIndex={0} {...props}>
            <video ref={videoRef} className="w-full h-full object-contain" poster={poster} onClick={togglePlay} onDoubleClick={handleFullscreen} loop preload="metadata">
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {variant === 'drive' && (
                <>
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/75 to-transparent transition-opacity duration-300 pointer-events-none",
                        (isControlsVisible || !isPlaying) ? "opacity-100" : "opacity-0"
                    )} />
                    {feedbackIcon && (
                        <div key={feedbackIcon.key} className="absolute inset-0 flex items-center justify-center pointer-events-none animate-feedback-drive">
                            <div className="bg-black/40 text-white rounded-full p-4">
                                <Icon className="text-5xl filled-icon">{feedbackIcon.icon}</Icon>
                            </div>
                        </div>
                    )}
                </>
            )}

            <Controls
                isVisible={isControlsVisible}
                hasMounted={hasMounted}
                isPlaying={isPlaying}
                isInteractingWithSlider={isInteractingWithSlider}
                togglePlay={togglePlay}
                src={src}
                isMuted={isMuted}
                toggleMute={toggleMute}
                currentTime={currentTime}
                duration={duration}
                progress={progress}
                progressContainerRef={progressContainerRef}
                handleProgressInteraction={(e: React.MouseEvent<HTMLDivElement>, setInteracting: boolean) => {
                    handleProgressInteraction(e, setInteracting);
                }}
                handleSliderChange={handleSliderChange}
                handleSliderChangeFinished={() => setIsInteractingWithSlider(false)}
                rewind={() => seek(-10)}
                forward={() => seek(10)}
                playbackRate={playbackRate}
                setPlaybackRate={setPlaybackRate}
                handleFullscreen={handleFullscreen}
            />

            <style>
            {`
                .text-shadow-elevation-1 { text-shadow: 0 1px 3px rgba(0,0,0,0.6); }

                @keyframes feedback-animation-drive {
                    0% {
                        transform: scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                .animate-feedback-drive {
                    animation: feedback-animation-drive 0.5s linear forwards;
                }
            `}
            </style>
        </div>
    );
});
VideoPlayer.displayName = 'VideoPlayer';
