<?php
include 'api.php'; // Include the api.php to use its functions

echo json_encode([
    'success' => true,
    'scores' => getLeaderboard()
]);
