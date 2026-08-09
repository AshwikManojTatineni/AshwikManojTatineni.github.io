// ─── Section Definitions ────────────────────────────────────────
export const SECTIONS = [
  {
    id: 'home',
    label: 'Home',
    icon: '⬡',
    theme: {
      bg: '#0a0a0a',
      accent: '#ffd98a',
      glow: '#f5e6c8',
      text: '#ffffff',
    },
  },
  {
    id: 'perception',
    label: 'Perception',
    icon: '◎',
    theme: {
      bg: '#0a0a0a',
      accent: '#00ff3c',
      glow: '#00ff3c',
      text: '#00ff3c',
    },
  },
  {
    id: 'controls',
    label: 'Controls',
    icon: '⟲',
    theme: {
      bg: '#0a1628',
      accent: '#4db8ff',
      glow: '#4db8ff',
      text: '#4db8ff',
    },
  },
  {
    id: 'mechatronics',
    label: 'Mechatronics',
    icon: '⚙',
    theme: {
      bg: '#0d0d10',
      accent: '#c0c0d8',
      glow: '#ff6b35',
      text: '#e0e0e8',
    },
  },
  {
    id: 'rehab',
    label: 'Rehab / Wearable',
    icon: '✦',
    theme: {
      bg: '#0a1a18',
      accent: '#00dca8',
      glow: '#00dca8',
      text: '#00dca8',
    },
  },
  {
    id: 'embodiedai',
    label: 'Embodied AI',
    icon: '◈',
    theme: {
      bg: '#121210',
      accent: '#8a9bae',
      glow: '#c0d0e0',
      text: '#e8e6e0',
    },
  },
];

