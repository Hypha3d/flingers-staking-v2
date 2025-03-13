// components/playerHub/QuestsSection.tsx
import { FC, JSX } from 'react';
import styles from '@/app/playerHub/page.module.css';
import { Quest } from '@/config/tasks-quests';

interface QuestsSectionProps {
  quests: Quest[];
  activeQuestTab: string;
  setActiveQuestTab: (tab: string) => void;
  renderQuestCard: (quest: Quest) => JSX.Element;
}

const QuestsSection: FC<QuestsSectionProps> = ({
  quests,
  activeQuestTab,
  setActiveQuestTab,
  renderQuestCard
}) => {
  const dailyQuests = quests.filter(quest => quest.type === 'daily');
  const weeklyQuests = quests.filter(quest => quest.type === 'weekly');
  const monthlyQuests = quests.filter(quest => quest.type === 'monthly');
  const storyQuests = quests.filter(quest => quest.type === 'story');
  const sideQuests = quests.filter(quest => quest.type === 'side');
  
  return (
    <div className={styles.taskSection}>
      <div className={styles.sectionTitle}>
        Game Quests
      </div>
      
      <div className={styles.tabsNav} style={{ marginBottom: '15px' }}>
        <button 
          className={`${styles.tabBtn} ${activeQuestTab === 'daily' ? styles.active : ''}`}
          onClick={() => setActiveQuestTab('daily')}
        >
          Daily
        </button>
        <button 
          className={`${styles.tabBtn} ${activeQuestTab === 'weekly' ? styles.active : ''}`}
          onClick={() => setActiveQuestTab('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`${styles.tabBtn} ${activeQuestTab === 'monthly' ? styles.active : ''}`}
          onClick={() => setActiveQuestTab('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`${styles.tabBtn} ${activeQuestTab === 'story' ? styles.active : ''}`}
          onClick={() => setActiveQuestTab('story')}
        >
          Story
        </button>
        <button 
          className={`${styles.tabBtn} ${activeQuestTab === 'side' ? styles.active : ''}`}
          onClick={() => setActiveQuestTab('side')}
        >
          Side
        </button>
      </div>
      
      <div className={styles.taskList}>
        {activeQuestTab === 'daily' && dailyQuests.map((quest) => renderQuestCard(quest))}
        {activeQuestTab === 'weekly' && weeklyQuests.map((quest) => renderQuestCard(quest))}
        {activeQuestTab === 'monthly' && monthlyQuests.map((quest) => renderQuestCard(quest))}
        {activeQuestTab === 'story' && storyQuests.map((quest) => renderQuestCard(quest))}
        {activeQuestTab === 'side' && sideQuests.map((quest) => renderQuestCard(quest))}
      </div>
    </div>
  );
};

export default QuestsSection;