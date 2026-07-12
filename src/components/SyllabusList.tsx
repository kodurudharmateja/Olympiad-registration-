import { trpc } from "@/providers/trpc";

export default function SyllabusList() {
  const { data: syllabusItems, isLoading } = trpc.syllabus.list.useQuery();

  if (isLoading) {
    return <p className="text-xs text-[#9B9590]">Loading syllabus...</p>;
  }

  if (!syllabusItems || syllabusItems.length === 0) {
    return <p className="text-xs text-[#9B9590]">Syllabus details coming soon.</p>;
  }

  return (
    <div className="space-y-4">
      {syllabusItems.map((item) => (
        <div key={item.id} className="border-b border-[#E8E4E0] last:border-0 pb-3 last:pb-0">
          <h5 className="text-sm font-semibold text-[#2D2D2D] mb-1">{item.examName}</h5>
          <p className="text-xs text-[#6B6560] leading-relaxed whitespace-pre-line">{item.content}</p>
        </div>
      ))}
    </div>
  );
}