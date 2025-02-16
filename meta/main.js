const width = 1000;
const height = 600;
let data = [];
let commits = [];
let xScale, yScale;
let brushSelection = null;

async function loadData() {
  // Load CSV data and convert types as needed
  data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: +row.line,
    depth: +row.depth,
    length: +row.length,
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  // Process commits based on loaded data
  processCommits();

  // Now compute and display stats
  displayStats();
  createScatterplot();
}

function processCommits() {
  commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
    let first = lines[0];
    let { author, date, time, timezone, datetime } = first;
    let ret = {
      id: commit,
      url: 'https://github.com/YOUR_REPO/commit/' + commit,
      author,
      date,
      time,
      timezone,
      datetime,
      hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
      totalLines: lines.length,
    };

    Object.defineProperty(ret, 'lines', {
      value: lines,
      enumerable: false,
      configurable: false,
      writable: false,
    });

    return ret;
  });
}

function displayStats() {
  // Compute some stats
  const totalLOC = data.length;
  const totalCommits = commits.length;
  // Assuming each row has a "file" property; adjust if needed:
  const numberOfFiles = d3.group(data, d => d.file).size;
  const longestFile = d3.max(data, d => d.length);
  const averageLineLength = d3.mean(data, d => d.length);
  
  // Example for most common commit hour:
  const commitHours = commits.map(c => Math.floor(c.hourFrac));
  const hourCounts = d3.rollup(commitHours, v => v.length, d => d);
  const mostCommonHour = d3.greatest(Array.from(hourCounts), ([hour, count]) => count)[0];

  // Build stats array
  const statsArray = [
    { label: 'Total LOC', value: totalLOC },
    { label: 'Total Commits', value: totalCommits },
    { label: 'Number of Files', value: numberOfFiles },
    { label: 'Longest File (in lines)', value: longestFile },
    { label: 'Average Line Length', value: averageLineLength.toFixed(2) },
    { label: 'Most Common Commit Hour', value: `${mostCommonHour}:00` }
  ];

  // Select the container and clear its current contents
  const statsContainer = d3.select('#stats');
  statsContainer.html('');

  // Append each stat item to the container
  statsArray.forEach(stat => {
    statsContainer.append('div')
      .attr('class', 'stat-item')
      .html(`${stat.label}: <span>${stat.value}</span>`);
  });
}


function createScatterplot() {
  // Create sthe SVG element
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');
  
  // margins and usable area
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };
  const usableArea = {
    left: margin.left,
    right: width - margin.right,
    top: margin.top,
    bottom: height - margin.bottom,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };
    xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, d => d.datetime))
    .range([usableArea.left, usableArea.right])
    .nice();
    yScale = d3
    .scaleLinear()
    .domain([0, 24])
    .range([usableArea.bottom, usableArea.top]);
  
  // axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale)
                  .tickFormat(d => String(d % 24).padStart(2, '0') + ':00');
  
  svg.append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);
  
  svg.append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);
  
  // Draw horizontal grid lines 
  const gridlines = svg.append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);
  
  gridlines.call(
    d3.axisLeft(yScale)
      .tickFormat('')
      .tickSize(-usableArea.width)
  );
  
  // Compute min and max of total lines edited among commits
  const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);

// Create a radius scale using a linear scale (we will update to a sqrt scale next)
  let rScale = d3.scaleSqrt()
  .domain([minLines, maxLines])
  .range([2, 30]); // Experiment with these values for appropriate min/max radii

  // Sort commits by totalLines in descending order so that smaller dots render on top
  const sortedCommits = d3.sort(commits, d => -d.totalLines);

  // Append the dots
  const dots = svg.append('g').attr('class', 'dots');
  
  dots.selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines))
    .style('fill-opacity', 0.7)
    .attr('fill', 'purple')
    .on('mouseenter', function(event,d) {
        d3.select(this).style('fill-opacity', 1);
        updateTooltipContent(d);
        updateTooltipVisibility(true);
        updateTooltipPosition(event);
    })
    .on('mouseleave', function() {
        d3.select(this).style('fill-opacity', 0.7);
        updateTooltipContent({});  // Clear tooltip content
        updateTooltipVisibility(false);
    });

    // const brush = d3.brush().on('start brush end', brushed);
    // d3.select(svg).call(brush);
    
    // // Raise dots above the brush overlay so tooltips work
    // d3.select(svg).selectAll('.dots, .overlay ~ *').raise();

    // // d3.select(svg).call(brush).on('start brush end', brushed);
    // // d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
    const brush = d3.brush()
    .extent([[usableArea.left, usableArea.top], [usableArea.right, usableArea.bottom]])  // Define the area where brushing can happen
    .on('start brush end', brushed);
    svg.append('g')
    .attr('class', 'brush')
    .call(brush);

    svg.selectAll('.dots, .overlay ~ *').raise();
  
}



