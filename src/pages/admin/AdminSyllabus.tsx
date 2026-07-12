import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function AdminSyllabus() {
  const utils = trpc.useUtils();
  const { data: syllabusItems } = trpc.syllabus.list.useQuery();

  const [examName, setExamName] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const createMutation = trpc.syllabus.create.useMutation({
    onSuccess: () => {
      utils.syllabus.list.invalidate();
      setExamName("");
      setContent("");
    },
  });

  const updateMutation = trpc.syllabus.update.useMutation({
    onSuccess: () => {
      utils.syllabus.list.invalidate();
      setExamName("");
      setContent("");
      setEditingId(null);
    },
  });

  const deleteMutation = trpc.syllabus.delete.useMutation({
    onSuccess: () => utils.syllabus.list.invalidate(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || !content.trim()) return;
    if (editingId) {
      updateMutation.mutate({ id: editingId, examName, content });
    } else {
      createMutation.mutate({ examName, content });
    }
  };

  const startEdit = (item: { id: number; examName: string; content: string }) => {
    setEditingId(item.id);
    setExamName(item.examName);
    setContent(item.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setExamName("");
    setContent("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Manage Syllabus</h2>
        <p className="text-sm text-[#6B6560]">Add exam names and syllabus — visible to everyone, no login needed</p>
      </div>

      <Card className="border-[#E8E4E0] bg-white">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#6B6560] block mb-1">Exam Name</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g. Class 6-8 Physics Olympiad"
                className="w-full px-3 py-2 text-sm border border-[#E8E4E0] rounded-lg focus:outline-none focus:border-[#8B8680]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B6560] block mb-1">Syllabus Details</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="List topics, chapters, or paste syllabus text here"
                className="w-full px-3 py-2 text-sm border border-[#E8E4E0] rounded-lg focus:outline-none focus:border-[#8B8680]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-[#2D2D2D] text-white rounded-lg hover:bg-[#1A1A1A] disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {editingId ? "Update Syllabus" : "Add Syllabus"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-sm border border-[#E8E4E0] rounded-lg text-[#6B6560]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {syllabusItems && syllabusItems.length > 0 ? (
          syllabusItems.map((item) => (
            <Card key={item.id} className="border-[#E8E4E0] bg-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#2D2D2D]">{item.examName}</h4>
                    <p className="text-xs text-[#6B6560] mt-1 whitespace-pre-line">{item.content}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(item)} className="text-[#8B8680] hover:text-[#2D2D2D]">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMutation.mutate({ id: item.id })} className="text-[#8B8680] hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-[#9B9590] text-center py-6">No syllabus added yet</p>
        )}
      </div>
    </div>
  );
}