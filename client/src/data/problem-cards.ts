export interface ProblemCard {
  id: number;
  category: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completionRate: string;
  rating: string;
  estimatedTime: string;
}

// Memory Management problems
export const memoryManagementProblems: ProblemCard[] = [
  {
    id: 1,
    category: "Memory Management",
    title: "Custom Memory Allocator",
    description: "Design a static memory allocation system optimized for embedded systems with limited heap space.",
    difficulty: "Easy",
    completionRate: "82%",
    rating: "4.3",
    estimatedTime: "30 min"
  },
  {
    id: 2,
    category: "Memory Management",
    title: "Memory Pool Implementation",
    description: "Create a fixed-size memory pool allocator that minimizes fragmentation for real-time applications.",
    difficulty: "Medium",
    completionRate: "65%",
    rating: "4.5",
    estimatedTime: "40 min"
  },
  {
    id: 3,
    category: "Memory Management",
    title: "Heap Defragmentation",
    description: "Implement a real-time heap defragmentation algorithm for long-running embedded systems.",
    difficulty: "Hard",
    completionRate: "42%",
    rating: "4.9",
    estimatedTime: "55 min"
  },
  {
    id: 4,
    category: "Memory Management",
    title: "Stack Overflow Protection",
    description: "Create a stack overflow detection and protection mechanism for resource-constrained MCUs.",
    difficulty: "Medium",
    completionRate: "58%",
    rating: "4.4", 
    estimatedTime: "35 min"
  },
  {
    id: 5,
    category: "Memory Management",
    title: "Memory Leakage Detector",
    description: "Build a simple memory leak detection tool for C programs running on embedded systems.",
    difficulty: "Easy",
    completionRate: "75%",
    rating: "4.1",
    estimatedTime: "25 min"
  },
  {
    id: 6,
    category: "Memory Management",
    title: "Garbage Collection",
    description: "Implement a mark-and-sweep garbage collector for a custom memory allocation system.",
    difficulty: "Hard",
    completionRate: "38%",
    rating: "4.8",
    estimatedTime: "60 min"
  },
  {
    id: 7,
    category: "Memory Management",
    title: "DMA Controller",
    description: "Design a direct memory access controller interface for efficient high-speed data transfers.",
    difficulty: "Medium",
    completionRate: "52%",
    rating: "4.6",
    estimatedTime: "45 min"
  },
  {
    id: 8,
    category: "Memory Management",
    title: "Cache-Friendly Data Structures",
    description: "Implement data structures optimized for embedded CPU cache patterns and memory access.",
    difficulty: "Easy",
    completionRate: "79%",
    rating: "4.2",
    estimatedTime: "35 min"
  },
  {
    id: 9,
    category: "Memory Management",
    title: "Memory Virtualization",
    description: "Design a simple memory virtualization layer for MCUs without MMU support.",
    difficulty: "Hard",
    completionRate: "36%",
    rating: "4.9",
    estimatedTime: "70 min"
  },
  {
    id: 10,
    category: "Memory Management",
    title: "Memory-Mapped I/O",
    description: "Implement a memory-mapped I/O system with proper interrupt handling for an embedded platform.",
    difficulty: "Medium",
    completionRate: "61%",
    rating: "4.5",
    estimatedTime: "50 min"
  },
  {
    id: 11,
    category: "Memory Management",
    title: "Flash Memory Wear Leveling",
    description: "Design a wear leveling algorithm for flash memory to extend the lifespan of EEPROM storage.",
    difficulty: "Medium",
    completionRate: "59%",
    rating: "4.6",
    estimatedTime: "55 min"
  },
  {
    id: 12,
    category: "Memory Management",
    title: "Buffer Overflow Detection",
    description: "Implement a buffer overflow detection system for C string operations in an embedded context.",
    difficulty: "Easy",
    completionRate: "74%",
    rating: "4.2",
    estimatedTime: "30 min"
  },
  {
    id: 13,
    category: "Memory Management",
    title: "Paging System",
    description: "Implement a simple paging system to manage memory in a resource-constrained embedded device.",
    difficulty: "Medium",
    completionRate: "48%",
    rating: "4.7",
    estimatedTime: "45 min"
  },
  {
    id: 14,
    category: "Memory Management",
    title: "Memory Protection Unit",
    description: "Implement a memory protection unit (MPU) configuration system for Cortex-M MCUs.",
    difficulty: "Medium",
    completionRate: "53%",
    rating: "4.7",
    estimatedTime: "50 min"
  },
  {
    id: 15,
    category: "Memory Management",
    title: "Memory-Safe String Library",
    description: "Create a memory-safe string handling library for C with bounds checking and overflow protection.",
    difficulty: "Hard",
    completionRate: "41%",
    rating: "4.8",
    estimatedTime: "60 min"
  },
  {
    id: 16,
    category: "Memory Management",
    title: "Memory Usage Monitor",
    description: "Create a memory usage monitoring tool for embedded systems that tracks stack and heap allocation.",
    difficulty: "Easy",
    completionRate: "77%",
    rating: "4.2",
    estimatedTime: "30 min"
  }
];

