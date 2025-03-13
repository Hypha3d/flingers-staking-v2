// components/playerHub/TasksSection.tsx
import React, { JSX } from 'react';
import styles from '@/app/playerHub/page.module.css';
import type { Task } from '@/types/playerHub';
import { getAllTasks } from '@/config/tasks-quests';

interface TasksSectionProps {
  tasks: Task[];
  activeTaskTab: string;
  setActiveTaskTab: (tab: string) => void;
  renderTaskCard: (task: Task) => JSX.Element;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  activeTaskTab,
  setActiveTaskTab,
  renderTaskCard
}) => {
  const onboardingTasks = tasks.filter(task => 
    getAllTasks().find(t => t.id === task.id)?.type === 'onboarding'
  );
  
  const progressionTasks = tasks.filter(task => 
    getAllTasks().find(t => t.id === task.id)?.type === 'progression'
  );
  
  const communityTasks = tasks.filter(task => 
    getAllTasks().find(t => t.id === task.id)?.type === 'community'
  );
  
  return (
    <div className={styles.taskSection}>
      <div className={styles.sectionTitle}>
        Player Tasks
      </div>
      
      <div className={styles.tabsNav} style={{ marginBottom: '15px' }}>
        <button 
          className={`${styles.tabBtn} ${activeTaskTab === 'onboarding' ? styles.active : ''}`}
          onClick={() => setActiveTaskTab('onboarding')}
        >
          Onboarding
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTaskTab === 'progression' ? styles.active : ''}`}
          onClick={() => setActiveTaskTab('progression')}
        >
          Progression
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTaskTab === 'community' ? styles.active : ''}`}
          onClick={() => setActiveTaskTab('community')}
        >
          Community
        </button>
      </div>
      
      <div className={styles.taskList}>
        {activeTaskTab === 'onboarding' && onboardingTasks.map((task) => renderTaskCard(task))}
        {activeTaskTab === 'progression' && progressionTasks.map((task) => renderTaskCard(task))}
        {activeTaskTab === 'community' && communityTasks.map((task) => renderTaskCard(task))}
      </div>
    </div>
  );
};

export default TasksSection;