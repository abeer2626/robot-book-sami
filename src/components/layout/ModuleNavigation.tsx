import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

interface Module {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  progress?: number;
}

interface ModuleNavigationProps {
  onNavigate?: () => void;
}

const modules: Module[] = [
  {
    id: 'module-01',
    title: 'Module 1: Foundations',
    description: 'Introduction to robotics, components, and AI fundamentals',
    estimatedHours: 25,
    progress: 0
  },
  {
    id: 'module-02',
    title: 'Module 2: Core Concepts',
    description: 'Motion planning, control systems, and perception',
    estimatedHours: 40,
    progress: 0
  },
  {
    id: 'module-03',
    title: 'Module 3: Advanced Topics',
    description: 'Machine learning, human-robot interaction, and ethics',
    estimatedHours: 50,
    progress: 0
  },
  {
    id: 'module-04',
    title: 'Module 4: Applications',
    description: 'Real-world implementations and case studies',
    estimatedHours: 35,
    progress: 0
  },
  {
    id: 'module-05',
    title: 'Module 5: Capstone',
    description: 'Complete projects and future directions',
    estimatedHours: 30,
    progress: 0
  }
];

export default function ModuleNavigation({ onNavigate }: ModuleNavigationProps): JSX.Element {
  const location = useLocation();

  const getModuleProgress = (moduleId: string): number => {
    // In a real implementation, this would come from user context or API
    return modules.find(m => m.id === moduleId)?.progress || 0;
  };

  const isCurrentModule = (moduleId: string): boolean => {
    return location.pathname.startsWith(`/docs/${moduleId}`);
  };

  return (
    <div className="module-navigation">
      <div className="module-navigation__header">
        <h3>Learning Modules</h3>
        <p className="module-navigation__description">
          Navigate through your robotics learning journey
        </p>
      </div>

      <div className="module-navigation__list">
        {modules.map((module) => {
          const progress = getModuleProgress(module.id);
          const isCurrent = isCurrentModule(module.id);

          return (
            <Link
              key={module.id}
              to={`/docs/${module.id}`}
              className={`module-navigation__item ${
                isCurrent ? 'module-navigation__item--current' : ''
              }`}
              onClick={(e) => {
                // Close mobile nav if it's open
                if (onNavigate && window.innerWidth < 768) {
                  e.preventDefault();
                  onNavigate();
                  // Navigate after a short delay to allow animation
                  setTimeout(() => {
                    window.location.href = `/docs/${module.id}`;
                  }, 300);
                }
              }}
            >
              <div className="module-navigation__item-content">
                <div className="module-navigation__item-header">
                  <h4 className="module-navigation__item-title">
                    {module.title}
                  </h4>
                  {progress > 0 && (
                    <span className="module-navigation__item-progress">
                      {progress}%
                    </span>
                  )}
                </div>
                <p className="module-navigation__item-description">
                  {module.description}
                </p>
                <div className="module-navigation__item-meta">
                  <span className="module-navigation__item-hours">
                    ⏱️ {module.estimatedHours} hours
                  </span>
                  <div className="module-navigation__item-bar">
                    <div
                      className="module-navigation__item-progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}