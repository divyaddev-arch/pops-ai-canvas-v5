import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Icon } from './Icons';
import { IconButton } from './IconButton';
import { Menu, MenuItem } from './Menu';
import { Slider } from './Slider';
import { Divider } from './Divider';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface AudioPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
}

const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes)}:${String(seconds).padStart(2, '0')}`;
};

export const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(({ src, className, ...props }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const volumeControlRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isVolumeControlOpen, setIsVolumeControlOpen] = useState(false);
    const [moreMenuAnchor, setMoreMenuAnchor] = useState<HTMLElement | null>(null);
    const isMoreMenuOpen = Boolean(moreMenuAnchor);
    const [buffered, setBuffered] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [menuView, setMenuView] = useState<'main' | 'speed'>('main');

    const handlePlayPause = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    }, [isPlaying]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
        }
    };
    
    const handleVolumeChange = (newVolume: number) => {
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            if (newVolume > 0 && audioRef.current.muted) {
                audioRef.current.muted = false;
            }
        }
    };

    const handleTimelineSliderChange = (newTime: number) => {
        if (!isSeeking) setIsSeeking(true);
        setCurrentTime(newTime);
    };
    
    const handleTimelineSliderChangeFinished = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = currentTime;
        }
        setIsSeeking(false);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
                setIsVolumeControlOpen(false);
            }
        };
        if (isVolumeControlOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVolumeControlOpen]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onLoadedMetadata = () => {
            if (audio.duration !== Infinity) setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
            setVolume(audio.volume);
            setIsMuted(audio.muted);
        };
        const onTimeUpdate = () => {
            if (!isSeeking && audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        };
        const onEnded = () => {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.currentTime = 0;
        };
        const onVolumeChange = () => {
            setIsMuted(audio.muted);
            setVolume(audio.volume);
        };
        const onProgress = () => {
            if (audio.buffered.length > 0) {
                setBuffered(audio.buffered.end(audio.buffered.length - 1));
            }
        };


        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('durationchange', onLoadedMetadata);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('volumechange', onVolumeChange);
        audio.addEventListener('progress', onProgress);
        
        onProgress();

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('durationchange', onLoadedMetadata);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('volumechange', onVolumeChange);
            audio.removeEventListener('progress', onProgress);
        };
    }, [isSeeking]);

    const volumeIcon = useMemo(() => {
        if (isMuted || volume === 0) return 'volume_off';
        if (volume > 0.5) return 'volume_up';
        return 'volume_down';
    }, [isMuted, volume]);
    
    const handleOpenMoreMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMoreMenuAnchor(event.currentTarget);
        setMenuView('main');
    };

    const playbackSpeedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    return (
        <div
            ref={ref}
            className={cn('w-full max-w-[300px] bg-surface-container text-on-surface rounded-full h-[54px] pl-[10px] pr-[10px] flex items-center', className)}
            {...props}
        >
            <audio ref={audioRef} src={src} preload="metadata" />
            <IconButton size="xsmall" onClick={handlePlayPause} className="!text-on-surface">
                <Icon className="filled-icon">{isPlaying ? 'pause' : 'play_arrow'}</Icon>
            </IconButton>
            <span className="label-large tabular-nums text-on-surface-variant ml-[5px]">
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="flex-1 min-w-0 mx-[16px]">
                <Slider
                    variant="gm2"
                    value={currentTime}
                    onValueChange={handleTimelineSliderChange}
                    onValueChangeFinished={handleTimelineSliderChangeFinished}
                    valueRange={[0, duration]}
                    aria-label="Audio progress"
                    thumbSize={12}
                    hideValueLabel={true}
                    activeTrackColor="var(--color-on-surface)"
                    inactiveTrackColor="rgba(var(--color-on-surface-rgb), 0.16)"
                    thumbColor="var(--color-on-surface)"
                    hideThumbUntilHover={true}
                />
            </div>
            <div className="flex items-center">
                 <div
                    ref={volumeControlRef}
                    className={cn(
                        'flex items-center justify-end h-[32px] rounded-full transition-all duration-300 ease-in-out',
                        isVolumeControlOpen
                            ? 'w-[100px] bg-surface-container-highest pl-[16px]'
                            : 'w-[32px] bg-transparent'
                    )}
                >
                    <div className={cn(
                        "w-[52px] transition-opacity duration-150",
                        isVolumeControlOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    )}>
                        <Slider
                            variant="gm2"
                            value={isMuted ? 0 : volume}
                            onValueChange={handleVolumeChange}
                            valueRange={[0, 1]}
                            aria-label="Volume control"
                            thumbSize={12}
                            hideValueLabel={true}
                            activeTrackColor="var(--color-on-surface)"
                            inactiveTrackColor="rgba(var(--color-on-surface-rgb), 0.16)"
                            thumbColor="var(--color-on-surface)"
                            className="!h-full"
                            hideThumbUntilHover={true}
                        />
                    </div>
                    <IconButton
                        size="xsmall"
                        onClick={() => {
                            if (isVolumeControlOpen) {
                                toggleMute();
                            } else {
                                setIsVolumeControlOpen(true);
                            }
                        }}
                        className={cn("!text-on-surface shrink-0", !isVolumeControlOpen && "no-state-layer")}
                    >
                        <Icon className="filled-icon">{volumeIcon}</Icon>
                    </IconButton>
                </div>
                
                <IconButton size="xsmall" onClick={handleOpenMoreMenu} className="!text-on-surface">
                    <Icon className="filled-icon">more_vert</Icon>
                </IconButton>
            </div>
            <Menu 
                anchorEl={moreMenuAnchor} 
                open={isMoreMenuOpen} 
                onClose={() => setMoreMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                className="w-[200px]"
            >
                {menuView === 'main' ? (
                    <>
                        <MenuItem headline="Playback speed" leadingIcon={<Icon>slow_motion_video</Icon>} onClick={() => setMenuView('speed')} />
                    </>
                ) : (
                    <>
                        <MenuItem headline="Options" leadingIcon={<Icon>arrow_back</Icon>} onClick={() => setMenuView('main')} />
                        <Divider />
                        {playbackSpeedOptions.map(rate => (
                            <MenuItem 
                                key={rate} 
                                headline={rate === 1 ? 'Normal' : `${rate}x`} 
                                onClick={() => {
                                    setPlaybackRate(rate);
                                    setMoreMenuAnchor(null);
                                }}
                                trailingIcon={playbackRate === rate ? <Icon>check</Icon> : null}
                            />
                        ))}
                    </>
                )}
            </Menu>
        </div>
    );
});
AudioPlayer.displayName = 'AudioPlayer';