// Multithreading problems
export const multithreadingProblems: ProblemCard[] = [
  {
    id: 1,
    category: "Multithreading",
    title: "Thread-Safe Ring Buffer",
    description: "Implement a thread-safe ring buffer data structure for inter-thread communication in a resource-constrained environment.",
    difficulty: "Medium",
    completionRate: "68%",
    rating: "4.7",
    estimatedTime: "45 min"
  },
  {
    id: 2,
    category: "Multithreading",
    title: "Mutex Implementation",
    description: "Create a basic mutex implementation using atomic operations for thread synchronization.",
    difficulty: "Medium",
    completionRate: "62%",
    rating: "4.5",
    estimatedTime: "40 min"
  },
  {
    id: 3,
    category: "Multithreading",
    title: "Semaphore Implementation",
    description: "Build a counting semaphore for thread synchronization in an embedded RTOS environment.",
    difficulty: "Easy",
    completionRate: "71%",
    rating: "4.3",
    estimatedTime: "35 min"
  },
  {
    id: 4,
    category: "Multithreading",
    title: "Deadlock Detection",
    description: "Implement a deadlock detection algorithm for an embedded system with limited resources.",
    difficulty: "Hard",
    completionRate: "39%",
    rating: "4.8",
    estimatedTime: "65 min"
  },
  {
    id: 5,
    category: "Multithreading",
    title: "Priority Inheritance Protocol",
    description: "Implement the priority inheritance protocol to solve priority inversion in a real-time system.",
    difficulty: "Hard",
    completionRate: "41%",
    rating: "4.9",
    estimatedTime: "70 min"
  },
  {
    id: 6,
    category: "Multithreading",
    title: "Thread Pool Design",
    description: "Create an efficient thread pool implementation for handling multiple periodic tasks in an embedded system.",
    difficulty: "Medium",
    completionRate: "57%",
    rating: "4.6",
    estimatedTime: "50 min"
  },
  {
    id: 7,
    category: "Multithreading",
    title: "Read-Write Lock",
    description: "Implement a read-write lock that allows concurrent reads but exclusive writes.",
    difficulty: "Medium",
    completionRate: "55%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 8,
    category: "Multithreading",
    title: "Message Queue Implementation",
    description: "Create a robust message queue system for inter-task communication in an RTOS environment.",
    difficulty: "Easy",
    completionRate: "75%",
    rating: "4.2",
    estimatedTime: "30 min"
  },
  {
    id: 9,
    category: "Multithreading",
    title: "Lock-Free Data Structure",
    description: "Implement a lock-free queue using atomic operations for high-performance thread communication.",
    difficulty: "Hard",
    completionRate: "37%",
    rating: "4.9",
    estimatedTime: "75 min"
  },
  {
    id: 10,
    category: "Multithreading",
    title: "Thread Synchronization Barriers",
    description: "Create a barrier synchronization primitive for coordinating multiple threads in an embedded application.",
    difficulty: "Medium",
    completionRate: "63%",
    rating: "4.4",
    estimatedTime: "40 min"
  },
  {
    id: 11,
    category: "Multithreading",
    title: "Condition Variables",
    description: "Implement condition variables for thread signaling and synchronization in a resource-constrained environment.",
    difficulty: "Medium",
    completionRate: "59%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 12,
    category: "Multithreading",
    title: "Spin Lock Implementation",
    description: "Design an efficient spin lock mechanism for short-duration critical sections in a multicore system.",
    difficulty: "Easy",
    completionRate: "73%",
    rating: "4.1",
    estimatedTime: "25 min"
  },
  {
    id: 13,
    category: "Multithreading",
    title: "Thread-Safe Memory Allocator",
    description: "Create a thread-safe memory allocation system that avoids contention in a multithreaded application.",
    difficulty: "Hard",
    completionRate: "42%",
    rating: "4.8",
    estimatedTime: "60 min"
  },
  {
    id: 14,
    category: "Multithreading",
    title: "Priority Ceiling Protocol",
    description: "Implement the priority ceiling protocol to prevent unbounded priority inversion in a real-time system.",
    difficulty: "Hard",
    completionRate: "38%",
    rating: "4.7",
    estimatedTime: "65 min"
  },
  {
    id: 15,
    category: "Multithreading",
    title: "Event Flags Group",
    description: "Implement an event flags group synchronization mechanism for an RTOS environment.",
    difficulty: "Easy",
    completionRate: "78%",
    rating: "4.3",
    estimatedTime: "30 min"
  },
  {
    id: 16,
    category: "Multithreading",
    title: "Thread-Specific Storage",
    description: "Create a thread-specific storage mechanism for maintaining per-thread data in an embedded system.",
    difficulty: "Medium",
    completionRate: "61%",
    rating: "4.4",
    estimatedTime: "45 min"
  }
];

