import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TerminalIcon, CheckCircleIcon, Loader2, XCircleIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from '@/components/ui/separator';

type MigrationResult = {
  message: string;
  success: boolean;
  migrated?: number;
  errors?: number;
  total?: number;
  error?: string;
};

const MigratePage: React.FC = () => {
  const [adminToken, setAdminToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMigration = async () => {
    if (!adminToken) {
      setError('Admin token is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiRequest<MigrationResult>('/api/admin/migrate-problems', {
        method: 'POST',
        headers: {
          'X-Admin-Token': adminToken
        }
      });

      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to start migration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!adminToken) {
      setError('Admin token is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest<{success: boolean; postgresConnection: string; mongoConnection: string; timestamp: string}>('/api/admin/db-status', {
        method: 'GET',
        headers: {
          'X-Admin-Token': adminToken
        }
      });

      setResult({
        message: 'Database status checked successfully',
        success: response.success,
        ...response
      });
    } catch (err: any) {
      setError(err.message || 'Failed to check database status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Database Migration Tool</CardTitle>
          <CardDescription>
            Migrate problem data from MongoDB to PostgreSQL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Admin Token
            </label>
            <Input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Enter admin token"
              className="w-full"
            />
          </div>

          <div className="flex space-x-4 pt-2">
            <Button 
              onClick={handleMigration} 
              disabled={isLoading || !adminToken}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <TerminalIcon className="h-4 w-4 mr-2" />
                  Migrate Problems
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleCheckStatus} 
              disabled={isLoading || !adminToken}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <TerminalIcon className="h-4 w-4 mr-2" />
                  Check DB Status
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <Separator />
              <h3 className="text-lg font-semibold flex items-center">
                {result.success ? (
                  <><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> Success</>
                ) : (
                  <><XCircleIcon className="h-5 w-5 text-red-500 mr-2" /> Failed</>
                )}
              </h3>
              <p className="text-muted-foreground">{result.message}</p>
              
              {(result.migrated !== undefined || result.total !== undefined) && (
                <div className="bg-muted p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    {result.total !== undefined && (
                      <>
                        <div className="text-sm font-medium">Total Problems:</div>
                        <div>{result.total}</div>
                      </>
                    )}
                    {result.migrated !== undefined && (
                      <>
                        <div className="text-sm font-medium">Migrated:</div>
                        <div>{result.migrated}</div>
                      </>
                    )}
                    {result.errors !== undefined && (
                      <>
                        <div className="text-sm font-medium">Errors:</div>
                        <div>{result.errors}</div>
                      </>
                    )}
                    {result.error && (
                      <>
                        <div className="text-sm font-medium">Error:</div>
                        <div className="text-red-500">{result.error}</div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MigratePage;