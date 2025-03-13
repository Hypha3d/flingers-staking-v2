// services/playerService.ts
export function savePlayerData(playerData: any) {
    localStorage.setItem('playerData', JSON.stringify(playerData));
  }
  
  export function getPlayerData() {
    return JSON.parse(localStorage.getItem('playerData') || '{}');
  }
  
  // services/taskService.ts
  export function getAvailableTasks(playerLevel: number, completedTaskIds: string[]) {
    // Logic to get available tasks
  }