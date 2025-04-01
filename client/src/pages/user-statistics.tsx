import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trophy, Flame, BarChart3, Award, Calendar, Target, Clock, Users, Zap } from "lucide-react";
import ActivityHeatmap from "@/components/dashboard/activity-heatmap";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Skill = {
  name: string;
  level: number;
  color: string;
};

export default function UserStatistics() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Fetch user stats
  const { data: userStats, isLoading: isLoadingStats } = useQuery<any>({
    queryKey: ["/api/user-stats"],
    enabled: true,
  });
  
  // Fetch user activity (for streak data)
  const { data: userActivity, isLoading: isLoadingActivity } = useQuery<any>({
    queryKey: ["/api/user-streak"],
    enabled: true,
  });
  
  // Fetch user progress (completed problems)
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery<any>({
    queryKey: ["/api/user-progress"],
    enabled: true,
  });
  
  const skills: Skill[] = [
    { name: "Memory Management", level: 75, color: "bg-blue-500" },
    { name: "Multithreading", level: 60, color: "bg-purple-500" },
    { name: "Data Structures", level: 85, color: "bg-green-500" },
    { name: "RTOS", level: 45, color: "bg-yellow-500" },
    { name: "C Programming", level: 90, color: "bg-red-500" },
    { name: "Linux API", level: 65, color: "bg-indigo-500" },
    { name: "Power Management", level: 40, color: "bg-pink-500" },
    { name: "Microcontrollers", level: 70, color: "bg-orange-500" },
  ];
  
  const achievements = [
    { name: "First Solve", earned: true, date: "Jan 15, 2025", icon: <Award className="h-5 w-5 text-green-500" /> },
    { name: "5-Day Streak", earned: true, date: "Feb 10, 2025", icon: <Flame className="h-5 w-5 text-orange-500" /> },
    { name: "Memory Master", earned: true, date: "Feb 18, 2025", icon: <Zap className="h-5 w-5 text-yellow-500" /> },
    { name: "10 Hard Problems", earned: false, date: null, icon: <Trophy className="h-5 w-5 text-gray-400" /> },
    { name: "Community Contributor", earned: false, date: null, icon: <Users className="h-5 w-5 text-gray-400" /> },
    { name: "30-Day Streak", earned: false, date: null, icon: <Calendar className="h-5 w-5 text-gray-400" /> },
    { name: "Speed Coder", earned: false, date: null, icon: <Clock className="h-5 w-5 text-gray-400" /> },
    { name: "Completed All RTOS", earned: false, date: null, icon: <Target className="h-5 w-5 text-gray-400" /> },
  ];
  
  const currentStreak = userActivity?.current || 0;
  const longestStreak = userActivity?.longest || 0;
  
  const totalSolved = userStats?.solvedProblems || 0;
  const easySolved = userStats?.easyProblems?.solved || 0;
  const mediumSolved = userStats?.mediumProblems?.solved || 0;
  const hardSolved = userStats?.hardProblems?.solved || 0;
  
  const easyTotal = userStats?.easyProblems?.total || 1;
  const mediumTotal = userStats?.mediumProblems?.total || 1;
  const hardTotal = userStats?.hardProblems?.total || 1;
  
  const easyPercent = (easySolved / easyTotal) * 100;
  const mediumPercent = (mediumSolved / mediumTotal) * 100;
  const hardPercent = (hardSolved / hardTotal) * 100;
  
  const recentlyCompletedProblems = (userProgress || []).slice(0, 5);
  
  return (
    <div className="bg-[rgb(14,14,16)] text-white h-full">
      <Header 
        isScrolled={true} 
        onNavigateFeatures={() => {}} 
        onNavigateProblems={() => {}} 
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col space-y-6">
          {/* Header section */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">User Statistics</h1>
            <Button className="bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] text-black">
              Share Profile
            </Button>
          </div>
          
          {/* Main statistics tabs */}
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-[rgb(24,24,27)]">
              <TabsTrigger 
                value="overview" 
                className={`${activeTab === 'overview' ? 'bg-[rgb(214,251,65)] text-black' : 'text-gray-300'}`}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className={`${activeTab === 'skills' ? 'bg-[rgb(214,251,65)] text-black' : 'text-gray-300'}`}
              >
                Skills
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className={`${activeTab === 'achievements' ? 'bg-[rgb(214,251,65)] text-black' : 'text-gray-300'}`}
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className={`${activeTab === 'activity' ? 'bg-[rgb(214,251,65)] text-black' : 'text-gray-300'}`}
              >
                Activity
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Top stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white">Problems Solved</CardTitle>
                    <CardDescription className="text-gray-400">Your coding progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-white mb-2">{totalSolved}</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-500">Easy</span>
                        <span className="text-xs text-gray-400">{easySolved} / {easyTotal}</span>
                      </div>
                      <Progress value={easyPercent} className="h-2 bg-[rgb(35,35,40)]" indicatorClassName="bg-green-500" />
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-yellow-500">Medium</span>
                        <span className="text-xs text-gray-400">{mediumSolved} / {mediumTotal}</span>
                      </div>
                      <Progress value={mediumPercent} className="h-2 bg-[rgb(35,35,40)]" indicatorClassName="bg-yellow-500" />
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-red-500">Hard</span>
                        <span className="text-xs text-gray-400">{hardSolved} / {hardTotal}</span>
                      </div>
                      <Progress value={hardPercent} className="h-2 bg-[rgb(35,35,40)]" indicatorClassName="bg-red-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white">Current Streak</CardTitle>
                    <CardDescription className="text-gray-400">Keep up the momentum</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Flame className="h-8 w-8 text-orange-500 mr-2" />
                      <div className="text-4xl font-bold text-white">{currentStreak}</div>
                      <div className="text-sm ml-2 text-gray-400">days</div>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                      <div className="flex justify-between items-center">
                        <span>Longest streak</span>
                        <span className="font-medium text-white">{longestStreak} days</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span>Last active</span>
                        <span className="font-medium text-white">Today</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white">Top Skills</CardTitle>
                    <CardDescription className="text-gray-400">Your strongest areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {skills.slice(0, 3).map((skill, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white">{skill.name}</span>
                            <span className="text-xs text-gray-400">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2 bg-[rgb(35,35,40)]" indicatorClassName={skill.color} />
                        </div>
                      ))}
                      <Button variant="link" className="text-[rgb(214,251,65)] hover:text-[rgb(194,231,45)] p-0 h-auto mt-2" onClick={() => setActiveTab("skills")}>
                        View all skills →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent activity and achievements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)] md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white">Recently Solved Problems</CardTitle>
                    <CardDescription className="text-gray-400">Your latest achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProgress ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-[rgb(214,251,65)]" />
                      </div>
                    ) : recentlyCompletedProblems.length > 0 ? (
                      <div className="space-y-3">
                        {recentlyCompletedProblems.map((problem: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-[rgb(18,18,20)]">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-3 ${
                                problem.problem?.difficulty === 'Easy' ? 'bg-green-500' :
                                problem.problem?.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <div>
                                <div className="text-sm font-medium text-white">{problem.problem?.title || `Problem ${index + 1}`}</div>
                                <div className="text-xs text-gray-400">
                                  {new Date(problem.updatedAt || new Date()).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Badge className={`${
                              problem.problem?.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400 border-green-700' :
                              problem.problem?.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700' : 
                              'bg-red-900/30 text-red-400 border-red-700'
                            } border`}>
                              {problem.problem?.difficulty || 'Easy'}
                            </Badge>
                          </div>
                        ))}
                        <Button variant="link" className="text-[rgb(214,251,65)] hover:text-[rgb(194,231,45)] p-0 h-auto mt-2" onClick={() => window.location.href = "/dashboard"}>
                          View all problems →
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        No problems solved yet. Get started on the dashboard!
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white">Recent Achievements</CardTitle>
                    <CardDescription className="text-gray-400">Your badges and trophies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {achievements.filter(a => a.earned).slice(0, 3).map((achievement, index) => (
                        <div key={index} className="flex items-center p-2 rounded-md bg-[rgb(18,18,20)]">
                          <div className="mr-3 flex-shrink-0">
                            {achievement.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{achievement.name}</div>
                            <div className="text-xs text-gray-400">Earned on {achievement.date}</div>
                          </div>
                        </div>
                      ))}
                      <Button variant="link" className="text-[rgb(214,251,65)] hover:text-[rgb(194,231,45)] p-0 h-auto mt-2" onClick={() => setActiveTab("achievements")}>
                        View all achievements →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Activity heatmap */}
              <div className="w-full">
                <ActivityHeatmap />
              </div>
            </TabsContent>
            
            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-white">Your Skill Progression</CardTitle>
                  <CardDescription className="text-gray-400">
                    Skills are calculated based on problems solved in each category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skills.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">{skill.name}</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium mr-2 text-gray-400">{skill.level}%</span>
                            <Badge 
                              className={`${
                                skill.level >= 80 ? 'bg-green-900/30 text-green-400 border-green-700' :
                                skill.level >= 50 ? 'bg-blue-900/30 text-blue-400 border-blue-700' : 
                                'bg-gray-900/30 text-gray-400 border-gray-700'
                              } border`}
                            >
                              {skill.level >= 80 ? 'Expert' : skill.level >= 50 ? 'Intermediate' : 'Beginner'}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={skill.level} className="h-3 bg-[rgb(35,35,40)]" indicatorClassName={skill.color} />
                        
                        <div className="text-xs text-gray-400 flex justify-between items-center pt-1">
                          <span>Problems solved in this category: {Math.floor(skill.level / 10)}</span>
                          <span>Next level: {Math.ceil(skill.level / 10) * 10} problems</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-white">Skill Recommendations</CardTitle>
                  <CardDescription className="text-gray-400">
                    Suggested problems to improve your skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skills
                      .filter(skill => skill.level < 50)
                      .slice(0, 3)
                      .map((skill, index) => (
                        <div key={index} className="p-4 rounded-md bg-[rgb(18,18,20)] border border-[rgb(35,35,40)]">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium text-white">{skill.name}</div>
                            <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-700 border">
                              Needs Improvement
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">
                            Solve more problems in this category to improve your skill level.
                          </p>
                          <Button className="w-full bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] text-black">
                            View Recommended Problems
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-white">Your Achievements</CardTitle>
                  <CardDescription className="text-gray-400">
                    Badges and trophies you've earned through your coding journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-md border ${
                          achievement.earned 
                            ? 'bg-[rgb(24,24,27)] border-[rgb(55,55,65)]' 
                            : 'bg-[rgb(18,18,20)] border-[rgb(35,35,40)] opacity-60'
                        } flex flex-col items-center justify-center text-center`}
                      >
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[rgb(35,35,40)] mb-3">
                          {achievement.icon}
                        </div>
                        <div className="font-medium text-white mb-1">{achievement.name}</div>
                        {achievement.earned ? (
                          <div className="text-xs text-gray-400">Earned on {achievement.date}</div>
                        ) : (
                          <div className="text-xs text-gray-500">Not yet earned</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-white">Achievement Progress</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track your progress towards new achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-md bg-[rgb(18,18,20)] border border-[rgb(35,35,40)]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-white">10 Hard Problems</span>
                        </div>
                        <Badge className="bg-blue-900/30 text-blue-400 border-blue-700 border">
                          In Progress
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Progress: {hardSolved}/10</span>
                          <span className="text-gray-400">{Math.floor((hardSolved / 10) * 100)}%</span>
                        </div>
                        <Progress value={(hardSolved / 10) * 100} className="h-2 bg-[rgb(35,35,40)]" indicatorClassName="bg-blue-500" />
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md bg-[rgb(18,18,20)] border border-[rgb(35,35,40)]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-white">30-Day Streak</span>
                        </div>
                        <Badge className="bg-blue-900/30 text-blue-400 border-blue-700 border">
                          In Progress
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Progress: {currentStreak}/30 days</span>
                          <span className="text-gray-400">{Math.floor((currentStreak / 30) * 100)}%</span>
                        </div>
                        <Progress value={(currentStreak / 30) * 100} className="h-2 bg-[rgb(35,35,40)]" indicatorClassName="bg-orange-500" />
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md bg-[rgb(18,18,20)] border border-[rgb(35,35,40)]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-white">Community Contributor</span>
                        </div>
                        <Badge className="bg-blue-900/30 text-blue-400 border-blue-700 border">
                          In Progress
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Progress: Post 5 helpful comments on problems</span>
                          <span className="text-gray-400">0/5</span>
                        </div>
                        <Progress value={0} className="h-2 bg-[rgb(35,35,40)]" indicatorClassName="bg-purple-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-white">Activity Calendar</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your coding consistency over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmap />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white">Current Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <Flame className="h-10 w-10 text-orange-500 mr-3" />
                      <div className="text-5xl font-bold text-white">{currentStreak}</div>
                      <div className="text-lg ml-2 text-gray-400">days</div>
                    </div>
                    <div className="text-center mt-3 text-sm text-gray-400">
                      Keep solving problems daily to maintain your streak!
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white">Longest Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <Trophy className="h-10 w-10 text-yellow-500 mr-3" />
                      <div className="text-5xl font-bold text-white">{longestStreak}</div>
                      <div className="text-lg ml-2 text-gray-400">days</div>
                    </div>
                    <div className="text-center mt-3 text-sm text-gray-400">
                      Your personal best. Can you beat it?
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white">Total Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <BarChart3 className="h-10 w-10 text-blue-500 mr-3" />
                      <div className="text-5xl font-bold text-white">{totalSolved}</div>
                      <div className="text-lg ml-2 text-gray-400">problems</div>
                    </div>
                    <div className="text-center mt-3 text-sm text-gray-400">
                      Total problems solved across all categories
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)]">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-white">Activity Insights</CardTitle>
                  <CardDescription className="text-gray-400">
                    Patterns and trends in your coding activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-white">Most Active Day</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <div 
                            key={index} 
                            className={`p-2 rounded-md text-center ${
                              index === 3 ? 'bg-[rgb(214,251,65)] text-black' : 'bg-[rgb(35,35,40)] text-gray-400'
                            }`}
                          >
                            <div className="text-sm font-medium">{day}</div>
                            <div className={`text-xs ${index === 3 ? 'text-black' : 'text-gray-500'}`}>
                              {index === 3 ? '40%' : `${10 + (index * 5)}%`}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        You're most active on Wednesdays. Consider spreading your activity more evenly throughout the week.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-white">Monthly Progress</h3>
                      <div className="h-24 flex items-end space-x-2">
                        {[25, 40, 65, 35, 55, 45, 30, 60, 70, 50, 75, 90].map((height, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-[rgb(214,251,65)] rounded-sm" 
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="text-[10px] text-gray-500 mt-1">
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        Your activity has increased in recent months. Keep up the good work!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}