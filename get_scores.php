<?php
// Read current scores
$file = 'scores.json';
$scores = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

// Return the scores
echo json_encode($scores);
?>
