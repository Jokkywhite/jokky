import { create } from 'zustand';

export type TimelineClip = {
  id: string;
  label: string;
  duration: number;
  start: number;
  color: string;
  thumbnail: string;
  source?: File;
};

export type ExportQuality = '720p' | '1080p' | '4K';

type EditorState = {
  clips: TimelineClip[];
  selectedClipId: string | null;
  timelineZoom: number;
  isExporting: boolean;
  exportQuality: ExportQuality;
  exportProgress: number;
  autoSaveEnabled: boolean;
  activeLanguage: string;
  projects: { id?: string; name: string; updated_at?: string }[];
  setClips: (clips: TimelineClip[]) => void;
  selectClip: (id: string | null) => void;
  addClip: (clip: TimelineClip) => void;
  removeClip: (id: string) => void;
  updateClip: (id: string, patch: Partial<TimelineClip>) => void;
  setTimelineZoom: (zoom: number) => void;
  setExportQuality: (quality: ExportQuality) => void;
  setExporting: (value: boolean) => void;
  setExportProgress: (value: number) => void;
  setProjects: (projects: { id?: string; name: string; updated_at?: string }[]) => void;
  saveProjectCloud: (name: string) => Promise<any>;
  loadProjectsCloud: () => Promise<any>;
  loadState: () => void;
  saveState: () => void;
};

const initialClips: TimelineClip[] = [
  {
    id: 'clip-1',
    label: 'Opening Scene',
    duration: 12,
    start: 0,
    color: 'from-violet-500 to-fuchsia-500',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'clip-2',
    label: 'Slow Motion',
    duration: 9,
    start: 12,
    color: 'from-sky-500 to-cyan-500',
    thumbnail: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'clip-3',
    label: 'Title Reveal',
    duration: 5,
    start: 21,
    color: 'from-emerald-500 to-lime-500',
    thumbnail: 'https://images.unsplash.com/photo-1516375195447-8f762f7da456?auto=format&fit=crop&w=400&q=80',
  },
];

const STORAGE_KEY = 'jokkywhite-editor-state';

export const useEditorStore = create<EditorState>((set, get) => ({
  clips: initialClips,
  selectedClipId: null,
  timelineZoom: 1,
  isExporting: false,
  exportQuality: '1080p',
  exportProgress: 0,
  autoSaveEnabled: true,
  activeLanguage: 'en',
  projects: [],
  setClips: (clips) => set({ clips }),
  selectClip: (id) => set({ selectedClipId: id }),
  addClip: (clip) => set({ clips: [...get().clips, clip] }),
  removeClip: (id) => set({ clips: get().clips.filter((clip) => clip.id !== id) }),
  updateClip: (id, patch) => set({ clips: get().clips.map((clip) => (clip.id === id ? { ...clip, ...patch } : clip)) }),
  setTimelineZoom: (zoom) => set({ timelineZoom: Math.min(2.4, Math.max(0.8, zoom)) }),
  setExportQuality: (quality) => set({ exportQuality: quality }),
  setExporting: (value) => set({ isExporting: value }),
  setExportProgress: (value) => set({ exportProgress: value }),
  setProjects: (projects) => set({ projects }),
  saveProjectCloud: async (name: string) => {
    try {
      // dynamic import to avoid hard dependency in non-cloud scenarios
      const { saveProjectToCloud } = await import('../lib/supabase');
      const payload = { clips: get().clips, timelineZoom: get().timelineZoom };
      const res = await saveProjectToCloud(name, payload);
      return res;
    } catch (err) {
      return { error: err };
    }
  },
  loadProjectsCloud: async () => {
    try {
      const { listProjectsForUser } = await import('../lib/supabase');
      const res = await listProjectsForUser();
      if (res.data) set({ projects: res.data });
      return res;
    } catch (err) {
      return { error: err };
    }
  },
  saveState: () => {
    const snapshot = JSON.stringify({
      clips: get().clips.map(({ id, label, duration, start, color, thumbnail }) => ({ id, label, duration, start, color, thumbnail })),
      selectedClipId: get().selectedClipId,
      exportQuality: get().exportQuality,
      timelineZoom: get().timelineZoom,
    });
    localStorage.setItem(STORAGE_KEY, snapshot);
  },
  loadState: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as Partial<Omit<EditorState, 'saveState' | 'loadState'>>;
      set({
        clips: data.clips ?? get().clips,
        selectedClipId: data.selectedClipId ?? get().selectedClipId,
        exportQuality: data.exportQuality ?? get().exportQuality,
        timelineZoom: data.timelineZoom ?? get().timelineZoom,
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
}));
