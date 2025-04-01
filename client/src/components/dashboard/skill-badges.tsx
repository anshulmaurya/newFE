import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock } from 'lucide-react';

interface SkillBadge {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  requirements: string;
  progress: number; // 0-100
  unlocked: boolean;
}

// Example skill badges data
const skillBadgesData: SkillBadge[] = [
  {
    id: 'mm-1',
    name: 'Memory Maestro',
    category: 'Memory Management',
    icon: '🧠',
    color: '#FF5733',
    description: 'Master of memory allocation and management techniques',
    requirements: 'Solve 5 memory management problems',
    progress: 60,
    unlocked: true,
  },
  {
    id: 'mt-1',
    name: 'Thread Tamer',
    category: 'Multithreading',
    icon: '🧵',
    color: '#33A1FF',
    description: 'Expert in synchronization primitives and concurrency',
    requirements: 'Solve 3 multithreading problems',
    progress: 40,
    unlocked: false,
  },
  {
    id: 'ds-1',
    name: 'Data Structure Demystifier',
    category: 'Data Structures',
    icon: '📊',
    color: '#33FF57',
    description: 'Adept at implementing and optimizing complex data structures',
    requirements: 'Solve 7 data structure problems',
    progress: 80,
    unlocked: true,
  },
  {
    id: 'cpp-1',
    name: 'C++ Sorcerer',
    category: 'C++ API',
    icon: '⚡',
    color: '#A833FF',
    description: 'Wizard of modern C++ features and Standard Library',
    requirements: 'Solve 4 C++ API problems',
    progress: 25,
    unlocked: false,
  },
  {
    id: 'linux-1',
    name: 'Kernel Commander',
    category: 'Linux API',
    icon: '🐧',
    color: '#FFD700',
    description: 'Master of Linux kernel and system programming',
    requirements: 'Solve 5 Linux API problems',
    progress: 10,
    unlocked: false,
  },
  {
    id: 'rtos-1',
    name: 'RTOS Ranger',
    category: 'RTOS',
    icon: '⏱️',
    color: '#FF33A8',
    description: 'Expert in real-time operating systems concepts',
    requirements: 'Solve 3 RTOS problems',
    progress: 90,
    unlocked: true,
  },
];

const BadgeIcon: React.FC<{ badge: SkillBadge, isHovered: boolean }> = ({ badge, isHovered }) => {
  return (
    <motion.div
      className="text-3xl flex items-center justify-center select-none"
      animate={isHovered && badge.unlocked ? {
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
        transition: { duration: 0.5 }
      } : {}}
    >
      {badge.icon}
    </motion.div>
  );
};

const ProgressRing: React.FC<{ 
  progress: number, 
  color: string, 
  size: number, 
  isHovered: boolean,
  unlocked: boolean 
}> = ({ progress, color, size, isHovered, unlocked }) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={isHovered && unlocked ? { rotate: 360 } : {}}
      transition={{ duration: 3, ease: "linear", repeat: isHovered ? Infinity : 0 }}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={unlocked ? color : "#333"}
        strokeWidth={strokeWidth / 2}
        strokeOpacity={0.2}
      />
      
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={unlocked ? color : "#555"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={unlocked ? dashOffset : circumference}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: unlocked ? dashOffset : circumference }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Badge status icon in center */}
      {unlocked && progress === 100 && (
        <foreignObject x={size / 2 - 8} y={size / 2 - 8} width={16} height={16}>
          <motion.div
            className="text-green-500"
            animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
          >
            <CheckCircle size={16} />
          </motion.div>
        </foreignObject>
      )}
      
      {!unlocked && (
        <foreignObject x={size / 2 - 8} y={size / 2 - 8} width={16} height={16}>
          <motion.div
            className="text-gray-500"
            animate={isHovered ? { scale: [1, 1.1, 1], rotate: [0, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Lock size={16} />
          </motion.div>
        </foreignObject>
      )}
    </motion.svg>
  );
};

const SkillBadgeCard: React.FC<{ badge: SkillBadge }> = ({ badge }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`relative rounded-lg p-3 flex flex-col items-center space-y-1 cursor-pointer ${
        badge.unlocked ? 'bg-[#1E1E24]' : 'bg-[#1A1A1E]'
      }`}
      whileHover={{ y: -3, boxShadow: `0 8px 20px -8px ${badge.color}30` }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <ProgressRing 
          progress={badge.progress} 
          color={badge.color} 
          size={60} 
          isHovered={isHovered}
          unlocked={badge.unlocked}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <BadgeIcon badge={badge} isHovered={isHovered} />
        </div>
      </div>

      <h3 
        className="font-semibold text-center text-sm" 
        style={{ color: badge.unlocked ? badge.color : 'gray' }}
      >
        {badge.name}
      </h3>
      
      <Badge 
        variant="outline" 
        className="text-xs bg-opacity-20 px-2 py-0"
        style={{ backgroundColor: `${badge.color}20`, borderColor: `${badge.color}50` }}
      >
        {badge.category}
      </Badge>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className="text-xs text-center text-gray-400"
              animate={isHovered ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {badge.unlocked ? `${badge.progress}% Complete` : badge.requirements}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{badge.description}</p>
            <p className="text-xs mt-1">{badge.requirements}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

const SkillBadges: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Get unique categories from badges
  const uniqueCategories = Array.from(new Set(skillBadgesData.map(badge => badge.category)));
  const categories = ['All', ...uniqueCategories];
  
  // Filter badges by active category
  const filteredBadges = activeCategory && activeCategory !== 'All'
    ? skillBadgesData.filter(badge => badge.category === activeCategory)
    : skillBadgesData;
    
  return (
    <div className="bg-[rgb(20,20,22)] rounded-md border border-[rgb(35,35,40)]">
      <div className="px-3 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Skill Badges</h3>
          
          <div className="flex overflow-x-auto gap-1 hide-scrollbar">
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category === 'All' ? null : category)}
                variant={activeCategory === category || (category === 'All' && !activeCategory) ? "default" : "outline"}
                className={`h-6 px-2 py-0 text-xs whitespace-nowrap ${
                  activeCategory === category || (category === 'All' && !activeCategory)
                    ? 'bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] text-black' 
                    : 'bg-[rgb(35,35,40)] text-gray-300 hover:bg-[rgb(45,45,50)] hover:text-white'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {filteredBadges.slice(0, 6).map(badge => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="relative rounded-md p-2 flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    style={{ 
                      backgroundColor: badge.unlocked ? `${badge.color}15` : 'rgb(30,30,34)',
                      borderColor: badge.unlocked ? badge.color : 'transparent',
                      borderWidth: 1
                    }}
                  >
                    <div className="text-xl mb-1">{badge.icon}</div>
                    <div className="w-full rounded-full h-1 bg-gray-800 mb-1">
                      <div 
                        className="h-1 rounded-full" 
                        style={{ 
                          width: `${badge.progress}%`, 
                          backgroundColor: badge.unlocked ? badge.color : '#555' 
                        }}
                      ></div>
                    </div>
                    {!badge.unlocked && (
                      <div className="absolute right-1 top-1">
                        <Lock size={10} className="text-gray-500" />
                      </div>
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{badge.name}</p>
                  <p className="text-xs mt-1">{badge.category}</p>
                  <p className="text-xs mt-1">{badge.description}</p>
                  <p className="text-xs mt-1 text-gray-400">{badge.requirements}</p>
                  <p className="text-xs mt-1 font-semibold">{badge.progress}% Complete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillBadges;