import React, { useMemo, useEffect } from 'react';

interface ArrowPosition {
  left: number;
  top: number;
}

interface TaskLinkProps {
  tasks: {
    id: number;
    dependencies: number[];
    left: number;
    top: number;
    width: number;
    height: number;
  }[];
  visibleTaskIds: Set<number>;
}

const TaskLinks: React.FC<TaskLinkProps> = ({ tasks, visibleTaskIds }) => {
  const links = useMemo(() => {
    console.log('Calculating task links...');
    const result: { from: ArrowPosition; to: ArrowPosition }[] = [];
    const taskMap = new Map(tasks.map(task => [task.id, task]));

    console.log('Visible Task IDs:', visibleTaskIds);
    visibleTaskIds.forEach(taskId => {
      const task = taskMap.get(taskId);
      if (!task) {
        console.warn(`Task ${taskId} not found in task map.`);
        return;
      }

      console.log(
        `Task ${taskId} details: left=${task.left}, top=${task.top}, width=${task.width}, height=${task.height}`
      );
      console.log(`Task ${taskId} is visible with dependencies:`, task.dependencies);

      task.dependencies.forEach(depId => {
        const dependency = taskMap.get(depId);
        if (dependency) {
          console.log(
            `Dependency ${depId} details: left=${dependency.left}, top=${dependency.top}, width=${dependency.width}, height=${dependency.height}`
          );
          console.log(`Creating link from task ${depId} to task ${taskId}`);
          result.push({
            from: {
              left: dependency.left + dependency.width,
              top: dependency.top + dependency.height / 2,
            },
            to: {
              left: task.left,
              top: task.top + task.height / 2,
            },
          });
        } else {
          console.warn(`Dependency ${depId} for task ${taskId} not found.`);
        }
      });
    });

    // Adjust positions to be relative to the SVG container
    const adjustedLinks = result.map(link => {
      const adjustedFrom = {
        left: link.from.left,
        top: link.from.top - window.scrollY, // Adjust for scroll position
      };
      const adjustedTo = {
        left: link.to.left,
        top: link.to.top - window.scrollY, // Adjust for scroll position
      };

      console.log(
        `Adjusting link: from (${link.from.left}, ${link.from.top}) to (${link.to.left}, ${link.to.top}) -> adjusted from (${adjustedFrom.left}, ${adjustedFrom.top}) to (${adjustedTo.left}, ${adjustedTo.top})`
      );

      return { from: adjustedFrom, to: adjustedTo };
    });

    console.log('Adjusted task links:', adjustedLinks);
    return adjustedLinks;
  }, [tasks, visibleTaskIds]);

  useEffect(() => {
    console.log('Checking visibility logic...');
    tasks.forEach(task => {
      const isVisible =
        task.top + task.height > window.scrollY && task.top < window.scrollY + window.innerHeight;
      console.log(
        `Task ${task.id} visibility: top=${task.top}, height=${task.height}, scrollY=${window.scrollY}, innerHeight=${window.innerHeight}, isVisible=${isVisible}`
      );
    });
  }, [tasks, visibleTaskIds]);

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {links.map((link, index) => {
        console.log(
          `Rendering link ${index}: x1=${link.from.left}, y1=${link.from.top}, x2=${link.to.left}, y2=${link.to.top}`
        );
        return (
          <line
            key={index}
            x1={link.from.left}
            y1={link.from.top}
            x2={link.to.left}
            y2={link.to.top}
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="black" />
        </marker>
      </defs>
    </svg>
  );
};

export default TaskLinks;