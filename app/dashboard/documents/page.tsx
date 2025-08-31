"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, FileText, Folder, Trash2, Pencil, Plus, Search } from "lucide-react"
import type { ArticleState } from "../article-writer/actions"
import Link from "next/link"
import { storage, type FolderData } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { StorageMonitor } from "@/components/storage-monitor"

export default function DocumentsPage() {
  const [articles, setArticles] = useState<ArticleState[]>([])
  const [folders, setFolders] = useState<FolderData[]>([])
  const [selectedArticle, setSelectedArticle] = useState<ArticleState | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const storedArticles = storage.getArticles()
    const storedFolders = storage.getFolders()

    setArticles(storedArticles)
    setFolders(storedFolders)
  }

  const handleDelete = (timestamp: number) => {
    const success = storage.deleteArticle(timestamp)
    if (success) {
      setArticles((prev) => prev.filter((article) => article.timestamp !== timestamp))
      toast({
        title: "Article Deleted",
        description: "The article has been deleted successfully.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete the article. Please try again.",
      })
    }
  }

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return

    if (confirm(`Are you sure you want to delete ${selectedItems.size} article(s)?`)) {
      let successCount = 0
      selectedItems.forEach((timestamp) => {
        if (storage.deleteArticle(timestamp)) {
          successCount++
        }
      })

      if (successCount > 0) {
        loadData()
        setSelectedItems(new Set())
        toast({
          title: "Articles Deleted",
          description: `${successCount} article(s) deleted successfully.`,
        })
      }
    }
  }

  const handleView = (article: ArticleState) => {
    setSelectedArticle(article)
    setIsViewDialogOpen(true)
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    const folder = storage.createFolder(newFolderName.trim())
    setFolders((prev) => [...prev, folder])
    setNewFolderName("")
    setIsNewFolderDialogOpen(false)

    toast({
      title: "Folder Created",
      description: `Folder "${folder.name}" has been created successfully.`,
    })
  }

  const handleDeleteFolder = (folderId: string) => {
    if (confirm("Are you sure you want to delete this folder?")) {
      const success = storage.deleteFolder(folderId)
      if (success) {
        setFolders((prev) => prev.filter((folder) => folder.id !== folderId))
        toast({
          title: "Folder Deleted",
          description: "The folder has been deleted successfully.",
        })
      }
    }
  }

  const filteredArticles = articles.filter(
    (article) =>
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.article?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredArticles.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredArticles.map((article) => article.timestamp!)))
    }
  }

  const toggleSelectItem = (timestamp: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(timestamp)) {
      newSelected.delete(timestamp)
    } else {
      newSelected.add(timestamp)
    }
    setSelectedItems(newSelected)
  }

  return (
    <div className="w-full space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Documents</h1>
          <span className="text-muted-foreground">
            {articles.length} {articles.length === 1 ? "document" : "documents"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Folder
          </Button>
          <Button asChild>
            <Link href="/dashboard/article-writer">
              <Plus className="mr-2 h-4 w-4" /> New Document
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Search and bulk actions */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedItems.size > 0 && (
              <Button variant="outline" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedItems.size})
              </Button>
            )}
          </div>

          {/* Folders Section */}
          {folders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Folders</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <div key={folder.id} className="group relative">
                    <div className="flex items-center p-4 rounded-lg border bg-card hover:bg-secondary cursor-pointer transition-colors">
                      <Folder className="w-6 h-6 mr-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground truncate">{folder.name}</p>
                        <p className="text-sm text-muted-foreground">0 files</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteFolder(folder.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 items-center p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
                <div className="col-span-1 flex items-center">
                  <Checkbox
                    checked={selectedItems.size === filteredArticles.length && filteredArticles.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
                <div className="col-span-6">NAME</div>
                <div className="col-span-3">LAST MODIFIED</div>
                <div className="col-span-2"></div>
              </div>

              <div>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <div
                      key={article.timestamp}
                      className="grid grid-cols-12 gap-4 items-center p-4 border-b last:border-b-0"
                    >
                      <div className="col-span-1 flex items-center">
                        <Checkbox
                          checked={selectedItems.has(article.timestamp!)}
                          onCheckedChange={() => toggleSelectItem(article.timestamp!)}
                        />
                      </div>
                      <div className="col-span-6 flex items-center gap-3">
                        <div className="bg-secondary p-2 rounded-md">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-medium text-foreground truncate">{article.title}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-sm text-muted-foreground">
                          {article.timestamp ? new Date(article.timestamp).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleView(article)}>
                              <Pencil className="mr-2 h-4 w-4" /> View/Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleDelete(article.timestamp!)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-16 flex flex-col items-center justify-center text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">
                      {searchQuery ? "No matching documents" : "No documents yet"}
                    </h3>
                    <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
                      {searchQuery
                        ? "Try adjusting your search terms."
                        : "Create your first article and it will appear here."}
                    </p>
                    {!searchQuery && (
                      <Button asChild>
                        <Link href="/dashboard/article-writer">New Document</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Storage Monitor Sidebar */}
        <div className="space-y-6">
          <StorageMonitor />
        </div>
      </div>

      {/* View/Edit Dialog */}
      {selectedArticle && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedArticle.title}</DialogTitle>
              <DialogDescription>
                Generated on {selectedArticle.timestamp ? new Date(selectedArticle.timestamp).toLocaleString() : "N/A"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow grid grid-rows-[auto_1fr] gap-4 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.article || "" }}
                />
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder to organize your documents.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder-name" className="text-right">
                Name
              </Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New Folder"
                className="col-span-3"
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
