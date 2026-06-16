import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UploadCloud, Trash2, Loader2, GripVertical, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
    fetchAllVideoReviews,
    uploadVideoReview,
    updateVideoReview,
    deleteVideoReview,
    reorderVideoReviews,
} from "@/store/admin/video-review-slice";

const ALLOWED = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_MB = 80;
const MIN_SEC = 2;
const MAX_SEC = 35;

export default function AdminVideoReviews() {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { videos, isLoading } = useSelector((state) => state.videoReviews);

    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const fileInputRef = useRef(null);
    const dragIndex = useRef(null);

    useEffect(() => {
        dispatch(fetchAllVideoReviews());
    }, [dispatch]);

    useEffect(() => {
        // Clean up object URLs to avoid memory leaks.
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // Validate file (type, size, duration) before upload.
    const validateAndSet = (f) => {
        if (!f) return;
        if (!ALLOWED.includes(f.type)) {
            toast({ variant: "destructive", title: "Invalid file", description: "Allowed: MP4, WebM, MOV." });
            return;
        }
        if (f.size > MAX_MB * 1024 * 1024) {
            toast({ variant: "destructive", title: "File too large", description: `Max ${MAX_MB}MB.` });
            return;
        }
        const url = URL.createObjectURL(f);
        const probe = document.createElement("video");
        probe.preload = "metadata";
        probe.onloadedmetadata = () => {
            const d = probe.duration;
            if (d < MIN_SEC || d > MAX_SEC) {
                toast({
                    variant: "destructive",
                    title: "Wrong length",
                    description: `Video must be ${MIN_SEC}–${MAX_SEC}s (got ${Math.round(d)}s).`,
                });
                URL.revokeObjectURL(url);
                return;
            }
            setFile(f);
            setPreviewUrl(url);
        };
        probe.onerror = () => {
            toast({ variant: "destructive", title: "Unreadable video", description: "Could not read this file." });
            URL.revokeObjectURL(url);
        };
        probe.src = url;
    };

    const handleUpload = async () => {
        if (!file) {
            toast({ variant: "destructive", title: "No file", description: "Choose a video first." });
            return;
        }
        const formData = new FormData();
        formData.append("video", file);
        formData.append("title", title);

        setUploading(true);
        setProgress(0);
        const result = await dispatch(
            uploadVideoReview({
                formData,
                onUploadProgress: (e) => {
                    if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
                },
            })
        );
        setUploading(false);

        if (result?.payload?.Success) {
            toast({ title: "Uploaded", description: "Video review added.", className: "bg-green-50 border-green-200 text-green-900" });
            setTitle("");
            setFile(null);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            dispatch(fetchAllVideoReviews());
        } else {
            toast({ variant: "destructive", title: "Upload failed", description: result?.payload?.message || "Try again." });
        }
    };

    const handleToggleActive = async (video) => {
        const result = await dispatch(updateVideoReview({ id: video._id, data: { isActive: !video.isActive } }));
        if (result?.payload?.Success) dispatch(fetchAllVideoReviews());
        else toast({ variant: "destructive", title: "Update failed" });
    };

    const handleSaveTitle = async (video, newTitle) => {
        if (newTitle === video.title) return;
        const result = await dispatch(updateVideoReview({ id: video._id, data: { title: newTitle } }));
        if (result?.payload?.Success) dispatch(fetchAllVideoReviews());
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const result = await dispatch(deleteVideoReview({ id: deleteTarget._id }));
        setDeleteTarget(null);
        if (result?.payload?.Success) {
            toast({ title: "Deleted", description: "Video review removed." });
            dispatch(fetchAllVideoReviews());
        } else {
            toast({ variant: "destructive", title: "Delete failed" });
        }
    };

    // Drag to reorder
    const onDrop = async (dropIndex) => {
        const from = dragIndex.current;
        dragIndex.current = null;
        if (from === null || from === dropIndex) return;
        const next = [...videos];
        const [moved] = next.splice(from, 1);
        next.splice(dropIndex, 0, moved);
        const order = next.map((v, i) => ({ id: v._id, order: i }));
        await dispatch(reorderVideoReviews({ order }));
        dispatch(fetchAllVideoReviews());
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <VideoIcon className="w-6 h-6" /> Video Reviews
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Short {MIN_SEC}–{MAX_SEC}s review reels shown on the home page. Drag to reorder; toggle to show/hide.
                </p>
            </div>

            {/* Upload */}
            <Card className="mb-10">
                <CardHeader>
                    <CardTitle className="text-lg">Upload a new reel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="vr-title">Title (optional)</Label>
                                <Input id="vr-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer linen — customer review" maxLength={120} />
                            </div>
                            <div>
                                <Label htmlFor="vr-file">Video file</Label>
                                <input
                                    id="vr-file"
                                    ref={fileInputRef}
                                    type="file"
                                    accept={ALLOWED.join(",")}
                                    onChange={(e) => validateAndSet(e.target.files?.[0])}
                                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-900 file:text-white hover:file:bg-gray-700 cursor-pointer"
                                />
                                <p className="text-xs text-gray-400 mt-1">MP4 / WebM / MOV · ≤ {MAX_MB}MB · {MIN_SEC}–{MAX_SEC}s</p>
                            </div>
                            {uploading && (
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gray-900 h-2 transition-all" style={{ width: `${progress}%` }} />
                                </div>
                            )}
                            <Button onClick={handleUpload} disabled={uploading || !file} className="w-full">
                                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                {uploading ? `Uploading ${progress}%` : "Upload"}
                            </Button>
                        </div>
                        <div className="flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 aspect-[9/16] max-h-72 mx-auto overflow-hidden">
                            {previewUrl ? (
                                <video src={previewUrl} className="h-full w-full object-cover" muted controls playsInline />
                            ) : (
                                <span className="text-xs text-gray-400 px-4 text-center">Preview appears here</span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Management list */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Current reels {videos?.length ? `(${videos.length})` : ""}
            </h2>

            {isLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
            ) : videos?.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm border border-dashed rounded-xl">No video reviews yet.</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {videos.map((video, index) => (
                        <div
                            key={video._id}
                            draggable
                            onDragStart={() => (dragIndex.current = index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => onDrop(index)}
                            className={`group relative rounded-xl border bg-white overflow-hidden ${video.isActive ? "border-gray-200" : "border-gray-200 opacity-60"}`}
                        >
                            <div className="relative aspect-[9/16] bg-gray-100">
                                <video
                                    src={video.videoUrl}
                                    poster={video.posterUrl}
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="h-full w-full object-cover"
                                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                />
                                <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                    <GripVertical size={10} /> {Math.round(video.duration)}s
                                </span>
                                <button
                                    onClick={() => setDeleteTarget(video)}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="p-3 space-y-2">
                                <Input
                                    defaultValue={video.title}
                                    onBlur={(e) => handleSaveTitle(video, e.target.value)}
                                    placeholder="Add a title…"
                                    className="h-8 text-xs"
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-gray-500">{video.isActive ? "Visible" : "Hidden"}</span>
                                    <Switch checked={video.isActive} onCheckedChange={() => handleToggleActive(video)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete confirm */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this video review?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-500">This permanently removes the video from storage and the home page. This cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
