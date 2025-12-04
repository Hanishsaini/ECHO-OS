import MemoryViewer from "@/components/MemoryViewer";

export default function MemoriesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Memories</h2>
                <p className="text-muted-foreground mt-1">
                    View and manage your AI twin's memories and interactions.
                </p>
            </div>
            <MemoryViewer />
        </div>
    );
}