// Updates the tooltip content based on the commit object
function updateTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');
    const timeEl = document.getElementById('commit-time');
    const authorEl = document.getElementById('commit-author');
    const linesEl = document.getElementById('commit-lines');
    
    // If commit is empty, clear content
    if (Object.keys(commit).length === 0) {
      link.textContent = '';
      date.textContent = '';
      timeEl.textContent = '';
      authorEl.textContent = '';
      linesEl.textContent = '';
      return;
    }
    
    link.href = commit.url;
    link.textContent = commit.id;
    // Format the date nicely; adjust options as needed
    date.textContent = commit.datetime ? commit.datetime.toLocaleString('en', { dateStyle: 'full' }) : '';
    timeEl.textContent = commit.datetime ? commit.datetime.toLocaleTimeString('en', { timeStyle: 'short' }) : '';
    authorEl.textContent = commit.author || '';
    linesEl.textContent = commit.totalLines;
  }
  
  // Updates tooltip visibility
function updateTooltipVisibility(isVisible) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.hidden = !isVisible;
  }
  
  // Positions the tooltip near the mouse cursor
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
  }

  
// Called whenever brushing occurs
function brushed(event) {
    brushSelection = event.selection;
    updateSelection();
    updateSelectionCount();
    updateLanguageBreakdown(); // If you have language stats; otherwise, remove or adjust
  }
  

  // Check if a commit falls within the brush selection
function isCommitSelected(commit) {
    if (!brushSelection) return false;
    
    const [minX, minY] = brushSelection[0];
    const [maxX, maxY] = brushSelection[1];
    
    // Use xScale and yScale to map data to coordinates
    const x = xScale(commit.datetime);
    const y = yScale(commit.hourFrac);
    
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
  
  // Update visual state of dots based on brush selection
function updateSelection() {
    d3.selectAll('circle')
      .classed('selected', d => isCommitSelected(d));
  }
  
  // Update the count of selected commits (assumes an element with id "selection-count" exists)
function updateSelectionCount() {
    const selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
    const countElement = document.getElementById('selection-count');
    if (countElement) {
      countElement.textContent = (selectedCommits.length || 'No') + ' commits selected';
    }
    return selectedCommits;
  }
  


function updateLanguageBreakdown() {
    const selectedCommits = brushSelection
        ? commits.filter(isCommitSelected)
        : [];
    const container = document.getElementById('language-breakdown');
    const requiredCommits = selectedCommits.length ? selectedCommits : commits;
    const lines = requiredCommits.flatMap((d) => d.lines);

    // Use d3.rollup to count lines per language
    const breakdown = d3.rollup(
        lines,
        (v) => v.length,
        (d) => d.type
    );

    // Update DOM with breakdown
    container.innerHTML = '';

    for (const [language, count] of breakdown) {
        const proportion = count / lines.length;
        const formatted = d3.format('.1~%')(proportion);
        const percentage = (proportion * 100).toFixed(1); // Convert to percentage for better readability

        container.innerHTML += `
            <div class="lang-item">
                <strong>${language.toUpperCase()}</strong>: ${count} lines (${formatted})
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    }

    return breakdown;
}


document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  console.log("xScale domain:", xScale.domain(), "range:", xScale.range());
  console.log("yScale domain:", yScale.domain(), "range:", yScale.range());

  // Optionally, remove console.log calls once you're satisfied with the output.
});