// Data Structures problems
export const dataStructuresProblems: ProblemCard[] = [
  {
    id: 1,
    category: "Data Structures",
    title: "Fixed-Size Circular Buffer",
    description: "Implement a memory-efficient circular buffer optimized for embedded systems with limited RAM.",
    difficulty: "Easy",
    completionRate: "83%",
    rating: "4.2",
    estimatedTime: "25 min"
  },
  {
    id: 2,
    category: "Data Structures",
    title: "Static Memory Pool",
    description: "Design a static memory pool for efficient allocation and deallocation of fixed-size memory blocks.",
    difficulty: "Medium",
    completionRate: "67%",
    rating: "4.6",
    estimatedTime: "40 min"
  },
  {
    id: 3,
    category: "Data Structures",
    title: "Binary Heap for Priority Queue",
    description: "Create a binary heap-based priority queue for task scheduling in an RTOS environment.",
    difficulty: "Medium",
    completionRate: "61%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 4,
    category: "Data Structures",
    title: "Fixed-Size Hash Table",
    description: "Implement a hash table with constant memory footprint for lookup operations in embedded systems.",
    difficulty: "Medium",
    completionRate: "59%",
    rating: "4.6",
    estimatedTime: "50 min"
  },
  {
    id: 5,
    category: "Data Structures",
    title: "Intrusive Linked List",
    description: "Create an intrusive linked list implementation that avoids dynamic memory allocation.",
    difficulty: "Easy",
    completionRate: "76%",
    rating: "4.3",
    estimatedTime: "30 min"
  },
  {
    id: 6,
    category: "Data Structures",
    title: "Trie for Command Parsing",
    description: "Implement a trie data structure for efficient command parsing in embedded CLI applications.",
    difficulty: "Hard",
    completionRate: "43%",
    rating: "4.8",
    estimatedTime: "60 min"
  },
  {
    id: 7,
    category: "Data Structures",
    title: "Fixed-Size Stack",
    description: "Create a stack implementation with overflow protection for resource-constrained systems.",
    difficulty: "Easy",
    completionRate: "85%",
    rating: "4.1",
    estimatedTime: "20 min"
  },
  {
    id: 8,
    category: "Data Structures",
    title: "Thread-Safe Queue",
    description: "Design a thread-safe queue using mutex or semaphore for inter-task communication.",
    difficulty: "Medium",
    completionRate: "64%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 9,
    category: "Data Structures",
    title: "Static Binary Search Tree",
    description: "Implement a binary search tree that uses a pre-allocated fixed-size memory pool.",
    difficulty: "Hard",
    completionRate: "47%",
    rating: "4.7",
    estimatedTime: "55 min"
  },
  {
    id: 10,
    category: "Data Structures",
    title: "Lock-Free Ring Buffer",
    description: "Create a lock-free ring buffer implementation for high-performance producer-consumer scenarios.",
    difficulty: "Hard",
    completionRate: "39%",
    rating: "4.9",
    estimatedTime: "65 min"
  },
  {
    id: 11,
    category: "Data Structures",
    title: "Bloom Filter",
    description: "Implement a space-efficient probabilistic data structure for testing element membership.",
    difficulty: "Medium",
    completionRate: "58%",
    rating: "4.6",
    estimatedTime: "50 min"
  },
  {
    id: 12,
    category: "Data Structures",
    title: "Sparse Array",
    description: "Create a memory-efficient sparse array implementation for embedded systems with large address spaces.",
    difficulty: "Medium",
    completionRate: "53%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 13,
    category: "Data Structures",
    title: "State Machine Framework",
    description: "Design a compact state machine framework for embedded control systems with minimal memory usage.",
    difficulty: "Easy",
    completionRate: "72%",
    rating: "4.4",
    estimatedTime: "35 min"
  },
  {
    id: 14,
    category: "Data Structures",
    title: "Command Pattern Queue",
    description: "Implement a command pattern queue for scheduling and executing operations in an embedded system.",
    difficulty: "Medium",
    completionRate: "62%",
    rating: "4.5",
    estimatedTime: "40 min"
  },
  {
    id: 15,
    category: "Data Structures",
    title: "Pool-Based Object Allocator",
    description: "Create an object pool allocator to avoid runtime heap fragmentation in long-running applications.",
    difficulty: "Hard",
    completionRate: "46%",
    rating: "4.8",
    estimatedTime: "55 min"
  },
  {
    id: 16,
    category: "Data Structures",
    title: "Bit Vector",
    description: "Implement a space-efficient bit vector with optimized bit manipulation for resource-constrained systems.",
    difficulty: "Easy",
    completionRate: "81%",
    rating: "4.2",
    estimatedTime: "30 min"
  }
];

