import { DragEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../store/editorStore';
import { execFFmpeg, loadFFmpeg, onProgress, offProgress, isLoaded, readFileAsUint8, writeFileFromBlob } from '../lib/ffmpegService';
import TimelineClip from '../components/TimelineClip';
import ToolButton from '../components/ToolButton';
import { useTranslation } from 'react-i18next';

const timelineRuler = Array.from({ length: 9 }, (_, index) => index * 5);

export default function EditorPage() {
  const { t } = useTranslation();
  const {
    clips,
    selectedClipId,
    selectClip,
    addClip,
    setClips,
    updateClip,
    setTimelineZoom,
    timelineZoom,
    exportQuality,
    setExportQuality,
    isExporting,
    setExporting,
    saveState,
    loadState,
  } = useEditorStore();
  const [previewSrc, setPreviewSrc] = useState('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80');
  const [mediaName, setMediaName] = useState('JWE_Cinematic.mp4');
  const [isLoadedState, setIsLoadedState] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const exportProgress = useEditorStore((s) => s.exportProgress);
  const setExportProgress = useEditorStore((s) => s.setExportProgress);

  useEffect(() => {
    loadState();
  }, [loadState]);

  useEffect(() => {
    (async () => {
      try {
        if (!isLoaded()) {
          await loadFFmpeg();
        }
        setIsLoadedState(true);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const subscription = setTimeout(() => saveState(), 600);
    return () => clearTimeout(subscription);
  }, [clips, exportQuality, timelineZoom, saveState]);

  const activeClip = useMemo(() => clips.find((clip) => clip.id === selectedClipId) ?? clips[0], [clips, selectedClipId]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const reorderClips = useCallback(
    (fromId: string, toId: string | null) => {
      const fromIndex = clips.findIndex((c) => c.id === fromId);
      if (fromIndex === -1) return;
      const item = clips[fromIndex];
      const without = clips.filter((c) => c.id !== fromId);
      if (!toId) {
        setClips([...without, item]);
        return;
      }
      const toIndex = without.findIndex((c) => c.id === toId);
      const newArr = [...without.slice(0, toIndex), item, ...without.slice(toIndex)];
      setClips(newArr);
    },
    [clips, setClips]
  );

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPreviewSrc(previewUrl);
    setMediaName(file.name);
    addClip({
      id: `clip-${Date.now()}`,
      label: file.name.replace(/\.[^.]+$/, ''),
      duration: 8,
      start: clips.reduce((sum, clip) => sum + clip.duration, 0),
      color: 'from-pink-500 to-rose-500',
      thumbnail: previewUrl,
      source: file,
    });
  };

  useEffect(() => {
    const handler = (ratio: number) => {
      setExportProgress(Math.round(ratio * 100));
    };
    onProgress(handler);
    return () => offProgress(handler);
  }, [setExportProgress]);

  const runExport = async () => {
    if (!clips.length) return;
    setExporting(true);
    setExportProgress(0);
    try {
      const resolution =
        exportQuality === '1080p'
          ? '1920x1080'
          : exportQuality === '4K'
          ? '3840x2160'
          : '1280x720';

      const inputArgs: string[] = [];
      const sourceInputs = await Promise.all(
        clips.map(async (clip, index) => {
          if (clip.source) {
            const filename = `clip-${index}.mp4`;
            await writeFileFromBlob(filename, clip.source);
            return { index, filename, duration: clip.duration };
          }

          return { index, filename: null, duration: clip.duration };
        })
      );

      for (const input of sourceInputs) {
        if (input.filename) {
          inputArgs.push('-ss', '0', '-t', String(input.duration), '-i', input.filename);
        } else {
          inputArgs.push('-f', 'lavfi', '-i', `testsrc=duration=${input.duration}:size=${resolution}:rate=24`);
        }
      }

      const filterInputs = clips
        .map((_, index) => `[${index}:v]scale=${resolution}:flags=lanczos,format=yuv420p,setsar=1[v${index}]`)
        .join('; ');
      const concatInputs = clips.map((_, index) => `[v${index}]`).join('');
      const filterComplex = `${filterInputs}; ${concatInputs}concat=n=${clips.length}:v=1:a=0,format=yuv420p[outv]`;

      const args = [
        ...inputArgs,
        '-filter_complex',
        filterComplex,
        '-map',
        '[outv]',
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-crf',
        '24',
        '-movflags',
        'faststart',
        'output.mp4',
      ];

      await execFFmpeg(args);
      const data = await readFileAsUint8('output.mp4');
      const blob = new Blob([new Uint8Array(data)], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setExportProgress(100);
      setTimeout(() => setExporting(false), 600);
    } catch (error) {
      console.error(error);
      setExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[36px] border border-white/10 p-6 shadow-xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_0.6fr]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('editor.preview')}</p>
                <h2 className="text-3xl font-semibold text-white">{mediaName}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <ToolButton label={t('editor.trim')} icon="✂️" />
                <ToolButton label={t('editor.split')} icon="🪓" />
                <ToolButton label={t('editor.duplicate')} icon="📄" />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
              <div className="rounded-[28px] border border-white/10 bg-[#090c14]/95 p-4 shadow-lg">
                <div className="aspect-video overflow-hidden rounded-[24px] bg-slate-900">
                  <video src={previewSrc} controls className="h-full w-full object-cover" />
                </div>
                <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  <p className="font-semibold text-white">{t('editor.timelinePreview')}</p>
                  <p className="mt-2">{t('editor.autoSave')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass-panel rounded-[28px] border border-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.28em] text-white/50">{t('editor.media')}</p>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-3xl border border-white/10 bg-[#0d1120]/90 p-4 text-white/80">{t('editor.dragDrop')}</div>
                    <div className="rounded-3xl border border-white/10 bg-[#0d1120]/90 p-4 text-white/80">{t('editor.clipsInProject', { count: clips.length })}</div>
                  </div>
                </div>
                <div className="glass-panel rounded-[28px] border border-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.28em] text-white/50">{t('editor.settings')}</p>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-[#0f1320]/90 p-4">
                      <p className="text-sm text-white/80">{t('editor.quality')}</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {(['720p', '1080p', '4K'] as const).map((quality) => (
                          <button
                            key={quality}
                            onClick={() => setExportQuality(quality)}
                            className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                              exportQuality === quality
                                ? 'bg-accent text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {quality}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-[#0f1320]/90 p-4">
                      <p className="text-sm text-white/80">{t('editor.timelineZoom')}</p>
                      <input
                        type="range"
                        min="0.8"
                        max="2.4"
                        step="0.1"
                        value={timelineZoom}
                        onChange={(event) => setTimelineZoom(Number(event.target.value))}
                        className="mt-4 w-full accent-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="glass-panel rounded-[36px] border border-white/10 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('editor.timeline')}</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{t('editor.timelineHeadline')}</h3>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <span>{t('editor.zoom')}</span>
              <span className="font-semibold text-white">{timelineZoom.toFixed(1)}x</span>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0f18]/95 p-4">
            <div className="mb-4 flex items-center justify-between text-sm text-white/50">
              <span>{t('editor.dragClipsInstruction')}</span>
              <span>{t('editor.selectedDuration', { seconds: activeClip?.duration ?? 0 })}</span>
            </div>
            <div className="relative grid gap-4 overflow-x-auto pb-4" style={{ gridAutoColumns: `${timelineZoom * 18}rem` }}>
              <div className="flex h-full items-start gap-4">
                {clips.map((clip) => (
                  <div
                    key={clip.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', clip.id);
                      setDraggingId(clip.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverId(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverId(clip.id);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const fromId = e.dataTransfer.getData('text/plain');
                      if (fromId) reorderClips(fromId, clip.id);
                      setDraggingId(null);
                      setDragOverId(null);
                    }}
                    className={`relative min-w-[16rem] flex-none rounded-[26px] p-3 transition-shadow ${
                      draggingId === clip.id ? 'opacity-60 scale-95' : 'bg-white/5'
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-gradient-to-r from-accent via-violet-500 to-sky-500 opacity-70" />
                    <img src={clip.thumbnail} alt={clip.label} className="h-28 w-full rounded-[20px] object-cover" />
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm text-white/80">
                      <div>
                        <p className="font-semibold text-white">{clip.label}</p>
                        <p className="text-xs uppercase tracking-[0.24em] text-white/50">{clip.duration}s</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => selectClip(clip.id)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.24em] text-white/80 transition hover:bg-white/10"
                        >
                          {t('editor.select')}
                        </button>
                      </div>
                    </div>
                    {dragOverId === clip.id && draggingId && draggingId !== clip.id && (
                      <div className="pointer-events-none absolute inset-0 rounded-[26px] border-2 border-dashed border-accent/60" />
                    )}
                  </div>
                ))}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverId(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromId = e.dataTransfer.getData('text/plain');
                    if (fromId) reorderClips(fromId, null);
                    setDraggingId(null);
                    setDragOverId(null);
                  }}
                  className="min-w-[8rem] flex-none"
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-5 gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
              {timelineRuler.map((tick) => (
                <div key={tick} className="flex flex-col items-center">
                  <span className="h-6 border-l border-white/10"></span>
                  <span className="mt-2">{tick}s</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-[36px] border border-white/10 p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white">{t('editor.selectedClip')}</h3>
            <p className="mt-3 text-sm text-white/70">{t('editor.selectedClipCopy')}</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-[#0f1320]/90 p-4">
                <p className="text-sm text-white/80">{t('editor.clipName')}</p>
                <input
                  value={activeClip?.label ?? ''}
                  onChange={(event) => activeClip && updateClip(activeClip.id, { label: event.target.value })}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-[#11151f]/90 px-4 py-3 text-white outline-none"
                />
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#0f1320]/90 p-4">
                <p className="text-sm text-white/80">{t('editor.filterStyle')}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {['editor.filterCinematic', 'editor.filterNeon', 'editor.filterVintage', 'editor.filterMono'].map((filter) => (
                    <button key={filter} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white/80 transition hover:bg-white/10">
                      {t(filter)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[36px] border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('editor.export')}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{t('editor.renderPanel')}</h3>
              </div>
              <span className={`rounded-3xl px-4 py-2 text-sm ${isLoadedState ? 'bg-emerald-500/10 text-emerald-200' : 'bg-yellow-500/10 text-yellow-200'}`}>
                {isLoadedState ? t('editor.statusReady') : t('editor.statusLoading')}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/70">{t('editor.exportCopy')}</p>
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-white/6">
                <div style={{ width: `${exportProgress}%` }} className="h-2 rounded-full bg-accent transition-all" />
              </div>
              <p className="mt-2 text-sm text-white/60">{t('editor.renderProgress', { progress: exportProgress })}</p>
            </div>
            <button
              onClick={runExport}
              disabled={isExporting}
              className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-accent px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? t('editor.rendering') : t('editor.export')}
            </button>
            {downloadUrl && (
              <a href={downloadUrl} download="jwe-export.mp4" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-white">
                {t('editor.downloadPreview')}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
