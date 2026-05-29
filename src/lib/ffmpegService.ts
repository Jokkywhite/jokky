import { FFmpeg } from '@ffmpeg/ffmpeg';

type ProgressHandler = (ratio: number, time?: number) => void;

let ffmpeg: FFmpeg | null = null;
let progressHandlers: Set<ProgressHandler> = new Set();
let attachedProgress = false;

// small exponential smoothing for noisy progress updates
const SMOOTH_ALPHA = 0.25;
let lastSmoothed = 0;

export async function initFFmpeg() {
  if (!ffmpeg) ffmpeg = new FFmpeg();
  return ffmpeg;
}

export async function loadFFmpeg() {
  const ff = await initFFmpeg();
  if (!ff.loaded) {
    // load in background-friendly way
    await ff.load();
  }
  // attach unified progress handler once
  if (!attachedProgress) attachProgressEmitter();
  return ff;
}

function attachProgressEmitter() {
  if (!ffmpeg) return;
  attachedProgress = true;
  try {
    // @ts-ignore
    ffmpeg.on('progress', ({ progress, time }: { progress?: number; time?: number }) => {
      const raw = progress ?? 0;
      // smooth
      lastSmoothed = SMOOTH_ALPHA * raw + (1 - SMOOTH_ALPHA) * lastSmoothed;
      for (const h of progressHandlers) h(lastSmoothed, time);
    });
  } catch (e) {
    // noop
  }
}

export function onProgress(fn: ProgressHandler) {
  progressHandlers.add(fn);
}

export function offProgress(fn: ProgressHandler) {
  progressHandlers.delete(fn);
}

let currentRunId = 0;

export async function execFFmpeg(args: string[], timeout?: number) {
  const { promise } = execFFmpegCancelable(args, { timeout });
  return promise;
}

export function execFFmpegCancelable(args: string[], opts?: { timeout?: number }) {
  const runId = ++currentRunId;
  let aborted = false;
  let finishedResolve: (v?: any) => void;
  let finishedReject: (err?: any) => void;
  const promise = new Promise<any>(async (resolve, reject) => {
    finishedResolve = resolve;
    finishedReject = reject;
    try {
      const ff = await loadFFmpeg();
      if (aborted) return reject(new Error('aborted'));
      // @ts-ignore
      const result = await ff.exec(args, opts?.timeout);
      if (aborted) return reject(new Error('aborted'));
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });

  return {
    id: runId,
    promise,
    cancel: async () => {
      aborted = true;
      try {
        await terminateFFmpeg();
      } catch (e) {}
      finishedReject?.(new Error('canceled'));
    },
  };
}

export async function writeFileFromBlob(path: string, blob: Blob) {
  return writeFileFromBlobChunked(path, blob, 4 * 1024 * 1024);
}

export async function writeFileFromBlobChunked(path: string, blob: Blob, chunkSize = 4 * 1024 * 1024) {
  const ff = await loadFFmpeg();
  const total = blob.size;
  let written = 0;
  let first = true;
  for (let offset = 0; offset < total; offset += chunkSize) {
    const slice = blob.slice(offset, offset + chunkSize);
    const arrayBuffer = await slice.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    if (first) {
      // @ts-ignore
      await ff.writeFile(path, uint8);
      first = false;
    } else {
      // read existing, concat, and rewrite (FFmpeg FS doesn't expose append reliably)
      // @ts-ignore
      const existing = (await ff.readFile(path)) as Uint8Array | ArrayBuffer;
      const existingArr = existing instanceof Uint8Array ? existing : new Uint8Array(existing as ArrayBuffer);
      const combined = new Uint8Array(existingArr.length + uint8.length);
      combined.set(existingArr, 0);
      combined.set(uint8, existingArr.length);
      // @ts-ignore
      await ff.writeFile(path, combined);
    }
    written += uint8.length;
    const ratio = Math.min(1, written / total);
    for (const h of progressHandlers) h(ratio);
  }
}

export async function readFileAsUint8(path: string) {
  const ff = await loadFFmpeg();
  // @ts-ignore
  const data = await ff.readFile(path);
  if (data instanceof Uint8Array) return data;
  return new Uint8Array(data as unknown as ArrayBuffer);
}

export async function terminateFFmpeg() {
  if (!ffmpeg) return;
  try {
    ffmpeg.terminate();
  } catch {}
  ffmpeg = null;
  attachedProgress = false;
  progressHandlers.clear();
  lastSmoothed = 0;
}

export function isLoaded() {
  return !!ffmpeg && ffmpeg.loaded;
}
