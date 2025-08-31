export interface StorageQuota {
  used: number
  available: number
  percentage: number
}

export interface UserPreferences {
  userName: string
  theme: "light" | "dark" | "system"
  language: string
  autoSave: boolean
  notifications: boolean
}

export interface ProjectData {
  id: string
  name: string
  type: "article" | "keyword-research" | "super-page" | "bulk-generation"
  createdAt: number
  updatedAt: number
  data: any
  tags: string[]
  folder?: string
}

export interface FolderData {
  id: string
  name: string
  createdAt: number
  color?: string
  description?: string
}

class StorageManager {
  private readonly STORAGE_KEYS = {
    ARTICLES: "articlesList",
    PROJECTS: "projectsList",
    FOLDERS: "foldersList",
    USER_PREFERENCES: "userPreferences",
    KEYWORD_RESEARCH: "keywordResearchList",
    SUPER_PAGES: "superPagesList",
  } as const

  // Storage quota management
  async getStorageQuota(): Promise<StorageQuota> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        const used = estimate.usage || 0
        const available = estimate.quota || 0
        const percentage = available > 0 ? (used / available) * 100 : 0

        return { used, available, percentage }
      } catch (error) {
        console.error("[v0] Storage quota estimation failed:", error)
      }
    }

    // Fallback for browsers without storage API
    const used = this.getLocalStorageSize()
    const available = 5 * 1024 * 1024 // Assume 5MB limit
    const percentage = (used / available) * 100

    return { used, available, percentage }
  }

  private getLocalStorageSize(): number {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  }

  // Generic storage operations with error handling
  private setItem<T>(key: string, data: T): boolean {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(key, serialized)
      console.log(`[v0] Saved ${key} to localStorage`)
      return true
    } catch (error) {
      console.error(`[v0] Failed to save ${key}:`, error)
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        this.handleQuotaExceeded(key)
      }
      return false
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`[v0] Failed to parse ${key}:`, error)
      return defaultValue
    }
  }

  private handleQuotaExceeded(attemptedKey: string) {
    console.warn("[v0] Storage quota exceeded, attempting cleanup...")

    // Remove old articles first (keep only last 50)
    const articles = this.getArticles()
    if (articles.length > 50) {
      const trimmed = articles.slice(0, 50)
      this.setItem(this.STORAGE_KEYS.ARTICLES, trimmed)
      console.log(`[v0] Trimmed articles from ${articles.length} to 50`)
    }

    // Remove old keyword research (keep only last 20)
    const keywordResearch = this.getKeywordResearch()
    if (keywordResearch.length > 20) {
      const trimmed = keywordResearch.slice(0, 20)
      this.setItem(this.STORAGE_KEYS.KEYWORD_RESEARCH, trimmed)
      console.log(`[v0] Trimmed keyword research from ${keywordResearch.length} to 20`)
    }
  }

  // User preferences
  getUserPreferences(): UserPreferences {
    return this.getItem(this.STORAGE_KEYS.USER_PREFERENCES, {
      userName: "User",
      theme: "system" as const,
      language: "en-us",
      autoSave: true,
      notifications: true,
    })
  }

  setUserPreferences(preferences: Partial<UserPreferences>): boolean {
    const current = this.getUserPreferences()
    const updated = { ...current, ...preferences }
    return this.setItem(this.STORAGE_KEYS.USER_PREFERENCES, updated)
  }

  // Articles management
  getArticles(): any[] {
    const articles = this.getItem(this.STORAGE_KEYS.ARTICLES, [])
    return articles.sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0))
  }

  saveArticle(article: any): boolean {
    const articles = this.getArticles()
    const articleToStore = {
      ...article,
      imageUrl: undefined, // Remove large image data
      id: article.id || Date.now().toString(),
      timestamp: article.timestamp || Date.now(),
    }

    const newArticles = [articleToStore, ...articles]
    return this.setItem(this.STORAGE_KEYS.ARTICLES, newArticles)
  }

  deleteArticle(timestamp: number): boolean {
    const articles = this.getArticles()
    const filtered = articles.filter((article) => article.timestamp !== timestamp)
    return this.setItem(this.STORAGE_KEYS.ARTICLES, filtered)
  }

  // Keyword research management
  getKeywordResearch(): any[] {
    return this.getItem(this.STORAGE_KEYS.KEYWORD_RESEARCH, [])
  }

  saveKeywordResearch(research: any): boolean {
    const existing = this.getKeywordResearch()
    const researchToStore = {
      ...research,
      id: research.id || Date.now().toString(),
      timestamp: research.timestamp || Date.now(),
    }

    const newResearch = [researchToStore, ...existing]
    return this.setItem(this.STORAGE_KEYS.KEYWORD_RESEARCH, newResearch)
  }

  // Super pages management
  getSuperPages(): any[] {
    return this.getItem(this.STORAGE_KEYS.SUPER_PAGES, [])
  }

  saveSuperPage(superPage: any): boolean {
    const existing = this.getSuperPages()
    const superPageToStore = {
      ...superPage,
      id: superPage.id || Date.now().toString(),
      timestamp: superPage.timestamp || Date.now(),
    }

    const newSuperPages = [superPageToStore, ...existing]
    return this.setItem(this.STORAGE_KEYS.SUPER_PAGES, newSuperPages)
  }

  // Folders management
  getFolders(): FolderData[] {
    return this.getItem(this.STORAGE_KEYS.FOLDERS, [])
  }

  createFolder(name: string, color?: string, description?: string): FolderData {
    const folder: FolderData = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      color,
      description,
    }

    const folders = this.getFolders()
    const newFolders = [...folders, folder]
    this.setItem(this.STORAGE_KEYS.FOLDERS, newFolders)

    return folder
  }

  deleteFolder(folderId: string): boolean {
    const folders = this.getFolders()
    const filtered = folders.filter((folder) => folder.id !== folderId)
    return this.setItem(this.STORAGE_KEYS.FOLDERS, filtered)
  }

  // Projects management (unified system)
  getProjects(): ProjectData[] {
    return this.getItem(this.STORAGE_KEYS.PROJECTS, [])
  }

  saveProject(project: Omit<ProjectData, "id" | "createdAt" | "updatedAt">): boolean {
    const projects = this.getProjects()
    const projectToStore: ProjectData = {
      ...project,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const newProjects = [projectToStore, ...projects]
    return this.setItem(this.STORAGE_KEYS.PROJECTS, newProjects)
  }

  updateProject(id: string, updates: Partial<ProjectData>): boolean {
    const projects = this.getProjects()
    const updatedProjects = projects.map((project) =>
      project.id === id ? { ...project, ...updates, updatedAt: Date.now() } : project,
    )
    return this.setItem(this.STORAGE_KEYS.PROJECTS, updatedProjects)
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects()
    const filtered = projects.filter((project) => project.id !== id)
    return this.setItem(this.STORAGE_KEYS.PROJECTS, filtered)
  }

  // Data export/import
  exportAllData(): string {
    const data = {
      articles: this.getArticles(),
      projects: this.getProjects(),
      folders: this.getFolders(),
      keywordResearch: this.getKeywordResearch(),
      superPages: this.getSuperPages(),
      userPreferences: this.getUserPreferences(),
      exportedAt: Date.now(),
      version: "1.0",
    }

    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      if (data.articles) this.setItem(this.STORAGE_KEYS.ARTICLES, data.articles)
      if (data.projects) this.setItem(this.STORAGE_KEYS.PROJECTS, data.projects)
      if (data.folders) this.setItem(this.STORAGE_KEYS.FOLDERS, data.folders)
      if (data.keywordResearch) this.setItem(this.STORAGE_KEYS.KEYWORD_RESEARCH, data.keywordResearch)
      if (data.superPages) this.setItem(this.STORAGE_KEYS.SUPER_PAGES, data.superPages)
      if (data.userPreferences) this.setItem(this.STORAGE_KEYS.USER_PREFERENCES, data.userPreferences)

      console.log("[v0] Data import completed successfully")
      return true
    } catch (error) {
      console.error("[v0] Data import failed:", error)
      return false
    }
  }

  // Cleanup operations
  clearAllData(): boolean {
    try {
      Object.values(this.STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      console.log("[v0] All data cleared successfully")
      return true
    } catch (error) {
      console.error("[v0] Failed to clear data:", error)
      return false
    }
  }

  // Search functionality
  searchContent(query: string): any[] {
    const articles = this.getArticles()
    const projects = this.getProjects()
    const keywordResearch = this.getKeywordResearch()

    const searchTerm = query.toLowerCase()
    const results: any[] = []

    // Search articles
    articles.forEach((article) => {
      if (article.title?.toLowerCase().includes(searchTerm) || article.article?.toLowerCase().includes(searchTerm)) {
        results.push({ ...article, type: "article" })
      }
    })

    // Search projects
    projects.forEach((project) => {
      if (project.name?.toLowerCase().includes(searchTerm)) {
        results.push({ ...project, type: "project" })
      }
    })

    // Search keyword research
    keywordResearch.forEach((research) => {
      if (research.keyword?.toLowerCase().includes(searchTerm)) {
        results.push({ ...research, type: "keyword-research" })
      }
    })

    return results
  }
}

export const storage = new StorageManager()
