import { useState, useCallback } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Download, CheckCircle, XCircle, FileSpreadsheet, AlertTriangle } from "lucide-react";

interface CsvRow {
  name?: string;
  class?: string;
  className?: string;
  section?: string;
  rollNumber?: string;
  roll_no?: string;
  rollno?: string;
  gender?: string;
  mobile?: string;
  parentName?: string;
  parent_name?: string;
  [key: string]: string | undefined;
}

export default function SchoolUpload() {
  const utils = trpc.useUtils();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    totalRows: number;
    validCount: number;
    invalidCount: number;
    validRows: Record<string, string>[];
    invalidRows: { row: Record<string, string>; errors: string[]; index: number }[];
  } | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const validateMutation = trpc.upload.validateCsv.useMutation({
    onSuccess: (data) => setValidationResult(data),
  });

  const importMutation = trpc.upload.importStudents.useMutation({
    onSuccess: () => {
      utils.student.listBySchool.invalidate();
      setImportSuccess(true);
      setValidationResult(null);
      setFile(null);
      setTimeout(() => setImportSuccess(false), 3000);
    },
  });

  const parseCSV = (text: string): CsvRow[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: CsvRow = {};
      headers.forEach((h, i) => {
        row[h] = values[i] ?? "";
      });
      return row;
    });
  };

  const handleFile = useCallback((file: File) => {
    setFile(file);
    setValidationResult(null);
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length > 0) {
        validateMutation.mutate({ rows: rows as Record<string, string | undefined>[] });
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f && (f.name.endsWith(".csv") || f.name.endsWith(".xlsx"))) {
        handleFile(f);
      }
    },
    [handleFile]
  );

  const handleImport = () => {
    if (!validationResult || validationResult.validCount === 0) return;
    importMutation.mutate(
      validationResult.validRows.map((r) => ({
        name: r.name || "",
        className: r.className || r.class || "",
        section: r.section || undefined,
        rollNumber: r.rollNumber || r.roll_no || r.rollno || undefined,
        gender: r.gender || "",
        mobile: r.mobile || undefined,
        parentName: r.parentName || r.parent_name || undefined,
      }))
    );
  };

  const downloadTemplate = () => {
    const headers = "name,class,section,rollNumber,gender,mobile,parentName\n";
    const example = "John Doe,8,A,R001,Male,9876543210,Mr. Doe\n";
    const blob = new Blob([headers + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_upload_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Bulk Upload Students</h2>
        <p className="text-sm text-[#6B6560]">Upload multiple students via CSV file</p>
      </div>

      {importSuccess && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Students imported successfully!
        </div>
      )}

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging ? "border-[#8B8680] bg-[#F7F5F2]" : "border-[#D9D4CC] bg-white"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("csv-upload")?.click()}
      >
        <CardContent className="p-8 text-center">
          <input
            id="csv-upload"
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <Upload className="w-10 h-10 text-[#9B9590] mx-auto mb-3" />
          <p className="text-sm text-[#2D2D2D] font-medium mb-1">
            {file ? file.name : "Click or drag CSV file here"}
          </p>
          <p className="text-xs text-[#9B9590]">Supports .csv files with columns: name, class, gender</p>
        </CardContent>
      </Card>

      <Button variant="outline" className="border-[#D9D4CC] text-[#6B6560]" onClick={downloadTemplate}>
        <Download className="w-4 h-4 mr-2" />
        Download CSV Template
      </Button>

      {/* Validation Results */}
      {validationResult && (
        <Card className="border-[#E8E4E0] bg-white">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#2D2D2D]">Validation Results</h3>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" /> {validationResult.validCount} valid
                </span>
                {validationResult.invalidCount > 0 && (
                  <span className="flex items-center gap-1 text-red-500">
                    <XCircle className="w-3 h-3" /> {validationResult.invalidCount} errors
                  </span>
                )}
              </div>
            </div>

            {validationResult.invalidCount > 0 && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-3">
                <h4 className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Errors Found
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {validationResult.invalidRows.map((r, i) => (
                    <div key={i} className="text-xs text-red-600">
                      Row {r.index + 1}: {r.errors.join(", ")}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {validationResult.validCount > 0 && (
              <Button
                className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white"
                onClick={handleImport}
                disabled={importMutation.isPending}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {importMutation.isPending ? "Importing..." : `Import ${validationResult.validCount} Students`}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}