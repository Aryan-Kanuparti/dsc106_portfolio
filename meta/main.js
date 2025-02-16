const width = 1000;
const height = 600;
let data = [];
let commits = [];

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
  

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, d => d.datetime))
    .range([usableArea.left, usableArea.right])
    .nice();
  
  const yScale = d3
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
  
  // Append the dots
  const dots = svg.append('g').attr('class', 'dots');
  
  dots.selectAll('circle')
    .data(commits)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', 5)
    .attr('fill', 'steelblue');
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  // Optionally, remove console.log calls once you're satisfied with the output.
});
