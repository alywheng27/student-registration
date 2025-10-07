"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"
import { Upload, File, X, Check, AlertCircle, Eye, Calendar, FileText, User } from "lucide-react"


export function DocumentUpload({ onUploadComplete }) {
  const { user } = useAuth()
  const student = user
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [currentFileName, setCurrentFileName] = useState("")
  const [selectedDocumentType, setSelectedDocumentType] = useState("")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const documentTypes = [
    { value: "id", label: "ID Document", description: "Government-issued photo ID" },
    { value: "transcript", label: "Academic Transcript", description: "Official academic records" },
    { value: "birth_certificate", label: "Birth Certificate", description: "Official birth certificate" },
    { value: "other", label: "Other", description: "Other supporting documents" },
  ]

  const requiredDocuments = [
    { type: "id", name: "ID Document", description: "Government-issued photo ID" },
    { type: "transcript", name: "Academic Transcript", description: "Official academic records" },
    { type: "birth_certificate", name: "Birth Certificate", description: "Official birth certificate" },
  ]

  const acceptedFileTypes = [".pdf", ".jpg", ".jpeg", ".png"]
  const maxFileSize = 5 * 1024 * 1024 // 5MB

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      return "File size must be less than 5MB"
    }

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!acceptedFileTypes.includes(fileExtension)) {
      return "File type not supported. Please upload PDF, JPG, or PNG files"
    }

    if (!selectedDocumentType) {
      return "Please select a document type before uploading"
    }

    return null
  }

  const handleFiles = async (files) => {
    const file = files[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setUploading(true)
    setUploadProgress(0)
    setCurrentFileName(file.name)

    try {
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newDocument = {
        id: Date.now().toString(),
        name: file.name.split(".")[0],
        type: selectedDocumentType,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date(),
        status: "pending",
      }

      console.log("[v0] Document uploaded:", newDocument)

      setUploadProgress(100)
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
        setCurrentFileName("")
        setSelectedDocumentType("")
        onUploadComplete?.()
      }, 500)
    } catch (err) {
      setError("Upload failed. Please try again.")
      setUploading(false)
      setUploadProgress(0)
      setCurrentFileName("")
    }
  }

  const getDocumentStatus = (docType) => {
    const uploaded = student.documents.find((doc) => doc.type === docType)
    return uploaded ? uploaded.status : "missing"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4 text-green-500" />
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Upload className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Under Review</Badge>
      default:
        return <Badge variant="secondary">Not Uploaded</Badge>
    }
  }

  const getDocumentTypeLabel = (type) => {
    const docType = documentTypes.find((dt) => dt.value === type)
    return docType ? docType.label : type
  }

  const getDocumentTypeDescription = (type) => {
    const docType = documentTypes.find((dt) => dt.value === type)
    return docType ? docType.description : "Document"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600"
      case "rejected":
        return "text-red-600"
      case "pending":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Upload your required documents. Accepted formats: PDF, JPG, PNG (max 5MB each)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Document Type</label>
            <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select document type..." />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((docType) => (
                  <SelectItem key={docType.value} value={docType.value}>
                    <div>
                      <div className="font-medium">{docType.label}</div>
                      <div className="text-xs text-muted-foreground">{docType.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            } ${uploading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-primary/50"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedFileTypes.join(",")}
              onChange={handleFileInput}
              disabled={uploading}
            />

            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-primary">{currentFileName}</p>
                  <p className="text-sm text-muted-foreground">{getDocumentTypeLabel(selectedDocumentType)}</p>
                  <p className="text-sm font-medium">Uploading document...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">Drop files here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports PDF, JPG, PNG files up to 5MB</p>
                  {!selectedDocumentType && (
                    <p className="text-sm text-amber-600 mt-2">Please select a document type first</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>Track your document submission progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requiredDocuments.map((doc) => {
              const status = getDocumentStatus(doc.type)
              return (
                <div key={doc.type} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(status)}
                    {status === "missing" && (
                      <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {student.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>Manage your submitted documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {student.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold text-base">{doc.fileName}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-primary">{getDocumentTypeLabel(doc.type)}</span>
                        <span>•</span>
                        <span>Uploaded {doc.uploadedAt ? doc.uploadedAt.toLocaleDateString() : "Unknown date"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(doc.status)}
                    <Button size="sm" variant="ghost" onClick={() => handleViewDocument(doc)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Details
            </DialogTitle>
            <DialogDescription>View detailed information about your uploaded document</DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6">
              {/* Document Preview Section */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <File className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedDocument.fileName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getDocumentTypeDescription(selectedDocument.type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(selectedDocument.status)}</div>
                </div>

                {/* Document preview placeholder */}
                <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <File className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Document Preview</p>
                    <p className="text-xs text-gray-400">Click to view full document</p>
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Document Type</label>
                    <p className="text-base font-semibold">{getDocumentTypeLabel(selectedDocument.type)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">File Name</label>
                    <p className="text-base">{selectedDocument.fileName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Upload Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">
                        {selectedDocument.uploadedAt
                          ? selectedDocument.uploadedAt.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedDocument.status)}
                      <p className={`text-base font-medium ${getStatusColor(selectedDocument.status)}`}>
                        {selectedDocument.status.charAt(0).toUpperCase() + selectedDocument.status.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Document ID</label>
                    <p className="text-base font-mono text-sm">{selectedDocument.id}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submitted By</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">
                        {student.firstName} {student.lastName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status-specific information */}
              {selectedDocument.status === "rejected" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This document was rejected. Please review the feedback and upload a corrected version.
                  </AlertDescription>
                </Alert>
              )}

              {selectedDocument.status === "pending" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This document is currently under review. You will be notified once the review is complete.
                  </AlertDescription>
                </Alert>
              )}

              {selectedDocument.status === "approved" && (
                <Alert className="border-green-200 bg-green-50">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    This document has been approved and meets all requirements.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => window.open(selectedDocument.fileUrl, "_blank")}>
                  <Eye className="h-4 w-4 mr-2" />
                  Open Document
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
