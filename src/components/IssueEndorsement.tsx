import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, AlertTriangle, LogOut, User, Loader2, TrendingUp, Users } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mysqlService } from '@/services/mysqlService';
import LoginForm from './LoginForm';
import IssueResolutionManager from './IssueResolutionManager';

const IssueEndorsement = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch approved issues with resolution field
  const { data: approvedIssues = [], isLoading: loadingApproved, error: approvedError } = useQuery({
    queryKey: ['approved-issues'],
    queryFn: async () => {
      try {
        const response = await fetch(`${mysqlService.apiBaseUrl}/issues?status=approved`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch approved issues: ${response.status}`);
        }
        
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error('Error fetching approved issues:', error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  // Fetch rejected issues
  const { data: rejectedIssues = [], isLoading: loadingRejected, error: rejectedError } = useQuery({
    queryKey: ['rejected-issues'],
    queryFn: async () => {
      try {
        const response = await fetch(`${mysqlService.apiBaseUrl}/rejected-issues`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch rejected issues: ${response.status}`);
        }
        
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error('Error fetching rejected issues:', error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  // Fetch pending issues to get the count
  const { data: pendingIssues = [], isLoading: loadingPending, error: pendingError } = useQuery({
    queryKey: ['pending-issues-count'],
    queryFn: async () => {
      try {
        const response = await fetch(`${mysqlService.apiBaseUrl}/pending-issues`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch pending issues: ${response.status}`);
        }
        
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error('Error fetching pending issues:', error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['pending-issues'] });
    queryClient.invalidateQueries({ queryKey: ['pending-issues-count'] });
    queryClient.invalidateQueries({ queryKey: ['approved-issues'] });
    queryClient.invalidateQueries({ queryKey: ['rejected-issues'] });
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden flex items-center justify-center py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(68,138,255,0.05)_25%,_rgba(68,138,255,0.05)_50%,_transparent_50%,_transparent_75%,_rgba(68,138,255,0.05)_75%)] bg-[length:20px_20px] pointer-events-none" />
        <div className="relative w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 z-10 items-center">
          {/* Left: Highlighted content (no Card) */}
          <div className="flex flex-col justify-center px-2 md:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3 drop-shadow-lg">
              Issue Detection & Endorsement
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 drop-shadow-sm">
              Login to review, approve, or reject detected customer issues securely.
            </p>
            <ul className="space-y-4 mt-4 text-xl text-gray-900 font-medium text-left">
              <li className="flex items-center hover:translate-x-2 transition-transform duration-200">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" /> 
                <span>Approve or reject issues</span>
              </li>
              <li className="flex items-center hover:translate-x-2 transition-transform duration-200">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" /> 
                <span>Track issue status</span>
              </li>
              <li className="flex items-center hover:translate-x-2 transition-transform duration-200">
                <Users className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" /> 
                <span>Supervisor & admin access</span>
              </li>
              <li className="flex items-center hover:translate-x-2 transition-transform duration-200">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" /> 
                <span>Add resolution notes</span>
              </li>
            </ul>
          </div>
          {/* Right: Login Form */}
          <div className="flex items-center justify-center"><LoginForm /></div>
        </div>
      </div>
    );
  }

  // Show errors if any queries failed
  if (approvedError || rejectedError || pendingError) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Error loading data. Please check your connection and try again.
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Issue Detection & Endorsement
              </CardTitle>
              <CardDescription className="text-gray-600 max-w-2xl">
                Review automatically detected issues and their suggested resolutions. 
                Approve, reject, or edit issues before they become part of the master knowledge base.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">{user?.name}</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {user?.role}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Pending Issues ({pendingIssues.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approved Issues ({approvedIssues.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center">
            <XCircle className="w-4 h-4 mr-2" />
            Rejected Issues ({rejectedIssues.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loadingPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading pending issues...</span>
            </div>
          ) : (
            <IssueResolutionManager />
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {loadingApproved ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading approved issues...</span>
            </div>
          ) : approvedIssues.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8 text-gray-500">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No approved issues yet</p>
                  <p className="text-sm">Approved issues will appear here after review</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            approvedIssues.map((issue) => (
              <Card key={issue.id} className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-shadow duration-200">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-green-600"></div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-gray-200">
                          {issue.category}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200">
                          Approved
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                          {issue.feedback_count} feedback{issue.feedback_count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{issue.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-500 mt-1">
                          <span className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Approved by: {issue.approved_by}</span>
                            <span className="text-gray-300">|</span>
                            <Clock className="w-4 h-4" />
                            <span>{new Date(issue.approved_date).toLocaleDateString()}</span>
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-800">Issue Description</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 shadow-sm border border-green-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold text-gray-800">Resolution Plan</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{issue.resolution}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {loadingRejected ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading rejected issues...</span>
            </div>
          ) : rejectedIssues.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8 text-gray-500">
                <div className="text-center">
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No rejected issues</p>
                  <p className="text-sm">Rejected issues will appear here after review</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            rejectedIssues.map((issue) => (
              <Card key={issue.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{issue.category}</Badge>
                        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                      </div>
                      <CardTitle>{issue.original_title}</CardTitle>
                      <CardDescription>
                        Rejected by: {issue.rejected_by} | Date: {new Date(issue.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Original Description:</h4>
                      <p className="text-sm text-gray-600">{issue.original_description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Rejection Reason:</h4>
                      <p className="text-sm text-gray-600 bg-red-50 p-3 rounded border-l-4 border-l-red-400">{issue.rejection_reason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IssueEndorsement;