// C/C++ APIs problems
export const cppApiProblems: ProblemCard[] = [
  {
    id: 1,
    category: "C/C++ APIs",
    title: "UART Driver Implementation",
    description: "Create a complete UART driver with interrupt handling and buffer management for embedded systems.",
    difficulty: "Medium",
    completionRate: "65%",
    rating: "4.6",
    estimatedTime: "50 min"
  },
  {
    id: 2,
    category: "C/C++ APIs",
    title: "SPI Interface Driver",
    description: "Implement a full-featured SPI driver with DMA support for efficient data transfers.",
    difficulty: "Medium",
    completionRate: "63%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 3,
    category: "C/C++ APIs",
    title: "I2C Master/Slave Protocol",
    description: "Create a complete I2C protocol implementation supporting both master and slave modes.",
    difficulty: "Hard",
    completionRate: "51%",
    rating: "4.7",
    estimatedTime: "60 min"
  },
  {
    id: 4,
    category: "C/C++ APIs",
    title: "ADC Driver with DMA",
    description: "Build an ADC driver with DMA for continuous sampling in data acquisition applications.",
    difficulty: "Medium",
    completionRate: "59%",
    rating: "4.5",
    estimatedTime: "50 min"
  },
  {
    id: 5,
    category: "C/C++ APIs",
    title: "PWM Generator",
    description: "Implement a flexible PWM generator with variable frequency and duty cycle control.",
    difficulty: "Easy",
    completionRate: "78%",
    rating: "4.3",
    estimatedTime: "35 min"
  },
  {
    id: 6,
    category: "C/C++ APIs",
    title: "GPIO Abstraction Layer",
    description: "Create a hardware-independent GPIO abstraction layer for portable embedded applications.",
    difficulty: "Easy",
    completionRate: "82%",
    rating: "4.2",
    estimatedTime: "30 min"
  },
  {
    id: 7,
    category: "C/C++ APIs",
    title: "CAN Bus Driver",
    description: "Implement a CAN bus protocol stack with message filtering and interrupt handling.",
    difficulty: "Hard",
    completionRate: "48%",
    rating: "4.8",
    estimatedTime: "65 min"
  },
  {
    id: 8,
    category: "C/C++ APIs",
    title: "USB Device Stack",
    description: "Create a USB device stack implementing HID class for embedded systems.",
    difficulty: "Hard",
    completionRate: "41%",
    rating: "4.9",
    estimatedTime: "75 min"
  },
  {
    id: 9,
    category: "C/C++ APIs",
    title: "EEPROM/Flash Driver",
    description: "Implement a driver for EEPROM/Flash memory with wear leveling and error checking.",
    difficulty: "Medium",
    completionRate: "61%",
    rating: "4.6",
    estimatedTime: "45 min"
  },
  {
    id: 10,
    category: "C/C++ APIs",
    title: "Real-Time Clock Driver",
    description: "Build an RTC driver with alarm functionality and power-down retention capabilities.",
    difficulty: "Easy",
    completionRate: "75%",
    rating: "4.3",
    estimatedTime: "35 min"
  },
  {
    id: 11,
    category: "C/C++ APIs",
    title: "DMA Controller API",
    description: "Create a portable API for configuring and managing DMA transfers across different channels.",
    difficulty: "Hard",
    completionRate: "52%",
    rating: "4.7",
    estimatedTime: "55 min"
  },
  {
    id: 12,
    category: "C/C++ APIs",
    title: "LCD Display Driver",
    description: "Implement a graphics driver for LCD displays with hardware acceleration support.",
    difficulty: "Medium",
    completionRate: "58%",
    rating: "4.6",
    estimatedTime: "50 min"
  },
  {
    id: 13,
    category: "C/C++ APIs",
    title: "Timer/Counter Library",
    description: "Create a flexible timer/counter library for precise timing operations in embedded systems.",
    difficulty: "Medium",
    completionRate: "64%",
    rating: "4.5",
    estimatedTime: "40 min"
  },
  {
    id: 14,
    category: "C/C++ APIs",
    title: "Watchdog Timer Driver",
    description: "Implement a watchdog timer API with safe window mode and reset management.",
    difficulty: "Easy",
    completionRate: "79%",
    rating: "4.2",
    estimatedTime: "30 min"
  },
  {
    id: 15,
    category: "C/C++ APIs",
    title: "Ethernet MAC Driver",
    description: "Create a low-level Ethernet MAC driver with buffer management and interrupt handling.",
    difficulty: "Hard",
    completionRate: "45%",
    rating: "4.8",
    estimatedTime: "70 min"
  },
  {
    id: 16,
    category: "C/C++ APIs",
    title: "Cryptography Library",
    description: "Implement a lightweight cryptography library for embedded systems with AES and SHA support.",
    difficulty: "Hard",
    completionRate: "43%",
    rating: "4.9",
    estimatedTime: "65 min"
  }
];