// ─── Projects ───────────────────────────────────────────────────
export const PROJECTS = [
{
  "id": "quadruped-rl",
  "title": "Quadruped Locomotion via Reinforcement Learning",
  "date": "Nov – Dec 2025",
  "sections": [
    "controls",
    "embodiedai"
  ],
  "tags": [
    "Isaac Lab",
    "RL",
    "PD Control",
    "Raibert Heuristics",
    "Domain Randomization"
  ],
  "media": [
    "asserts/Quadraped Simulation/Actuator_Torque_friction_ExtraCredit.mp4",
    "asserts/Quadraped Simulation/RL_Project_Report.pdf"
  ],
  "bullets": [
    "Developed a robust locomotion policy for a Unitree Go2 robot in Isaac Lab, progressively optimizing a Reinforcement Learning agent from a baseline velocity tracker to a stable gait using action-rate regularization.",
    "Implemented an explicit PD torque controller (Kp=20, Kd=0.5) and integrated Raibert heuristics with gait clock logic to enforce physically consistent foot placement and eliminate crawling artifacts.",
    "Engineered domain randomization techniques by introducing stochastic actuator friction (static and viscous) during training resets, significantly reducing policy jitter and enhancing robustness against dynamic uncertainties."
  ]
},
{
  "id": "visual-nav",
  "title": "Autonomous Visual Navigation Robot",
  "date": "Oct – Dec 2025",
  "sections": [
    "perception",
    "embodiedai"
  ],
  "tags": [
    "ResNet50",
    "A*",
    "Topological Graph",
    "Ball Tree"
  ],
  "media": [
    "asserts/Visual Based Autonomous Navigation/Autonomous Navigation 1.mp4",
    "asserts/Visual Based Autonomous Navigation/Autonomous Navigation_0.mp4"
  ],
  "bullets": [
    "Engineered a mapless navigation pipeline using a pre-trained ResNet50 backbone to extract 2048-dimensional global features, constructing a sparse weighted topological graph from 3,751 exploration images.",
    "Implemented an A* search algorithm for optimal path planning on the topological graph, integrated with a Ball Tree data structure to perform fast O(log N) nearest-neighbor queries for real-time visual localization.",
    "Developed a dynamic navigation loop capable of \"stuck detection\" by monitoring feature variance across frames, triggering online replanning to handle perceptual aliasing and recover from localization failures."
  ]
},
{
  "id": "lerobot",
  "title": "LeRobot Hackathon — Sandwich Making Bot",
  "date": "Apr 2025",
  "sections": [
    "mechatronics",
    "embodiedai"
  ],
  "tags": [
    "LeRobot S-100",
    "ACT Policy",
    "VLA",
    "π₀",
    "Groot N1.5"
  ],
  "media": [
    "asserts/LeRobot Hackathon-Sandwich Making Bot/WhatsApp Video 2026-08-09 at 12.37.29 PM.mp4",
    "asserts/LeRobot Hackathon-Sandwich Making Bot/WhatsApp Video 2026-08-09 at 12.37.32 PM.mp4",
    "asserts/LeRobot Hackathon-Sandwich Making Bot/WhatsApp Video 2026-08-09 at 12.37.36 PM.mp4"
  ],
  "bullets": [
    "Assembled LeRobot S-100 Arm and recorded the data of 100 episodes per task.",
    "Implemented ACT policy to train sequential tasks with the recorded data.",
    "Gained exposure to other VLA policies like π₀ and Nvidia Groot N1.5."
  ]
},
{
  "id": "cipn-sock",
  "title": "Multi-Modal Sock for CIPN Rehabilitation",
  "date": "Jan 2025 – Present",
  "sections": [
    "rehab"
  ],
  "tags": [
    "Wearable",
    "CIPN",
    "Fabrication",
    "Sensor Integration"
  ],
  "media": [
    "asserts/CIPN sock/CIPN Sock.mp4",
    "asserts/CIPN sock/CIPN.mp4",
    "asserts/CIPN sock/CIPN.jpg"
  ],
  "bullets": [
    "Fabricated a Multi-Modal Sock for Chemotherapy-Induced Peripheral Neuropathy (CIPN) Rehabilitation at the MERIIT Lab.",
    "Integrates multiple sensing modalities for comprehensive lower-limb diagnostics."
  ]
},
{
  "id": "pressure-sensor",
  "title": "Capacitive Pressure Sensor Array for Gait Analysis",
  "date": "Jan 2025 – Present",
  "sections": [
    "rehab"
  ],
  "tags": [
    "Capacitive Sensing",
    "Gait Analysis",
    "Custom PCB"
  ],
  "media": [
    "asserts/Gait Analysis with custom capacitive pressure sensor/Gait Analysis.mp4",
    "asserts/Gait Analysis with custom capacitive pressure sensor/Pressuresensor.jpg"
  ],
  "bullets": [
    "Developed a custom Capacitive Pressure Sensor Array for Gait Analysis.",
    "Designed for plantar pressure mapping to support rehabilitation diagnostics."
  ]
},
{
  "id": "gait-tracking",
  "title": "Movement Tracking Parallel Manipulator for Gait Rehabilitation",
  "date": "Feb – May 2025",
  "sections": [
    "perception",
    "rehab"
  ],
  "tags": [
    "Computer Vision",
    "IMU",
    "Pinhole Model",
    "3-RPS"
  ],
  "media": [
    "asserts/Gait Rehab Parallel and Serial Manipulator/Gait Rehab Parallel Manipulator_0.MOV",
    "asserts/Gait Rehab Parallel and Serial Manipulator/Teleop Serial Manipulator.mp4"
  ],
  "bullets": [
    "Led the computer vision pipeline for a dual-system setup involving a 3-RPS parallel manipulator on a gantry, enabling real-time tracking and gait motion control via a blue-object-based target.",
    "Designed and integrated a custom blue target box housing an IMU to place on top of the hybrid platform.",
    "Implemented pixel-to-world mapping and depth estimation using the pinhole model."
  ]
},
{
  "id": "tracking-system",
  "title": "2-Axis Tracking System Using Deep Learning",
  "date": "Nov 2023 – Apr 2024",
  "sections": [
    "perception"
  ],
  "tags": [
    "YOLOv8",
    "DeepSORT",
    "MVS SDK",
    "Real-Time"
  ],
  "media": [
    "asserts/2-Axis Tracking Using Deep Learning/Object Detection and Tracking_0.mp4"
  ],
  "bullets": [
    "Developed a 2-axis object tracking system capable of detecting up to 80 distinct classes and tracking a single object in real time based on user input.",
    "Designed an interface to acquire images via the MVS SDK and implemented YOLOv8 for object detection with DeepSORT for object tracking.",
    "Enabled user-driven mouse input to dynamically adjust motor control, keeping the target centered in the frame."
  ]
},
{
  "id": "holonomic-robot",
  "title": "Autonomous Indoor Navigation for a Holonomic Robot",
  "date": "Aug – Oct 2023",
  "sections": [
    "mechatronics"
  ],
  "tags": [
    "Holonomic Drive",
    "PRM",
    "Stereo Camera",
    "Dead-Reckoning"
  ],
  "media": [
    "asserts/Autonomous Holonomic Robot/Holonomic Robot_0.mp4"
  ],
  "bullets": [
    "Developed a holonomic autonomous robot capable of reaching designated positions via path points generated from stereo camera data using PRM.",
    "Derived and validated kinematic model to facilitate accurate path planning and movement using Dead-Reckoning."
  ]
},
{
  "id": "wrist-exo",
  "title": "3-Axis Exoskeleton for Neuromuscular Wrist Rehabilitation",
  "date": "Jan 2025 – Present",
  "sections": [
    "rehab",
    "controls"
  ],
  "tags": [
    "EPOS4",
    "Torque Control",
    "Exoskeleton",
    "Safety Limits"
  ],
  "media": [
    "asserts/3-Axis Exoskeleton/3-Axis Exoskeleton 1.png",
    "asserts/3-Axis Exoskeleton/3-Axis Exoskeleton_0.png"
  ],
  "bullets": [
    "Developed an algorithm to control the torque of a 3-Axis Exoskeleton for Neuromuscular Wrist Rehabilitation with the EPOS4 Module.",
    "Integrated safety limits across each axis to prevent injury during rehabilitation sessions."
  ]
},
{
  "id": "haptic-glove",
  "title": "Haptic Glove Sensor Calibration",
  "date": "Jan 2025 – Present",
  "sections": [
    "rehab"
  ],
  "tags": [
    "Haptic",
    "Calibration",
    "DAQ",
    "Wearable"
  ],
  "media": [
    "asserts/3-Axis Exoskeleton/Haptic Glove 1.png",
    "asserts/3-Axis Exoskeleton/Haptic Glove 2.png",
    "asserts/3-Axis Exoskeleton/Haptic Glove_0.png"
  ],
  "bullets": [
    "Calibrated and programmed the data acquisition of the sensors on the Haptic Glove.",
    "Part of the MERIIT Lab research on immersive rehabilitation interfaces."
  ]
},
{
  "id": "vr-rehab",
  "title": "Immersive VR Rehabilitation Environment",
  "date": "Jan 2025 – Present",
  "sections": [
    "rehab",
    "embodiedai"
  ],
  "tags": [
    "Meta SDK",
    "Unity",
    "VR",
    "Sensor Integration"
  ],
  "media": [
    "asserts/Interactive VR Environment/VR Simulated.mp4"
  ],
  "bullets": [
    "Developing an immersive VR environment using Meta SDK and Unity with real-time sensor integration.",
    "Bridging physical hardware signals and responsive virtual interfaces for rehabilitation."
  ]
},
{
  "id": "force-control",
  "title": "Virtual Force Measurement & Adaptive Control",
  "date": "Nov – Dec 2025",
  "sections": [
    "controls"
  ],
  "tags": [
    "Gazebo",
    "ROS",
    "MATLAB",
    "Force/Torque",
    "Adaptive Control"
  ],
  "media": [],
  "bullets": [
    "Architected a high-fidelity Gazebo simulation environment integrated with a virtual end-effector force/torque sensor, enabling the extraction of real-time WrenchStamped data via ROS/MATLAB for contact analysis.",
    "Developed a closed-loop adaptive controller that modulates manipulator velocity and grasp strategy based on real-time force feedback, utilizing dynamic thresholds to prevent safety violations during object hand-offs.",
    "Engineered a data logging pipeline to evaluate grasp stability by computing peak force, standard deviation, and contact duration, optimizing the trade-off between operation speed and safety compliance."
  ]
},
{
  "id": "line-follower",
  "title": "Line-Following Robot with PID Control",
  "date": "Jul – Aug 2023",
  "sections": [
    "controls",
    "mechatronics"
  ],
  "tags": [
    "PID",
    "Differential Drive",
    "Path Following"
  ],
  "media": [],
  "bullets": [
    "Built a line-following robot utilizing PID control to ensure stable and precise path-following capabilities.",
    "Part of a larger vertical stacking mobile robot research project at the Motion Analysis Lab."
  ]
},
{
  "id": "stacking-robot",
  "title": "Vertical Stacking Mobile Robot",
  "date": "Jul – Aug 2023",
  "sections": [
    "mechatronics"
  ],
  "tags": [
    "Differential Drive",
    "Pneumatics",
    "Conveyor",
    "Assembly"
  ],
  "media": [],
  "bullets": [
    "Designed and assembled a differential wheeled robot with a pneumatic piston base and conveyor for Vertical Stacking.",
    "Full mechanical design, fabrication, and system integration at the Motion Analysis Lab, Chennai."
  ]
},
];

