import { Trash2Icon, PlusCircleIcon } from "lucide-react";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { Toaster } from "@/components/ui/toaster";
// import { useToast } from "@/hooks/use-toast";

const App = () => {
  // const { toast } = useToast();
  const [rows, setRows] = useState([
    { id: 1, file: null, fileType: "public", moduleType: "employee" },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        file: null,
        fileType: "public",
        moduleType: "employee",
      },
    ]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const saveData = async () => {
    const formData = new FormData();

    rows.forEach((row, index) => {
      if (row.file) {
        formData.append(`file_${index}`, row.file);
      }
      formData.append(`doc_type_${index}`, row.fileType);
      formData.append(`module_type_${index}`, row.moduleType);
    });

    try {
      const response = await fetch("/wp-json/doc/v1/add", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      toast({
        title: "Data uploaded",
        description: "Your data has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const clearData = () => {
    setRows([]);
  };

  const handleChange = (id, field, value) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 space-x-2">
        {/* <Toaster /> */}
        {/* sheet */}

        <Sheet>
          امرنا تمام <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader className="mt-6">
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <button
          onClick={addRow}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center mb-2"
        >
          <PlusCircleIcon className="mr-2" /> New Document
        </button>
        <button
          onClick={saveData}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={clearData}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200 shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Upload Input File</th>
            <th className="p-2 border">File Type</th>
            <th className="p-2 border">Module Type</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="p-2 border">
                <input
                  type="file"
                  onChange={(e) =>
                    handleChange(row.id, "file", e.target.files[0])
                  }
                  className="file-input"
                />
              </td>
              <td className="p-2 border">
                <select
                  value={row.fileType}
                  onChange={(e) =>
                    handleChange(row.id, "fileType", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </td>
              <td className="p-2 border">
                <select
                  value={row.moduleType}
                  onChange={(e) =>
                    handleChange(row.id, "moduleType", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="employee">Employee</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => deleteRow(row.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  <Trash2Icon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

const rootElement = document.getElementById("wp-react-app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <>
      <App />
    </>
  );
}