// Linux APIs problems
export const linuxApiProblems: ProblemCard[] = [
  {
    id: 1,
    category: "Linux APIs",
    title: "Character Device Driver",
    description: "Create a Linux character device driver with read/write operations and ioctl support.",
    difficulty: "Medium",
    completionRate: "62%",
    rating: "4.6",
    estimatedTime: "55 min"
  },
  {
    id: 2,
    category: "Linux APIs",
    title: "GPIO Sysfs Interface",
    description: "Implement a sysfs interface for GPIO control in a Linux embedded system.",
    difficulty: "Easy",
    completionRate: "75%",
    rating: "4.3",
    estimatedTime: "40 min"
  },
  {
    id: 3,
    category: "Linux APIs",
    title: "I2C Device Driver",
    description: "Create a complete I2C device driver for Linux with support for multiple devices on the bus.",
    difficulty: "Medium",
    completionRate: "59%",
    rating: "4.5",
    estimatedTime: "50 min"
  },
  {
    id: 4,
    category: "Linux APIs",
    title: "Linux Input Device Driver",
    description: "Build an input device driver for a custom keypad or touch interface in Linux.",
    difficulty: "Medium",
    completionRate: "57%",
    rating: "4.6",
    estimatedTime: "55 min"
  },
  {
    id: 5,
    category: "Linux APIs",
    title: "SPI Protocol Driver",
    description: "Implement a SPI protocol driver for a specific device in the Linux kernel.",
    difficulty: "Hard",
    completionRate: "48%",
    rating: "4.7",
    estimatedTime: "60 min"
  },
  {
    id: 6,
    category: "Linux APIs",
    title: "Memory-mapped I/O Driver",
    description: "Create a device driver that uses memory-mapped I/O for register access.",
    difficulty: "Medium",
    completionRate: "61%",
    rating: "4.5",
    estimatedTime: "50 min"
  },
  {
    id: 7,
    category: "Linux APIs",
    title: "Real-time Task Scheduling",
    description: "Implement a real-time task scheduling system using Linux PREEMPT_RT capabilities.",
    difficulty: "Hard",
    completionRate: "43%",
    rating: "4.8",
    estimatedTime: "65 min"
  },
  {
    id: 8,
    category: "Linux APIs",
    title: "Linux DMA Engine API",
    description: "Create a DMA client driver using the Linux DMA Engine API for high-speed data transfers.",
    difficulty: "Hard",
    completionRate: "41%",
    rating: "4.9",
    estimatedTime: "70 min"
  },
  {
    id: 9,
    category: "Linux APIs",
    title: "Network Device Driver",
    description: "Implement a basic network device driver for a custom Ethernet controller.",
    difficulty: "Hard",
    completionRate: "45%",
    rating: "4.8",
    estimatedTime: "75 min"
  },
  {
    id: 10,
    category: "Linux APIs",
    title: "Linux IPC Mechanisms",
    description: "Create a comprehensive example of Linux IPC mechanisms (message queues, shared memory, semaphores).",
    difficulty: "Medium",
    completionRate: "64%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 11,
    category: "Linux APIs",
    title: "Proc Filesystem Interface",
    description: "Implement a proc filesystem interface for exposing device statistics and configuration.",
    difficulty: "Easy",
    completionRate: "72%",
    rating: "4.3",
    estimatedTime: "35 min"
  },
  {
    id: 12,
    category: "Linux APIs",
    title: "Block Device Driver",
    description: "Create a simple block device driver for a custom storage device or partition.",
    difficulty: "Hard",
    completionRate: "47%",
    rating: "4.7",
    estimatedTime: "60 min"
  },
  {
    id: 13,
    category: "Linux APIs",
    title: "Clock Framework Driver",
    description: "Implement a clock provider driver using the Linux Common Clock Framework.",
    difficulty: "Medium",
    completionRate: "56%",
    rating: "4.6",
    estimatedTime: "55 min"
  },
  {
    id: 14,
    category: "Linux APIs",
    title: "Linux GPIO IRQ Handling",
    description: "Create a driver that uses GPIO interrupts for event-driven processing.",
    difficulty: "Medium",
    completionRate: "63%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 15,
    category: "Linux APIs",
    title: "Device Tree Integration",
    description: "Implement a device driver that properly integrates with the Linux device tree subsystem.",
    difficulty: "Medium",
    completionRate: "58%",
    rating: "4.6",
    estimatedTime: "50 min"
  },
  {
    id: 16,
    category: "Linux APIs",
    title: "Linux Power Management",
    description: "Create a device driver that implements proper power management callbacks and states.",
    difficulty: "Hard",
    completionRate: "49%",
    rating: "4.7",
    estimatedTime: "60 min"
  }
];

