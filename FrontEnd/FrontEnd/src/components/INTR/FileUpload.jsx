import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { Modal } from "react-bootstrap"; // Import Modal from react-bootstrap
import Swal from "sweetalert2";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [subjectCode, setSubjectCode] = useState("");
  const [author, setAuthor] = useState("");
  const [coAuthor, setCoAuthor] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control file upload modal visibility
  const [previewModalShow, setPreviewModalShow] = useState(false); // State to control preview modal visibility
  const [revisionComment, setRevisionComment] = useState("");
  const previewRef = useRef(null);

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    // Fetch all files on component load
    fetchUploadedFiles();
    toast.info("Welcome to the File Management Dashboard!");
  }, []);

  const fetchUploadedFiles = async (uploaderUserId = null) => {
    setLoadingFiles(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage or wherever it's stored
      const headers = {
        Authorization: `Bearer ${token}`, // Include the token in the request header
      };

      const endpoint = uploaderUserId
        ? `${API_URL}/files/uploader/${uploaderUserId}`
        : `${API_URL}/files/uploader`; // Default to fetching by the authenticated user

      const response = await axios.get(endpoint, { headers });
      setUploadedFiles(response.data);

      if (uploaderUserId) {
        toast.success("Files fetched successfully for the specified user!");
      } else {
        toast.success("All files fetched successfully!");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessage("No Files has been uploaded by the User");
      toast.error("Failed to fetch files.");
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchComments = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${API_URL}/files/comments/${fileId}`, {
        headers,
      });
      return response.data; // This will contain the comments
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments.");
      return [];
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage("Invalid file type. Only PDF and DOCX files are allowed.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !subjectCode || !author) {
      setMessage("Please fill all required fields and select a file!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectCode", subjectCode);
    formData.append("author", author);
    formData.append("coAuthor", coAuthor);

    try {
      const response = await axios.post(`${API_URL}/upload/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedFile = response.data;
      setMessage("File uploaded successfully!");

      // SweetAlert for success message
      Swal.fire({
        title: "Success!",
        text: "File uploaded successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      fetchUploadedFiles();

      setFile(null);
      setSubjectCode("");
      setAuthor("");
      setCoAuthor("");
      setShowModal(false); // Close modal after upload
    } catch (error) {
      setMessage("Please Update your College and Department in Settings");
      toast.error("Error uploading file!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  const handleViewFile = async (fileId, filepath, comment) => {
    setSelectedFile(filepath);
    setRevisionComment(comment);

    // Fetch the comments for the file
    const comments = await fetchComments(fileId);
    setRevisionComment(comments.join("\n") || "No comments available."); // Join the comments with new lines

    const fileExtension = filepath.split(".").pop().toLowerCase();
    setFileType(fileExtension);
    setPreviewModalShow(true); // Show the preview modal
  };

  const closePreview = () => {
    setPreviewModalShow(false); // Close the preview modal
    setSelectedFile(null);
    setFileType(null);
    setRevisionComment("");
  };

  const downloadFile = async (filepath) => {
    try {
      if (filepath.startsWith("http://") || filepath.startsWith("https://")) {
        window.open(filepath, "_blank");
        toast.success("File download initiated.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/files/download/${encodeURIComponent(filepath)}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = filepath.split("/").pop();
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`File "${filename}" downloaded successfully.`);
    } catch (error) {
      console.error("Error downloading file:", error.message);
      toast.error("Error downloading file.");
    }
  };

  const handleDelete = (fileId) => {
    const fileToDelete = uploadedFiles.find((file) => file._id === fileId);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success mx-2",
        cancelButton: "btn btn-danger mx-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });

          setUploadedFiles(uploadedFiles.filter((file) => file._id !== fileId));
          setHistory([
            ...history,
            {
              action: "Deleted file from dashboard",
              fileId,
              timestamp: new Date().toLocaleString(),
            },
          ]);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error",
          });
        }
      });
  };

  // Function to map status to color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "badge bg-success";
      case "Subject for Revision: CITL":
        return "badge bg-warning";
      case "pending":
        return "badge bg-secondary";
      case "ready to print":
        return "badge bg-success";
      case "Subject for Revision: Department":
        return "badge bg-warning";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="font-bold"> Add File </h1>

      {/* Button to trigger modal */}
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary mb-3"
      >
        Upload File
      </button>

      {/* Modal for file upload */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="file-upload">
            <div className="mb-3">
              <label>Subject Code:</label>
              <input
                type="text"
                className="form-control"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Author:</label>
              <input
                type="text"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Co-Author:</label>
              <input
                type="text"
                className="form-control"
                value={coAuthor}
                onChange={(e) => setCoAuthor(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>File:</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
            {message && <p>{message}</p>}
          </div>
        </Modal.Body>
      </Modal>

      <h2 className="mt-4 font-bold pb-2">Uploaded Files</h2>
      {loadingFiles ? (
        <p>Loading files...</p>
      ) : uploadedFiles.length > 0 ? (
        <table className="table-auto w-[950px] border-collapse shadow-2xl rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="p-2 text-left font-semibold shadow-md rounded-md">
                Subject Code
              </th>
              <th className="p-2 text-left font-semibold shadow-md rounded-md">
                Author
              </th>
              <th className="p-2 text-left font-semibold shadow-md rounded-md">
                Co-Author
              </th>
              <th className="p-2 text-left font-semibold shadow-md rounded-md">
                Status
              </th>
              <th className="p-2 text-left font-semibold shadow-md rounded-md">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file, index) => (
              <tr
                key={file._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="p-2 text-gray-800 shadow-md rounded-md">
                  {file.subjectCode}
                </td>
                <td className="p-2 text-gray-800 shadow-md rounded-md">
                  {file.author}
                </td>
                <td className="p-2 text-gray-800 shadow-md rounded-md">
                  {file.coAuthor || "N/A"}
                </td>
                <td className="p-2 shadow-sm rounded-md">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeClass(
                      file.status
                    )}`}
                  >
                    {file.status || "Pending"}
                  </span>
                </td>
                <td className="p-3 shadow-sm rounded-md">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleViewFile(
                          file._id,
                          file.filepath,
                          file.revisionComment
                        )
                      }
                      className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition"
                    >
                      View Comments
                    </button>
                    <button
                      onClick={() => downloadFile(file.filepath)}
                      className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="w-[950px]">No files uploaded yet.</p>
      )}

      {/* File Preview Modal */}
      <Modal show={previewModalShow} onHide={closePreview} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-8">
              {/* PDF Preview */}
              {fileType === "pdf" ? (
                <iframe
                  src={`${API_URL}/files/preview/${encodeURIComponent(
                    selectedFile
                  )}`}
                  title="PDF Preview"
                  style={{ width: "100%", height: "500px", border: "none" }} // Increased height for larger preview
                ></iframe>
              ) : fileType === "docx" || fileType === "doc" ? (
                <iframe
                  src={`https://docs.google.com/gview?url=${selectedFile}&embedded=true`}
                  title="Word Document Preview"
                  style={{ width: "100%", height: "500px", border: "none" }} // Increased height for larger preview
                ></iframe>
              ) : (
                <p>File preview not available for this type.</p>
              )}
            </div>
            <div className="col-md-4">
              <h5 className="font-bold">Revision Comment</h5>
              {revisionComment ? (
                <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                  {revisionComment.split("\n").map((line, index) => (
                    <li
                      key={index}
                      style={{ fontSize: "16px", color: "black" }}
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "16px", color: "black" }}>
                  No comments available.
                </p>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FileUpload;
