"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { PlusCircle, Trash2, Share2, ExternalLink } from "lucide-react"
import { LoadingSpinner, LoadingOverlay } from "./components/ui/loading"
import { ThemeToggle } from "./components/ui/theme-toggle"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Textarea } from "./components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Toast } from "./components/ui/toast"

function App() {
  const [links, setLinks] = useState([])
  const [form, setForm] = useState({ url: "", title: "", description: "" })
  const [urlError, setUrlError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(null)
  const [showToast, setShowToast] = useState(false)

  const API_URL = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {
    fetchLinks()
    // Check for saved theme
    const savedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.classList.add(savedTheme)
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/links`)
      setLinks(response.data)
    } catch (error) {
      console.error('Failed to fetch links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      setShowToast(true)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleOpenLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.url) {
      setUrlError("URL is required")
      return
    }

    if (!validateUrl(form.url)) {
      setUrlError("Please enter a valid URL")
      return
    }

    setIsSubmitting(true)
    try {
      await axios.post(`${API_URL}/api/links`, form)
      setForm({ url: "", title: "", description: "" })
      setUrlError("")
      await fetchLinks()
    } catch (error) {
      console.error('Failed to add link:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setIsDeleting(id)
    try {
      await axios.delete(`${API_URL}/api/links/${id}`)
      await fetchLinks()
    } catch (error) {
      console.error('Failed to delete link:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">🔗rinku</h1>
        <ThemeToggle />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com"
                value={form.url}
                onChange={(e) => {
                  setForm({ ...form, url: e.target.value })
                  setUrlError("")
                }}
                className={urlError ? "border-red-500" : ""}
              />
              {urlError && <p className="text-sm text-red-500">{urlError}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Link Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add a description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner className="mr-2" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Adding..." : "Add Link"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner className="py-8" />
          ) : links.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No links added yet. Add your first link above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">URL</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="w-[160px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{link.title || "Untitled"}</div>
                          <div className="text-sm text-muted-foreground md:hidden truncate max-w-[200px]">
                            {link.url}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate block max-w-[200px]"
                        >
                          {link.url}
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="truncate max-w-[300px]">{link.description || "No description"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleOpenLink(link.url)}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open</span>
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleCopyUrl(link.url)}
                          >
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(link.id)}
                            disabled={isDeleting === link.id}
                          >
                            {isDeleting === link.id ? (
                              <LoadingSpinner className="h-4 w-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {showToast && (
        <Toast 
          message="URL copied to clipboard!" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  )
}

export default App
