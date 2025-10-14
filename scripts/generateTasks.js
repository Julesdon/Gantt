// scripts/generateTasks.js
import fs from 'fs';

const generateTasks = (count) => {
  const taskTypes = [
    'Site Preparation', 'Excavation', 'Foundation Pour', 'Foundation Curing',
    'Framing - Floor', 'Framing - Walls', 'Framing - Roof', 'Roof Sheathing',
    'Window Installation', 'Door Installation', 'Rough Electrical', 'Rough Plumbing',
    'HVAC Installation', 'Insulation', 'Drywall Hanging', 'Drywall Taping',
    'Drywall Finishing', 'Interior Painting', 'Exterior Painting', 'Flooring - Subfloor',
    'Flooring - Tile', 'Flooring - Hardwood', 'Flooring - Carpet', 'Cabinet Installation',
    'Countertop Installation', 'Fixture Installation', 'Final Electrical', 'Final Plumbing',
    'Landscaping', 'Driveway', 'Walkways', 'Final Inspection'
  ];
  
  const locations = ['Building A', 'Building B', 'Building C', 'Building D', 'Site Common Area'];
  
  // Generate initial tasks without dependencies
  const tasks = Array.from({ length: count }, (_, i) => {
    const startDate = new Date();
    // Random date between 12 months ago and 48 months from now
    const monthsOffset = Math.floor(Math.random() * 60) - 12; // -12 to +48
    startDate.setMonth(startDate.getMonth() + monthsOffset);
    startDate.setDate(Math.floor(Math.random() * 28) + 1);
    
    const endDate = new Date(startDate);
    const weeksToAdd = Math.floor(Math.random() * 4) + 1; // 1-4 weeks
    endDate.setDate(endDate.getDate() + (weeksToAdd * 7));
    
    return {
      id: i + 1,
      name: `${taskTypes[i % taskTypes.length]} - ${locations[Math.floor(i / taskTypes.length) % locations.length]} - Phase ${Math.floor(i / 50) + 1}`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dependencies: []
    };
  });
  
  // Add dependencies (random tasks that come before this one)
  tasks.forEach((task, index) => {
    if (index > 0) {
      const numDependencies = Math.floor(Math.random() * 6); // 0-5 dependencies
      const possibleDependencies = tasks.slice(0, index); // Only tasks created before this one
      
      if (possibleDependencies.length > 0) {
        const selectedDeps = new Set();
        for (let i = 0; i < numDependencies && i < possibleDependencies.length; i++) {
          const randomIndex = Math.floor(Math.random() * possibleDependencies.length);
          selectedDeps.add(possibleDependencies[randomIndex].id);
        }
        task.dependencies = Array.from(selectedDeps);
      }
    }
  });
  
  return tasks;
};

const recalculateDependentDates = (tasks) => {
  // Create a map for quick lookup
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  
  // For each task, ensure it starts after all its dependencies end
  tasks.forEach(task => {
    if (task.dependencies.length > 0) {
      let latestEndDate = new Date(task.startDate);
      
      task.dependencies.forEach(depId => {
        const depTask = taskMap.get(depId);
        if (depTask) {
          const depEndDate = new Date(depTask.endDate);
          if (depEndDate > latestEndDate) {
            latestEndDate = depEndDate;
          }
        }
      });
      
      // Add 1 day buffer after latest dependency
      latestEndDate.setDate(latestEndDate.getDate() + 1);
      
      // Only update if the new start date is later than current
      const currentStart = new Date(task.startDate);
      if (latestEndDate > currentStart) {
        const originalDuration = (new Date(task.endDate) - currentStart) / (1000 * 60 * 60 * 24);
        task.startDate = latestEndDate.toISOString().split('T')[0];
        
        // Recalculate end date to maintain duration
        const newEndDate = new Date(latestEndDate);
        newEndDate.setDate(newEndDate.getDate() + originalDuration);
        task.endDate = newEndDate.toISOString().split('T')[0];
      }
    }
  });
};

// Generate tasks
console.log('Generating 1000 construction tasks...');
let tasks = generateTasks(1000);

// Sort by end date (ascending)
console.log('Sorting tasks by end date...');
tasks.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

// Recalculate dates based on dependencies
console.log('Recalculating dates based on dependencies...');
recalculateDependentDates(tasks);

// Sort again after recalculation
console.log('Final sort by end date...');
tasks.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

// Create output directory if it doesn't exist
const outputDir = './src/data';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write to file
fs.writeFileSync(`${outputDir}/mockTasks.json`, JSON.stringify(tasks, null, 2));

console.log(`✅ Successfully generated 1000 tasks!`);
console.log(`📊 Date range: ${tasks[0].endDate} to ${tasks[tasks.length - 1].endDate}`);
console.log(`📦 File saved to: ${outputDir}/mockTasks.json`);