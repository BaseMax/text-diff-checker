// Text Diff Checker - Main JavaScript

// Get DOM elements
const text1Input = document.getElementById('text1');
const text2Input = document.getElementById('text2');
const modeSelect = document.getElementById('mode');
const compareBtn = document.getElementById('compareBtn');
const clearBtn = document.getElementById('clearBtn');
const output = document.getElementById('output');

// Event listeners
compareBtn.addEventListener('click', performComparison);
clearBtn.addEventListener('click', clearAll);

// Longest Common Subsequence (LCS) algorithm for finding differences
function getLCS(arr1, arr2) {
    const m = arr1.length;
    const n = arr2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // Build LCS table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (arr1[i - 1] === arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to find the LCS and differences
    const diff = [];
    let i = m, j = n;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && arr1[i - 1] === arr2[j - 1]) {
            diff.unshift({ type: 'unchanged', value: arr1[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diff.unshift({ type: 'added', value: arr2[j - 1] });
            j--;
        } else if (i > 0) {
            diff.unshift({ type: 'removed', value: arr1[i - 1] });
            i--;
        }
    }

    return diff;
}

// Line-by-line comparison
function compareLines(text1, text2) {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    return getLCS(lines1, lines2);
}

// Word-by-word comparison
function compareWords(text1, text2) {
    // Split by whitespace but preserve the separators
    const words1 = text1.split(/(\s+)/);
    const words2 = text2.split(/(\s+)/);
    return getLCS(words1, words2);
}

// Render the diff output
function renderDiff(diff, mode) {
    output.innerHTML = '';
    output.classList.remove('empty');

    if (diff.length === 0) {
        output.classList.add('empty');
        output.textContent = 'No differences found or empty input.';
        return;
    }

    const fragment = document.createDocumentFragment();

    diff.forEach(item => {
        if (mode === 'line') {
            // Line-by-line rendering
            const lineDiv = document.createElement('div');
            lineDiv.className = `diff-line diff-${item.type}`;
            
            let prefix = '';
            if (item.type === 'removed') prefix = '- ';
            else if (item.type === 'added') prefix = '+ ';
            else prefix = '  ';
            
            lineDiv.textContent = prefix + item.value;
            fragment.appendChild(lineDiv);
        } else {
            // Word-by-word rendering
            const wordSpan = document.createElement('span');
            wordSpan.className = `diff-word diff-${item.type}`;
            wordSpan.textContent = item.value;
            fragment.appendChild(wordSpan);
        }
    });

    output.appendChild(fragment);
}

// Main comparison function
function performComparison() {
    const text1 = text1Input.value;
    const text2 = text2Input.value;
    const mode = modeSelect.value;

    if (!text1 && !text2) {
        output.classList.add('empty');
        output.textContent = 'Please enter text in both fields to compare.';
        return;
    }

    let diff;
    if (mode === 'line') {
        diff = compareLines(text1, text2);
    } else {
        diff = compareWords(text1, text2);
    }

    renderDiff(diff, mode);
}

// Clear all inputs and output
function clearAll() {
    text1Input.value = '';
    text2Input.value = '';
    output.innerHTML = '';
    output.classList.add('empty');
    output.textContent = 'Enter text and click "Compare" to see differences.';
}

// Initialize with empty state message
clearAll();
