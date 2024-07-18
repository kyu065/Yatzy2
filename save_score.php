<?php
// Save the score to a file or database (for simplicity, we'll use a file)
$file = 'scores.json';

// Get the JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Check if the input is valid
if (!isset($data['name']) || !isset($data['score'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Read current scores
$scores = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

// Add the new score
$scores[] = ['name' => $data['name'], 'score' => $data['score']];

// Sort scores in descending order
usort($scores, function ($a, $b) {
    return $b['score'] - $a['score'];
});

// Keep only the top 10 scores
$scores = array_slice($scores, 0, 10);

// Save scores back to the file
file_put_contents($file, json_encode($scores));

// Return the result
echo json_encode(['success' => true, 'scores' => $scores]);
?>
