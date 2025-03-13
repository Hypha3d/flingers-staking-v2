"use client";

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppContext } from '@/context/AppContext';
import { GAMES, Game, GameCategory, DevlogEntry } from '@/config/games';
import styles from './page.module.css';

export default function Games() {
  const { profile } = useAppContext();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'all'>('all');
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'devlog'>('details');
  const [selectedDevlog, setSelectedDevlog] = useState<DevlogEntry | null>(null);
  
  // Filter games by category
  const filteredGames = activeCategory === 'all' 
    ? GAMES 
    : GAMES.filter(game => game.category === activeCategory);
  
  // Group games by category
  const gameCategories = {
    staking: filteredGames.filter(game => game.category === 'staking'),
    minigame: filteredGames.filter(game => game.category === 'minigame'),
    online: filteredGames.filter(game => game.category === 'online'),
    release: filteredGames.filter(game => game.category === 'release')
  };
  
  // Handle game card click
  const handleGameClick = (game: Game) => {
    if (game.status === 'development' && game.comingSoon) {
      // Don't open modal for games in development
      return;
    }
    
    setSelectedGame(game);
    setActiveModalTab('details');
    setSelectedDevlog(null);
    setIsModalOpen(true);
  };
  
  // Get status badge text and color
  const getStatusBadge = (status: Game['status']) => {
    switch (status) {
      case 'development':
        return { text: 'In Development', color: '#f44336' };
      case 'alpha':
        return { text: 'Alpha', color: '#ff9800' };
      case 'beta':
        return { text: 'Beta', color: '#2196f3' };
      case 'release':
        return { text: 'Release', color: '#4caf50' };
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'TBC';
    if (dateString === 'TBC') return 'TBC';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle devlog click
  const handleDevlogClick = (devlog: DevlogEntry) => {
    setSelectedDevlog(devlog);
  };
  
  // Render game card
  const renderGameCard = (game: Game) => {
    const statusBadge = getStatusBadge(game.status);
    const isPlayable = game.status !== 'development' || !game.comingSoon;
    
    return (
      <div 
        key={game.id} 
        className={`${styles.gameCard} ${!isPlayable ? styles.inDevelopment : ''}`}
        onClick={() => isPlayable && handleGameClick(game)}
      >
        <div className={styles.gameImg}>
          {game.icon}
        </div>
        <div 
          className={styles.statusBadge} 
          style={{ backgroundColor: statusBadge.color }}
        >
          {statusBadge.text}
        </div>
        <div className={styles.gameDetails}>
          <div className={styles.gameTitle}>{game.title}</div>
        </div>
      </div>
    );
  };
  
  // Render category section
  const renderCategorySection = (title: string, games: Game[]) => {
    if (games.length === 0) return null;
    
    return (
      <div className={styles.categorySection}>
        <h2 className={styles.categoryTitle}>{title}</h2>
        <div className={styles.gamesGrid}>
          {games.map(renderGameCard)}
        </div>
      </div>
    );
  };
  
  // Render modal content based on active tab
  const renderModalContent = () => {
    if (!selectedGame) return null;
    
    switch (activeModalTab) {
      case 'details':
        return (
          <>
            <div className={styles.modalIconContainer}>
              <div className={styles.modalIcon}>{selectedGame.icon}</div>
              <div 
                className={styles.modalStatus}
                style={{ backgroundColor: getStatusBadge(selectedGame.status).color }}
              >
                {getStatusBadge(selectedGame.status).text}
              </div>
            </div>
            
            <div className={styles.modalDescription}>
              {selectedGame.longDescription || selectedGame.description}
            </div>
            
            <div className={styles.modalInfo}>
              <div className={styles.modalInfoRow}>
                <div className={styles.modalInfoLabel}>Players:</div>
                <div className={styles.modalInfoValue}>{selectedGame.players.toLocaleString()}</div>
              </div>
              <div className={styles.modalInfoRow}>
                <div className={styles.modalInfoLabel}>Reward Points:</div>
                <div className={styles.modalInfoValue}>{selectedGame.points.toLocaleString()}</div>
              </div>
              <div className={styles.modalInfoRow}>
                <div className={styles.modalInfoLabel}>Release Date:</div>
                <div className={styles.modalInfoValue}>{formatDate(selectedGame.releaseDate)}</div>
              </div>
              {selectedGame.lastUpdated && (
                <div className={styles.modalInfoRow}>
                  <div className={styles.modalInfoLabel}>Last Updated:</div>
                  <div className={styles.modalInfoValue}>{formatDate(selectedGame.lastUpdated)}</div>
                </div>
              )}
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={`${styles.modalButton} ${styles.secondaryButton}`} 
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button 
                className={`${styles.modalButton} ${styles.primaryButton}`}
                onClick={() => {
                  alert(`Launching ${selectedGame.title}! Game functionality will be added later.`);
                  setIsModalOpen(false);
                }}
              >
                Launch Game
              </button>
            </div>
          </>
        );
        
      case 'devlog':
        return (
          <div className={styles.devlogContainer}>
            {selectedGame.devlogs && selectedGame.devlogs.length > 0 ? (
              <>
                {/* Devlog list and detail view */}
                <div className={styles.devlogContent}>
                  {/* Left column: list of devlogs */}
                  <div className={styles.devlogList}>
                    <h3 className={styles.devlogListTitle}>Updates</h3>
                    {selectedGame.devlogs.map((devlog) => (
                      <div 
                        key={devlog.date + devlog.title}
                        className={`${styles.devlogItem} ${selectedDevlog?.date === devlog.date && selectedDevlog?.title === devlog.title ? styles.activeDevlog : ''}`}
                        onClick={() => handleDevlogClick(devlog)}
                      >
                        <div className={styles.devlogItemDate}>
                          {formatDate(devlog.date)}
                        </div>
                        <div className={styles.devlogItemTitle}>
                          {devlog.title}
                          {devlog.version && <span className={styles.versionTag}>v{devlog.version}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Right column: devlog detail */}
                  <div className={styles.devlogDetail}>
                    {selectedDevlog ? (
                      <>
                        <div className={styles.devlogDetailHeader}>
                          <h3 className={styles.devlogDetailTitle}>
                            {selectedDevlog.title}
                            {selectedDevlog.version && <span className={styles.devlogVersion}>v{selectedDevlog.version}</span>}
                          </h3>
                          <div className={styles.devlogDetailDate}>
                            {formatDate(selectedDevlog.date)}
                          </div>
                        </div>
                        <div className={styles.devlogDetailContent}>
                          {selectedDevlog.content}
                        </div>
                      </>
                    ) : (
                      <div className={styles.noDevlogSelected}>
                        <p>Select an update from the list to view details.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.modalActions}>
                  <button 
                    className={`${styles.modalButton} ${styles.secondaryButton}`} 
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.noDevlogs}>
                <p>No development updates available yet.</p>
                <div className={styles.modalActions}>
                  <button 
                    className={`${styles.modalButton} ${styles.secondaryButton}`} 
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };
  
  return (
    <AppLayout>
      <div className={styles.pageTitle}>GAMES</div>
      
      {/* Category Navigation */}
      <div className={styles.categoryNav}>
        <button 
          className={`${styles.categoryBtn} ${activeCategory === 'all' ? styles.active : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All Games
        </button>
        <button 
          className={`${styles.categoryBtn} ${activeCategory === 'minigame' ? styles.active : ''}`}
          onClick={() => setActiveCategory('minigame')}
        >
          Minigames
        </button>
        <button 
          className={`${styles.categoryBtn} ${activeCategory === 'staking' ? styles.active : ''}`}
          onClick={() => setActiveCategory('staking')}
        >
          Staking Games
        </button>
        <button 
          className={`${styles.categoryBtn} ${activeCategory === 'online' ? styles.active : ''}`}
          onClick={() => setActiveCategory('online')}
        >
          Multiplayer
        </button>
        <button 
          className={`${styles.categoryBtn} ${activeCategory === 'release' ? styles.active : ''}`}
          onClick={() => setActiveCategory('release')}
        >
          Full Games
        </button>
      </div>
      
      {/* Render all categories or just the selected one */}
      {activeCategory === 'all' ? (
        <>
          {renderCategorySection('Minigames', gameCategories.minigame)}
          {renderCategorySection('Staking Games', gameCategories.staking)}
          {renderCategorySection('Multiplayer', gameCategories.online)}
          {renderCategorySection('Full Games', gameCategories.release)}
        </>
      ) : (
        renderCategorySection(
          activeCategory === 'minigame' ? 'Minigames' :
          activeCategory === 'staking' ? 'Staking Games' :
          activeCategory === 'online' ? 'Multiplayer' : 'Full Games',
          filteredGames
        )
      )}
      
      {/* Game Detail Modal */}
      {isModalOpen && selectedGame && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedGame.title}</h2>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            {/* Modal Tabs */}
            <div className={styles.modalTabs}>
              <button 
                className={`${styles.modalTab} ${activeModalTab === 'details' ? styles.activeTab : ''}`}
                onClick={() => setActiveModalTab('details')}
              >
                Details
              </button>
              <button 
                className={`${styles.modalTab} ${activeModalTab === 'devlog' ? styles.activeTab : ''}`}
                onClick={() => {
                  setActiveModalTab('devlog');
                  // Select the most recent devlog by default if available
                  if (selectedGame.devlogs && selectedGame.devlogs.length > 0) {
                    setSelectedDevlog(selectedGame.devlogs[0]);
                  }
                }}
              >
                Dev Updates
              </button>
            </div>
            
            <div className={styles.modalContent}>
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}