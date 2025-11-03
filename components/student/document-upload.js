"use client"

import {
	AlertCircle,
	Check,
	CircleAlert,
	CircleCheck,
	CircleDashed,
	Eye,
	File,
	FileText,
	RectangleEllipsis,
	Upload,
	User,
	X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { getDocuments, getProfile } from "@/lib/student_info"

export function DocumentUpload({ onUploadComplete }) {
	const { user, updateDocuments } = useAuth()
	const fileInputRef = useRef(null)
	const [formData, setFormData] = useState({
		id: "",
		document: null,
		type: "",
	})
	const [documents, setDocuments] = useState()
	const [profile, setProfile] = useState()
	const [uploading, setUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [error, setError] = useState("")
	const [documentSuccess, setDocumentSuccess] = useState(null)
	const [documentError, setDocumentError] = useState(null)
	const [dragActive, setDragActive] = useState(false)
	const [currentFileName, setCurrentFileName] = useState("")
	const [selectedDocumentType, setSelectedDocumentType] = useState("")
	const [selectedDocument, setSelectedDocument] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [pendingFile, setPendingFile] = useState(null)
	const [previewUrl, setPreviewUrl] = useState(null)
	const [isImagePreview, setIsImagePreview] = useState(false)

	const documentTypes = [
		{
			value: "birth_certificate",
			label: "Birth Certificate",
			description: "PSA Birth Certificate",
		},
		{
			value: "good_moral",
			label: "Good Moral",
			description: "Official Good Moral",
		},
		{
			value: "grade_card",
			label: "Grade Card",
			description: "Official Grade Card",
		},
	]

	const acceptedFileTypes = [".pdf", ".jpg", ".jpeg", ".png"]
	const maxFileSize = 5 * 1024 * 1024 // 5MB

	const documentsData = async () => {
		const data = await getDocuments(user.id)

		const dataObject = [
			{
				type: "birth_certificate",
				name: data.birth_certificate,
				status: data.birth_certificate_status,
			},
			{
				type: "good_moral",
				name: data.good_moral,
				status: data.good_moral_status,
			},
			{
				type: "grade_card",
				name: data.grade_card,
				status: data.grade_card_status,
			},
		]
		setDocuments(dataObject)
	}

	const profileData = async () => {
		const data = await getProfile(user.id)
		setProfile(data)
	}

	useEffect(() => {
		if (previewUrl) URL.revokeObjectURL(previewUrl)

		if (!user) return

		documentsData()
		profileData()
	}, [user, previewUrl])

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

		handleFiles(e?.dataTransfer?.files)
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

		const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
		if (!acceptedFileTypes.includes(fileExtension)) {
			return "File type not supported. Please upload PDF, JPG, or PNG files"
		}

		if (!selectedDocumentType) {
			return "Please select a document type before uploading"
		}

		return null
	}

	const handleFiles = async (files) => {
		if (!files[0]) return

		const validationError = validateFile(files[0])
		if (validationError) {
			setError(validationError)
			return
		}

		setError("")
		// hold the file for explicit submit by user
		setPendingFile(files[0])
		setCurrentFileName(files[0].name)

		if (!user) return
		setFormData({
			id: user.id,
			document: files[0],
			type: selectedDocumentType,
		})

		const objectUrl = URL.createObjectURL(files[0])
		setPreviewUrl(objectUrl)
		setIsImagePreview(files[0].type?.startsWith("image/"))
	}

	const submitFile = async () => {
		if (!pendingFile) return

		setUploading(true)
		setUploadProgress(0)

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

			const result = await updateDocuments({
				...formData,
			})

			setUploadProgress(100)

			if (result.success) {
				setDocumentSuccess(result.message || "Document update successful")
			} else {
				setDocumentError(result.error || "Document update failed")
			}

			setTimeout(() => {
				setUploading(false)
				setUploadProgress(0)
				setCurrentFileName("")
				setSelectedDocumentType("")
				setPendingFile(null)
				if (previewUrl) {
					URL.revokeObjectURL(previewUrl)
					setPreviewUrl(null)
					setIsImagePreview(false)
				}
				onUploadComplete?.()
			}, 500)
		} catch (err) {
			setError(err.message || "Upload failed. Please try again.")
			setUploading(false)
			setUploadProgress(0)
			setCurrentFileName("")
		}
	}

	const removeSelectedFile = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl)
			setPreviewUrl(null)
		}
		setPendingFile(null)
		setCurrentFileName("")
	}

	// memoize status mapping so derived status values are recomputed only when `documents` changes
	const documentStatusMap = useMemo(() => {
		if (!documents) return {}
		return {
			birth_certificate: documents[0].status ?? 0,
			good_moral: documents[1].status ?? 0,
			grade_card: documents[2].status ?? 0,
		}
	}, [documents])

	const getDocumentStatus = (docType) => {
		return documentStatusMap[docType] ?? 0
	}

	const statusIconMap = useMemo(() => {
		return {
			1: <CircleDashed className="h-4 w-4 text-gray-500" />,
			2: <RectangleEllipsis className="h-4 w-4 text-blue-500" />,
			3: <Check className="h-4 w-4 text-green-500" />,
			4: <X className="h-4 w-4 text-red-500" />,
			5: <AlertCircle className="h-4 w-4 text-yellow-500" />,
			default: <Upload className="h-4 w-4 text-gray-400" />,
		}
	}, [])

	const getStatusIcon = (status) => {
		return statusIconMap[status] ?? statusIconMap.default
	}

	// memoized mapping of status -> badge to avoid recreating elements on each render
	const statusBadgeMap = useMemo(() => {
		return {
			1: <Badge className="bg-gray-500 text-white">Pending</Badge>,
			2: <Badge className="bg-blue-500 text-white">In Progress</Badge>,
			3: <Badge className="bg-green-500 text-white">Approved</Badge>,
			4: <Badge className="bg-red-500 text-white">Rejected</Badge>,
			5: <Badge className="bg-yellow-500">Incomplete</Badge>,
			default: <Badge variant="secondary">Not Uploaded</Badge>,
		}
	}, [])

	const getStatusBadge = (status) => {
		return statusBadgeMap[status] ?? statusBadgeMap.default
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
		const docSelected = documents.find((d) => d.type === doc.value)
		setSelectedDocument(docSelected)
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
						Upload your required documents. Accepted formats: PDF, JPG, PNG (max
						5MB each)
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="mb-6">
						<span className="text-sm font-medium mb-2 block">
							Document Type
						</span>
						<Select
							value={selectedDocumentType}
							onValueChange={setSelectedDocumentType}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select document type..." />
							</SelectTrigger>
							<SelectContent>
								{documentTypes.map((docType) => (
									<SelectItem key={docType.value} value={docType.value}>
										<div>
											<div className="font-medium">{docType.label}</div>
											<div className="text-xs text-muted-foreground">
												{docType.description}
											</div>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div
						className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
							dragActive
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25"
						} ${uploading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-primary/50"}`}
						role="document"
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
						onClick={() => !uploading && fileInputRef.current?.click()}
						onKeyPress={() => !uploading && fileInputRef.current?.click()}
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
									<p className="text-lg font-semibold text-primary">
										{currentFileName}
									</p>
									<p className="text-sm text-muted-foreground">
										{getDocumentTypeLabel(selectedDocumentType)}
									</p>
									<p className="text-sm font-medium">Uploading document...</p>
									<Progress
										value={uploadProgress}
										className="w-full max-w-xs mx-auto"
									/>
									<p className="text-xs text-muted-foreground">
										{uploadProgress}% complete
									</p>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
									<Upload className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-lg font-medium">
										Drop files here or click to browse
									</p>
									<p className="text-sm text-muted-foreground">
										Supports PDF, JPG, PNG files up to 5MB
									</p>
									{!selectedDocumentType && (
										<p className="text-sm text-amber-600 mt-2">
											Please select a document type first
										</p>
									)}
								</div>

								{/* Pending file preview + actions */}
								{pendingFile && (
									<div className="mt-4 flex flex-col items-center gap-3">
										<div className="flex items-center gap-3">
											{isImagePreview ? (
												<Image
													src={previewUrl}
													alt={currentFileName}
													className="h-20 w-20 object-contain rounded"
													width={200}
													height={200}
												/>
											) : (
												<div className="flex items-center gap-2">
													<File className="h-6 w-6 text-muted-foreground" />
													<span
														className="text-sm font-medium max-w-xs truncate"
														title={currentFileName}
													>
														{currentFileName}
													</span>
												</div>
											)}
										</div>
										<div className="flex gap-2 mt-5">
											<Button
												onClick={(e) => {
													e.stopPropagation()
													submitFile()
												}}
												disabled={!pendingFile || uploading}
											>
												Submit
											</Button>
											<Button
												variant="outline"
												onClick={(e) => {
													e.stopPropagation()
													removeSelectedFile()
												}}
												disabled={uploading}
											>
												Remove
											</Button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
					{documentSuccess && (
						<Alert className="mt-5 text-green-700">
							<CircleCheck />
							<AlertDescription className="text-green-700">
								{documentSuccess}
							</AlertDescription>
						</Alert>
					)}

					{documentError && (
						<Alert variant="destructive" className="mt-5">
							<CircleAlert />
							<AlertDescription>{documentError}</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Required Documents</CardTitle>
					<CardDescription>
						Track your document submission progress
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{documentTypes.map((doc) => {
							const status = getDocumentStatus(doc.value)
							return (
								<div
									key={doc.value}
									className="flex items-center justify-between p-4 border rounded-lg"
								>
									<div className="flex items-center space-x-3">
										{getStatusIcon(status)}
										<div>
											<h4 className="font-medium">{doc.label}</h4>
											<p className="text-sm text-muted-foreground">
												{doc.description}
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										{/* {getStatusBadge(status)} */}
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleViewDocument(doc)}
										>
											<Eye className="h-4 w-4 mr-1" />
											View
										</Button>
									</div>
								</div>
							)
						})}
					</div>
				</CardContent>
			</Card>

			{/* {documents && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>Manage your submitted documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                       <h4 className="font-semibold text-base max-w-xs truncate" title={doc.name}>{doc.name}</h4>
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
      )} */}

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="min-w-xl max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Document Details
						</DialogTitle>
						<DialogDescription>
							View detailed information about your uploaded document
						</DialogDescription>
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
											<h3
												className="font-semibold text-lg max-w-xs truncate"
												title={selectedDocument.name}
											>
												{selectedDocument.name}
											</h3>
											<p className="text-sm text-muted-foreground">
												{getDocumentTypeDescription(selectedDocument.type)}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										{getStatusBadge(selectedDocument.status)}
									</div>
								</div>

								{/* Document preview placeholder */}
								<Link href={selectedDocument.name} target="_blank">
									<div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
										<div className="text-center">
											<File className="h-12 w-12 text-gray-400 mx-auto mb-2" />
											<p className="text-sm text-gray-500">Document Preview</p>
											<p className="text-xs text-gray-400">
												Click to view full document
											</p>
										</div>
									</div>
								</Link>
							</div>

							{/* Document Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-4">
									<div>
										<span className="text-sm font-medium text-muted-foreground">
											Document Type
										</span>
										<p className="text-base font-semibold">
											{getDocumentTypeLabel(selectedDocument.type)}
										</p>
									</div>

									<div>
										<span className="text-sm font-medium text-muted-foreground">
											File Name
										</span>
										<p
											className="text-base max-w-xs truncate"
											title={selectedDocument.name}
										>
											{selectedDocument.name}
										</p>
									</div>

									{/* <div>
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
                  </div> */}
								</div>

								<div className="space-y-4">
									<div>
										<span className="text-sm font-medium text-muted-foreground">
											Status
										</span>
										<div className="flex items-center gap-2 mt-1">
											{/* {getStatusIcon(selectedDocument.status)} */}
											<p
												className={`text-base font-medium ${getStatusColor(selectedDocument.status)}`}
											>
												{getStatusBadge(selectedDocument.status)}
											</p>
										</div>
									</div>

									{/* <div>
                    <label className="text-sm font-medium text-muted-foreground">Document ID</label>
                    <p className="text-base font-mono text-sm">{selectedDocument.id}</p>
                  </div> */}

									<div>
										<span className="text-sm font-medium text-muted-foreground">
											Submitted By
										</span>
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-muted-foreground" />
											<p className="text-base">
												{profile.first_name} {profile.surname}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Status-specific information */}
							{selectedDocument.status === 1 && (
								<Alert>
									<CircleDashed className="h-4 w-4" />
									<AlertDescription>
										This document is currently under review. You will be
										notified once the review is complete.
									</AlertDescription>
								</Alert>
							)}

							{selectedDocument.status === 2 && (
								<Alert className="border-blue-200 bg-blue-50">
									<RectangleEllipsis className="h-4 w-4 text-blue-600" />
									<AlertDescription className="text-blue-800">
										Document in progress — we&apos;ll notify you when it&apos;s
										complete (1–3 business days).
									</AlertDescription>
								</Alert>
							)}

							{selectedDocument.status === 3 && (
								<Alert className="border-green-200 bg-green-50">
									<Check className="h-4 w-4 text-green-600" />
									<AlertDescription className="text-green-800">
										This document has been approved and meets all requirements.
									</AlertDescription>
								</Alert>
							)}

							{selectedDocument.status === 4 && (
								<Alert variant="destructive">
									<X className="h-4 w-4" />
									<AlertDescription>
										This document was rejected. Please review the feedback and
										upload a corrected version.
									</AlertDescription>
								</Alert>
							)}

							{selectedDocument.status === 5 && (
								<Alert className="border-yellow-200 bg-yellow-50">
									<AlertCircle className="h-4 w-4 text-yellow-600" />
									<AlertDescription className="text-yellow-800">
										Document incomplete — please resubmit with the missing
										information.
									</AlertDescription>
								</Alert>
							)}

							{/* Action buttons */}
							<div className="flex justify-end gap-2 pt-4 border-t">
								<Button variant="outline" onClick={() => setIsModalOpen(false)}>
									Close
								</Button>
								<Button
									onClick={() => window.open(selectedDocument.name, "_blank")}
								>
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
