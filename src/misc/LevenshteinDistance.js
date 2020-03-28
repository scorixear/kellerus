// Calculate the Levenshtein Distance between two strings (the number of insertions,
// deletions, and substitutions needed to transform the first string into the second)
function findClosestMatch(search, results) {
  const returnArray = [];
  for (let i = 0; i<results.length; i++) {
    const current = calculateLevenshteinDistance(search, results[i]);
    if (current <= 2) {
      returnArray.push(results[i]);
    }
  }
  return returnArray;
}

function calculateLevenshteinDistance(a, b) {
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;

  const matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) == a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
            Math.min(matrix[i][j-1] + 1, // insertion
                matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};

export default {
  findClosestMatch,
};
