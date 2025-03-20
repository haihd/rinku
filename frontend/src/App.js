"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { PlusCircle, Trash2 } from "lucide-react"
import { ThemeToggle } from "./components/ui/theme-toggle"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Textarea } from "./components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"

function App() {
  const [links, setLinks] = useState([])
  const [form, setForm] = useState({ url: "", title: "", description: "" })
  const [urlError, setUrlError] = useState("")

  const API_URL = "https://reimagined-space-xylophone-pqqrwx4pr5f6r95-5000.app.github.dev"

  useEffect(() => {
    fetchLinks()
    // Check for saved theme
    const savedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.classList.add(savedTheme)
  }, [])

  const fetchLinks = async () => {
    const response = await axios.get(`${API_URL}/api/links`)
    setLinks(response.data)
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
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

    await axios.post(`${API_URL}/api/links`, form)
    setForm({ url: "", title: "", description: "" })
    setUrlError("")
    fetchLinks()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/links/${id}`)
    fetchLinks()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Rinku</h1>
        <ThemeToggle />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Bookmark</CardTitle>
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
                placeholder="Website Title"
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

            <Button type="submit" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Bookmark
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Bookmarks</CardTitle>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No bookmarks added yet. Add your first bookmark above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">URL</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="w-[80px]">Action</TableHead>
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
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(link.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