// RTOS problems
export const rtosProblems: ProblemCard[] = [
  {
    id: 1,
    category: "RTOS",
    title: "Task Scheduler Implementation",
    description: "Create a priority-based preemptive scheduler for an RTOS kernel.",
    difficulty: "Hard",
    completionRate: "47%",
    rating: "4.8",
    estimatedTime: "65 min"
  },
  {
    id: 2,
    category: "RTOS",
    title: "Message Queue System",
    description: "Implement a message queue for inter-task communication in an RTOS environment.",
    difficulty: "Medium",
    completionRate: "63%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 3,
    category: "RTOS",
    title: "Semaphore Implementation",
    description: "Create binary and counting semaphores for synchronization in an RTOS kernel.",
    difficulty: "Medium",
    completionRate: "67%",
    rating: "4.4",
    estimatedTime: "40 min"
  },
  {
    id: 4,
    category: "RTOS",
    title: "Mutex with Priority Inheritance",
    description: "Implement a mutex with priority inheritance to prevent priority inversion.",
    difficulty: "Hard",
    completionRate: "43%",
    rating: "4.9",
    estimatedTime: "60 min"
  },
  {
    id: 5,
    category: "RTOS",
    title: "Time Management Services",
    description: "Create RTOS time management services with tick counting and delay functions.",
    difficulty: "Easy",
    completionRate: "78%",
    rating: "4.2",
    estimatedTime: "30 min"
  },
  {
    id: 6,
    category: "RTOS",
    title: "Memory Pool Implementation",
    description: "Implement a fixed-size memory pool for dynamic memory allocation in an RTOS.",
    difficulty: "Medium",
    completionRate: "61%",
    rating: "4.6",
    estimatedTime: "50 min"
  },
  {
    id: 7,
    category: "RTOS",
    title: "Task Notification System",
    description: "Create a lightweight task notification system as an alternative to semaphores.",
    difficulty: "Medium",
    completionRate: "65%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 8,
    category: "RTOS",
    title: "Event Groups Implementation",
    description: "Implement event groups for synchronizing multiple task events in an RTOS.",
    difficulty: "Medium",
    completionRate: "59%",
    rating: "4.6",
    estimatedTime: "45 min"
  },
  {
    id: 9,
    category: "RTOS",
    title: "Interrupt Management System",
    description: "Create an RTOS-aware interrupt management system with priority handling.",
    difficulty: "Hard",
    completionRate: "45%",
    rating: "4.8",
    estimatedTime: "60 min"
  },
  {
    id: 10,
    category: "RTOS",
    title: "RTOS Heap Management",
    description: "Implement multiple heap allocation strategies for an RTOS memory manager.",
    difficulty: "Hard",
    completionRate: "48%",
    rating: "4.7",
    estimatedTime: "55 min"
  },
  {
    id: 11,
    category: "RTOS",
    title: "Software Timer Services",
    description: "Create a software timer service for executing functions at future times or periodically.",
    difficulty: "Medium",
    completionRate: "62%",
    rating: "4.5",
    estimatedTime: "50 min"
  },
  {
    id: 12,
    category: "RTOS",
    title: "Task Statistics Collection",
    description: "Implement a system for collecting runtime statistics about task CPU usage and stack utilization.",
    difficulty: "Easy",
    completionRate: "71%",
    rating: "4.3",
    estimatedTime: "35 min"
  },
  {
    id: 13,
    category: "RTOS",
    title: "RTOS Kernel Porting Layer",
    description: "Create a hardware abstraction layer to port an RTOS kernel to a new microcontroller architecture.",
    difficulty: "Hard",
    completionRate: "42%",
    rating: "4.9",
    estimatedTime: "70 min"
  },
  {
    id: 14,
    category: "RTOS",
    title: "Idle Task Hook Functions",
    description: "Implement a power-saving idle task with hook functions for an RTOS kernel.",
    difficulty: "Easy",
    completionRate: "75%",
    rating: "4.1",
    estimatedTime: "30 min"
  },
  {
    id: 15,
    category: "RTOS",
    title: "Stream Buffer Implementation",
    description: "Create a stream buffer mechanism for byte stream transfers between tasks or ISRs.",
    difficulty: "Medium",
    completionRate: "57%",
    rating: "4.6",
    estimatedTime: "45 min"
  },
  {
    id: 16,
    category: "RTOS",
    title: "Task Deadlock Detection",
    description: "Build a system for detecting task deadlocks in a complex RTOS application.",
    difficulty: "Hard",
    completionRate: "41%",
    rating: "4.8",
    estimatedTime: "65 min"
  }
];