// ─── Experience ─────────────────────────────────────────────────
export const EXPERIENCE = [
  {
    title: 'MAE Department Course Assistant',
    subtitle: 'ROB-UY-3404 / ROB-GY 6423',
    org: 'New York University',
    location: 'Brooklyn, NY',
    date: 'Sep 2025 – Present',
    bullets: [
      'Guided students through MATLAB & Simulink simulations of Two-Channel Telerobotic Architecture for Position and Velocity Tracking.',
      'Currently providing academic support on the Course Project and Assignments.',
    ],
  },
  {
    title: 'Graduate Researcher',
    subtitle: 'MERIIT Lab',
    org: 'New York University',
    location: 'Brooklyn, NY',
    date: 'Jan 2025 – Present',
    bullets: [
      'Fabricated a Multi-Modal Sock for CIPN Rehabilitation.',
      'Developed a custom Capacitive Pressure Sensor Array for Gait Analysis.',
      'Built a 3-Axis Exoskeleton Torque Control system with EPOS4 Module.',
      'Calibrated data acquisition sensors on the Haptic Glove.',
      'Developing immersive VR rehabilitation environments with Meta SDK and Unity.',
    ],
  },
  {
    title: 'Research Intern',
    subtitle: 'Motion Analysis Lab — Vertical Stacking Mobile Robot',
    org: 'SRM University',
    location: 'Chennai, India',
    date: 'Jul – Aug 2023',
    bullets: [
      'Designed and assembled a differential wheeled robot with pneumatic piston base and conveyor.',
      'Built a line-following robot utilizing PID control for stable path-following.',
    ],
  },
];

