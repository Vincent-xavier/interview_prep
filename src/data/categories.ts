import { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'react',         label: 'React',            icon: '⚛️',  group: 'Frontend' },
  { id: 'react_extra',   label: 'React Advanced',   icon: '🔮',  group: 'Frontend' },
  { id: 'typescript',    label: 'TypeScript',        icon: '📘',  group: 'Frontend' },
  { id: 'js_core',       label: 'JavaScript Core',  icon: '🟡',  group: 'Frontend' },
  { id: 'redux',         label: 'Redux & State',     icon: '🔄',  group: 'Frontend' },
  { id: 'dotnet',        label: '.NET Core & C#',   icon: '🔷',  group: 'Backend' },
  { id: 'aspnet',        label: 'ASP.NET Web API',  icon: '🌐',  group: 'Backend' },
  { id: 'ef_linq',       label: 'EF Core & LINQ',   icon: '🔗',  group: 'Backend' },
  { id: 'database',      label: 'PostgreSQL & SQL',  icon: '🗄️',  group: 'Database' },
  { id: 'security',      label: 'JWT & Security',   icon: '🔐',  group: 'Security' },
  { id: 'solid',         label: 'OOP & SOLID',      icon: '🏗️',  group: 'Architecture' },
  { id: 'microservices', label: 'Microservices',    icon: '🧩',  group: 'Architecture' },
  { id: 'system_design', label: 'System Design',    icon: '🏛️',  group: 'Architecture' },
  { id: 'performance',   label: 'Performance',      icon: '⚡',  group: 'Architecture' },
  { id: 'testing',       label: 'Testing',          icon: '🧪',  group: 'Architecture' },
  { id: 'devops',        label: 'Docker & DevOps',  icon: '🐳',  group: 'DevOps' },
  { id: 'scenario',      label: 'Scenario Based',   icon: '🎭',  group: 'Special' },
  { id: 'string_js',     label: 'String (JS)',      icon: '🟨',  group: 'Special' },
  { id: 'string_cs',     label: 'String (C#)',      icon: '🔵',  group: 'Special' },
  { id: 'hr_behavior',   label: 'HR & Behavioral',  icon: '🤝',  group: 'HR' },
  { id: 'db_code',       label: 'SQL Coding',       icon: '💾',  group: 'HR' },
];

export const GROUPS = CATEGORIES.reduce<Record<string, Category[]>>((acc, cat) => {
  if (!acc[cat.group]) acc[cat.group] = [];
  acc[cat.group].push(cat);
  return acc;
}, {});
