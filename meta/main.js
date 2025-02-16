// let data = [];

// async function loadData() {
//   data = await d3.csv('loc.csv');
//   console.log(data);
// }

// document.addEventListener('DOMContentLoaded', async () => {
//   await loadData();
// });

// async function loadData() {
//     data = await d3.csv('loc.csv', (row) => ({
//       ...row,
//       line: +row.line,  // Convert to number
//       depth: +row.depth,
//       length: +row.length,
//       date: new Date(row.date + 'T00:00' + row.timezone), // Convert to date
//       datetime: new Date(row.datetime),
//     }));
//     displayStats();
//   }


// let commits = [];


// function processCommits() {
//     commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
//       let first = lines[0];
//       let { author, date, time, timezone, datetime } = first;
  
//       let ret = {
//         id: commit,
//         url: 'https://github.com/YOUR_REPO/commit/' + commit,
//         author,
//         date,
//         time,
//         timezone,
//         datetime,
//         hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
//         totalLines: lines.length,
//       };
  
//       Object.defineProperty(ret, 'lines', {
//         value: lines,
//         enumerable: false,  // Hide from console
//         configurable: false,
//         writable: false,
//       });
  
//       return ret;
//     });
//   }



// function displayStats() {
//   processCommits();

//   const dl = d3.select('#stats').append('dl').attr('class', 'stats');

//   dl.append('dt').html('Total <abbr title="Lines of Code">LOC</abbr>');
//   dl.append('dd').text(data.length);

//   dl.append('dt').text('Total Commits');
//   dl.append('dd').text(commits.length);

//   // Maximum file length
//   let maxFileLength = d3.max(data, (d) => d.length);
//   dl.append('dt').text('Longest file (in lines)');
//   dl.append('dd').text(maxFileLength);

//   // Average line length
//   let avgLineLength = d3.mean(data, (d) => d.length);
//   dl.append('dt').text('Average Line Length');
//   dl.append('dd').text(avgLineLength.toFixed(2));

//   // Most common commit time of day
//   let commonTime = d3.rollups(
//     commits,
//     (v) => v.length,
//     (d) => Math.floor(d.hourFrac)
//   );

//   let mostCommonHour = commonTime.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
//   dl.append('dt').text('Most Common Commit Hour');
//   dl.append('dd').text(`${mostCommonHour}:00`);
// }

  
  

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

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  // Optionally, remove console.log calls once you're satisfied with the output.
});
