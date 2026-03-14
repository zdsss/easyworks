const DB_NAME = 'easywork-offline'
const STORE = 'queue'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
    }
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function enqueue(item) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req = store.add({ ...item, timestamp: Date.now() })
    req.onsuccess = () => resolve(req.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function getQueue() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function dequeue(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror = (e) => reject(e.target.error)
  })
}

/**
 * Process the offline queue in order.
 * Items with a `chainId` are treated as a chain: if one item in a chain fails,
 * all subsequent items with the same chainId are skipped (removed from queue).
 * Returns a summary: { processed, skipped, failed }
 */
export async function processQueue(httpInstance) {
  let items
  try {
    items = await getQueue()
  } catch {
    return
  }

  const failedChains = new Set()
  let skipped = 0

  for (const item of items) {
    // If this item belongs to a failed chain, skip it
    if (item.chainId && failedChains.has(item.chainId)) {
      await dequeue(item.id)
      skipped++
      continue
    }

    try {
      await httpInstance({ method: item.method, url: item.url, data: item.body })
      await dequeue(item.id)
    } catch (e) {
      if (e.response) {
        // Server rejected (4xx/5xx) - discard to avoid infinite retry
        await dequeue(item.id)
        if (item.chainId) {
          failedChains.add(item.chainId)
        }
      }
      // Network error: keep in queue for next time, but break chain
      if (!e.response && item.chainId) {
        failedChains.add(item.chainId)
      }
    }
  }

  if (skipped > 0) {
    console.warn(`[offlineQueue] ${skipped} item(s) skipped due to chain failures. Please check manually.`)
  }
}