// ─── Education ──────────────────────────────────────────────────
export const EDUCATION = [
  {
    school: 'New York University',
    degree: 'Master of Science: Mechatronics and Robotics',
    gpa: '3.6 / 4.0',
    date: 'May 2026',
    location: 'Brooklyn, NY',
  },
  {
    school: 'SRM University',
    degree: 'B.Tech: Mechatronics Engineering, Robotics Specialization',
    gpa: '8.68 / 10',
    date: 'July 2024',
    location: 'Chennai, India',
  },
];

// ─── Skills ─────────────────────────────────────────────────────
export const SKILLS = {
  programming: ['Python', 'C', 'Embedded C', 'C++', 'PLC', 'Assembly'],
  software: ['MATLAB', 'Simulink', 'ROS', 'Gazebo', 'Isaac Sim', 'SolidWorks', 'FluidSIM', 'LabVIEW', 'ANSYS'],
  fabrication: ['Design', 'Machining', 'Assembly', 'CNC Milling', '3D Printing'],
};

// ─── Personal ───────────────────────────────────────────────────
export const PERSONAL = {
  name: 'Ashwik Manoj Tatineni',
  phone: '(917) 982-3854',
  email: 'at6287@nyu.edu',
  linkedin: 'https://linkedin.com/in/ashwik-manoj-tatineni',
  location: 'Brooklyn, NY',
};
