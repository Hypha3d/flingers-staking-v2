// components/playerHub/SkillTreeModal.tsx
import React from 'react';
import styles from '@/app/playerHub/page.module.css';
import type { Character } from '@/types/playerHub';

interface SkillTreeModalProps {
  selectedCharacter: Character;
  CHARACTER_CLASSES: any;
  unlockSkill: (characterId: string, skillId: string) => void;
  setIsSkillTreeModalOpen: (isOpen: boolean) => void;
}

const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  selectedCharacter,
  CHARACTER_CLASSES,
  unlockSkill,
  setIsSkillTreeModalOpen
}) => {
  // Get the class data for the selected character
  const classData = CHARACTER_CLASSES[selectedCharacter.class as keyof typeof CHARACTER_CLASSES];
  
  return (
    <div className={styles.modalOverlay} onClick={() => setIsSkillTreeModalOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ width: '700px', maxWidth: '90%' }}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {selectedCharacter.name} - Skill Tree
            <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: 'normal', color: 'var(--text-dim)' }}>
              Level {selectedCharacter.level} {selectedCharacter.class.charAt(0).toUpperCase() + selectedCharacter.class.slice(1)}
            </span>
          </h3>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsSkillTreeModalOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '15px',
            padding: '10px', 
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Available Skill Points</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {selectedCharacter.skillPoints || 0}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Unlocked Skills</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {selectedCharacter.unlockedSkills?.length || 0} / {classData.skillTree.length}
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {classData.skillTree.map((skill: any) => {
              const isUnlocked = selectedCharacter.unlockedSkills?.includes(skill.id);
              const canUnlock = !isUnlocked && 
                (selectedCharacter.skillPoints || 0) >= skill.pointCost &&
                selectedCharacter.level >= skill.levelRequired &&
                (!skill.prerequisiteSkills ||
                  skill.prerequisiteSkills.every((prereq: string) => 
                    selectedCharacter.unlockedSkills?.includes(prereq)
                  )
                );
              
              return (
                <div 
                  key={skill.id}
                  className={styles.previewSection}
                  style={{ 
                    position: 'relative',
                    opacity: selectedCharacter.level < skill.levelRequired ? 0.6 : 1
                  }}
                >
                  <div className={styles.previewTitle} style={{ 
                    color: isUnlocked ? 'var(--primary-color)' : 'var(--text-dim)'
                  }}>
                    {skill.name}
                  </div>
                  
                  <div style={{ 
                    fontSize: '24px', 
                    marginBottom: '10px',
                    color: isUnlocked ? 'var(--primary-color)' : 'var(--text-dim)'
                  }}>
                    {skill.icon}
                  </div>
                  
                  <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                    {skill.description}
                  </div>
                  
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    <div>Level required: {skill.levelRequired}</div>
                    <div>Cost: {skill.pointCost} point{skill.pointCost > 1 ? 's' : ''}</div>
                    {skill.prerequisiteSkills && skill.prerequisiteSkills.length > 0 && (
                      <div>
                        Requires: {skill.prerequisiteSkills.map((prereqId: string) => {
                          const prereqSkill = classData.skillTree.find((s: any) => s.id === prereqId);
                          return prereqSkill?.name;
                        }).join(', ')}
                      </div>
                    )}
                  </div>
                  
                  {skill.bonuses.length > 0 && (
                    <div style={{ fontSize: '11px', marginTop: '8px' }}>
                      {skill.bonuses.map((bonus: any, idx: number) => (
                        <div key={idx} style={{ color: isUnlocked ? 'var(--success-color)' : 'var(--text-dim)' }}>
                          {bonus.stat}: +{bonus.value}{bonus.isPercentage ? '%' : ''}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {isUnlocked && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: 'var(--success-color)',
                        fontSize: '16px'
                      }}
                    >
                      ✓
                    </div>
                  )}
                  
                  {!isUnlocked && (
                    <button
                      className={styles.miniBtn}
                      style={{ 
                        marginTop: '10px',
                        width: '100%',
                        opacity: canUnlock ? 1 : 0.5
                      }}
                      onClick={() => {
                        if (canUnlock) {
                          unlockSkill(selectedCharacter.id, skill.id);
                        } else if (selectedCharacter.level < skill.levelRequired) {
                          alert(`You need to reach level ${skill.levelRequired} to unlock this skill.`);
                        } else if ((selectedCharacter.skillPoints || 0) < skill.pointCost) {
                          alert(`You need ${skill.pointCost} skill points to unlock this skill.`);
                        } else {
                          alert('You need to unlock prerequisite skills first.');
                        }
                      }}
                      disabled={!canUnlock}
                    >
                      {canUnlock ? 'Unlock' : 'Locked'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreeModal;