"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { xanoClient } from "@/lib/xano-client"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from "lucide-react"

interface ConnectionStatus {
  configured: boolean
  reachable: boolean
  error?: string
  baseUrl?: string
  testing: boolean
}

export function XanoConnectionTest() {
  const [status, setStatus] = useState<ConnectionStatus>({
    configured: false,
    reachable: false,
    testing: false,
  })

  const testConnection = async () => {
    setStatus((prev) => ({ ...prev, testing: true, error: undefined }))

    try {
      const baseUrl = xanoClient.getBaseURL()
      const configured = xanoClient.isReady()

      if (!configured) {
        setStatus({
          configured: false,
          reachable: false,
          testing: false,
          baseUrl,
          error: "Xano workspace URL not configured or invalid",
        })
        return
      }

      // Test basic connectivity
      const isReachable = await xanoClient.healthCheck()

      if (isReachable) {
        setStatus({
          configured: true,
          reachable: true,
          testing: false,
          baseUrl,
        })
      } else {
        // Try a simple GET request to see if we get any response
        try {
          const response = await fetch(baseUrl, {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
          })

          setStatus({
            configured: true,
            reachable: false,
            testing: false,
            baseUrl,
            error: `Server responded with ${response.status}: ${response.statusText}`,
          })
        } catch (fetchError) {
          setStatus({
            configured: true,
            reachable: false,
            testing: false,
            baseUrl,
            error: fetchError instanceof Error ? fetchError.message : "Network error",
          })
        }
      }
    } catch (error) {
      setStatus({
        configured: false,
        reachable: false,
        testing: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const getStatusIcon = () => {
    if (status.testing) {
      return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
    }
    if (status.configured && status.reachable) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    if (status.configured && !status.reachable) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusText = () => {
    if (status.testing) return "Testing connection..."
    if (status.configured && status.reachable) return "Connected"
    if (status.configured && !status.reachable) return "Configuration issue"
    return "Not configured"
  }

  const getStatusColor = () => {
    if (status.testing) return "default"
    if (status.configured && status.reachable) return "default"
    if (status.configured && !status.reachable) return "secondary"
    return "destructive"
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Xano Connection Status
            </CardTitle>
            <CardDescription>Verify your connection to the Xano backend service</CardDescription>
          </div>
          <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Details */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Workspace URL:</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{status.baseUrl || "Not configured"}</code>
              {status.baseUrl && (
                <Button variant="ghost" size="sm" onClick={() => window.open(status.baseUrl, "_blank")}>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Configuration:</span>
            <Badge variant={status.configured ? "default" : "destructive"}>
              {status.configured ? "Valid" : "Invalid"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Connectivity:</span>
            <Badge variant={status.reachable ? "default" : "destructive"}>
              {status.reachable ? "Reachable" : "Unreachable"}
            </Badge>
          </div>
        </div>

        {/* Error Message */}
        {status.error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        {/* Status-specific guidance */}
        {!status.configured && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>To configure Xano:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Create a Xano workspace at xano.com</li>
                  <li>Copy your workspace API URL</li>
                  <li>Update NEXT_PUBLIC_XANO_WORKSPACE_URL in .env.local</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {status.configured && !status.reachable && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Connection issues detected:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Check if your Xano workspace is active</li>
                  <li>Verify the API URL is correct</li>
                  <li>Ensure CORS is configured in Xano</li>
                  <li>Check your internet connection</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {status.configured && status.reachable && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              ✅ Xano connection is working! You can now use real API endpoints instead of mock data.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={status.testing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${status.testing ? "animate-spin" : ""}`} />
            Test Again
          </Button>

          {!status.configured && (
            <Button variant="default" onClick={() => window.open("https://xano.com", "_blank")}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Xano
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
