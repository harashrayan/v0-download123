"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Download, Upload, Trash2, AlertTriangle } from "lucide-react"
import { storage, type StorageQuota } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export function StorageMonitor() {
  const [quota, setQuota] = useState<StorageQuota>({ used: 0, available: 0, percentage: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStorageInfo()
  }, [])

  const loadStorageInfo = async () => {
    try {
      const quotaInfo = await storage.getStorageQuota()
      setQuota(quotaInfo)
    } catch (error) {
      console.error("[v0] Failed to load storage info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    try {
      const data = storage.exportAllData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `floral-verse-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
      })
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const success = storage.importData(content)

        if (success) {
          toast({
            title: "Import Successful",
            description: "Your data has been imported successfully.",
          })
          loadStorageInfo()
        } else {
          throw new Error("Import failed")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "Failed to import data. Please check the file format.",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      const success = storage.clearAllData()
      if (success) {
        toast({
          title: "Data Cleared",
          description: "All data has been cleared successfully.",
        })
        loadStorageInfo()
      } else {
        toast({
          variant: "destructive",
          title: "Clear Failed",
          description: "Failed to clear data. Please try again.",
        })
      }
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStorageStatus = () => {
    if (quota.percentage > 90) return { color: "destructive", icon: AlertTriangle }
    if (quota.percentage > 70) return { color: "warning", icon: AlertTriangle }
    return { color: "default", icon: HardDrive }
  }

  const status = getStorageStatus()
  const StatusIcon = status.icon

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-2 bg-muted rounded mb-4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          Storage Usage
        </CardTitle>
        <CardDescription>Manage your local storage and data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Used: {formatBytes(quota.used)}</span>
            <span>Available: {formatBytes(quota.available)}</span>
          </div>
          <Progress value={quota.percentage} className="h-2" />
          <div className="flex justify-between items-center">
            <Badge variant={quota.percentage > 90 ? "destructive" : quota.percentage > 70 ? "secondary" : "default"}>
              {quota.percentage.toFixed(1)}% used
            </Badge>
            {quota.percentage > 80 && (
              <span className="text-xs text-muted-foreground">Consider cleaning up old data</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label>
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearData}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