// Power Management problems
export const powerManagementProblems: ProblemCard[] = [
  {
    id: 1,
    category: "Power Management",
    title: "Dynamic Voltage Scaling",
    description: "Implement a dynamic voltage scaling algorithm for power optimization in embedded processors.",
    difficulty: "Hard",
    completionRate: "46%",
    rating: "4.8",
    estimatedTime: "60 min"
  },
  {
    id: 2,
    category: "Power Management",
    title: "Sleep Mode Controller",
    description: "Create a system to manage various sleep modes and wake-up sources for a microcontroller.",
    difficulty: "Medium",
    completionRate: "63%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 3,
    category: "Power Management",
    title: "Battery Monitoring System",
    description: "Implement a battery monitoring system with state-of-charge estimation and low power alerts.",
    difficulty: "Medium",
    completionRate: "67%",
    rating: "4.4",
    estimatedTime: "50 min"
  },
  {
    id: 4,
    category: "Power Management",
    title: "Power Gating Implementation",
    description: "Create a power gating system to completely shut down unused circuit blocks.",
    difficulty: "Hard",
    completionRate: "41%",
    rating: "4.9",
    estimatedTime: "65 min"
  },
  {
    id: 5,
    category: "Power Management",
    title: "Clock Gating Controller",
    description: "Implement a clock gating controller to disable clocks to inactive system blocks.",
    difficulty: "Medium",
    completionRate: "59%",
    rating: "4.6",
    estimatedTime: "45 min"
  },
  {
    id: 6,
    category: "Power Management",
    title: "Dynamic Frequency Scaling",
    description: "Create a dynamic frequency scaling system for energy-performance tradeoffs in an embedded processor.",
    difficulty: "Hard",
    completionRate: "43%",
    rating: "4.8",
    estimatedTime: "60 min"
  },
  {
    id: 7,
    category: "Power Management",
    title: "Peripheral Power Management",
    description: "Implement a peripheral power management system that controls power to unused peripherals.",
    difficulty: "Easy",
    completionRate: "75%",
    rating: "4.3",
    estimatedTime: "35 min"
  },
  {
    id: 8,
    category: "Power Management",
    title: "Energy Harvesting Controller",
    description: "Create a control system for energy harvesting applications with power budgeting.",
    difficulty: "Hard",
    completionRate: "39%",
    rating: "4.9",
    estimatedTime: "70 min"
  },
  {
    id: 9,
    category: "Power Management",
    title: "Low-Power Duty Cycling",
    description: "Implement a duty cycling algorithm for minimizing power consumption in sensing applications.",
    difficulty: "Medium",
    completionRate: "65%",
    rating: "4.5",
    estimatedTime: "45 min"
  },
  {
    id: 10,
    category: "Power Management",
    title: "Power-Aware Task Scheduling",
    description: "Create a power-aware task scheduling algorithm for an RTOS environment.",
    difficulty: "Hard",
    completionRate: "42%",
    rating: "4.8",
    estimatedTime: "60 min"
  },
  {
    id: 11,
    category: "Power Management",
    title: "Watchdog Power Manager",
    description: "Implement a watchdog-based power management system to recover from power-related hangs.",
    difficulty: "Easy",
    completionRate: "73%",
    rating: "4.2",
    estimatedTime: "30 min"
  },
  {
    id: 12,
    category: "Power Management",
    title: "Low-Power Communication Protocol",
    description: "Design a low-power wireless communication protocol with optimal sleep/wake patterns.",
    difficulty: "Hard",
    completionRate: "45%",
    rating: "4.7",
    estimatedTime: "65 min"
  },
  {
    id: 13,
    category: "Power Management",
    title: "Power Profiling Tool",
    description: "Create a power profiling tool to measure and analyze system power consumption patterns.",
    difficulty: "Medium",
    completionRate: "62%",
    rating: "4.6",
    estimatedTime: "50 min"
  },
  {
    id: 14,
    category: "Power Management",
    title: "Battery Charging Controller",
    description: "Implement a multi-stage battery charging controller for lithium-ion batteries.",
    difficulty: "Medium",
    completionRate: "64%",
    rating: "4.5",
    estimatedTime: "55 min"
  },
  {
    id: 15,
    category: "Power Management",
    title: "Power Supply Sequencing",
    description: "Create a power supply sequencing system for safely starting up and shutting down a complex embedded system.",
    difficulty: "Easy",
    completionRate: "71%",
    rating: "4.3",
    estimatedTime: "40 min"
  },
  {
    id: 16,
    category: "Power Management",
    title: "Thermal Management System",
    description: "Implement a thermal management system that adjusts performance based on temperature readings.",
    difficulty: "Medium",
    completionRate: "58%",
    rating: "4.6",
    estimatedTime: "50 min"
  }
];

export const getCategoryProblems = (category: string): ProblemCard[] => {
  switch(category) {
    case "Memory Management":
      return memoryManagementProblems;
    case "Multithreading":
      return multithreadingProblems;
    case "Data Structures":
      return dataStructuresProblems;
    case "C/C++ APIs":
      return cppApiProblems;
    case "Linux APIs":
      return linuxApiProblems;
    case "RTOS":
      return rtosProblems;
    case "Power Management":
      return powerManagementProblems;
    default:
      return memoryManagementProblems;
  }
};