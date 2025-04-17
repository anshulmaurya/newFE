import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, User, UserCheck, Target, CalendarDays, Award, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyGoal, setDailyGoal] = useState<number>(3);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch user stats record including daily goal
  const { data: userStats, isLoading: isLoadingStats } = useQuery<any>({
    queryKey: ["/api/user-stats-record"],
    enabled: !!user,
  });

  // Fetch user activity (for streak data)
  const { data: userStreak, isLoading: isLoadingStreak } = useQuery<any>({
    queryKey: ["/api/user-streak"],
    enabled: !!user,
  });

  // Set initial daily goal from user stats when data is loaded
  useEffect(() => {
    if (userStats && typeof userStats.dailyGoal === 'number') {
      setDailyGoal(userStats.dailyGoal);
    }
  }, [userStats]);

  // Mutation for updating daily goal
  const updateDailyGoalMutation = useMutation({
    mutationFn: async (newDailyGoal: number) => {
      return await apiRequest("POST", "/api/user-daily-goal", { dailyGoal: newDailyGoal });
    },
    onSuccess: () => {
      toast({
        title: "Daily Goal Updated",
        description: `Your daily goal has been set to ${dailyGoal} problem${dailyGoal === 1 ? '' : 's'}.`,
      });
      setIsEditing(false);
      // Invalidate queries to refresh user stats data
      queryClient.invalidateQueries({ queryKey: ["/api/user-stats-record"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update daily goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveDailyGoal = () => {
    if (dailyGoal < 1) {
      toast({
        title: "Invalid Daily Goal",
        description: "Daily goal must be at least 1.",
        variant: "destructive",
      });
      return;
    }
    updateDailyGoalMutation.mutate(dailyGoal);
  };

  const handleDailyGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setDailyGoal(value);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isScrolled={true} 
        onNavigateFeatures={() => {}} 
        onNavigateProblems={() => {}} 
      />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="md:col-span-1 bg-[rgb(24,24,26)] border-[rgb(32,32,34)]">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-2 border-[rgb(214,251,65)] mb-4">
                <AvatarImage 
                  src={user.avatarUrl || "https://github.com/identicons/app/oauth_app/1234"} 
                  alt={user.username || "User"}
                />
                <AvatarFallback className="bg-[rgb(36,36,38)] text-[rgb(214,251,65)]">
                  {user.username ? user.username.substring(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.displayName || user.username}</CardTitle>
              <CardDescription>
                {user.email && !user.email.includes("@example.com") ? user.email : ""}
              </CardDescription>
              
              <div className="mt-2 flex gap-2">
                {user.githubId && (
                  <Badge variant="outline" className="flex items-center gap-1 border-[rgb(214,251,65)] text-[rgb(214,251,65)]">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <Separator className="my-2 bg-[rgb(32,32,34)]" />
              
              {isLoadingStats || isLoadingStreak ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-[rgb(214,251,65)]" />
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-[rgb(214,251,65)]" />
                    <div>
                      <p className="text-sm text-gray-300">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-[rgb(214,251,65)]" />
                    <div>
                      <p className="text-sm text-gray-300">Joined</p>
                      <p className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-[rgb(214,251,65)]" />
                    <div>
                      <p className="text-sm text-gray-300">Problems Solved</p>
                      <p className="font-medium">{userStats?.totalSolved || 0}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-300">Current Streak</p>
                      <p className="font-medium">{userStreak?.current || 0} days</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Settings and Goals Card */}
          <Card className="md:col-span-2 bg-[rgb(24,24,26)] border-[rgb(32,32,34)]">
            <CardHeader>
              <CardTitle>Settings and Goals</CardTitle>
              <CardDescription>Manage your profile settings and learning goals</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="goals">
                <TabsList className="bg-[rgb(32,32,34)]">
                  <TabsTrigger value="goals">Learning Goals</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="goals" className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5 text-[rgb(214,251,65)]" /> 
                      Daily Goal
                    </h3>
                    
                    <Card className="bg-[rgb(28,28,30)] border-[rgb(38,38,40)]">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="dailyGoal">Problems per day</Label>
                              <p className="text-sm text-gray-400">
                                Set a daily goal for how many problems you want to solve each day (minimum 1).
                              </p>
                            </div>
                            
                            {!isEditing ? (
                              <Badge className="text-base py-1.5 px-3 bg-[rgb(214,251,65)] hover:bg-[rgb(214,251,65)] text-black">
                                {userStats?.dailyGoal || 3}
                              </Badge>
                            ) : null}
                          </div>
                          
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                id="dailyGoal"
                                type="number"
                                value={dailyGoal}
                                onChange={handleDailyGoalChange}
                                min={1}
                                className="max-w-[100px] bg-[rgb(32,32,34)] border-[rgb(45,45,47)]"
                              />
                              <Button 
                                variant="default" 
                                className="bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] text-black"
                                onClick={handleSaveDailyGoal}
                                disabled={updateDailyGoalMutation.isPending}
                              >
                                {updateDailyGoalMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4 mr-2" />
                                )}
                                Save
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setIsEditing(false);
                                  setDailyGoal(userStats?.dailyGoal || 3);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="border-[rgb(214,251,65)] text-[rgb(214,251,65)] hover:bg-[rgb(214,251,65)]/10"
                              onClick={() => setIsEditing(true)}
                            >
                              Edit Goal
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="text-sm text-gray-400 italic mt-2">
                      Setting a realistic daily goal helps maintain consistency and build a learning habit.
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-[rgb(214,251,65)]" /> 
                      Account Preferences
                    </h3>
                    
                    <div className="rounded-md border border-[rgb(38,38,40)] p-6 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-400 mb-2">Account preference settings are coming soon.</p>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}